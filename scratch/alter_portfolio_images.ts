import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    console.log("Adding additional_images column to portfolio table...");
    await db.execute(sql`ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS additional_images TEXT;`);
    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

main();
