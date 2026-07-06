import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactRequests } from "@/db/schema";
import { getServerUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    const body = await req.json();
    
    await db
      .update(contactRequests)
      .set({
        name: body.name,
        email: body.email,
        phone: body.phone,
        country: body.country,
        city: body.city,
      })
      .where(eq(contactRequests.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating contact request:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
