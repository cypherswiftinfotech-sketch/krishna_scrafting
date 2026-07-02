import { Pool } from 'pg';
const pool = new Pool({
  connectionString: "postgresql://postgres:strongpassword%40123%40@db.hosspruhzrversremqef.supabase.co:5432/postgres"
});

async function run() {
  await pool.query(`
    ALTER TABLE trainings
    ADD COLUMN IF NOT EXISTS learnings TEXT;
  `);
  console.log("Added learnings column to trainings table");
  pool.end();
}

run().catch(console.error);
