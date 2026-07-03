import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    const [existing] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (existing.avatarPublicId) {
      await deleteFromCloudinary(existing.avatarPublicId);
    }

    await db.delete(testimonials).where(eq(testimonials.id, id));
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
