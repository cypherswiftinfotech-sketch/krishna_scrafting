import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS training_banner_settings (
    id SERIAL PRIMARY KEY,
    media_url TEXT,
    media_public_id TEXT,
    headline VARCHAR(255),
    subheadline TEXT,
    cta_text VARCHAR(100),
    cta_link VARCHAR(255) DEFAULT '/trainings',
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`);

await client.query(`
  INSERT INTO training_banner_settings (media_url, headline, subheadline, cta_text, cta_link)
  SELECT 'https://images.unsplash.com/photo-1596489370007-96a8dc5884ba?auto=format&fit=crop&q=80&w=1600', 'Learn Epoxy Art Professionally', 'Join our masterclasses and turn your passion into a thriving business. Learn pouring, curing, and finishing from industry experts.', 'Enroll Now', '/trainings'
  WHERE NOT EXISTS (SELECT 1 FROM training_banner_settings);
`);

console.log("✅ training_banner_settings table created and seeded successfully!");
await client.end();
