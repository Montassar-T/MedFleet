import express from 'express'
import cors from 'cors'
import { OAuth2Client }  from 'google-auth-library';

import {getAll,activateUserAccount , getById,getAll4Veh , deleteById  , create , getUserByEmail , updateUserPassword , getUser , updateUser , updatePass , updateProfil , modify, addForVeh , last , checkAll ,deleteNotif} from './database.js'
import { createUser, loginUser ,deleteAccount ,createUserFromGoogle, loginFromGoogle} from './auth.js'; 
import { generateActivationToken,sendVerificationEmail , sendActivationEmail , generateVerificationCode } from './verification.js'; 

import {hors, nbM ,tt} from './dashboard.js';
const app = express();
const client = new OAuth2Client('903178606296-okr46g353c0rhtb756875v66l0kn4tgn.apps.googleusercontent.com');

app.use(cors()); // Enable CORS for all routes


app.use(express.json())
const port =3000;

app.get('/', (req, res) => 
  res.send("Welcome")
);

app.post('/reset/pass', async (req, res) => {
  try {
    const { pass, email } = req.body; 
    await updateUserPassword(email, pass);

    res.status(200).json({ message: 'Password reset successfully' });
    
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});
app.post('/api/signup', async (req, res) => {
  const { tokenId } = req.body;

  try {
    // Verify the ID token with Google
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: '903178606296-okr46g353c0rhtb756875v66l0kn4tgn.apps.googleusercontent.com', // Replace with your actual client ID
    });

    // Extract user information from the verified token payload
    const payload = ticket.getPayload();
    const { email , name,picture } = payload;
    const largerPicture = `${picture}?sz=800`; 

    // Check if the user already exists in your database
    const existingUser = await getUserByEmail(email);
    let token = await loginFromGoogle(email,name,largerPicture)

    

   
    res.json({token} );
  } catch (error) {
    console.error('Google authentication error during sign-up:', error);
    res.status(401).send('Unauthorized');
  }
});

app.post('/api/login', async (req, res) => {
  const { tokenId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: '903178606296-okr46g353c0rhtb756875v66l0kn4tgn.apps.googleusercontent.com', // Replace with your actual client ID
    });
    // Extract user information from the verified token payload
    const payload = ticket.getPayload();
    const { email ,name , picture } = payload;
    const largerPicture = `${picture}?sz=400`; 

    // Check if the user already exists in your database
   

    let token = await loginFromGoogle(email,name , largerPicture)
    // Generate a JWT token for the user

    // Send the JWT token and user ID as a response to the client
    res.json({ token , picture: largerPicture});
  } catch (error) {
    console.error('Google authentication error during login:', error);
    res.status(401).send('Unauthorized');
  }
});

app.get('/api/activate', async (req, res) => {
  try {
    const { token } = req.query;
    // Verify activation token and activate user account
    const result = await activateUserAccount(token);
    if (result.success) {
      const responseHtml = `
        <html>
          <head>
            <script>
              // Close the window after 1 second (adjust as needed)
              setTimeout(() => {
                window.close();
              }, 5000);
            </script>
          </head>
          <body>
            <p>Account activated successfully. This window will close shortly.</p>
          </body>
        </html>
      `;
      res.status(200).send(responseHtml);
    } else {
      // Activation failed
      res.status(400).json({ message: 'Invalid activation token' });
    }
  } catch (error) {
    console.error('Error activating account:', error);
    res.status(500).json({ message: 'Failed to activate account' });
  }
});



app.get('/users/verify', async (req, res) => {
  try {
    const { email } = req.query; // Extract email from query parameters
    const user = await getUserByEmail(email); // Call getUserByEmail function
    if (user) {
      // Generate verification code
      const verificationCode = generateVerificationCode();
      
      // Send verification email
      await sendVerificationEmail(user.email, verificationCode);

      // Send response
      res.status(200).json({ message: `Verification code sent successfully. Your verification code is: ${verificationCode}` });
    } else {
      res.status(404).json({ message: 'User not found' }); // Handle case when user is not found
    }
  } catch (error) {
    console.error('Error retrieving user by email:', error);
    res.status(500).json({ message: 'Failed to retrieve user by email' }); // Handle other errors
  }
});
app.get('/dashboard/hors/:userId', async (req, res) => {
  try {
  
    const id = req.params.userId
    const result = await hors(id);
    res.json({ count: result }); // Send the count as JSON response
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response if something goes wrong
  }
});
app.delete('/accountDelete/:userId', async (req, res) => {
  try {
  
    const id = req.params.userId
    const result = await deleteAccount(id);
    res.status(200).json({ message: `Done` });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response if something goes wrong
  }
});



