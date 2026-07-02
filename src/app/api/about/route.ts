import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { aboutSettings } from "@/db/schema";

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
    updatedAt: new Date(),
  };
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { storyTitle, storyText, missionTitle, missionText, visionTitle, visionText } = body;

  const rows = await db.select().from(aboutSettings).limit(1);
  const existing = rows[0];

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
      })
      .returning();
    updated = r;
  }

  return NextResponse.json({ settings: updated });
}
