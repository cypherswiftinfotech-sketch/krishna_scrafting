import "dotenv/config";
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

  console.log("Connected to the database. Creating custom solutions tables...");

  const queries = `
    CREATE TABLE IF NOT EXISTS "custom_solutions_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "hero_video_url" text,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "solutions" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar(255) NOT NULL,
      "description" text,
      "image_url" text,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "recent_projects" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar(255) NOT NULL,
      "city" varchar(255),
      "cost_range" varchar(255),
      "time_taken" varchar(255),
      "description" text,
      "before_image_url" text,
      "after_image_url" text,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "customer_reviews" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar(255) NOT NULL,
      "rating" integer DEFAULT 5 NOT NULL,
      "text" text NOT NULL,
      "avatar_url" text,
      "sort_order" integer DEFAULT 0 NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL
    );

    -- Insert default settings row if it doesn't exist
    INSERT INTO "custom_solutions_settings" ("id", "hero_video_url")
    SELECT 1, ''
    WHERE NOT EXISTS (SELECT 1 FROM "custom_solutions_settings" WHERE "id" = 1);
  `;

  try {
    await client.query(queries);
    console.log("Custom solutions tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await client.end();
  }
}

main();
