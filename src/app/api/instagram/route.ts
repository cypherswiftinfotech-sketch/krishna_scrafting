import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { instagramPosts } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const rows = await db.select().from(instagramPosts).orderBy(asc(instagramPosts.sortOrder));
    return NextResponse.json({ posts: rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const postLink = formData.get("postLink") as string;
    const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
    const file = formData.get("image") as File | null;

    if (!postLink || !file) {
      return NextResponse.json({ error: "Missing link or image" }, { status: 400 });
    }

    const uploaded = await uploadToCloudinary(file, "instagram");
    if (!uploaded) throw new Error("Image upload failed");

    const [post] = await db
      .insert(instagramPosts)
      .values({
        postLink,
        sortOrder,
        imageUrl: uploaded.url,
        imagePublicId: uploaded.publicId,
      })
      .returning();

    return NextResponse.json({ post }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
