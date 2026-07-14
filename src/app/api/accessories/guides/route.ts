import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { learningGuides } from "@/db/schema";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const guides = await db.select().from(learningGuides).orderBy(desc(learningGuides.id));
    return NextResponse.json({ guides });
  } catch (error) {
    console.error("Error fetching learning guides:", error);
    return NextResponse.json({ error: "Failed to fetch guides" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const file = formData.get("image") as File | null;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, "learning_guides");
      if (uploaded) {
        imageUrl = uploaded.url;
        imagePublicId = uploaded.publicId;
      }
    }

    const [guide] = await db
      .insert(learningGuides)
      .values({
        title,
        content,
        imageUrl,
        imagePublicId,
      })
      .returning();

    try {
      const { notifyAllSubscribers, generateEmailTemplate } = await import("@/lib/sendEmail");
      const htmlMessage = generateEmailTemplate({
        title: `New Learning Guide: ${title}`,
        message: `<p style="font-size: 18px; color: #111;">We just published a new learning guide!</p>
                  <p><strong>${title}</strong></p>
                  <p>${content.substring(0, 150)}...</p>`,
        linkUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/accessories`,
        linkText: "Learn more"
      });
      await notifyAllSubscribers(
        `New Learning Guide: ${title}`,
        htmlMessage
      );
    } catch (e) {
      console.error("Failed to notify subscribers:", e);
    }

    return NextResponse.json({ guide }, { status: 201 });
  } catch (error) {
    console.error("Error creating learning guide:", error);
    return NextResponse.json({ error: "Failed to create guide" }, { status: 500 });
  }
}
