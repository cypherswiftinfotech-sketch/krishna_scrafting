import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(newsletterSubscribers);
    // Return the actual count from the database
    const count = Number(result[0].count);
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching subscriber count:", error);
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await db.insert(newsletterSubscribers).values({ email }).onConflictDoNothing();
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
