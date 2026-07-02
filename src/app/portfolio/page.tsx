"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
  featured: boolean;
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
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => setItems(d.portfolio || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered =
    activeFilter === "All"
      ? items
      : items.filter((i) => i.category === activeFilter);

  return (
    <div className="min-h-screen bg-white pt-24 pb-20" style={{ fontFamily: "var(--font-body)" }}>
      
      {/* Page Header */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-4xl sm:text-5xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500" style={{ fontFamily: "var(--font-heading)" }}>
          Our Portfolio
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          A showcase of our finest epoxy and resin creations across India and beyond.
        </p>
      </div>

      {/* Category Filter Tabs — Apple-style pill scroll */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeFilter === cat
                  ? "text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
              }`}
              style={
                activeFilter === cat
                  ? { background: "linear-gradient(135deg, #1d4ed8, #0d9488)" }
                  : {}
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`break-inside-avoid rounded-2xl bg-gray-100 animate-pulse ${COLUMN_HEIGHTS[i % COLUMN_HEIGHTS.length]}`}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-gray-500 text-lg font-semibold">No items in this category yet.</p>
            <p className="text-gray-400 text-sm mt-2">
              Upload from the Admin Panel → Gallery Upload.
            </p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((item, index) => {
              const hClass = COLUMN_HEIGHTS[index % COLUMN_HEIGHTS.length];
              return (
                <div
                  key={item.id}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                  onClick={() => setLightbox(item)}
                >
                  <div className={`relative w-full overflow-hidden ${hClass}`}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    {/* Apple-style dark scrim that appears on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Hover content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg">
                        {item.title}
                      </p>
                      {item.category && (
                        <span className="mt-1 inline-block text-[10px] font-black uppercase tracking-widest text-teal-300">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Zoom icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {item.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-gradient-to-r from-blue-600 to-teal-500 text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative flex-1 min-h-[50vh] md:min-h-[70vh] bg-black">
              <Image
                src={lightbox.imageUrl}
                alt={lightbox.title}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>

            {/* Info panel */}
            <div className="md:w-64 bg-[#1a1a1a] p-6 flex flex-col justify-end">
              {lightbox.category && (
                <span className="text-xs font-black uppercase tracking-widest mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                  {lightbox.category}
                </span>
              )}
              <h2 className="text-xl font-black text-white leading-tight mb-2">
                {lightbox.title}
              </h2>
              {lightbox.description && (
                <p className="text-gray-400 text-sm leading-relaxed">
                  {lightbox.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
