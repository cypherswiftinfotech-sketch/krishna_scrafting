import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

// Diagnostic route — hit GET /api/health to see whether:
//   1. DATABASE_URL is set
//   2. The DB connection works
//   3. The schema is present (users table exists)
//
// Returns a JSON report. Safe to delete after you confirm everything works.

export const dynamic = "force-dynamic";

export async function GET() {
  const report: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_set: Boolean(process.env.DATABASE_URL),
      DATABASE_URL_preview: process.env.DATABASE_URL
        ? process.env.DATABASE_URL.replace(/:[^:@/]+@/, ":***@")
        : null,
      NODE_ENV: process.env.NODE_ENV,
      JWT_SECRET_set: Boolean(process.env.JWT_SECRET),
      JWT_SECRET_is_default:
        process.env.JWT_SECRET === "supersecretjwtkey" ||
        process.env.JWT_SECRET === "replace-with-a-long-random-string-min-32-chars",
    },
  };

  try {
    const result = await db.execute(
      sql`select current_database() as db, current_user as "user", version() as version`
    );
    report.db_connection = { ok: true, info: result.rows?.[0] ?? result };
  } catch (err) {
    report.db_connection = {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  try {
    const tables = await db.execute(
      sql`select table_name from information_schema.tables where table_schema = 'public' order by table_name`
    );
    report.tables = tables.rows ?? tables;
  } catch (err) {
    report.tables_error = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(report, { status: 200 });
}