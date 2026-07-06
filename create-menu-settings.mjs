import { Pool } from 'pg';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:strongpassword%40123%40@db.hosspruhzrversremqef.supabase.co:5432/postgres"
});

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu_settings (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) NOT NULL UNIQUE,
      visible BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    INSERT INTO menu_settings (key, visible) VALUES 
      ('home', true),
      ('store', true),
      ('portfolio', true),
      ('custom_services', true),
      ('training_academy', true),
      ('accessories', true),
      ('blogs', true),
      ('about_us', true),
      ('contact_us', true)
    ON CONFLICT (key) DO NOTHING;
  `);
  console.log("menu_settings table created successfully");
  pool.end();
}

run().catch(console.error);
