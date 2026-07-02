import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aboutPartners } from "@/db/schema";
import { asc } from "drizzle-orm";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const rows = await db
    .select()
    .from(aboutPartners)
    .orderBy(asc(aboutPartners.sortOrder));
  return NextResponse.json({ partners: rows });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const sortOrder = formData.get("sortOrder") as string;
  const file = formData.get("image") as File | null;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  let imageUrl: string | null = null;
  let imagePublicId: string | null = null;

  if (file && file.size > 0) {
    const uploaded = await uploadToCloudinary(file, "about-partners");
    imageUrl = uploaded?.url || null;
    imagePublicId = uploaded?.publicId || null;
  }

  const [item] = await db
    .insert(aboutPartners)
    .values({
      name,
      role: role || null,
      bio: bio || null,
      imageUrl,
      imagePublicId,
      sortOrder: parseInt(sortOrder) || 0,
    })
    .returning();

  return NextResponse.json({ item }, { status: 201 });
}
