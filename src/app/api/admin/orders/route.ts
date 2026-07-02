import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { getServerUser } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const user = await getServerUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      status: orders.status,
      totalAmount: orders.totalAmount,
      shippingAddress: orders.shippingAddress,
      notes: orders.notes,
      createdAt: orders.createdAt,
      userEmail: users.email,
      userName: users.name,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  return NextResponse.json({ orders: rows });
}
