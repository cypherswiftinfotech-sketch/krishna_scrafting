import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customSolutionsInquiries } from "@/db/schema";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const items = await db.select().from(customSolutionsInquiries).orderBy(customSolutionsInquiries.createdAt);
  return NextResponse.json({ inquiries: items.reverse() });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const type = formData.get("type") as string;
    
    // Parse common/specific fields
    const name = formData.get("name") as string | null;
    const phone = formData.get("phone") as string | null;
    const email = formData.get("email") as string | null;
    const city = formData.get("city") as string | null;
    const state = formData.get("state") as string | null;
    const projectType = formData.get("projectType") as string | null;
    const area = formData.get("area") as string | null;
    const budget = formData.get("budget") as string | null;
    const preferredDate = formData.get("preferredDate") as string | null;
    const preferredTime = formData.get("preferredTime") as string | null;
    const address = formData.get("address") as string | null;
    const mapLocation = formData.get("mapLocation") as string | null;
    const description = formData.get("description") as string | null;
    
    const file = formData.get("image") as File | null;
    let imageUrl = null;

    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, "custom_solutions_inquiries");
      if (uploaded) imageUrl = uploaded.url;
    }

    const [newItem] = await db.insert(customSolutionsInquiries).values({
      type: type || "quote",
      name,
      phone,
      email,
      city,
      state,
      projectType,
      area,
      budget,
      preferredDate,
      preferredTime,
      address,
      mapLocation,
      description,
      imageUrl,
    }).returning();

    return NextResponse.json({ inquiry: newItem });
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}
