import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });

await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5,
    avatar_url TEXT,
    avatar_public_id TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  );
`);

await client.query(`
  INSERT INTO testimonials (name, role, content, rating, avatar_url, sort_order)
  SELECT * FROM (VALUES 
    ('Aarti Sharma', 'Interior Designer', 'The custom epoxy river table I ordered exceeded all my expectations. The craftsmanship is truly world-class, and it has become the absolute centerpiece of my client''s living room.', 5, 'https://i.pravatar.cc/150?img=1', 1),
    ('Vikram Mehta', 'Business Owner', 'We installed the epoxy flooring for our new corporate office. It is incredibly durable, looks stunning, and gives off that premium aesthetic we were aiming for.', 5, 'https://i.pravatar.cc/150?img=11', 2),
    ('Priya Singh', 'Homeowner', 'I bought a custom resin clock and a set of coasters. The attention to detail is impeccable. Every single guest asks me where I got them from!', 5, 'https://i.pravatar.cc/150?img=5', 3),
    ('Rahul Desai', 'Architect', 'Collaborating with Sri Krishna Crafting was seamless. They understood the brief perfectly and delivered a stunning custom bar top that left my clients speechless.', 5, 'https://i.pravatar.cc/150?img=8', 4),
    ('Kavita Rao', 'Art Collector', 'Their wall art pieces are mesmerizing. The depth of the ocean colors they achieved with the resin is just breathtaking. Highly recommend!', 5, 'https://i.pravatar.cc/150?img=9', 5)
  ) AS t(name, role, content, rating, avatar_url, sort_order)
  WHERE NOT EXISTS (SELECT 1 FROM testimonials);
`);

console.log("✅ testimonials table created and seeded successfully!");
await client.end();
