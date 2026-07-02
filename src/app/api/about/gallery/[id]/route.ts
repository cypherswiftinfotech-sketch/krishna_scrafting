import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aboutGalleryImages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [item] = await db
    .select()
    .from(aboutGalleryImages)
    .where(eq(aboutGalleryImages.id, parseInt(id)));
  if (item?.imagePublicId) await deleteFromCloudinary(item.imagePublicId);
  await db.delete(aboutGalleryImages).where(eq(aboutGalleryImages.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
