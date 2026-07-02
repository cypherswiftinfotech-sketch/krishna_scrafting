import { Pool } from 'pg';
const pool = new Pool({
  connectionString: "postgresql://postgres:strongpassword%40123%40@db.hosspruhzrversremqef.supabase.co:5432/postgres"
});

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_categories (
      id SERIAL PRIMARY KEY,
      main_category VARCHAR(255) NOT NULL,
      sub_category VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Insert default categories if they don't exist
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Home Products', 'Tables' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Home Products' AND sub_category = 'Tables');
    
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Home Products', 'Gifts' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Home Products' AND sub_category = 'Gifts');
    
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Home Products', 'Wall arts' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Home Products' AND sub_category = 'Wall arts');
    
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Home Products', 'Watches' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Home Products' AND sub_category = 'Watches');
    
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Home Products', 'Others' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Home Products' AND sub_category = 'Others');
    
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Commercial Products', 'Tables' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Commercial Products' AND sub_category = 'Tables');
    
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Commercial Products', 'Pen' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Commercial Products' AND sub_category = 'Pen');
    
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Commercial Products', 'Gifts' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Commercial Products' AND sub_category = 'Gifts');
    
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Commercial Products', 'Name Plates' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Commercial Products' AND sub_category = 'Name Plates');
    
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Commercial Products', 'Watches' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Commercial Products' AND sub_category = 'Watches');
    
    INSERT INTO product_categories (main_category, sub_category)
    SELECT 'Commercial Products', 'Others' WHERE NOT EXISTS (SELECT 1 FROM product_categories WHERE main_category = 'Commercial Products' AND sub_category = 'Others');

    -- Modify products table
    -- Add main_category and sub_category columns
    ALTER TABLE products ADD COLUMN IF NOT EXISTS main_category VARCHAR(255) DEFAULT 'Home Products';
    ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_category VARCHAR(255) DEFAULT 'Others';
    
    -- Map existing categories to the new ones
    UPDATE products SET main_category = 'Home Products', sub_category = 'Watches' WHERE category = 'watch';
    UPDATE products SET main_category = 'Commercial Products', sub_category = 'Pen' WHERE category = 'pen';
    UPDATE products SET main_category = 'Commercial Products', sub_category = 'Name Plates' WHERE category = 'nameplate';
    UPDATE products SET main_category = 'Home Products', sub_category = 'Tables' WHERE category = 'table';
  `);
  console.log("Categories created and products table updated successfully");
  pool.end();
}

run().catch(console.error);
