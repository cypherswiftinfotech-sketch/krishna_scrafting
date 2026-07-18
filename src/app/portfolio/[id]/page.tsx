import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PortfolioImageSlider from "@/components/PortfolioImageSlider";
import { ArrowLeft, ExternalLink, MapPin, Tag } from "lucide-react";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { eq, ne } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import PortfolioTabs from "@/components/PortfolioTabs";
import PortfolioRequestButton from "@/components/PortfolioRequestButton";

export const revalidate = 60; // Cache for 60 seconds (ISR) for faster loading

export default async function PortfolioItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Extract ID from slug format "elegant-epoxy-table-15" or just "15"
  const itemIdMatch = id.match(/-(\d+)$/);
  const itemId = itemIdMatch ? parseInt(itemIdMatch[1], 10) : parseInt(id, 10);

  if (isNaN(itemId)) return notFound();

  const [item] = await db
    .select()
    .from(portfolio)
    .where(eq(portfolio.id, itemId))
    .limit(1);

  if (!item) return notFound();

  // Fetch recommended items (excluding current one)
  const recommendedItems = await db
    .select()
    .from(portfolio)
    .where(ne(portfolio.id, itemId))
    .limit(3);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 text-gray-900" style={{ fontFamily: "var(--font-body)" }}>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link href="/portfolio" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-700 transition-colors text-sm font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Main Image */}
          <div className="w-full lg:w-2/3">
            <PortfolioImageSlider 
              images={[item.imageUrl, ...(item.additionalImages ? JSON.parse(item.additionalImages) : [])]} 
              title={item.title} 
            />
          </div>

          {/* Details Panel */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {item.category && (
                <span className="text-xs font-black uppercase tracking-[0.15em] text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
                  {item.category}
                </span>
              )}
              {item.featured && (
                <span className="text-xs font-black uppercase tracking-[0.15em] text-white-force bg-gradient-to-r from-blue-700 to-teal-500 px-3 py-1.5 rounded-full shadow-md">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-8 text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
              {item.title}
            </h1>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <MapPin className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Location</p>
                  <p className="text-gray-900 font-medium">{item.place || "Available PAN India"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <Tag className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Project Value</p>
                  <p className="text-gray-900 font-medium">{item.cost || "On Request"}</p>
                </div>
              </div>

              <PortfolioRequestButton portfolioId={item.id} portfolioTitle={item.title} />

              {item.socialLink && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <ExternalLink className="w-5 h-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">View on Social</p>
                    <a href={item.socialLink} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 transition-colors font-semibold underline underline-offset-4">
                      Explore Original Post
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-width Description and Review Tabs */}
        <PortfolioTabs 
          description={item.description}
          review={item.review}
          reviewPhotoUrl={item.reviewPhotoUrl}
          clientExperience={item.clientExperience}
        />
      </div>

      {/* Recommended Projects Section */}
      {recommendedItems.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
              More Like This
            </h2>
            <div className="h-[2px] flex-1 bg-gray-100"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedItems.map((rec) => (
              <Link
                key={rec.id}
                href={`/portfolio/${slugify(rec.title)}-${rec.id}`}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-500 block h-[300px]"
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={rec.imageUrl}
                    alt={rec.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {rec.category && (
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-teal-300 block mb-2">
                        {rec.category}
                      </span>
                    )}
                    <h3 className="text-gray-50 font-black text-xl leading-tight drop-shadow-md" style={{ fontFamily: "var(--font-heading)" }}>
                      {rec.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
