import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt, { hash } from 'bcrypt';
import { sendActivationEmail } from './verification.js';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();


export async function getAll4Veh(table ,id, userId) {
  try {
    const [result] = await pool.query(`SELECT * FROM ${table} WHERE veh_id = ? AND  user_id = ?`, [id, userId]);
    return result;
  } catch (error) {
    console.error('Error while fetching :', error);
    throw error;
  }
}
export async function addForVeh(tableName, data, userId) {
  try {
    // Add userId to the data object
    data.user_id = userId;

    // Log the data object before processing
    console.log('Data before processing:', data);

    // Remove the 'statue' attribute if tableName is 'consumptions'
      if ((tableName === 'consumptions' || tableName ==='accidents') && data.hasOwnProperty('statue')) {
      delete data.statue;
    } 

    if((tableName ==='maintenance' ||tableName==='repairs') && data.statue ==="false"){
      await pool.query('UPDATE vehicles SET statue = ? WHERE id = ?', ['false', data.veh_id]);

    }
    

    // Log the data object after processing
    console.log('Data after processing:', data);

    // Extract attribute names and values from the data object
    const attributes = Object.keys(data);
    const attributePlaceholders = attributes.map(() => '?').join(', ');
    const attributeNames = attributes.join(', ');
    const values = attributes.map(attribute => data[attribute]);

    // Construct the SQL query dynamically
    const sql = `INSERT INTO ${tableName} (${attributeNames}) VALUES (${attributePlaceholders})`;

    // Perform the database query to insert the data
    await pool.query(sql, values);

    return { success: true, message: 'Data inserted successfully' };
  } catch (error) {
    console.error('Error inserting data:', error);
    return { success: false, message: 'Error inserting data', error: error.message };
  }
}




async function getAll(tableName, id) {
  let result;
  if (tableName === 'missions') {
    // Add your logic specific to fetching missions
    const sql = `
      SELECT missions.id, 
             missions.veh_id, 
             vehicles.marque AS vehicle_marque, 
             vehicles.imma AS vehicle_immatricule, 
             missions.driver_id, 
             concat(drivers.nom,' ',drivers.prenom) AS driver_nom, 
             missions.dest, 
             missions.statue, 
             missions.date, 
             missions.user_id 
      FROM missions 
      JOIN vehicles ON missions.veh_id = vehicles.id 
      JOIN drivers ON missions.driver_id = drivers.id
      WHERE missions.user_id = ${id};
    `;
    const [missions] = await pool.query(sql);
    return missions;
  } else {
    // Default behavior: Fetch all records from the specified table for the given user ID
    result = await pool.query(`SELECT * FROM ${tableName} WHERE user_id = ?`, [id]);
    return result[0];
  }
}




