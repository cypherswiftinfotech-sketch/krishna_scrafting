import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { studentSuccessStories } from "@/db/schema";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const stories = await db.select().from(studentSuccessStories).orderBy(studentSuccessStories.sortOrder);
    return NextResponse.json({ stories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    
    const media = formData.get("media") as File | null;
    const secondaryMedia = formData.get("secondaryMedia") as File | null;

    let mediaUrl = null;
    let mediaPublicId = null;
    let secondaryMediaUrl = null;
    let secondaryMediaPublicId = null;

    if (media && media.size > 0) {
      const uploaded = await uploadToCloudinary(media, "success_stories");
      if (uploaded) {
        mediaUrl = uploaded.url;
        mediaPublicId = uploaded.publicId;
      }
    }

    if (secondaryMedia && secondaryMedia.size > 0) {
      const uploaded = await uploadToCloudinary(secondaryMedia, "success_stories");
      if (uploaded) {
        secondaryMediaUrl = uploaded.url;
        secondaryMediaPublicId = uploaded.publicId;
      }
    }

    const [inserted] = await db.insert(studentSuccessStories).values({
      type,
      title,
      description,
      sortOrder,
      mediaUrl,
      mediaPublicId,
      secondaryMediaUrl,
      secondaryMediaPublicId
    }).returning();

    return NextResponse.json({ success: true, story: inserted });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
