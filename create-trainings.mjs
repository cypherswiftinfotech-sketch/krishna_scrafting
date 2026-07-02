import { Pool } from 'pg';
const pool = new Pool({
  connectionString: "postgresql://postgres:strongpassword%40123%40@db.hosspruhzrversremqef.supabase.co:5432/postgres"
});

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS trainings (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      description TEXT,
      duration VARCHAR(100),
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      language VARCHAR(100) DEFAULT 'English',
      seats INT DEFAULT 10,
      image_url VARCHAR(1000),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
  console.log("Trainings table created successfully");
  pool.end();
}

run().catch(console.error);
