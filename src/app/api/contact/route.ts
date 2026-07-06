import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactRequests } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Save to database
    await db.insert(contactRequests).values({
      name: body.name,
      email: body.email,
      phone: body.phone,
      country: body.country,
      city: body.city,
      productInterest: body.productInterest,
      budget: body.budget,
      appointmentDate: body.appointmentDate,
      message: body.message,
      imageUrl: body.imageUrl,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving contact request:", error);
    return NextResponse.json(
      { error: "Failed to save request" },
      { status: 500 }
    );
  }
}
