import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { studentSuccessStories } from "@/db/schema";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const storyId = parseInt(id);

    const [existing] = await db.select().from(studentSuccessStories).where(eq(studentSuccessStories.id, storyId)).limit(1);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existing.mediaPublicId) await deleteFromCloudinary(existing.mediaPublicId);
    if (existing.secondaryMediaPublicId) await deleteFromCloudinary(existing.secondaryMediaPublicId);

    await db.delete(studentSuccessStories).where(eq(studentSuccessStories.id, storyId));

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
