import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { servicesHeroImages } from "@/db/schema";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const images = await db.select().from(servicesHeroImages).orderBy(servicesHeroImages.orderIndex, servicesHeroImages.id);
    return NextResponse.json({ images });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("media") as File | null;
    const title = formData.get("title") as string | null;
    
    if (!file || file.size === 0) return NextResponse.json({ error: "No file" }, { status: 400 });

    const uploaded = await uploadToCloudinary(file, "services_hero");
    if (!uploaded) return NextResponse.json({ error: "Upload failed" }, { status: 500 });

    const [inserted] = await db
      .insert(servicesHeroImages)
      .values({ mediaUrl: uploaded.url, mediaPublicId: uploaded.publicId, title: title || "" })
      .returning();

    return NextResponse.json({ image: inserted });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title } = await req.json();
    if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });

    await db.update(servicesHeroImages).set({ title }).where(eq(servicesHeroImages.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });

    const [existing] = await db.select().from(servicesHeroImages).where(eq(servicesHeroImages.id, parseInt(id))).limit(1);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existing.mediaPublicId) await deleteFromCloudinary(existing.mediaPublicId);
    await db.delete(servicesHeroImages).where(eq(servicesHeroImages.id, parseInt(id)));

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
