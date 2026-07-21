import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { homeCategories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { uploadToCloudinary } from "@/lib/cloudinary";

// GET — list all active home categories (sorted)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const showAll = searchParams.get("active") === "all";

    const rows = await db
      .select()
      .from(homeCategories)
      .where(showAll ? undefined : eq(homeCategories.active, true))
      .orderBy(asc(homeCategories.sortOrder), asc(homeCategories.createdAt));

    return NextResponse.json({ categories: rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST — create a new home category
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const label = formData.get("label") as string;
    const description = formData.get("description") as string;
    const storeQuery = (formData.get("storeQuery") as string) || "/shop";
    const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
    const active = formData.get("active") !== "false";
    const imageFile = formData.get("image") as File | null;

    if (!label) return NextResponse.json({ error: "Label is required" }, { status: 400 });

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const result = await uploadToCloudinary(imageFile, "home_categories");
      if (result) {
        imageUrl = result.url;
        imagePublicId = result.publicId;
      }
    }

    const [row] = await db
      .insert(homeCategories)
      .values({ label, description, imageUrl, imagePublicId, storeQuery, sortOrder, active })
      .returning();

    return NextResponse.json({ category: row }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
