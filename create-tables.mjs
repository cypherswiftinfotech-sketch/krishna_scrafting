import { Pool } from 'pg';
const pool = new Pool({
  connectionString: "postgresql://postgres:strongpassword%40123%40@db.hosspruhzrversremqef.supabase.co:5432/postgres"
});

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(255) NOT NULL,
      image_url VARCHAR(1000),
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log("Blogs table created successfully");
  pool.end();
}

run().catch(console.error);
