import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { homeCategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

// PUT — update a home category
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id, 10);
    const formData = await req.formData();
    const label = formData.get("label") as string;
    const description = formData.get("description") as string;
    const storeQuery = formData.get("storeQuery") as string;
    const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
    const active = formData.get("active") !== "false";
    const imageFile = formData.get("image") as File | null;

    const [existing] = await db.select().from(homeCategories).where(eq(homeCategories.id, id));
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let imageUrl = existing.imageUrl;
    let imagePublicId = existing.imagePublicId;

    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (imagePublicId) {
        await deleteFromCloudinary(imagePublicId);
      }
      const result = await uploadToCloudinary(imageFile, "home_categories");
      if (result) {
        imageUrl = result.url;
        imagePublicId = result.publicId;
      }
    }

    const [updated] = await db
      .update(homeCategories)
      .set({ label, description, imageUrl, imagePublicId, storeQuery, sortOrder, active, updatedAt: new Date() })
      .where(eq(homeCategories.id, id))
      .returning();

    return NextResponse.json({ category: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE — delete a home category
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id, 10);
    const [existing] = await db.select().from(homeCategories).where(eq(homeCategories.id, id));
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existing.imagePublicId) {
      await deleteFromCloudinary(existing.imagePublicId);
    }

    await db.delete(homeCategories).where(eq(homeCategories.id, id));
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
