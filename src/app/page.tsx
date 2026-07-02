"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Star,
  ArrowRight,
  Sparkles,
  Droplets,
  Gem,
  ShieldCheck,
  Truck,
  Heart,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface HeroSettings {
  videoUrl: string | null;
  headline: string | null;
  subheadline: string | null;
  ctaText: string | null;
}

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string | null;
  category: string;
  description: string | null;
  featured: boolean;
}

const categories = [
  { key: "river-table", label: "River Tables", icon: "🪵", desc: "Live-edge wood & ocean resin" },
  { key: "jewelry", label: "Resin Jewelry", icon: "💍", desc: "Earrings, pendants & rings" },
  { key: "coasters", label: "Coasters & Trays", icon: "🟦", desc: "Geode & ocean-inspired sets" },
  { key: "wall-art", label: "Wall Art", icon: "🖼️", desc: "Statement pieces for your home" },
];

const features = [
  {
    icon: <Droplets className="w-6 h-6" />,
    title: "Premium Resin",
    desc: "Crystal-clear, UV-resistant epoxy for glass-like finishes that last decades",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Handcrafted Art",
    desc: "Every piece is poured, cured and polished by skilled artisan hands",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Quality Guaranteed",
    desc: "Inspected at every stage — backed by our lifetime craftsmanship warranty",
  },
];