app.get('/dashboard/:userId/nbM/:year/:month', async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10); // Parse the year parameter as an integer
    const month = parseInt(req.params.month, 10); // Parse the month parameter as an integer
    const userId = req.params.userId

    const result = await nbM(userId,year ,month); // Call your asynchronous function to get the mission count
    res.json({ count: result }); // Send the count as JSON response
  } catch (error) {
    console.error('Error fetching mission count:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response if something goes wrong
  }
});
app.get('/dashboard/:userId/:entity/:year/:month', async (req, res) => {
  try {
    const year = parseInt(req.params.year, 10); // Parse the year parameter as an integer
    const month = parseInt(req.params.month, 10); // Parse the month parameter as an integer
    const entity = req.params.entity
    const userId = req.params.userId
    const result = await tt(userId,entity,year ,month);
    res.json({ count: result }); // Send the count as JSON response
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Send an error response if something goes wrong
  }
});
app.get('/vehicles/notif/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Extract user ID from route parameters

    const result = await getAll('notif', userId);
    res.json(result); // Sending the result as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});
app.delete('/vehicles/notif/:nid/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Extract user ID from route parameters
    const nId = req.params.nid; // Extract user ID from route parameters

    const result = await deleteNotif(nId, userId);
    res.json(result); // Sending the result as JSON
  } catch (error) {
    
    res.status(500).json({ message: 'Failed' });
  }
});

app.post('/vehicles/notif/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Extract user ID from route parameters

    const result = await checkAll(userId);
    res.json(result); // Sending the result as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});


app.get('/vehicles/entretien/:Vid/:user', async (req, res) => {
  try {
      const Vid = req.params.Vid;
      const userId = req.params.user;
      const result = await last(Vid, userId);

      if (result !== null) {
          res.status(200).json({ kilo: result });
      } else {
          res.status(404).json({ error: 'Kilometer data not found' });
      }
  } catch (error) {
      console.error('Error fetching kilometer:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/users/update/pass', async (req, res) => {
  try {
    const { password , userId } = req.body;
    await updatePass(password, userId);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ message: 'Error updating user' });
  }
});
app.post('/users/update/profil', async (req, res) => {
  try {
    const { name, organization, email, userId } = req.body;
    await updateProfil(name, organization, email, userId);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ message: 'Error updating user' });
  }
});
app.post('/users/update', async (req, res) => {
  try {
    const { name, organization, email, password, userId } = req.body;
    await updateUser(name, organization, email, password, userId);
    console.log("updated");
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ message: 'Error updating user' });
  }
});
app.get('/users/:id' , async( req , res)=> {
  const {id} = req.params
  const result = await getUser(id)
  res.send(result)
})


app.post('/auth/signup', async (req, res) => {
  try {
      const { name, organization, email, password } = req.body;
      // Call the createUser function from auth.js to create a new user
      //const activationToken = generateActivationToken(); 

      const newUser = await createUser(name, organization, email, password);

     // sendActivationEmail(email, activationToken);

      res.status(201).json({ message: 'User signed up successfully', user: newUser });
  } catch (error) {
      if (error.message === 'Email already exists') {
          res.status(409).json({ message: 'Email already exists' });
      } else {
          console.error('Error creating user:', error);
          res.status(500).json({ message: 'Failed to sign up user' });
      }
  }
});


app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (error) {
    if (error.message === 'Invalid password' || error.message ==='User not found') {
      res.status(401).json({ message: 'Invalid data' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});



app.post('/vehDetails/:entity', async (req, res) => {
  const entity = req.params.entity; // Correctly access the entity name
  const userId = req.query.user_id; 
  const data = req.body;

  const result = await addForVeh(entity, data, userId);
  res.send(result);
});



app.get('/vehDetails/:entity/:id', async (req, res) => {
  const {entity} = req.params
  const { id } = req.params;
  const userId = req.query.user_id; 

  const result = await getAll4Veh(entity ,id, userId);
  res.send(result);
});


app.get('/:entity/:id' , async( req , res)=> {
  const {entity} = req.params
  const {id} = req.params
  const userId = req.query.user_id; 
  const result = await getById(entity,id,userId)
  res.send(result)
})


app.get('/:entity', async (req, res) => {
  try {
    const { entity } = req.params;
    const userId = req.query.user_id; 
    const result = await getAll(entity, userId);
    res.json(result); // Sending the result as JSON
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});

app.put('/vehDetails/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  const data = req.body;
  const userId = req.query.user_id; 
  if (!id || !userId) {
    return res.status(400).json({ error: 'Entity ID or user ID missing' });
  }
  try {
    const result = await modify(entity, id, data, userId);
    res.status(200).send(result);
  } catch (error) {
    console.error('Error modifying entity:', error);
    res.status(500).json({ error: 'Error modifying entity' });
  }
});
app.put('/:entity/:id', async (req, res) => {
  const { entity, id } = req.params;
  const data = req.body;
  const userId = req.query.user_id; 

  if (!id || !userId) {
    return res.status(400).json({ error: 'Entity ID or user ID missing' });
  }

  try {
    const result = await modify(entity, id, data, userId);
    res.status(200).send(result);
  } catch (error) {
    console.error('Error modifying entity:', error);
    res.status(500).json({ error: 'Error modifying entity' });
  }
});


app.post('/:entity' , async( req , res)=> {
  const {entity} = req.params
  const data = req.body
  const userId = req.query.user_id; 

  const result = await create(entity,data,userId)
  res.status(201).send(result)
})
app.delete('/vehDetails/:entity/:id' , async( req , res)=> {
  const {entity} = req.params
  const {id} = req.params
  const userId = req.query.user_id; 

  const result = await deleteById(entity,id,userId)
  res.status(200).send(result)
})
app.delete('/:entity/:id' , async( req , res)=> {
  const {entity} = req.params
  const {id} = req.params
  const userId = req.query.user_id; 

  const result = await deleteById(entity,id,userId)
  res.status(200).send(result)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

