import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aboutPartners } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const sortOrder = formData.get("sortOrder") as string;
  const file = formData.get("image") as File | null;

  const [existing] = await db
    .select()
    .from(aboutPartners)
    .where(eq(aboutPartners.id, parseInt(id)));

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let imageUrl = existing.imageUrl;
  let imagePublicId = existing.imagePublicId;

  if (file && file.size > 0) {
    if (imagePublicId) await deleteFromCloudinary(imagePublicId);
    const uploaded = await uploadToCloudinary(file, "about-partners");
    imageUrl = uploaded?.url || null;
    imagePublicId = uploaded?.publicId || null;
  }

  const [updated] = await db
    .update(aboutPartners)
    .set({
      name: name || existing.name,
      role: role || existing.role,
      bio: bio ?? existing.bio,
      imageUrl,
      imagePublicId,
      sortOrder: sortOrder ? parseInt(sortOrder) : existing.sortOrder,
    })
    .where(eq(aboutPartners.id, parseInt(id)))
    .returning();

  return NextResponse.json({ item: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [item] = await db
    .select()
    .from(aboutPartners)
    .where(eq(aboutPartners.id, parseInt(id)));
  if (item?.imagePublicId) await deleteFromCloudinary(item.imagePublicId);
  await db.delete(aboutPartners).where(eq(aboutPartners.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
