import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ message: "Admin already exists" });
    }

    const hashed = await bcrypt.hash(adminPassword, 10);
    await db.insert(users).values({
      name: "Admin",
      email: adminEmail,
      password: hashed,
      role: "admin",
    });

    return NextResponse.json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
