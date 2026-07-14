import nodemailer from "nodemailer";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export function generateEmailTemplate({ title, message, linkUrl, linkText }: { title: string; message: string; linkUrl?: string; linkText?: string }) {
  const brandColor = "#135db6";
  const buttonHtml = linkUrl ? `
    <div style="text-align: center; margin-top: 30px;">
      <a href="${linkUrl}" style="background-color: ${brandColor}; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
        ${linkText || "View Details"}
      </a>
    </div>
  ` : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #333333; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, ${brandColor}, #008493); padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 40px 30px; font-size: 16px; line-height: 1.6; color: #4b5563; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
        .footer a { color: ${brandColor}; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          ${message}
          ${buttonHtml}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Sri Krishna Crafting. All rights reserved.</p>
          <p>You received this email because you are subscribed to our newsletter.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}


// Create a transporter using standard SMTP config
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "your-email@gmail.com", // Add your SMTP user
    pass: process.env.SMTP_PASS || "your-app-password", // Add your SMTP password
  },
});

export async function sendEmail({ to, subject, html }: { to: string | string[]; subject: string; html: string }) {
  if (process.env.NODE_ENV === "development" && (!process.env.SMTP_USER || process.env.SMTP_USER === "your-email@gmail.com")) {
    console.log("-------------------------------------------------------");
    console.log(`[MOCK EMAIL] TO: ${Array.isArray(to) ? to.join(", ") : to}`);
    console.log(`[MOCK EMAIL] SUBJECT: ${subject}`);
    console.log(`[MOCK EMAIL] HTML: ${html}`);
    console.log("-------------------------------------------------------");
    return true; // Simulate success in dev without credentials
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Admin'}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
    });
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function notifyAllSubscribers(subject: string, messageHtml: string) {
  try {
    const subscribers = await db.select().from(newsletterSubscribers);
    if (subscribers.length === 0) return 0;

    const emails = subscribers.map((sub) => sub.email);
    
    // We are sending individually in a loop to ensure delivery and privacy 
    // for standard SMTP accounts.
    // For large lists, you would chunk this or use a real mailing service (Resend, SendGrid)
    // We are simulating by sending individual or BCC. Here we loop for simplicity and reliability 
    // on basic SMTPs that restrict BCC size.
    for (const email of emails) {
      await sendEmail({
        to: email,
        subject,
        html: messageHtml,
      });
    }

    return subscribers.length;
  } catch (error) {
    console.error("Error notifying subscribers:", error);
    return 0;
  }
}
