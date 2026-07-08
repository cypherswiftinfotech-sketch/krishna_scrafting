import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customSolutionsSettings } from "@/db/schema";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const rows = await db.select().from(customSolutionsSettings).limit(1);
  const settings = rows[0] || { heroVideoUrl: null };
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("video") as File | null;
  
  const rows = await db.select().from(customSolutionsSettings).limit(1);
  const existing = rows[0];

  let heroVideoUrl = existing?.heroVideoUrl ?? null;

  if (file && file.size > 0) {
    const uploaded = await uploadToCloudinary(file, "custom_solutions");
    if (uploaded) {
      heroVideoUrl = uploaded.url;
    }
  }

  let updated;
  if (existing) {
    const [r] = await db
      .update(customSolutionsSettings)
      .set({ heroVideoUrl, updatedAt: new Date() })
      .returning();
    updated = r;
  } else {
    const [r] = await db
      .insert(customSolutionsSettings)
      .values({ heroVideoUrl })
      .returning();
    updated = r;
  }

  return NextResponse.json({ settings: updated });
}
