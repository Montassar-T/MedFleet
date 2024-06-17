import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getUserByEmail , createU } from './database.js'; // Assuming you have a function to fetch user by email
import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();

export async function loginUser(email, password) {
    // Retrieve user from the database based on the provided email
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    
    // Compare the provided password with the hashed password stored in the database
     const isValidPassword = await bcrypt.compare(password, user.password);  // password == user.password  // 
    if (!isValidPassword) {
        throw new Error('Invalid password');
    }
    
    // Generate and return a JWT token upon successful authentication
    const token = jwt.sign({userId:user.id,  email: user.email }, 'your-secret-key', { expiresIn: '1h' });
    return { token , userId : user.id};
}



export async function deleteAccount(id){
    try{
        await pool.query('delete from users where id = ?', [id]);

        console.log("user updated");
    } catch (error) {
      console.error("error updating user:", error);
      throw error; // re-throw the error to handle it at a higher level
    }
}
export async function createUser(name, organization, email, password) {
    try {
        // Hash the password before storing it in the database

        // Check if the user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        
        // Add the user to the database with the hashed password
        await createU(name, organization, email, password );
        
        // Return success message or any other relevant information
        return { message: 'User created successfully' };
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.message === 'Email already exists') {
            throw error; // Re-throw the existing error to maintain consistency
        } else {
            throw new Error('Failed to create user');
        }
    }
}
export async function createUserFromGoogle(email, name, url) {
  try {
    // Check if the user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      loginFromGoogle(email,name)
    }

    // Create the user in the database
    await createU(name, 'Hôpital', email, 'xxx', '');

    // Update the user's profile picture URL in the database
    await pool.query('UPDATE users SET url = ? WHERE email = ?', [url, email]);

    // Return success message or any other relevant information
    return { message: 'User created successfully' };
  } catch (error) {
    console.error('Error creating user during Google sign-up:', error);
    if (error.message === 'Email already exists') {
      throw error; // Re-throw the existing error to maintain consistency
    } else {
      throw new Error('Failed to create user during Google sign-up');
    }
  }
}


export async function loginFromGoogle(email, name, url) {
  let user = await getUserByEmail(email);

  if (!user) {
    // If the user doesn't exist, create them
    user = await createUserFromGoogle(email, name, url);
  }

  // Fetch the user again to ensure we have the latest data, including the user ID
  user = await getUserByEmail(email);

  // Generate the JWT token using the user's ID and email
  const token = jwt.sign({ userId: user.id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });

  // Return the token and user ID
  return { token, userId: user.id };
}