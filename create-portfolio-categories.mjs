import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        sort_order INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    console.log("Created portfolio_categories table");

    const check = await pool.query(`SELECT COUNT(*) as count FROM portfolio_categories;`);
    if (check.rows[0].count === '0' || check.rows[0].count === 0) {
      await pool.query(`
        INSERT INTO portfolio_categories (name, type, sort_order)
        VALUES 
          ('Epoxy Table', 'main', 1),
          ('Epoxy Flooring', 'main', 2),
          ('Epoxy Clock', 'main', 3),
          ('Epoxy Wall Art', 'main', 4),
          ('Home', 'sub', 1),
          ('Residential', 'sub', 2);
      `);
      console.log("Inserted default portfolio categories");
    }

  } catch (error) {
    console.error("Error setting up portfolio categories:", error);
  } finally {
    await pool.end();
  }
}

createTable();
