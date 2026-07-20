import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await pool.query('ALTER TABLE about_settings ADD COLUMN hero_image_url text;');
    console.log('Added hero_image_url');
  } catch (e) {
    console.log(e.message);
  }
  
  try {
    await pool.query('ALTER TABLE about_settings ADD COLUMN hero_image_public_id text;');
    console.log('Added hero_image_public_id');
  } catch (e) {
    console.log(e.message);
  }
  
  process.exit(0);
}

main();
