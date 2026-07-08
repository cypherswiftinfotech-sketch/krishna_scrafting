import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { learningGuides } from "@/db/schema";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guideId = parseInt(id, 10);
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const file = formData.get("image") as File | null;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(learningGuides)
      .where(eq(learningGuides.id, guideId))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    let imageUrl = existing.imageUrl;
    let imagePublicId = existing.imagePublicId;

    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, "learning_guides");
      if (uploaded) {
        imageUrl = uploaded.url;
        imagePublicId = uploaded.publicId;

        if (existing.imagePublicId) {
          await deleteFromCloudinary(existing.imagePublicId);
        }
      }
    }

    const [updated] = await db
      .update(learningGuides)
      .set({ title, content, imageUrl, imagePublicId })
      .where(eq(learningGuides.id, guideId))
      .returning();

    return NextResponse.json({ guide: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating guide:", error);
    return NextResponse.json({ error: "Failed to update guide" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guideId = parseInt(id, 10);

    const [existing] = await db
      .select()
      .from(learningGuides)
      .where(eq(learningGuides.id, guideId))
      .limit(1);

    if (existing?.imagePublicId) {
      await deleteFromCloudinary(existing.imagePublicId);
    }

    await db.delete(learningGuides).where(eq(learningGuides.id, guideId));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting guide:", error);
    return NextResponse.json({ error: "Failed to delete guide" }, { status: 500 });
  }
}
