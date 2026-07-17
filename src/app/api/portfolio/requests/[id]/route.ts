import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portfolioRequests } from "@/db/schema";
import { getServerUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.delete(portfolioRequests).where(eq(portfolioRequests.id, parseInt(id, 10)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio request:", error);
    return NextResponse.json({ error: "Failed to delete request" }, { status: 500 });
  }
}
