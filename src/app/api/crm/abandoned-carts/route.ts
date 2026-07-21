import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cartItems, users, products, crmSettings } from "@/db/schema";
import { eq, isNotNull, sql } from "drizzle-orm";
import { getServerUser } from "@/lib/auth";
import { notifyAllSubscribers, generateEmailTemplate } from "@/lib/sendEmail";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get abandoned carts (carts that belong to registered users and are inactive)
    const carts = await db
      .select({
        cartId: cartItems.id,
        userEmail: users.email,
        userName: users.name,
        productName: products.name,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
      })
      .from(cartItems)
      .innerJoin(users, eq(cartItems.userId, users.id))
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(isNotNull(cartItems.userId));

    return NextResponse.json({ carts });
  } catch (error: any) {
    console.error("Error fetching abandoned carts:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const carts = await db
      .select({
        cartId: cartItems.id,
        userEmail: users.email,
        userName: users.name,
        productName: products.name,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
      })
      .from(cartItems)
      .innerJoin(users, eq(cartItems.userId, users.id))
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(isNotNull(cartItems.userId));

    if (carts.length === 0) {
      return NextResponse.json({ success: true, message: "No abandoned carts to remind." });
    }

    // Group items by user email
    const usersCarts: Record<string, { name: string, items: string[] }> = {};
    for (const cart of carts) {
      if (!usersCarts[cart.userEmail]) {
        usersCarts[cart.userEmail] = { name: cart.userName, items: [] };
      }
      usersCarts[cart.userEmail].items.push(`- ${cart.quantity}x ${cart.productName}`);
    }

    let sentCount = 0;
    for (const email of Object.keys(usersCarts)) {
      const userCart = usersCarts[email];
      
      const htmlMessage = generateEmailTemplate({
        title: "Did you forget something?",
        message: `<p style="font-size: 18px; color: #111;">Hi ${userCart.name},</p>
                  <p>We noticed you left some great items in your cart. They are waiting for you!</p>
                  <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    ${userCart.items.join('<br>')}
                  </div>
                  <p>Hurry back before they sell out!</p>`,
        linkUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop`,
        linkText: "Return to Cart"
      });

      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || "Sri Krishna Crafting"}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject: "You left items in your cart!",
            html: htmlMessage,
          });
          sentCount++;
        } catch (e) {
          console.error(`Failed to send to ${email}`, e);
        }
      } else {
        console.log(`[MOCK EMAIL] Sent abandoned cart reminder to ${email}.`);
        sentCount++;
      }
    }

    return NextResponse.json({ success: true, message: `Reminders successfully sent to ${sentCount} users.` });
  } catch (error: any) {
    console.error("Error triggering reminders:", error);
    return NextResponse.json({ error: "Failed to send reminders" }, { status: 500 });
  }
}
