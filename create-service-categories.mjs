import { Pool } from 'pg';
const pool = new Pool({
  connectionString: "postgresql://postgres:strongpassword%40123%40@db.hosspruhzrversremqef.supabase.co:5432/postgres"
});

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_categories (
      id SERIAL PRIMARY KEY,
      main_category VARCHAR(255) NOT NULL,
      sub_category VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    -- Insert default HOME categories
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'HOME', 'Epoxy Flooring' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'HOME' AND sub_category = 'Epoxy Flooring');
    
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'HOME', 'River Tables' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'HOME' AND sub_category = 'River Tables');
    
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'HOME', 'Countertops' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'HOME' AND sub_category = 'Countertops');
    
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'HOME', 'Mandir Design' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'HOME' AND sub_category = 'Mandir Design');
    
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'HOME', 'Wall Art' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'HOME' AND sub_category = 'Wall Art');
    
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'HOME', 'Bulk Orders' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'HOME' AND sub_category = 'Bulk Orders');
    
    -- Insert default COMMERCIALS categories
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'COMMERCIALS', 'Epoxy Flooring' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'COMMERCIALS' AND sub_category = 'Epoxy Flooring');
    
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'COMMERCIALS', 'River Tables' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'COMMERCIALS' AND sub_category = 'River Tables');
    
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'COMMERCIALS', 'Countertops' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'COMMERCIALS' AND sub_category = 'Countertops');
    
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'COMMERCIALS', 'Mandir Design' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'COMMERCIALS' AND sub_category = 'Mandir Design');
    
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'COMMERCIALS', 'Wall Art' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'COMMERCIALS' AND sub_category = 'Wall Art');
    
    INSERT INTO service_categories (main_category, sub_category)
    SELECT 'COMMERCIALS', 'Bulk Orders' WHERE NOT EXISTS (SELECT 1 FROM service_categories WHERE main_category = 'COMMERCIALS' AND sub_category = 'Bulk Orders');
  `);
  console.log("Service categories created successfully");
  pool.end();
}

run().catch(console.error);
