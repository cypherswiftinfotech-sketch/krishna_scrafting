import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    await db.execute(sql`ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS cost VARCHAR(100);`);
    await db.execute(sql`ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS place VARCHAR(255);`);
    await db.execute(sql`ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS review TEXT;`);
    await db.execute(sql`ALTER TABLE portfolio ADD COLUMN IF NOT EXISTS social_link VARCHAR(1000);`);
    console.log("portfolio altered successfully.");
  } catch (e: any) {
    console.error("Error altering portfolio:", e.message);
  }
  console.log("Done.");
  process.exit(0);
}

main();
