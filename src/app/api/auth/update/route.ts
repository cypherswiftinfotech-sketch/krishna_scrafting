import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest) {
  const payload = await getServerUser();
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, phone, address } = await req.json();

  const [updated] = await db
    .update(users)
    .set({
      name: name || undefined,
      phone: phone || null,
      address: address || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, payload.userId))
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      phone: users.phone,
      address: users.address,
    });

  return NextResponse.json({ user: updated });
}
