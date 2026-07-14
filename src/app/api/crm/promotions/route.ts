import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems, users, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { generateEmailTemplate } from "@/lib/sendEmail";
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

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetCategory, subject, message } = await req.json();

    if (!targetCategory || !subject || !message) {
      return NextResponse.json({ error: "Category, subject, and message are required" }, { status: 400 });
    }

    // Find all users who ordered products in the target category
    const pastOrders = await db
      .select({ email: users.email })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(users, eq(orders.userId, users.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(targetCategory === "All Categories" ? undefined : eq(products.category, targetCategory as any));

    // Get unique emails
    const uniqueEmails = Array.from(new Set(pastOrders.map(o => o.email)));

    if (uniqueEmails.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "No users found for this category." });
    }

    const formattedMessage = message.split('\n').map((para: string) => `<p>${para}</p>`).join('');

    const htmlMessage = generateEmailTemplate({
      title: subject,
      message: formattedMessage,
      linkUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/store`,
      linkText: "Shop Now"
    });

    let sentCount = 0;
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      for (const email of uniqueEmails) {
        if (!email) continue;
        try {
          await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || "Sri Krishna Crafting"}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: htmlMessage,
          });
          sentCount++;
        } catch (e) {
          console.error(`Failed to send to ${email}`, e);
        }
      }
    } else {
      console.log(`[MOCK EMAIL] Sent ${uniqueEmails.length} targeted promotion emails.`);
      sentCount = uniqueEmails.length;
    }

    return NextResponse.json({ success: true, count: sentCount });
  } catch (error: any) {
    console.error("Error sending targeted promotion:", error);
    return NextResponse.json({ error: "Failed to send promotions" }, { status: 500 });
  }
}
