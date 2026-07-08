import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import pg from "pg";

const { Client } = pg;

async function main() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("No database URL provided in .env");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  await client.connect();

  console.log("Connected to the database. Creating accessories tables...");

  const queries = `
    CREATE TABLE IF NOT EXISTS "accessories_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "hero_video_url" text,
      "hero_video_public_id" text,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "accessories_kits" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar(255) NOT NULL,
      "contains" text NOT NULL,
      "price" numeric(10, 2) NOT NULL,
      "image_url" text,
      "image_public_id" text,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "learning_guides" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar(255) NOT NULL,
      "content" text NOT NULL,
      "image_url" text,
      "image_public_id" text,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
      "id" serial PRIMARY KEY NOT NULL,
      "email" varchar(255) UNIQUE NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );
  `;

  try {
    await client.query(queries);
    console.log("Tables created successfully.");

    // Initialize row if empty
    const { rowCount } = await client.query('SELECT COUNT(*) FROM accessories_settings');
    if (rowCount === 0 || (await client.query('SELECT COUNT(*) FROM accessories_settings')).rows[0].count === '0') {
      await client.query('INSERT INTO accessories_settings (hero_video_url) VALUES (NULL)');
      console.log('Initialized accessories_settings with default row.');
    }

  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await client.end();
  }
}

main();
