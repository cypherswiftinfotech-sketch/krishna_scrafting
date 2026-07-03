import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS instagram_posts (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    image_public_id TEXT,
    post_link VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`);

await client.query(`
  INSERT INTO instagram_posts (image_url, post_link, sort_order)
  SELECT * FROM (VALUES 
    ('https://images.unsplash.com/photo-1596489370007-96a8dc5884ba?auto=format&fit=crop&q=80&w=600', 'https://instagram.com/srikrishnacrafting', 1),
    ('https://images.unsplash.com/photo-1618220179428-22790b46a0eb?auto=format&fit=crop&q=80&w=600', 'https://instagram.com/srikrishnacrafting', 2),
    ('https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80&w=600', 'https://instagram.com/srikrishnacrafting', 3),
    ('https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600', 'https://instagram.com/srikrishnacrafting', 4)
  ) AS t(image_url, post_link, sort_order)
  WHERE NOT EXISTS (SELECT 1 FROM instagram_posts);
`);

console.log("✅ instagram_posts table created and seeded successfully!");
await client.end();
