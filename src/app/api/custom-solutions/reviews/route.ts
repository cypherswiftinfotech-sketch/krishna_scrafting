import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customerReviews } from "@/db/schema";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const items = await db.select().from(customerReviews).orderBy(customerReviews.sortOrder);
  return NextResponse.json({ reviews: items });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const text = formData.get("text") as string;
  const ratingStr = formData.get("rating") as string;
  const sortOrderStr = formData.get("sortOrder") as string;
  const file = formData.get("avatar") as File | null;
  
  let avatarUrl = null;
  if (file && file.size > 0) {
    const uploaded = await uploadToCloudinary(file, "custom_solutions_reviews");
    if (uploaded) avatarUrl = uploaded.url;
  }

  const [newItem] = await db.insert(customerReviews).values({
    name,
    text,
    avatarUrl,
    rating: ratingStr ? parseInt(ratingStr) : 5,
    sortOrder: sortOrderStr ? parseInt(sortOrderStr) : 0,
  }).returning();

  return NextResponse.json({ review: newItem });
}
