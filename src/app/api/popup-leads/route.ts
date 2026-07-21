import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { popupLeads } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const leads = await db
      .select()
      .from(popupLeads)
      .orderBy(desc(popupLeads.createdAt));

    return NextResponse.json({ leads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, source } = body;

    if (!name || !email || !source) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(popupLeads)
      .values({
        name,
        email,
        phone,
        source,
      })
      .returning();

    return NextResponse.json({ lead: inserted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
