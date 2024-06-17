import mysql from 'mysql2';

import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}).promise();



export async function nbM(user,year, month) {
    try {
      const [result] = await pool.query(`
        SELECT COUNT(*) AS count
        FROM missions
        WHERE YEAR(date) = ? AND MONTH(date) = ? and user_id = ?
      `, [year, month, user]);
  
      const count = result[0].count;
  
      if (!isNaN(count)) {
        return count;
      } else {
        throw new Error('Invalid count value');
      }
    } catch (error) {
      console.error('Error fetching mission count:', error);
      throw error;
    }
  }

  export async function tt(user,table , year, month) {
    try {
      const [result] = await pool.query(`
        SELECT SUM(cout) AS sum
        FROM ${table}
        WHERE YEAR(date) = ? AND MONTH(date) = ? and user_id = ?
      `, [year, month,user]);
  
      const sum = result[0].sum;
      if(sum == null){
        return 0
      }else {
      return sum}
    } catch (error) {
      console.error('Error fetching sum:', error);
      throw error;
    }
  }

 
  export async function hors(id) {
    try {      
        const [result] = await pool.query(`
            SELECT COUNT(DISTINCT veh_id) AS count
            FROM (
                SELECT veh_id FROM repairs WHERE statue = 'false' AND user_id = ?
                UNION
                SELECT veh_id FROM maintenance WHERE statue = 'false' AND user_id = ?
            ) AS combined_tables;
        `, [id, id]);
  
        const count = result[0].count; // Access count from the first row of the result
              
        return count  ; // Return count or 0 if count is null
    } catch (error) {
        console.error('Error fetching count:', error);
        throw error;
    }
}

  