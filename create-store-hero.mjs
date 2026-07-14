import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS store_hero_images (
    id SERIAL PRIMARY KEY,
    media_url TEXT NOT NULL,
    media_public_id TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    order_index INTEGER DEFAULT 0
  );
`);

console.log("✅ store_hero_images table created successfully!");
await client.end();
