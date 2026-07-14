import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { getServerUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query = db.select().from(blogs);
    let rows;

    if (category) {
      rows = await query.where(eq(blogs.category, category)).orderBy(desc(blogs.createdAt));
    } else {
      rows = await query.orderBy(desc(blogs.createdAt));
    }

    return NextResponse.json({ blogs: rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const file = formData.get("image") as File | null;

    if (!title || !content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl = null;
    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, "blogs");
      if (uploaded) imageUrl = uploaded.url;
    }

    const [blog] = await db
      .insert(blogs)
      .values({
        title,
        content,
        category,
        imageUrl,
      })
      .returning();

    try {
      const { notifyAllSubscribers, generateEmailTemplate } = await import("@/lib/sendEmail");
      const htmlMessage = generateEmailTemplate({
        title: `New Blog Post: ${title}`,
        message: `<p style="font-size: 18px; color: #111;">We just published a new blog post!</p>
                  <p><strong>${title}</strong></p>
                  <p>${content.substring(0, 150)}...</p>`,
        linkUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blogs`,
        linkText: "Read Story"
      });
      await notifyAllSubscribers(
        `New Blog Post: ${title}`,
        htmlMessage
      );
    } catch (e) {
      console.error("Failed to notify subscribers:", e);
    }

    return NextResponse.json({ blog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
