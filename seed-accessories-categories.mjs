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

  console.log("Connected to the database. Seeding Accessories categories...");

  const accessoriesCategories = [
    "Pigments", "Resins", "Hardeners", "Silicone Molds", 
    "Mixing Tools", "Safety Equipment", "Glitters", "Metallic Powders", 
    "Alcohol Inks", "Dry Flowers", "Wood Bases", "Clock Mechanisms", 
    "LED Lights", "Polishing Materials", "Packaging Materials", "Gift Accessories"
  ];

  try {
    for (let i = 0; i < accessoriesCategories.length; i++) {
      const subCat = accessoriesCategories[i];
      // Check if it already exists to avoid duplicates
      const checkResult = await client.query(
        'SELECT id FROM product_categories WHERE main_category = $1 AND sub_category = $2',
        ['Accessories', subCat]
      );
      
      if (checkResult.rowCount === 0) {
        await client.query(
          'INSERT INTO product_categories (main_category, sub_category, main_sort_order, sub_sort_order) VALUES ($1, $2, $3, $4)',
          ['Accessories', subCat, 10, i]
        );
        console.log(`Added category: Accessories -> ${subCat}`);
      } else {
        console.log(`Category already exists: Accessories -> ${subCat}`);
      }
    }
    console.log("Categories seeded successfully.");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await client.end();
  }
}

main();
