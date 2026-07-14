import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "portfolio_settings" (
        "id" serial PRIMARY KEY NOT NULL,
        "hero_video_url" text,
        "hero_video_public_id" text,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log("portfolio_settings created.");
  } catch (err: any) {
    console.error("Failed to create portfolio_settings:", err.message);
  }

  console.log("Done.");
  process.exit(0);
}

main();
