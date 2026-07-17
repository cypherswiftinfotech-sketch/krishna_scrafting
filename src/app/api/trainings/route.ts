import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trainings } from "@/db/schema";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  let rows;
  if (category && category !== "All") {
    rows = await db
      .select()
      .from(trainings)
      .where(eq(trainings.category, category))
      .orderBy(desc(trainings.createdAt));
  } else {
    rows = await db
      .select()
      .from(trainings)
      .orderBy(desc(trainings.createdAt));
  }

  return NextResponse.json({ trainings: rows });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const duration = formData.get("duration") as string;
  const price = formData.get("price") as string;
  const language = formData.get("language") as string;
  const seats = formData.get("seats") as string;
  const learnings = formData.get("learnings") as string;
  const fullDetails = formData.get("fullDetails") as string;
  const file = formData.get("image") as File | null;
  const youtubeThumbnailFile = formData.get("youtubeThumbnail") as File | null;
  const videoUrlString = formData.get("videoUrlString") as string | null;
  
  let imageUrl = null;
  if (file && file.size > 0) {
    const uploaded = await uploadToCloudinary(file, "trainings");
    if (uploaded) imageUrl = uploaded.url;
  }

  let youtubeThumbnailUrl = null;
  let youtubeThumbnailPublicId = null;
  if (youtubeThumbnailFile && youtubeThumbnailFile.size > 0) {
    const uploaded = await uploadToCloudinary(youtubeThumbnailFile, "trainings_thumbnails");
    if (uploaded) {
      youtubeThumbnailUrl = uploaded.url;
      youtubeThumbnailPublicId = uploaded.publicId;
    }
  }

  const videoUrl = videoUrlString || null;

  const [inserted] = await db
    .insert(trainings)
    .values({
      title,
      category,
      description,
      duration,
      price,
      language: language || "English",
      seats: seats ? parseInt(seats) : 10,
      imageUrl,
      videoUrl,
      youtubeThumbnailUrl,
      youtubeThumbnailPublicId,
      learnings: learnings || null,
      fullDetails: fullDetails || null,
    })
    .returning();

  return NextResponse.json({ training: inserted }, { status: 201 });
}
