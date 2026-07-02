import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, parseInt(id))).limit(1);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ blog });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const file = formData.get("image") as File | null;

    let updateData: any = {
      title,
      content,
      category,
      updatedAt: new Date(),
    };

    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, "blogs");
      if (uploaded) {
        updateData.imageUrl = uploaded.url;
      }
    }

    const [updated] = await db
      .update(blogs)
      .set(updateData)
      .where(eq(blogs.id, parseInt(id)))
      .returning();

    return NextResponse.json({ blog: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await db.delete(blogs).where(eq(blogs.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
