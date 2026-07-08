import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { accessoriesKits } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const contains = formData.get("contains") as string;
    const price = formData.get("price") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const file = formData.get("image") as File | null;
    const removeImage = formData.get("removeImage") === "true";

    const updateData: any = {
      name,
      contains,
      price,
      sortOrder,
    };

    if (file && file.size > 0) {
      const uploaded = await uploadToCloudinary(file, "accessories_kits");
      if (uploaded) {
        updateData.imageUrl = uploaded.url;
        updateData.imagePublicId = uploaded.publicId;

        // Fetch old image to delete
        const [oldKit] = await db.select().from(accessoriesKits).where(eq(accessoriesKits.id, id));
        if (oldKit?.imagePublicId) {
          await deleteFromCloudinary(oldKit.imagePublicId);
        }
      }
    } else if (removeImage) {
      updateData.imageUrl = null;
      updateData.imagePublicId = null;
      // Fetch old image to delete
      const [oldKit] = await db.select().from(accessoriesKits).where(eq(accessoriesKits.id, id));
      if (oldKit?.imagePublicId) {
        await deleteFromCloudinary(oldKit.imagePublicId);
      }
    }

    const [updatedKit] = await db
      .update(accessoriesKits)
      .set(updateData)
      .where(eq(accessoriesKits.id, id))
      .returning();

    return NextResponse.json({ kit: updatedKit });
  } catch (error) {
    console.error("Error updating kit:", error);
    return NextResponse.json({ error: "Failed to update kit" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const [oldKit] = await db.select().from(accessoriesKits).where(eq(accessoriesKits.id, id));
    
    const [deletedKit] = await db
      .delete(accessoriesKits)
      .where(eq(accessoriesKits.id, id))
      .returning();
      
    if (oldKit?.imagePublicId) {
      await deleteFromCloudinary(oldKit.imagePublicId);
    }

    return NextResponse.json({ success: true, kit: deletedKit });
  } catch (error) {
    console.error("Error deleting kit:", error);
    return NextResponse.json({ error: "Failed to delete kit" }, { status: 500 });
  }
}
