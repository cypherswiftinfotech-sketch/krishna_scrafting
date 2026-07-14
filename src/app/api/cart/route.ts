import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getServerUser();
  const sessionId = req.cookies.get("session_id")?.value;

  if (!user && !sessionId) {
    return NextResponse.json({ cart: [] });
  }

  const condition = user
    ? eq(cartItems.userId, user.userId)
    : eq(cartItems.sessionId, sessionId!);

  const rows = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      product: {
        id: products.id,
        name: products.name,
        price: products.price,
        imageUrl: products.imageUrl,
        category: products.category,
        stock: products.stock,
      },
    })
    .from(cartItems)
    .leftJoin(products, eq(cartItems.productId, products.id))
    .where(condition);

  return NextResponse.json({ cart: rows });
}

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  const { productId, quantity = 1 } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const sessionId = req.cookies.get("session_id")?.value || Math.random().toString(36).slice(2);

  const condition = user
    ? and(eq(cartItems.userId, user.userId), eq(cartItems.productId, productId))
    : and(eq(cartItems.sessionId, sessionId), eq(cartItems.productId, productId));

  const existing = await db.select().from(cartItems).where(condition).limit(1);

  if (existing[0]) {
    await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({
      userId: user ? user.userId : null,
      sessionId: user ? null : sessionId,
      productId,
      quantity,
    });
  }

  const res = NextResponse.json({ success: true });
  if (!user) {
    res.cookies.set("session_id", sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }
  return res;
}

export async function DELETE(req: NextRequest) {
  const user = await getServerUser();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const sessionId = req.cookies.get("session_id")?.value;

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const condition = user
    ? and(eq(cartItems.productId, parseInt(productId)), eq(cartItems.userId, user.userId))
    : and(eq(cartItems.productId, parseInt(productId)), eq(cartItems.sessionId, sessionId!));

  await db.delete(cartItems).where(condition);
  return NextResponse.json({ success: true });
}
