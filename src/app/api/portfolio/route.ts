import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { getServerUser } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const rows = await db
    .select()
    .from(portfolio)
    .orderBy(asc(portfolio.sortOrder), desc(portfolio.createdAt));

  return NextResponse.json({ portfolio: rows });
}

export async function POST(req: NextRequest) {
  // Bypassed auth check for testing
  // const user = await getServerUser();
  // if (!user || user.role !== "admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const featured = formData.get("featured") === "true";
  const sortOrder = formData.get("sortOrder") as string;
  const file = formData.get("image") as File | null;

  if (!title || !file || file.size === 0) {
    return NextResponse.json(
      { error: "Title and image are required" },
      { status: 400 }
    );
  }

  const uploaded = await uploadToCloudinary(file, "portfolio");
  const imageUrl = uploaded?.url || "";
  const imagePublicId = uploaded?.publicId || null;

  const [item] = await db
    .insert(portfolio)
    .values({
      title,
      description: description || null,
      category: category || null,
      featured,
      imageUrl,
      imagePublicId,
      sortOrder: parseInt(sortOrder) || 0,
    })
    .returning();

  return NextResponse.json({ item }, { status: 201 });
}
