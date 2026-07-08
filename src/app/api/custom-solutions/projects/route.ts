import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { recentProjects } from "@/db/schema";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET() {
  const items = await db.select().from(recentProjects).orderBy(recentProjects.sortOrder);
  return NextResponse.json({ projects: items });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const title = formData.get("title") as string;
  const city = formData.get("city") as string;
  const costRange = formData.get("costRange") as string;
  const timeTaken = formData.get("timeTaken") as string;
  const description = formData.get("description") as string;
  const sortOrderStr = formData.get("sortOrder") as string;
  
  const beforeFile = formData.get("beforeImage") as File | null;
  const afterFile = formData.get("afterImage") as File | null;
  
  let beforeImageUrl = null;
  let afterImageUrl = null;
  
  if (beforeFile && beforeFile.size > 0) {
    const uploaded = await uploadToCloudinary(beforeFile, "custom_solutions_projects");
    if (uploaded) beforeImageUrl = uploaded.url;
  }
  
  if (afterFile && afterFile.size > 0) {
    const uploaded = await uploadToCloudinary(afterFile, "custom_solutions_projects");
    if (uploaded) afterImageUrl = uploaded.url;
  }

  const [newItem] = await db.insert(recentProjects).values({
    title,
    city,
    costRange,
    timeTaken,
    description,
    beforeImageUrl,
    afterImageUrl,
    sortOrder: sortOrderStr ? parseInt(sortOrderStr) : 0,
  }).returning();

  return NextResponse.json({ project: newItem });
}
