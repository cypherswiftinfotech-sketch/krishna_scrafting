"use client";
import { useEffect, useState } from "react";
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

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((d) => setItems(d.portfolio || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["all", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))];

  const filtered =
    activeFilter === "all"
      ? items
      : items.filter((i) => i.category === activeFilter);

  return (
    <div className="pt-16 min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
        <h1 className="relative text-5xl font-black text-white mb-4">
          Our <span className="text-amber-400">Portfolio</span>
        </h1>
        <p className="relative text-gray-400 text-lg max-w-xl mx-auto">
          A showcase of our finest laser-engraved creations
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                  activeFilter === cat
                    ? "bg-amber-500 text-black shadow-lg"
                    : "bg-gray-900 text-gray-300 border border-gray-700 hover:border-amber-500/50 hover:text-amber-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <p className="text-gray-400 text-lg">No portfolio items yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Admin can upload portfolio items from the Admin Panel
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500/40 transition-all cursor-pointer"
                onClick={() => setLightbox(item)}
              >
                <div className="relative">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                    <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100" />
                  </div>
                  {item.featured && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-lg">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                  )}
                  {item.category && (
                    <span className="text-xs text-amber-400 font-semibold uppercase mt-2 block">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-amber-400 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div
            className="max-w-4xl w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[70vh] overflow-hidden">
              <Image
                src={lightbox.imageUrl}
                alt={lightbox.title}
                width={1200}
                height={800}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-black text-white">{lightbox.title}</h2>
              {lightbox.description && (
                <p className="text-gray-300 mt-2">{lightbox.description}</p>
              )}
              {lightbox.category && (
                <span className="text-amber-400 text-sm font-semibold uppercase mt-2 block">
                  {lightbox.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
