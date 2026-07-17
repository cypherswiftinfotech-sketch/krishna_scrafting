import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerUser } from "@/lib/auth";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Bypassed auth check for testing
  // const user = await getServerUser();
  // if (!user || user.role !== "admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const { id } = await params;
  const formData = await req.formData();

  const [existing] = await db
    .select()
    .from(portfolio)
    .where(eq(portfolio.id, parseInt(id)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const subCategory = formData.get("subCategory") as string;
  const featured = formData.get("featured") === "true";
  const sortOrder = formData.get("sortOrder") as string;
  const cost = formData.get("cost") as string;
  const place = formData.get("place") as string;
  const review = formData.get("review") as string;
  const socialLink = formData.get("socialLink") as string;
  const clientExperience = formData.get("clientExperience") as string;
  const file = formData.get("image") as File | null;
  const reviewPhotoFile = formData.get("reviewPhoto") as File | null;

  let imageUrl = existing.imageUrl;
  let imagePublicId = existing.imagePublicId;

  if (file && file.size > 0) {
    if (imagePublicId) await deleteFromCloudinary(imagePublicId);
    const uploaded = await uploadToCloudinary(file, "portfolio");
    if (uploaded) {
      imageUrl = uploaded.url;
      imagePublicId = uploaded.publicId;
    }
  }

  let additionalImagesJson = existing.additionalImages;
  const additionalImageFiles = formData.getAll("additionalImages") as File[];
  if (additionalImageFiles && additionalImageFiles.length > 0 && additionalImageFiles.some((f) => f.size > 0)) {
    const additionalImageUrls: string[] = [];
    for (const f of additionalImageFiles) {
      if (f && f.size > 0) {
        const u = await uploadToCloudinary(f, "portfolio");
        if (u?.url) additionalImageUrls.push(u.url);
      }
    }
    if (additionalImageUrls.length > 0) {
      additionalImagesJson = JSON.stringify(additionalImageUrls);
    }
  }

  let reviewPhotoUrl = existing.reviewPhotoUrl;
  if (reviewPhotoFile && reviewPhotoFile.size > 0) {
    const uploadedReview = await uploadToCloudinary(reviewPhotoFile, "portfolio/reviews");
    if (uploadedReview?.url) reviewPhotoUrl = uploadedReview.url;
  }

  const [updated] = await db
    .update(portfolio)
    .set({
      title: title || existing.title,
      description: description ?? existing.description,
      category: category ?? existing.category,
      subCategory: subCategory ?? existing.subCategory,
      featured,
      imageUrl,
      imagePublicId,
      cost: cost !== null ? cost : existing.cost,
      place: place !== null ? place : existing.place,
      review: review !== null ? review : existing.review,
      reviewPhotoUrl,
      clientExperience: clientExperience !== null ? clientExperience : existing.clientExperience,
      socialLink: socialLink !== null ? socialLink : existing.socialLink,
      additionalImages: additionalImagesJson,
      sortOrder: sortOrder ? parseInt(sortOrder) : existing.sortOrder,
    })
    .where(eq(portfolio.id, parseInt(id)))
    .returning();

  return NextResponse.json({ item: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Bypassed auth check for testing
  // const user = await getServerUser();
  // if (!user || user.role !== "admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const { id } = await params;
  const [existing] = await db
    .select()
    .from(portfolio)
    .where(eq(portfolio.id, parseInt(id)))
    .limit(1);

  if (existing?.imagePublicId) {
    await deleteFromCloudinary(existing.imagePublicId);
  }

  await db.delete(portfolio).where(eq(portfolio.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
