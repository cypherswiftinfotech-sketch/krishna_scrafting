import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();
  try {
    // Add sort order columns to product_categories
    await client.query(`
      ALTER TABLE product_categories
        ADD COLUMN IF NOT EXISTS main_sort_order INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS sub_sort_order INTEGER NOT NULL DEFAULT 0;
    `);
    console.log("✅ Added sort order columns to product_categories");

    // Add sort order columns to service_categories
    await client.query(`
      ALTER TABLE service_categories
        ADD COLUMN IF NOT EXISTS main_sort_order INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS sub_sort_order INTEGER NOT NULL DEFAULT 0;
    `);
    console.log("✅ Added sort order columns to service_categories");

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    client.release();
    pool.end();
  }
}

run().catch(console.error);