export default function HomePage() {
  const [hero, setHero] = useState<HeroSettings | null>(null);
  const [featured, setFeatured] = useState<Product[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch("/api/hero")
      .then((r) => r.json())
      .then((d) => setHero(d.settings))
      .catch(() => {});

    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((d) => setFeatured((d.products || []).slice(0, 6)))
      .catch(() => {});
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div>
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video / Fallback background */}
        {hero?.videoUrl ? (
          <video
            src={hero.videoUrl}
            poster="https://images.pexels.com/photos/7254419/pexels-photo-7254419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0">
            <Image
              src="https://images.pexels.com/photos/7254419/pexels-photo-7254419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600"
              alt="Resin art"
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: "#a5f3fc" }} />
            <span className="text-sm font-medium" style={{ color: "#ffffff" }}>
              Handcrafted Epoxy Resin Artistry
            </span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
            style={{ color: "#ffffff" }}
          >
            {hero?.headline || "Where Art Meets"}{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(to right, #a5f3fc, #5eead4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Resin
            </span>
          </h1>

          <p
            className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#e0f2fe" }}
          >
            {hero?.subheadline ||
              "Stunning handcrafted epoxy resin creations — from ocean-inspired river tables to wearable art. Each piece is one of a kind."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all hover:scale-105"
              style={{
                backgroundColor: "#ffffff",
                color: "rgb(15, 82, 186)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
              }}
            >
              <ShoppingBag className="w-5 h-5" />
              {hero?.ctaText || "Shop Collection"}
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all border hover:scale-105"
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.4)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Gem className="w-5 h-5" />
              View Gallery
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div
            className="w-6 h-10 border-2 rounded-full flex justify-center pt-2"
            style={{ borderColor: "rgba(255,255,255,0.5)" }}
          >
            <div
              className="w-1.5 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: "#a5f3fc" }}
            />
          </div>
        </div>
      </section>

      {/* ── Features Strip ───────────────────────────────────── */}
      <section
        className="py-14 border-y"
        style={{
          backgroundColor: "#ffffff",
          borderColor: "#e5e5e5",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={f.title} className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: "rgba(15, 82, 186, 0.1)",
                    border: "1px solid rgba(0, 128, 128, 0.3)",
                    color: "rgb(15, 82, 186)",
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ color: "#1f1f1f" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm" style={{ color: "#4b4b4b" }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1 mb-3"
            style={{
              backgroundColor: "rgba(0, 128, 128, 0.1)",
              border: "1px solid rgba(0, 128, 128, 0.25)",
            }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "#008080" }}
            >
              Browse
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black mb-3"
            style={{ color: "#1f1f1f" }}
          >
            Our{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(15, 82, 186), #008080)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Collections
            </span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: "#4b4b4b" }}>
            Explore our range of handcrafted epoxy resin art, from functional
            pieces to wearable creations.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.key}
              href={`/store?category=${cat.key}`}
              className="group relative rounded-2xl p-6 text-center transition-all hover:scale-105"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e5e5",
                boxShadow: "0 4px 14px rgba(15, 82, 186, 0.06)",
              }}
            >
              <div
                className="text-5xl mb-3 transition-transform group-hover:scale-110"
              >
                {cat.icon}
              </div>
              <h3
                className="font-bold mb-1"
                style={{ color: "#1f1f1f" }}
              >
                {cat.label}
              </h3>
              <p className="text-sm" style={{ color: "#4b4b4b" }}>
                {cat.desc}
              </p>
              <ArrowRight
                className="w-4 h-4 mt-3 mx-auto transition-opacity opacity-0 group-hover:opacity-100"
                style={{ color: "#008080" }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      {featured.length > 0 && (
        <section
          className="py-20"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2
                  className="text-4xl md:text-5xl font-black mb-2"
                  style={{ color: "#1f1f1f" }}
                >
                  Featured{" "}
                  <span
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgb(15, 82, 186), #008080)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Pieces
                  </span>
                </h2>
                <p style={{ color: "#4b4b4b" }}>Handpicked bestsellers</p>
              </div>
              <Link
                href="/store"
                className="hidden sm:flex items-center gap-2 font-semibold transition-colors"
                style={{ color: "#008080" }}
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl overflow-hidden transition-all group"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e5e5",
                    boxShadow: "0 4px 14px rgba(15, 82, 186, 0.05)",
                  }}
                >
                  <Link href={`/store/${product.id}`}>
                    <div
                      className="relative h-52 overflow-hidden"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-5xl">
                          {categories.find((c) => c.key === product.category)
                            ?.icon || "📦"}
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-5">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#008080" }}
                    >
                      {product.category}
                    </span>
                    <Link href={`/store/${product.id}`}>
                      <h3
                        className="font-bold text-lg mt-1 transition-colors line-clamp-1"
                        style={{ color: "#1f1f1f" }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    {product.description && (
                      <p
                        className="text-sm mt-1 line-clamp-2"
                        style={{ color: "#4b4b4b" }}
                      >
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span
                        className="text-2xl font-black"
                        style={{ color: "rgb(15, 82, 186)" }}
                      >
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="px-4 py-2 font-bold text-sm rounded-xl transition-all hover:scale-105"
                        style={{
                          backgroundColor: "rgb(15, 82, 186)",
                          color: "#ffffff",
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link
                href="/store"
                className="inline-flex items-center gap-2 font-semibold"
                style={{ color: "#008080" }}
              >
                View All Pieces <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose Us Banner ─────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Truck className="w-7 h-7" />,
              title: "Free Shipping",
              desc: "On all orders above ₹2,000",
            },
            {
              icon: <Heart className="w-7 h-7" />,
              title: "Made with Love",
              desc: "Each piece handcrafted in our studio",
            },
            {
              icon: <ShieldCheck className="w-7 h-7" />,
              title: "Lifetime Warranty",
              desc: "Against yellowing & craftsmanship defects",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-6 flex items-center gap-4"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e5e5",
                boxShadow: "0 4px 14px rgba(15, 82, 186, 0.05)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "rgba(15, 82, 186, 0.1)",
                  color: "rgb(15, 82, 186)",
                }}
              >
                {item.icon}
              </div>
              <div>
                <h3
                  className="font-bold text-lg"
                  style={{ color: "#1f1f1f" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: "#4b4b4b" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgb(15, 82, 186) 0%, #008080 100%)",
              boxShadow: "0 20px 50px rgba(15, 82, 186, 0.3)",
            }}
          >
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{ color: "#ffffff" }}
            >
              Have Something{" "}
              <span
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #a5f3fc, #ffffff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Custom?
              </span>
            </h2>
            <p
              className="text-lg mb-8"
              style={{ color: "#e0f2fe" }}
            >
              We craft bespoke resin pieces — wedding decor, corporate gifts,
              and signature statement art.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services?tab=custom_orders"
                className="px-8 py-4 font-bold rounded-xl transition-all hover:scale-105"
                style={{
                  backgroundColor: "#ffffff",
                  color: "rgb(15, 82, 186)",
                }}
              >
                Start Custom Order
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 font-bold rounded-xl transition-all"
                style={{
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                }}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}