import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, cartItems, products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getServerUser } from "@/lib/auth";

export async function GET() {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const condition = user.role === "admin"
    ? undefined
    : eq(orders.userId, user.userId);

  const rows = await db
    .select()
    .from(orders)
    .where(condition)
    .orderBy(desc(orders.createdAt));

  return NextResponse.json({ orders: rows });
}

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) {
    return NextResponse.json({ error: "Login required to checkout" }, { status: 401 });
  }

  const { shippingAddress, notes, items } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "No items to order" }, { status: 400 });
  }

  // Calculate total
  let totalAmount = 0;
  const orderItemsData = [];

  for (const item of items) {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, item.productId))
      .limit(1);

    if (!product) continue;

    const lineTotal = Number(product.price) * item.quantity;
    totalAmount += lineTotal;

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      priceAtPurchase: product.price,
      productName: product.name,
    });
  }

  const [order] = await db
    .insert(orders)
    .values({
      userId: user.userId,
      totalAmount: totalAmount.toFixed(2),
      shippingAddress: shippingAddress || null,
      notes: notes || null,
    })
    .returning();

  await db.insert(orderItems).values(
    orderItemsData.map((oi) => ({ ...oi, orderId: order.id }))
  );

  // Clear cart
  await db.delete(cartItems).where(eq(cartItems.userId, user.userId));

  return NextResponse.json({ order }, { status: 201 });
}
