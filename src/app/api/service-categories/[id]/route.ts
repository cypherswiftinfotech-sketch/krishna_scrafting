import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { serviceCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerUser } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await db.delete(serviceCategories).where(eq(serviceCategories.id, parseInt(id)));
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();

  const updateData: Partial<{
    mainCategory: string;
    subCategory: string;
    mainSortOrder: number;
    subSortOrder: number;
  }> = {};

  if (body.mainCategory !== undefined) updateData.mainCategory = body.mainCategory;
  if (body.subCategory !== undefined) updateData.subCategory = body.subCategory;
  if (body.mainSortOrder !== undefined) updateData.mainSortOrder = Number(body.mainSortOrder);
  if (body.subSortOrder !== undefined) updateData.subSortOrder = Number(body.subSortOrder);

  const [updated] = await db
    .update(serviceCategories)
    .set(updateData)
    .where(eq(serviceCategories.id, parseInt(id)))
    .returning();

  return NextResponse.json({ item: updated });
}
