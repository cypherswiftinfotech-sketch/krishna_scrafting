import { Pool } from 'pg';
import { config } from 'dotenv';

config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function alterTable() {
  try {
    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS price_display_type VARCHAR(50) DEFAULT 'price' NOT NULL,
      ADD COLUMN IF NOT EXISTS custom_price_text VARCHAR(255) DEFAULT '';
    `);
    console.log("Added price display columns to products table");

    // Set existing products to use 'custom' with 'Custom Price' since we hardcoded that previously,
    // or maybe they were 'price' originally? The user said "i want a option for price like either i put the price or custom price text or also option to keep it blank".
    // It's safe to default to 'price'. We can update them all to 'custom' to match the current view, but 'price' is a better default.
    // I'll set all current ones to 'custom' with 'Custom Price' just to preserve the exact look they have right now.
    await pool.query(`
      UPDATE products 
      SET price_display_type = 'custom', custom_price_text = 'Custom Price'
      WHERE price_display_type = 'price';
    `);
    console.log("Updated existing products to custom price");

  } catch (error) {
    console.error("Error altering products table:", error);
  } finally {
    await pool.end();
  }
}

alterTable();
