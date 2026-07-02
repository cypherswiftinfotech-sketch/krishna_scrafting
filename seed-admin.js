const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: "postgresql://postgres:strongpassword%40123%40@db.hosspruhzrversremqef.supabase.co:5432/postgres"
});

async function run() {
  const email = "admin@example.com";
  const password = "ChangeMe!StrongPass123";
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role',
    ['Admin', email, hashedPassword, 'admin']
  );
  
  console.log("Admin user created/updated successfully.");
  pool.end();
}

run().catch(console.error);
