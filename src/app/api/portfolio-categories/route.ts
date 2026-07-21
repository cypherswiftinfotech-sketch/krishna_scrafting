import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const categories = await db
      .select()
      .from(portfolioCategories)
      .orderBy(portfolioCategories.sortOrder);

    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type, sortOrder } = body;

    if (!name || !type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(portfolioCategories)
      .values({
        name,
        type,
        sortOrder: sortOrder || 0,
      })
      .returning();

    return NextResponse.json({ category: inserted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
