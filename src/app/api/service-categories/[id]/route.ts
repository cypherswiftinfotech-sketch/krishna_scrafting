import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { serviceCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(serviceCategories).where(eq(serviceCategories.id, parseInt(id)));
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  
  const [updated] = await db
    .update(serviceCategories)
    .set({ subCategory: body.subCategory })
    .where(eq(serviceCategories.id, parseInt(id)))
    .returning();
    
  return NextResponse.json({ item: updated });
}
