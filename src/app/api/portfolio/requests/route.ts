import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioRequests } from "@/db/schema";
import { getServerUser } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requests = await db.select().from(portfolioRequests).orderBy(desc(portfolioRequests.createdAt));
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Error fetching portfolio requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { portfolioId, portfolioTitle, customerName, customerPhone, message } = body;

    if (!portfolioId || !portfolioTitle || !customerName || !customerPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRequest = await db.insert(portfolioRequests).values({
      portfolioId,
      portfolioTitle,
      customerName,
      customerPhone,
      message,
    }).returning();

    return NextResponse.json({ request: newRequest[0] }, { status: 201 });
  } catch (error) {
    console.error("Error saving portfolio request:", error);
    return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
  }
}
