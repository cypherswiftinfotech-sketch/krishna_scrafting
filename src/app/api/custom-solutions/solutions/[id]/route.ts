import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { solutions } from "@/db/schema";
import { eq } from "drizzle-orm";

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
