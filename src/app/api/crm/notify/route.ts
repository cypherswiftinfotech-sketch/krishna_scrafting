import { NextRequest, NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth";
import { notifyAllSubscribers, generateEmailTemplate } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 });
    }

    // Replace line breaks with <p> for HTML email
    const formattedMessage = message.split('\n').map((para: string) => `<p>${para}</p>`).join('');

    const htmlMessage = generateEmailTemplate({
      title: subject,
      message: formattedMessage,
      linkUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      linkText: "Visit Our Website"
    });

    const count = await notifyAllSubscribers(subject, htmlMessage);

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error("Error in notify route:", error);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}
