import { Pool } from 'pg';
const pool = new Pool({
  connectionString: "postgresql://postgres:strongpassword%40123%40@db.hosspruhzrversremqef.supabase.co:5432/postgres"
});

async function run() {
  await pool.query(`
    ALTER TABLE service_categories
    ADD COLUMN IF NOT EXISTS image_url VARCHAR(1000),
    ADD COLUMN IF NOT EXISTS description TEXT;
  `);
  console.log("Service categories altered successfully");
  pool.end();
}

run().catch(console.error);
