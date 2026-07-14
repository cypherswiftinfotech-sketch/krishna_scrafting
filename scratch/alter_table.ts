import { db } from "../src/db";
import { sql } from "drizzle-orm";

async function main() {
  try {
    console.log("Running migrations manually...");
    await db.execute(sql`ALTER TABLE crm_settings ADD COLUMN IF NOT EXISTS abandoned_cart_first_reminder_days INTEGER DEFAULT 4 NOT NULL;`);
    await db.execute(sql`ALTER TABLE crm_settings ADD COLUMN IF NOT EXISTS abandoned_cart_recurring_reminder_days INTEGER DEFAULT 7 NOT NULL;`);
    console.log("crm_settings updated or already exists.");
  } catch (e: any) {
    if (e.message.includes('does not exist')) {
      try {
        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS "crm_settings" (
            "id" serial PRIMARY KEY NOT NULL,
            "abandoned_cart_first_reminder_days" integer DEFAULT 4 NOT NULL,
            "abandoned_cart_recurring_reminder_days" integer DEFAULT 7 NOT NULL,
            "updated_at" timestamp DEFAULT now() NOT NULL
          );
        `);
        console.log("crm_settings created.");
      } catch (err: any) {
        console.error("Failed to create crm_settings:", err.message);
      }
    } else {
      console.error("Error altering crm_settings:", e.message);
    }
  }

  try {
    await db.execute(sql`ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(1000);`);
    await db.execute(sql`ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS description TEXT;`);
    console.log("product_categories altered successfully.");
  } catch (e: any) {
    console.error("Error altering product_categories:", e.message);
  }

  console.log("Done.");
  process.exit(0);
}

main();
