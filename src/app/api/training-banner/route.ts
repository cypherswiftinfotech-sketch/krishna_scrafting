import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trainingBannerSettings } from "@/db/schema";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const rows = await db.select().from(trainingBannerSettings).limit(1);
    const settings = rows[0] || {
      headline: "Learn Epoxy Art Professionally",
      subheadline: "Join our masterclasses and turn your passion into a thriving business. Learn pouring, curing, and finishing from industry experts.",
      ctaText: "Enroll Now",
      ctaLink: "/trainings",
      whatsappNumber: "918319668016",
      mediaUrl: "https://images.unsplash.com/photo-1596489370007-96a8dc5884ba?auto=format&fit=crop&q=80&w=1600",
    };
    return NextResponse.json({ settings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const headline = formData.get("headline") as string;
    const subheadline = formData.get("subheadline") as string;
    const ctaText = formData.get("ctaText") as string;
    const ctaLink = formData.get("ctaLink") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;
    const youtubeVideoUrl = formData.get("youtubeVideoUrl") as string;
    const file = formData.get("media") as File | null;
    const youtubeBgFile = formData.get("youtubeVideoBackground") as File | null;

    const rows = await db.select().from(trainingBannerSettings).limit(1);
    const existing = rows[0];

    let mediaUrl = existing?.mediaUrl ?? null;
    let mediaPublicId = existing?.mediaPublicId ?? null;
    let youtubeVideoBackgroundUrl = existing?.youtubeVideoBackgroundUrl ?? null;
    let youtubeVideoBackgroundPublicId = existing?.youtubeVideoBackgroundPublicId ?? null;

    if (file && file.size > 0) {
      if (mediaPublicId) await deleteFromCloudinary(mediaPublicId);
      const uploaded = await uploadToCloudinary(file, "training_banner");
      if (uploaded) {
        mediaUrl = uploaded.url;
        mediaPublicId = uploaded.publicId;
      }
    }

    if (youtubeBgFile && youtubeBgFile.size > 0) {
      if (youtubeVideoBackgroundPublicId) await deleteFromCloudinary(youtubeVideoBackgroundPublicId);
      const uploaded = await uploadToCloudinary(youtubeBgFile, "training_banner_youtube_bg");
      if (uploaded) {
        youtubeVideoBackgroundUrl = uploaded.url;
        youtubeVideoBackgroundPublicId = uploaded.publicId;
      }
    }

    let updated;
    if (existing) {
      const [r] = await db
        .update(trainingBannerSettings)
        .set({ headline, subheadline, ctaText, ctaLink, whatsappNumber, youtubeVideoUrl, mediaUrl, mediaPublicId, youtubeVideoBackgroundUrl, youtubeVideoBackgroundPublicId, updatedAt: new Date() })
        .returning();
      updated = r;
    } else {
      const [r] = await db
        .insert(trainingBannerSettings)
        .values({ headline, subheadline, ctaText, ctaLink, whatsappNumber, youtubeVideoUrl, mediaUrl, mediaPublicId, youtubeVideoBackgroundUrl, youtubeVideoBackgroundPublicId })
        .returning();
      updated = r;
    }

    return NextResponse.json({ settings: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
