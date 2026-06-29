import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and fill in your Supabase " +
      "connection string from Dashboard → Settings → Database → Connection string → URI."
  );
}

if (databaseUrl.includes("YOUR_")) {
  throw new Error(
    "DATABASE_URL still contains placeholder values (YOUR_DB_PASSWORD / YOUR_POOLER_HOST). " +
      "Replace them with your real Supabase connection string."
  );
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
