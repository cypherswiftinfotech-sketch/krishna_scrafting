"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

import Link from "next/link";

interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
  featured: boolean;
  cost?: string | null;
  place?: string | null;
  review?: string | null;
  socialLink?: string | null;
}

const CATEGORIES = [
  "All",
  "Residential",
  "Commercial",
  "Corporate",
  "Temple Projects",
  "International Orders",
];

const COLUMN_HEIGHTS = ["h-[280px]", "h-[380px]", "h-[320px]", "h-[420px]", "h-[260px]", "h-[360px]", "h-[440px]", "h-[300px]"];

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/portfolio").then((r) => r.json()),
      fetch("/api/portfolio/settings").then((r) => r.json())
    ])
    .then(([portfolioData, settingsData]) => {
      setItems(portfolioData.portfolio || []);
      setSettings(settingsData.settings || null);
    })
    .catch(() => {})
    .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeFilter === "All"
      ? items
      : items.filter((i) => i.category === activeFilter);

  return (
    <div className="min-h-screen bg-white pt-0 pb-20" style={{ fontFamily: "var(--font-body)" }}>
      
      {/* Page Header */}
      <div className="relative mb-16 flex flex-col justify-center min-h-[50vh] overflow-hidden pt-24">
        {settings?.heroVideoUrl && (
          <div className="absolute inset-0 z-0">
            {settings.heroVideoUrl.match(/\.(mp4|webm|ogg)$/i) || settings.heroVideoUrl.includes("video/upload") ? (
              <video 
                src={settings.heroVideoUrl} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <Image 
                src={settings.heroVideoUrl}
                alt="Portfolio Hero"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-white/30 z-10" />
          </div>
        )}
        <div className="relative z-20 px-4 max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-end">
          <div>
            <p className="text-teal-600 uppercase tracking-[0.2em] text-xs font-semibold mb-4 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-teal-600"></span> SELECTED WORK
            </p>
            <h1 className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500 tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>
              Our portfolio
            </h1>
          </div>
          <p className="text-gray-600 font-medium text-sm md:text-base max-w-sm mt-6 md:mt-0 leading-relaxed text-right md:text-left drop-shadow-sm">
            A showcase of our finest epoxy and resin creations across India and beyond — filter by the kind of space it was made for.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide border-b border-gray-200">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-shrink-0 text-xs tracking-[0.1em] font-bold uppercase pb-4 relative transition-colors ${
                activeFilter === cat
                  ? "text-blue-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {cat}
              {activeFilter === cat && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-blue-700"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-xl bg-gray-100 animate-pulse h-[300px]"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg font-semibold">No items in this category yet.</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((item, index) => {
              const hClass = COLUMN_HEIGHTS[index % COLUMN_HEIGHTS.length];
              return (
                <Link
                  key={item.id}
                  href={`/portfolio/${item.id}`}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-500 block"
                >
                  <div className={`relative w-full overflow-hidden ${hClass}`}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Dark gradient for text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Explore Icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                      <div className="w-10 h-10 rounded-full border border-white/40 bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                        <ZoomIn className="w-5 h-5 text-gray-50" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-2">
                        {item.category && (
                          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-teal-300">
                            {item.category}
                          </span>
                        )}
                        {item.category && item.place && <span className="text-gray-300 text-[10px]">—</span>}
                        {item.place && (
                          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-teal-300">
                            {item.place}
                          </span>
                        )}
                      </div>
                      <h3 className="text-gray-50 font-black text-2xl leading-tight drop-shadow-md" style={{ fontFamily: "var(--font-heading)" }}>
                        {item.title}
                      </h3>
                      {item.cost && (
                        <p className="mt-3 text-sm text-gray-200 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                          {item.cost}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
