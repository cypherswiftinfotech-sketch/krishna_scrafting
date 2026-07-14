import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioSettings } from "@/db/schema";
import { getServerUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(portfolioSettings).limit(1);
  return NextResponse.json({ settings: rows[0] || null });
}

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("video") as File | null;

  let heroVideoUrl: string | undefined;
  let heroVideoPublicId: string | undefined;

  if (file && file.size > 0) {
    const uploaded = await uploadToCloudinary(file, "portfolio_hero");
    if (uploaded) {
      heroVideoUrl = uploaded.url;
      heroVideoPublicId = uploaded.publicId;
    }
  }

  const existing = await db.select().from(portfolioSettings).limit(1);

  if (existing.length > 0) {
    const updateData: any = {};
    if (heroVideoUrl) {
      updateData.heroVideoUrl = heroVideoUrl;
      updateData.heroVideoPublicId = heroVideoPublicId;
    }
    
    // update only if something changed
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
      await db.update(portfolioSettings).set(updateData).where(eq(portfolioSettings.id, existing[0].id));
    }
  } else {
    await db.insert(portfolioSettings).values({
      heroVideoUrl: heroVideoUrl || null,
      heroVideoPublicId: heroVideoPublicId || null,
    });
  }

  const rows = await db.select().from(portfolioSettings).limit(1);
  return NextResponse.json({ settings: rows[0] });
}
