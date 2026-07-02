import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { productCategories, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Optionally: Check if any products are using this category before deleting
  
  await db.delete(productCategories).where(eq(productCategories.id, parseInt(id)));
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  
  const [updated] = await db
    .update(productCategories)
    .set({ subCategory: body.subCategory })
    .where(eq(productCategories.id, parseInt(id)))
    .returning();
    
  return NextResponse.json({ item: updated });
}
