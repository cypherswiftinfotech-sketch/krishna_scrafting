import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, type, sortOrder } = body;

    const [updated] = await db
      .update(portfolioCategories)
      .set({
        name,
        type,
        sortOrder: sortOrder !== undefined ? sortOrder : 0,
      })
      .where(eq(portfolioCategories.id, parseInt(id)))
      .returning();

    return NextResponse.json({ category: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.delete(portfolioCategories).where(eq(portfolioCategories.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
