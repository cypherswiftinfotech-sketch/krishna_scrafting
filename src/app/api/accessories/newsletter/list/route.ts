import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const subscribers = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("Error fetching subscribers list:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
