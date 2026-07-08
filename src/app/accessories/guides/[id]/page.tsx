import { db } from "@/db";
import { learningGuides } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default async function GuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guideId = parseInt(id, 10);
  
  if (isNaN(guideId)) {
    notFound();
  }

  const [guide] = await db
    .select()
    .from(learningGuides)
    .where(eq(learningGuides.id, guideId))
    .limit(1);

  if (!guide) {
    notFound();
  }

  return (
    <main className="relative min-h-screen flex flex-col justify-center pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={guide.imageUrl || "/placeholder.jpg"}
          alt={guide.title}
          fill
          className="object-cover object-center"
          priority
        />
        {/* Soft Overlay for readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-20 flex flex-col items-center">
        <Link 
          href="/accessories" 
          className="self-start inline-flex items-center gap-2 text-[#ffffff]/90 hover:text-[#ffffff] mb-12 transition-colors font-semibold bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Accessories
        </Link>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-12 text-[#ffffff] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-center leading-tight">
          {guide.title}
        </h1>

        <div className="w-full bg-black/40 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl">
          <p className="text-lg md:text-xl text-[#ffffff] drop-shadow-sm leading-relaxed whitespace-pre-wrap">
            {guide.content}
          </p>
        </div>
      </div>
    </main>
  );
}
