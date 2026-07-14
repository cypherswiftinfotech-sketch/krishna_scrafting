"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, TrendingUp, Clock, Star } from "lucide-react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  category: string;
  subCategory?: string;
}

type Tab = "latest" | "bestsellers" | "trending";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "latest",      label: "Latest Products", icon: <Clock className="w-4 h-4" /> },
  { key: "bestsellers", label: "Best Sellers",    icon: <Star className="w-4 h-4" /> },
  { key: "trending",    label: "Trending",         icon: <TrendingUp className="w-4 h-4" /> },
];

export default function FeaturedProducts() {
  const [tab, setTab] = useState<Tab>("latest");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllFeatured, setShowAllFeatured] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((data) => {
        const list: Product[] = data.products || [];
        setProducts(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* Derive tab-specific ordering from the same product list */
  const displayed = (() => {
    const copy = [...products];
    if (tab === "latest")      return copy.slice(0, 8);
    if (tab === "bestsellers") return [...copy].sort(() => Math.random() - 0.5).slice(0, 8);
    if (tab === "trending")    return [...copy].reverse().slice(0, 8);
    return copy;
  })();

  const storeHref =
    tab === "latest"      ? "/store?sort=newest" :
    tab === "bestsellers" ? "/store?sort=popular" :
    "/store?sort=trending";

  return (
    <section className="py-20 border-t" style={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-5 py-1.5 mb-4"
            style={{
              background: "rgba(0,95,115,0.08)",
              border: "1px solid rgba(0,95,115,0.25)",
            }}
          >
            <ShoppingBag className="w-3.5 h-3.5" style={{ color: "var(--peacock-blue)" }} />
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--peacock-blue)" }}
            >
              Shop
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: "#1f1f1f" }}>
            Featured{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(90deg, var(--peacock-blue), var(--peacock-eye))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Products
            </span>
          </h2>
          <p style={{ color: "#6b7280" }}>
            Handpicked epoxy resin creations — discover something beautiful
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex justify-center mb-10">
          <div
            className="inline-flex rounded-2xl p-1 gap-1"
            style={{ background: "#ffffff", border: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
                style={
                  tab === t.key
                    ? {
                        background: "linear-gradient(135deg, var(--peacock-blue), #003d4a)",
                        color: "#ffffff",
                        boxShadow: "0 4px 14px rgba(0,95,115,0.35)",
                      }
                    : { color: "#6b7280" }
                }
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: "#e5e7eb" }}
              >
                <div style={{ height: "220px", background: "#d1d5db" }} />
                <div className="p-4 space-y-2">
                  <div className="h-3 rounded" style={{ background: "#e5e7eb", width: "70%" }} />
                  <div className="h-3 rounded" style={{ background: "#e5e7eb", width: "40%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No products found.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {(showAllFeatured ? displayed : displayed.slice(0, displayed.length >= 4 ? displayed.length - (displayed.length % 4) : displayed.length)).map((product) => (
                <Link
                key={product.id}
                href={`/store/${product.id}`}
                className="group rounded-2xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                {/* Image */}
                <div
                  className="relative overflow-hidden"
                  style={{ height: "220px", backgroundColor: "#f3f4f6" }}
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  {/* Category pill */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(0,95,115,0.85)",
                        color: "#fff",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {product.subCategory || product.category}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3
                    className="font-bold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors"
                    style={{ color: "#1f1f1f" }}
                  >
                    {product.name}
                  </h3>
                  <p className="font-black text-base" style={{ color: "var(--peacock-blue)" }}>
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            ))}
            </div>
            
            {displayed.length >= 4 && displayed.length % 4 !== 0 && (
              <div className="mt-8 text-center">
                <button onClick={() => setShowAllFeatured(!showAllFeatured)} className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all text-sm">
                  {showAllFeatured ? "View Less" : "View More Products"}
                </button>
              </div>
            )}
          </>
        )}

        {/* Explore Now */}
        <div className="flex justify-center mt-12">
          <Link
            href={storeHref}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, var(--peacock-blue) 0%, var(--peacock-eye) 100%)",
              color: "#ffffff",
              boxShadow: "0 8px 28px rgba(0,95,115,0.35)",
            }}
          >
            Explore Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
