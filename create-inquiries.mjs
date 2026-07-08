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

  console.log("Connected to the database. Creating custom_solutions_inquiries table...");

  const queries = `
    CREATE TABLE IF NOT EXISTS "custom_solutions_inquiries" (
      "id" serial PRIMARY KEY NOT NULL,
      "type" varchar(50) NOT NULL,
      "name" varchar(255),
      "phone" varchar(50),
      "email" varchar(255),
      "city" varchar(100),
      "state" varchar(100),
      "project_type" varchar(255),
      "area" varchar(100),
      "budget" varchar(100),
      "preferred_date" varchar(100),
      "preferred_time" varchar(100),
      "address" text,
      "map_location" text,
      "description" text,
      "image_url" text,
      "created_at" timestamp DEFAULT now() NOT NULL
    );
  `;

  try {
    await client.query(queries);
    console.log("Table created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await client.end();
  }
}

main();