async function getById(tableName, id , userId) {
  const [result] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ? and user_id = ?`, [id,userId]);
  return result[0];
}
export async function checkAll(id){
  try{
    await pool.query('UPDATE notif SET checked = 1 where  user_id = ?', [id]);
    return { success: true, message: id };
  } catch(error){
    
    return { success: false, message: id };
  }
}

export async function getUser(id ) {
  const [result] = await pool.query(`SELECT * FROM users WHERE id = ? `, [id]);
  return result[0];
}

async function create(tableName, data, userId) {
  // Add userId to the data object
  data.user_id = userId;

  

  // Extract attribute names and values from the data object
  let attributes, attributePlaceholders, attributeNames, values;
  if (tableName === 'missions') {

    attributes = ['veh_id', 'driver_id', 'dest', 'statue', 'date', 'user_id'];
    attributePlaceholders = attributes.map(() => '?').join(', ');
    attributeNames = attributes.join(', ');

    values = attributes.map(attribute => data[attribute]);
     // Update statue of drivers and vehicles to false
     try {
      if (data.statue === 'true') {
        await pool.query('UPDATE drivers SET statue = ? WHERE id = ?', ['true', data.driver_id]);
        await pool.query('UPDATE vehicles SET statue = ? WHERE id = ?', ['true', data.veh_id]);
      } else {
        await pool.query('UPDATE drivers SET statue = ? WHERE id = ?', ['false', data.driver_id]);
        await pool.query('UPDATE vehicles SET statue = ? WHERE id = ?', ['false', data.veh_id]);
      }
    } catch (error) {
      console.error('Error updating drivers/vehicles statue:', error);
      return { success: false, message: 'Error updating drivers/vehicles statue' };
    }
  } else {
    // For other tables, extract all attributes from the data object
    attributes = Object.keys(data);
    attributePlaceholders = attributes.map(() => '?').join(', ');
    attributeNames = attributes.join(', ');

    // Extract attribute values for other tables
    values = attributes.map(attribute => data[attribute]);
  }

  // Construct SQL query dynamically based on attribute names and values
  const sql = `INSERT INTO ${tableName} (${attributeNames}) VALUES (${attributePlaceholders})`;

  try {
    await pool.query(sql, values);
    return { success: true, message: 'Entity created successfully' };
  } catch (error) {
    console.error('Error creating entity:', error);
    return { success: false, message: 'Error creating entity' };
  }
}



async function updateById(tableName, id, data, userId) {
  await pool.query(`UPDATE ${tableName} SET ? WHERE id = ? and user_id = ?`, [data, id, userId]);
  return getById(tableName, id);
}

export async function deleteNotif (id , userId){
  try {
    await pool.query(`DELETE FROM notif WHERE id = ? AND user_id = ?`, [id, userId]);

   
    return { message: 'Notification deleted successfully' };
} catch (error) {
    throw new Error('Failed to delete notification');
}
}
async function deleteById(tableName, id, userId) {
  try {
    // Get the entity to be deleted before actually deleting it
    const entity = await getById(tableName, id);

    // Update the statues of related entities if deleting a mission
    if (tableName === 'missions') {
      await pool.query('UPDATE drivers SET statue = ? WHERE id = (SELECT driver_id FROM missions WHERE id = ?)', ['true', id]);
      await pool.query('UPDATE vehicles SET statue = ? WHERE id = (SELECT veh_id FROM missions WHERE id = ?)', ['true', id]);
    }

    // Delete the entity from the specified table
    await pool.query(`DELETE FROM ${tableName} WHERE id = ? AND user_id = ?`, [id, userId]);

    return entity; // Return the deleted entity
  } catch (error) {
    // Handle any errors that occur during database operations
    console.error('Error deleting entity:', error);
    throw new Error('An error occurred while deleting the entity.');
  }
}



// Function to create a new user
export async function createU(name, organization, email, password) {
  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    
    // Insert the user into the database with the hashed password and default status
    await pool.query('INSERT INTO users (username, email, organization, password) VALUES (?, ?, ?, ?)', [name, email, organization, hashedPassword]);

    // Send activation email

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Database error');
  }
}


export async function updateUser(name, organization, email, password, id) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds
    await pool.query('UPDATE users SET username = ?, organization = ?, email = ?, password = ? WHERE id = ?', [name, organization, email, hashedPassword, id]);
    console.log("user updated");
  } catch (error) {
    console.error("error updating user:", error);
    throw error; // re-throw the error to handle it at a higher level
  }
}

export async function updateProfil(name, organization, email, id) {
  try {
    await pool.query('UPDATE users SET username = ?, organization = ?, email = ? WHERE id = ?', [name, organization, email, id]);
    console.log("user updated");
  } catch (error) {
    console.error("error updating user:", error);
    throw error; // re-throw the error to handle it at a higher level
  }
}

export async function updatePass(password, id) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
    console.log("user updated");
  } catch (error) {
    console.error("error updating user:", error);
    throw error; // re-throw the error to handle it at a higher level
  }
}


export async function updateUserPassword(email , pass){
  const hashedPassword = await bcrypt.hash(pass, 10); // 10 is the number of salt rounds

  await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

}

export async function getUserByEmail(email) {
  try {
    // Execute the query to retrieve the user by email
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    // Check if any rows were returned
    if (rows.length > 0) {
      // Return the user object
      return rows[0];
    } else {
      // Return null if no user was found
      return null;
    }
  } catch (error) {
    // Log and handle any errors
    console.error('Error retrieving user by email:', error);
    throw new Error('Failed to retrieve user by email');
  }
}
export async function last(id, user) {
  try {
    const [result] = await pool.query(
      `SELECT MAX(kilo) AS maxKilo
       FROM maintenance
       WHERE veh_id = ? AND user_id = ?`,
      [id, user]
    );

    if (result.length > 0) {
      const maxKilometer = Number(result[0].maxKilo); // Access the maxKilo column alias from the first element
      return maxKilometer;
    } else {
      return 0; // Handle the case when no record is found
    }
  } catch (error) {
    console.error('Error fetching kilometer:', error);
    throw error;
  }
}




export async function modify(tableName, id, data, userId) {
  // Add userId to the data object if it's not already present
  if (!data.user_id) {
    data.user_id = userId;
  }

  // Extract attribute names and values from the data object
  let attributes, attributeUpdates, values;

  if (tableName === 'missions') {
    // Format date to include only month, day, and year (YYYY-MM-DD)
    const date = new Date(data.date);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    data.date = formattedDate;

    // For missions table, extract specific attributes
    attributes = ['veh_id', 'driver_id', 'dest', 'statue', 'date', 'user_id'];
    attributeUpdates = attributes.map(attribute => `${attribute} = ?`).join(', ');
    values = attributes.map(attribute => data[attribute]);
    if (data.statue === 'true') {
      await pool.query('UPDATE drivers SET statue = ? WHERE id = ?', ['true', data.driver_id]);
      await pool.query('UPDATE vehicles SET statue = ? WHERE id = ?', ['true', data.veh_id]);
    } else {
      await pool.query('UPDATE drivers SET statue = ? WHERE id = ?', ['false', data.driver_id]);
      await pool.query('UPDATE vehicles SET statue = ? WHERE id = ?', ['false', data.veh_id]);
    }
  } else {
    if (tableName === "vehicles") {
      try {
        // Get the last maintenance kilometer for the vehicle
        const lastKilometer = await(id, userId);
    
        if (lastKilometer !== null && data.kilometrageAct - lastKilometer >= 30000) {
          // Create a notification in the 'notif' table
          await pool.query('INSERT INTO notif (veh_id, user_id , name , imma) VALUES (?, ?, ?, ?)', [id, userId , data.type , data .imma]);
        }
      } catch (error) {
        console.error('Error creating notification:', error);
        // Handle the error as needed (e.g., throw an error or log it)
        throw new Error('Error creating notification');
      }
    }
    
    if(tableName ==="vehicles" && data.statue === 'true'){
      await pool.query(`UPDATE maintenance SET statue = ? WHERE veh_id = ? `, ['true', data.id]);
      await pool.query(`UPDATE repairs SET statue = ? WHERE veh_id = ? `, ['true', data.id])
    }
    // For other tables, extract all attributes from the data object
    if((tableName === 'drivers' || tableName ==="vehicles") && data.statue === 'true'){
      await pool.query(`UPDATE missions SET statue = ? WHERE driver_id = ? or veh_id =  ? `, ['true', data.id , data.id]);

    

    }
      if ((tableName === 'consumptions' || tableName ==='accidents') && data.hasOwnProperty('statue')) {
      delete data.statue;
    }
    if((tableName === 'repairs' ||tableName === 'maintenance') && data.statue === 'false'){
      await pool.query('UPDATE vehicles SET statue = ? WHERE id = ?', ['false', data.veh_id]);
      
    }
    
     
    attributes = Object.keys(data);
    attributeUpdates = attributes.map(attribute => `${attribute} = ?`).join(', ');
    values = attributes.map(attribute => data[attribute]);
  }

  // Construct SQL query dynamically based on attribute updates, entity ID, and user ID
  const sql = `UPDATE ${tableName} SET ${attributeUpdates} WHERE id = ? AND user_id = ?`;
  values.push(id, userId);

  try {
    // Execute the update query
    await pool.query(sql, values);

    // If the table is 'missions', handle specific logic for updating drivers/vehicles statues
    if (tableName === 'missions') {
      // Update the statues of drivers and vehicles based on the mission's statue
      if (data.statue === 'true') {
        await pool.query('UPDATE drivers SET statue = ? WHERE id = ?', ['true', data.driver_id]);
        await pool.query('UPDATE vehicles SET statue = ? WHERE id = ?', ['true', data.veh_id]);
      } else {
        await pool.query('UPDATE drivers SET statue = ? WHERE id = ?', ['false', data.driver_id]);
        await pool.query('UPDATE vehicles SET statue = ? WHERE id = ?', ['false', data.veh_id]);
      }
      
    }
 
    
    // Fetch and return the updated entity
    return getById(tableName, id, userId);
  } catch (error) {
    console.error('Error modifying entity:', error);
    throw new Error('Error modifying entity');
  }
}

export async function activateUserAccount(token) {
  try {
    // Query the database to find the user with the provided activation token
    const [rows] = await pool.query('SELECT * FROM users WHERE activation_token = ?', [token]);

    // Check if a user with the activation token exists
    if (rows.length > 0) {
      // Update the user's status to 'active' and remove the activation token
      await pool.query('UPDATE users SET status = ?, activation_token = NULL WHERE id = ?', ['active', rows[0].id]);

      // Return a success response
      return { success: true, message: 'Account activated successfully' };
    } else {
      // No user found with the provided activation token
      return { success: false, message: 'Invalid activation token' };
    }
  } catch (error) {
    // Handle database errors
    console.error('Error activating account:', error);
    throw new Error('Failed to activate account');
  }
}

export { getAll, getById, create, updateById, deleteById   };
