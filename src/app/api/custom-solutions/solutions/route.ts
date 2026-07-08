import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { solutions } from "@/db/schema";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const items = await db.select().from(solutions).orderBy(solutions.sortOrder);
  return NextResponse.json({ solutions: items });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const sortOrderStr = formData.get("sortOrder") as string;
  const file = formData.get("image") as File | null;
  
  let imageUrl = null;
  if (file && file.size > 0) {
    const uploaded = await uploadToCloudinary(file, "custom_solutions");
    if (uploaded) imageUrl = uploaded.url;
  }

  const [newItem] = await db.insert(solutions).values({
    title,
    description,
    imageUrl,
    sortOrder: sortOrderStr ? parseInt(sortOrderStr) : 0,
  }).returning();

  return NextResponse.json({ solution: newItem });
}
