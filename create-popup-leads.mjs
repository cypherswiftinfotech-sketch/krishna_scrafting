import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS popup_leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        source VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    console.log("Created popup_leads table");
  } catch (error) {
    console.error("Error setting up popup_leads:", error);
  } finally {
    await pool.end();
  }
}

createTable();
