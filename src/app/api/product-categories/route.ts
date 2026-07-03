import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { productCategories } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  const rows = await db
    .select()
    .from(productCategories)
    .orderBy(
      asc(productCategories.mainSortOrder),
      asc(productCategories.mainCategory),
      asc(productCategories.subSortOrder),
      asc(productCategories.subCategory)
    );

  return NextResponse.json({ categories: rows });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { mainCategory, subCategory, mainSortOrder, subSortOrder } = body;

  if (!mainCategory || !subCategory) {
    return NextResponse.json({ error: "Main and sub categories are required" }, { status: 400 });
  }

  // Check if it already exists
  const existing = await db
    .select()
    .from(productCategories)
    .where(eq(productCategories.mainCategory, mainCategory))
    .then(rows => rows.filter(r => r.subCategory === subCategory));

  if (existing.length > 0) {
    return NextResponse.json({ item: existing[0] }, { status: 200 });
  }

  const [item] = await db
    .insert(productCategories)
    .values({
      mainCategory,
      subCategory,
      mainSortOrder: mainSortOrder ?? 0,
      subSortOrder: subSortOrder ?? 0,
    })
    .returning();

  return NextResponse.json({ item }, { status: 201 });
}
