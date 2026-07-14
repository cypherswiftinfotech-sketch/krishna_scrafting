import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trainings } from "@/db/schema";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let training;
  
  if (!isNaN(parseInt(id)) && parseInt(id).toString() === id) {
    [training] = await db.select().from(trainings).where(eq(trainings.id, parseInt(id)));
  } else {
    const allTrainings = await db.select().from(trainings);
    training = allTrainings.find(t => t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id || t.title.toLowerCase().replace(/\s+/g, '-') === id);
  }

  if (!training) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ training });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await req.formData();
  
  const [existing] = await db.select().from(trainings).where(eq(trainings.id, parseInt(id)));
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

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
  const videoFile = formData.get("video") as File | null;
  
  let imageUrl = existing.imageUrl;
  if (file && file.size > 0) {
    const uploaded = await uploadToCloudinary(file, "trainings");
    if (uploaded) imageUrl = uploaded.url;
  }

  let videoUrl = existing.videoUrl;
  if (videoFile && videoFile.size > 0) {
    const uploaded = await uploadToCloudinary(videoFile, "trainings/videos");
    if (uploaded) videoUrl = uploaded.url;
  }

  const [updated] = await db
    .update(trainings)
    .set({
      title: title || existing.title,
      category: category || existing.category,
      description: description ?? existing.description,
      duration: duration || existing.duration,
      price: price || existing.price,
      language: language || existing.language,
      seats: seats ? parseInt(seats) : existing.seats,
      imageUrl,
      videoUrl,
      learnings: learnings !== null && learnings !== undefined ? learnings : existing.learnings,
      fullDetails: fullDetails !== null && fullDetails !== undefined ? fullDetails : existing.fullDetails,
      updatedAt: new Date(),
    })
    .where(eq(trainings.id, parseInt(id)))
    .returning();

  return NextResponse.json({ training: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(trainings).where(eq(trainings.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
