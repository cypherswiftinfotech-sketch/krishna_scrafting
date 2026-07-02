import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aboutGalleryImages } from "@/db/schema";
import { asc } from "drizzle-orm";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const rows = await db
    .select()
    .from(aboutGalleryImages)
    .orderBy(asc(aboutGalleryImages.sortOrder));
  return NextResponse.json({ images: rows });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const caption = formData.get("caption") as string;
  const sortOrder = formData.get("sortOrder") as string;
  const file = formData.get("image") as File | null;

  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Image is required" }, { status: 400 });
  }

  const uploaded = await uploadToCloudinary(file, "about-gallery");
  const imageUrl = uploaded?.url || "";
  const imagePublicId = uploaded?.publicId || null;

  const [item] = await db
    .insert(aboutGalleryImages)
    .values({
      imageUrl,
      imagePublicId,
      caption: caption || null,
      sortOrder: parseInt(sortOrder) || 0,
    })
    .returning();

  return NextResponse.json({ item }, { status: 201 });
}
