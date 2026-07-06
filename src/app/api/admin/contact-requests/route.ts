import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactRequests } from "@/db/schema";
import { getServerUser } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select()
    .from(contactRequests)
    .orderBy(desc(contactRequests.createdAt));

  return NextResponse.json({ requests: rows });
}
