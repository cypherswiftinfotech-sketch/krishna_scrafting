import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerUser } from "@/lib/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const formData = await req.formData();

  const [existing] = await db
    .select()
    .from(services)
    .where(eq(services.id, parseInt(id)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const features = formData.get("features") as string;
  const active = formData.get("active") !== "false";
  const sortOrder = formData.get("sortOrder") as string;
  const file = formData.get("image") as File | null;

  let imageUrl = existing.imageUrl;
  let imagePublicId = existing.imagePublicId;

  if (file && file.size > 0) {
    if (imagePublicId) await deleteFromCloudinary(imagePublicId);
    const uploaded = await uploadToCloudinary(file, "services");
    if (uploaded) {
      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }
  }

  const [updated] = await db
    .update(services)
    .set({
      title: title || existing.title,
      description: description ?? existing.description,
      category: (category as "custom_orders" | "corporate_gifts" | "flooring") || existing.category,
      features: features ?? existing.features,
      active,
      imageUrl,
      imagePublicId,
      sortOrder: sortOrder ? parseInt(sortOrder) : existing.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(services.id, parseInt(id)))
    .returning();

  return NextResponse.json({ service: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const [existing] = await db
    .select()
    .from(services)
    .where(eq(services.id, parseInt(id)))
    .limit(1);

  if (existing?.imagePublicId) {
    await deleteFromCloudinary(existing.imagePublicId);
  }

  await db.delete(services).where(eq(services.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
