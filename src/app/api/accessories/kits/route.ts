import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accessoriesKits } from "@/db/schema";
import { desc, asc } from "drizzle-orm";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const kits = await db
      .select()
      .from(accessoriesKits)
      .orderBy(asc(accessoriesKits.sortOrder), desc(accessoriesKits.createdAt));

    return NextResponse.json({ kits });
  } catch (error) {
    console.error("Error fetching kits:", error);
    return NextResponse.json({ error: "Failed to fetch kits" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const contains = formData.get("contains") as string;
    const price = formData.get("price") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const file = formData.get("image") as File | null;

    if (!name || !contains || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, "accessories_kits");
      if (uploaded) {
        imageUrl = uploaded.url;
        imagePublicId = uploaded.publicId;
      }
    }

    const [kit] = await db
      .insert(accessoriesKits)
      .values({
        name,
        contains,
        price,
        sortOrder,
        imageUrl,
        imagePublicId,
      })
      .returning();

    return NextResponse.json({ kit }, { status: 201 });
  } catch (error) {
    console.error("Error creating kit:", error);
    return NextResponse.json({ error: "Failed to create kit" }, { status: 500 });
  }
}
