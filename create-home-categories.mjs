// Run this script once to create the home_categories table in your database
// Usage: node create-home-categories.mjs

import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const { Client } = pg;

const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS home_categories (
    id SERIAL PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    image_url VARCHAR(1000),
    image_public_id TEXT,
    store_query VARCHAR(500) DEFAULT '/store',
    sort_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`);

// Seed with default categories matching the current design
await client.query(`
  INSERT INTO home_categories (label, description, store_query, sort_order, active)
  VALUES
    ('Epoxy Tables', 'Stunning river tables & live-edge resin masterpieces for your home', '/store?category=river-table', 1, true),
    ('Epoxy Flooring', 'High-gloss 3D floor coatings that transform any space beautifully', '/store?category=flooring', 2, true),
    ('Wall Art', 'Unique epoxy wall panels and abstract art pieces for bold interiors', '/store?category=wall-art', 3, true),
    ('Home Decor', 'Coasters, trays, bowls & centrepieces to elevate every room', '/store?category=coasters', 4, true),
    ('Custom Gifts', 'Personalised resin keepsakes, name plaques & corporate gifting', '/store?category=jewelry', 5, true),
    ('Resin Jewelry', 'Handcrafted earrings, pendants & rings embedded with floral & ocean art', '/store?category=jewelry', 6, true)
  ON CONFLICT DO NOTHING;
`);

console.log("✅ home_categories table created and seeded successfully!");
await client.end();
