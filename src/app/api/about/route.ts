import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aboutSettings } from "@/db/schema";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const rows = await db.select().from(aboutSettings).limit(1);
  const settings = rows[0] || {
    id: 0,
    storyTitle: "Our Story",
    storyText:
      "Sri Krishna Crafting was born from a deep passion for handcrafted beauty. Founded with love and dedication, we pour soul into every piece — from ocean-inspired river tables to wearable resin art. Each creation is a testament to the artistry of skilled hands and the magic of epoxy resin.",
    missionTitle: "Our Mission",
    missionText:
      "To craft premium, one-of-a-kind epoxy resin artworks that bring beauty, meaning, and lasting value into everyday spaces and lives.",
    visionTitle: "Our Vision",
    visionText:
      "To be India's most loved handcrafted resin art studio — celebrating artisans, inspiring creativity, and making bespoke art accessible to every home.",
    heroImageUrl: null,
    heroImagePublicId: null,
    updatedAt: new Date(),
  };
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const storyTitle = formData.get("storyTitle") as string;
  const storyText = formData.get("storyText") as string;
  const missionTitle = formData.get("missionTitle") as string;
  const missionText = formData.get("missionText") as string;
  const visionTitle = formData.get("visionTitle") as string;
  const visionText = formData.get("visionText") as string;
  const file = formData.get("heroImage") as File | null;

  const rows = await db.select().from(aboutSettings).limit(1);
  const existing = rows[0];

  let heroImageUrl = existing?.heroImageUrl ?? null;
  let heroImagePublicId = existing?.heroImagePublicId ?? null;

  if (file && file.size > 0) {
    if (heroImagePublicId) await deleteFromCloudinary(heroImagePublicId);
    const uploaded = await uploadToCloudinary(file, "about");
    if (uploaded) {
      heroImageUrl = uploaded.url;
      heroImagePublicId = uploaded.publicId;
    }
  }

  let updated;
  if (existing) {
    const [r] = await db
      .update(aboutSettings)
      .set({
        storyTitle: storyTitle || existing.storyTitle,
        storyText: storyText ?? existing.storyText,
        missionTitle: missionTitle || existing.missionTitle,
        missionText: missionText ?? existing.missionText,
        visionTitle: visionTitle || existing.visionTitle,
        visionText: visionText ?? existing.visionText,
        heroImageUrl,
        heroImagePublicId,
        updatedAt: new Date(),
      })
      .returning();
    updated = r;
  } else {
    const [r] = await db
      .insert(aboutSettings)
      .values({
        storyTitle: storyTitle || "Our Story",
        storyText: storyText || "",
        missionTitle: missionTitle || "Our Mission",
        missionText: missionText || "",
        visionTitle: visionTitle || "Our Vision",
        visionText: visionText || "",
        heroImageUrl,
        heroImagePublicId,
      })
      .returning();
    updated = r;
  }

  return NextResponse.json({ settings: updated });
}
