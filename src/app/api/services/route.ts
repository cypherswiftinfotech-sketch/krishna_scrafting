import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { getServerUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const conditions = [eq(services.active, true)];
  if (category) {
    conditions.push(
      eq(services.category, category as "custom_orders" | "corporate_gifts" | "flooring")
    );
  }

  const rows = await db
    .select()
    .from(services)
    .where(and(...conditions))
    .orderBy(asc(services.sortOrder));

  return NextResponse.json({ services: rows });
}

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const features = formData.get("features") as string;
  const sortOrder = formData.get("sortOrder") as string;
  const file = formData.get("image") as File | null;

  if (!title || !category) {
    return NextResponse.json({ error: "Title and category are required" }, { status: 400 });
  }

  let imageUrl: string | null = null;
  let imagePublicId: string | null = null;

  if (file && file.size > 0) {
    const uploaded = await uploadToCloudinary(file, "services");
    if (uploaded) {
      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }
  }

  const [service] = await db
    .insert(services)
    .values({
      title,
      description: description || null,
      category: category as "custom_orders" | "corporate_gifts" | "flooring",
      features: features || "",
      imageUrl,
      imagePublicId,
      sortOrder: parseInt(sortOrder) || 0,
    })
    .returning();

  return NextResponse.json({ service }, { status: 201 });
}
