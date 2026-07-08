import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accessoriesSettings } from "@/db/schema";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const [settings] = await db.select().from(accessoriesSettings).limit(1);
    
    if (!settings) {
      // If no settings exist yet, return an empty object
      return NextResponse.json({ settings: null });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching accessories settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("video") as File | null;

    // Get existing settings to replace old video
    const [existingSettings] = await db.select().from(accessoriesSettings).limit(1);

    let heroVideoUrl = existingSettings?.heroVideoUrl || null;
    let heroVideoPublicId = existingSettings?.heroVideoPublicId || null;

    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, "accessories");
      if (uploaded) {
        heroVideoUrl = uploaded.url;
        heroVideoPublicId = uploaded.publicId;

        // Delete old video if exists
        if (existingSettings?.heroVideoPublicId) {
          await deleteFromCloudinary(existingSettings.heroVideoPublicId);
        }
      }
    }

    let updatedSettings;

    if (existingSettings) {
      [updatedSettings] = await db
        .update(accessoriesSettings)
        .set({
          heroVideoUrl,
          heroVideoPublicId,
          updatedAt: new Date(),
        })
        .where(eq(accessoriesSettings.id, existingSettings.id))
        .returning();
    } else {
      [updatedSettings] = await db
        .insert(accessoriesSettings)
        .values({
          heroVideoUrl,
          heroVideoPublicId,
        })
        .returning();
    }

    return NextResponse.json({ settings: updatedSettings }, { status: 200 });
  } catch (error) {
    console.error("Error saving accessories settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
