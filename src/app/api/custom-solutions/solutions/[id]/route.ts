import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { solutions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const solutionId = parseInt(id);

    if (isNaN(solutionId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const additionalFiles = formData.getAll("additionalImages") as File[];
    
    if (additionalFiles.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Fetch existing solution
    const [existing] = await db.select().from(solutions).where(eq(solutions.id, solutionId));
    if (!existing) return NextResponse.json({ error: "Solution not found" }, { status: 404 });

    let additionalImagesUrls: string[] = [];
    if (existing.additionalImages) {
      try {
        const parsed = JSON.parse(existing.additionalImages);
        if (Array.isArray(parsed)) additionalImagesUrls = parsed;
      } catch (e) {}
    }

    for (const f of additionalFiles) {
      if (f.size > 0) {
        const u = await uploadToCloudinary(f, "custom_solutions");
        if (u) additionalImagesUrls.push(u.url);
      }
    }

    await db.update(solutions)
      .set({ additionalImages: JSON.stringify(additionalImagesUrls) })
      .where(eq(solutions.id, solutionId));

    return NextResponse.json({ success: true, additionalImagesUrls });
  } catch (error) {
    console.error("Update solution error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const solutionId = parseInt(id);

    if (isNaN(solutionId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await db.delete(solutions).where(eq(solutions.id, solutionId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete solution error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
