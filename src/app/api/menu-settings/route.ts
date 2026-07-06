import { NextResponse } from "next/server";
import { db } from "@/db";
import { menuSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return false;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== "admin") return false;
    return true;
  } catch (error) {
    return false;
  }
}

export async function GET() {
  try {
    const settings = await db.select().from(menuSettings);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching menu settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, visible } = await req.json();

    if (typeof key !== "string" || typeof visible !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const result = await db
      .update(menuSettings)
      .set({ visible, updatedAt: new Date() })
      .where(eq(menuSettings.key, key))
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating menu setting:", error);
    return NextResponse.json(
      { error: "Failed to update menu setting" },
      { status: 500 }
    );
  }
}
