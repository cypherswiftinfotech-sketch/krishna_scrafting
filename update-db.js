require('dotenv').config({path: '.env.local'});
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('ALTER TABLE training_banner_settings ADD COLUMN IF NOT EXISTS youtube_video_url TEXT;').then(() => {
  console.log('Done');
  process.exit(0);
}).catch(console.error);
