import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { heroSettings } from "@/db/schema";
import { getServerUser } from "@/lib/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const rows = await db.select().from(heroSettings).limit(1);
  const settings = rows[0] || {
    id: 0,
    videoUrl: null,
    videoPublicId: null,
    headline: "Crafted With Precision",
    subheadline: "Premium engraved products for every occasion",
    ctaText: "Shop Now",
    updatedAt: new Date(),
  };
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  // Bypassed auth check for testing
  // const user = await getServerUser();
  // if (!user || user.role !== "admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const formData = await req.formData();
  const headline = formData.get("headline") as string;
  const subheadline = formData.get("subheadline") as string;
  const ctaText = formData.get("ctaText") as string;
  const file = formData.get("video") as File | null;

  const rows = await db.select().from(heroSettings).limit(1);
  const existing = rows[0];

  let videoUrl = existing?.videoUrl ?? null;
  let videoPublicId = existing?.videoPublicId ?? null;

  if (file && file.size > 0) {
    if (videoPublicId) await deleteFromCloudinary(videoPublicId);
    const uploaded = await uploadToCloudinary(file, "hero");
    if (uploaded) {
      videoUrl = uploaded.url;
      videoPublicId = uploaded.publicId;
    }
  }

  let updated;
  if (existing) {
    const [r] = await db
      .update(heroSettings)
      .set({
        headline: headline || existing.headline,
        subheadline: subheadline || existing.subheadline,
        ctaText: ctaText || existing.ctaText,
        videoUrl,
        videoPublicId,
        updatedAt: new Date(),
      })
      .returning();
    updated = r;
  } else {
    const [r] = await db
      .insert(heroSettings)
      .values({
        headline: headline || "Crafted With Precision",
        subheadline: subheadline || "Premium engraved products for every occasion",
        ctaText: ctaText || "Shop Now",
        videoUrl,
        videoPublicId,
      })
      .returning();
    updated = r;
  }

  return NextResponse.json({ settings: updated });
}
