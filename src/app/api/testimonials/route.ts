import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const rows = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
    return NextResponse.json({ testimonials: rows });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const content = formData.get("content") as string;
    const rating = parseInt((formData.get("rating") as string) || "5", 10);
    const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
    const file = formData.get("avatar") as File | null;

    if (!name || !content) {
      return NextResponse.json({ error: "Missing name or content" }, { status: 400 });
    }

    let avatarUrl = "https://i.pravatar.cc/150";
    let avatarPublicId: string | null = null;

    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, "testimonials");
      if (uploaded) {
        avatarUrl = uploaded.url;
        avatarPublicId = uploaded.publicId;
      }
    }

    const [testimonial] = await db
      .insert(testimonials)
      .values({
        name,
        role,
        content,
        rating,
        sortOrder,
        avatarUrl,
        avatarPublicId,
      })
      .returning();

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
