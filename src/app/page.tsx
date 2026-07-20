"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
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
import FeaturedProducts from "@/components/FeaturedProducts";
import OurProcess from "@/components/OurProcess";
import TrainingBanner from "@/components/TrainingBanner";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";
import { cn } from "@/lib/utils";

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

interface HomeCategory {
  id: number;
  label: string;
  description: string | null;
  imageUrl: string | null;
  storeQuery: string | null;
  sortOrder: number;
  active: boolean;
}

const categories = [
  { key: "river-table", label: "River Tables", icon: "🪵", desc: "Live-edge wood & ocean resin" },
  { key: "jewelry", label: "Resin Jewelry", icon: "💍", desc: "Earrings, pendants & rings" },
  { key: "coasters", label: "Coasters & Trays", icon: "🟦", desc: "Geode & ocean-inspired sets" },
  { key: "wall-art", label: "Wall Art", icon: "🖼️", desc: "Statement pieces for your home" },
];

const featuredCategories = [
  {
    key: "epoxy-tables",
    label: "Epoxy Tables",
    desc: "Stunning river tables & live-edge resin masterpieces for your home",
    storeQuery: "/store?category=river-table",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
        <rect x="8" y="28" width="48" height="8" rx="4" fill="#b8860b" opacity="0.9"/>
        <rect x="14" y="36" width="6" height="16" rx="3" fill="#a0522d"/>
        <rect x="44" y="36" width="6" height="16" rx="3" fill="#a0522d"/>
        <ellipse cx="32" cy="32" rx="24" ry="6" fill="url(#tgr)" opacity="0.5"/>
        <defs><linearGradient id="tgr" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#3b82f6"/></linearGradient></defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #fef9c3 0%, #fde68a 50%, #fef3c7 100%)",
    accent: "#b8860b",
  },
  {
    key: "epoxy-flooring",
    label: "Epoxy Flooring",
    desc: "High-gloss 3D floor coatings that transform any space beautifully",
    storeQuery: "/store?category=flooring",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
        <rect x="4" y="40" width="56" height="16" rx="3" fill="#a0522d" opacity="0.4"/>
        <rect x="4" y="40" width="56" height="4" rx="2" fill="#b8860b" opacity="0.6"/>
        <ellipse cx="32" cy="40" rx="28" ry="8" fill="url(#fgr)" opacity="0.85"/>
        <path d="M8 32 Q32 8 56 32" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.6"/>
        <defs><linearGradient id="fgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#818cf8"/></linearGradient></defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #f0fdf4 100%)",
    accent: "#059669",
  },
  {
    key: "wall-art",
    label: "Wall Art",
    desc: "Unique epoxy wall panels and abstract art pieces for bold interiors",
    storeQuery: "/store?category=wall-art",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
        <rect x="6" y="8" width="52" height="40" rx="5" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
        <circle cx="20" cy="22" r="7" fill="#fbbf24" opacity="0.8"/>
        <path d="M6 38 L22 24 L34 34 L44 20 L58 38Z" fill="url(#wgr)" opacity="0.7"/>
        <rect x="6" y="50" width="52" height="6" rx="3" fill="#b8860b" opacity="0.5"/>
        <defs><linearGradient id="wgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f472b6"/><stop offset="100%" stopColor="#818cf8"/></linearGradient></defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5d0fe 100%)",
    accent: "#9333ea",
  },
  {
    key: "home-decor",
    label: "Home Decor",
    desc: "Coasters, trays, bowls & centrepieces to elevate every room",
    storeQuery: "/store?category=coasters",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
        <circle cx="32" cy="32" r="24" fill="url(#hgr)" opacity="0.3"/>
        <circle cx="32" cy="32" r="16" fill="url(#hgr2)" opacity="0.5"/>
        <circle cx="32" cy="32" r="8" fill="#b8860b" opacity="0.8"/>
        <defs>
          <linearGradient id="hgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient>
          <linearGradient id="hgr2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
        </defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)",
    accent: "#d97706",
  },
  {
    key: "custom-gifts",
    label: "Custom Gifts",
    desc: "Personalised resin keepsakes, name plaques & corporate gifting",
    storeQuery: "/store?category=jewelry",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
        <rect x="10" y="28" width="44" height="28" rx="4" fill="url(#ggr)" opacity="0.7"/>
        <rect x="6" y="22" width="52" height="10" rx="4" fill="#b8860b" opacity="0.6"/>
        <path d="M32 22 L32 56" stroke="#fff" strokeWidth="2"/>
        <path d="M6 27 Q20 14 32 22 Q44 14 58 27" stroke="#e11d48" strokeWidth="2" fill="none"/>
        <defs><linearGradient id="ggr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fb923c"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)",
    accent: "#e11d48",
  },
  {
    key: "accessories",
    label: "Accessories",
    desc: "Resin jewellery, keychains, hair clips & wearable art pieces",
    storeQuery: "/store?category=jewelry",
    icon: (
      <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none">
        <circle cx="32" cy="20" r="10" fill="none" stroke="url(#agr)" strokeWidth="3"/>
        <path d="M22 20 Q16 36 22 44 Q32 50 42 44 Q48 36 42 20" fill="url(#agr2)" opacity="0.5"/>
        <circle cx="22" cy="44" r="4" fill="#b8860b"/>
        <circle cx="42" cy="44" r="4" fill="#b8860b"/>
        <defs>
          <linearGradient id="agr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#ec4899"/></linearGradient>
          <linearGradient id="agr2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c4b5fd"/><stop offset="100%" stopColor="#f9a8d4"/></linearGradient>
        </defs>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)",
    accent: "#7c3aed",
  },
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
  const [homeCats, setHomeCats] = useState<HomeCategory[]>([]);
  const [activeCard, setActiveCard] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const carouselTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const addItem = useCartStore((s) => s.addItem);

  const goToCard = useCallback((idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveCard(idx);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);

  const startTimer = useCallback(() => {
    if (carouselTimer.current) clearInterval(carouselTimer.current);
    carouselTimer.current = setInterval(() => {
      setActiveCard(prev => (prev + 1) % Math.max(1, homeCats.length));
    }, 3200);
  }, [homeCats.length]);

  useEffect(() => {
    startTimer();
    return () => { if (carouselTimer.current) clearInterval(carouselTimer.current); };
  }, [startTimer]);

  useEffect(() => {
    Promise.all([
      fetch("/api/hero").then((r) => r.json()).then((d) => setHero(d.settings)).catch(() => {}),
      fetch("/api/products?featured=true").then((r) => r.json()).then((d) => setFeatured((d.products || []).slice(0, 6))).catch(() => {}),
      fetch("/api/home-categories").then((r) => r.json()).then((d) => setHomeCats(d.categories || [])).catch(() => {})
    ]).finally(() => setIsDataLoaded(true));
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

  // Determine if loader should be shown
  const showLoader = !isDataLoaded || (hero?.videoUrl && !isVideoLoaded);

  return (
    <div>
      {/* ── Global Preloader ──────────────────────────────────── */}
      <div 
        className={cn(
          "fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white transition-opacity duration-700 pointer-events-none",
          showLoader ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="w-16 h-16 border-4 border-gray-200 border-t-peacock-blue rounded-full animate-spin mb-4" style={{ borderTopColor: "var(--peacock-blue)" }}></div>
        <p className="text-gray-500 font-medium animate-pulse tracking-wide uppercase text-sm">Preparing Your Experience...</p>
      </div>

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video / Fallback background */}
        {hero?.videoUrl ? (
          <video
            src={hero.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            onError={() => setIsVideoLoaded(true)} // Fail-safe
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: "#1f1f1f" }} />
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
            <Sparkles className="w-4 h-4" style={{ color: "#008080" }} />
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
                backgroundImage: "var(--blue-gradient)",
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
            style={{ color: "#ffffff" }}
          >
            {hero?.subheadline ||
              "Stunning handcrafted epoxy resin creations — from ocean-inspired river tables to wearable art. Each piece is one of a kind."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl transition-all hover:scale-105"
              style={{
                background: "var(--blue-gradient)",
                color: "#ffffff",
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
              View Portfolio
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
              style={{ background: "var(--blue-gradient)" }}
            />
          </div>
        </div>
      </section>

      {/* ── Features Strip ───────────────────────────────────── */}
      <section
        className="py-14 border-y"
        style={{ backgroundColor: "#ffffff", borderColor: "#e5e5e5" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
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
                  <h3 className="font-semibold mb-1" style={{ color: "#1f1f1f" }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: "#4b4b4b" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Categories Carousel ──────────────────────── */}
      <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
        <style>{`
          @keyframes shimmerSweep {
            0%   { transform: translateX(-120%) skewX(-20deg); }
            100% { transform: translateX(320%)  skewX(-20deg); }
          }
          @keyframes brandShine {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          @keyframes cardPulse {
            0%, 100% { box-shadow: 0 0 0 0   rgba(15,82,186,0.20), 0 8px 32px rgba(0,0,0,0.10); }
            50%       { box-shadow: 0 0 0 6px rgba(15,82,186,0.08), 0 8px 32px rgba(0,0,0,0.10); }
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-1.5 mb-4"
              style={{
                background: "rgba(15,82,186,0.08)",
                border: "1px solid rgba(15,82,186,0.25)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "rgb(15,82,186)" }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgb(15,82,186)" }}>Explore</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-3" style={{ color: "#1f1f1f" }}>
              Featured{" "}
              <span style={{
                backgroundImage: "linear-gradient(90deg, rgb(15,82,186), #008080, rgb(15,82,186))",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "brandShine 3s linear infinite",
              }}>Categories</span>
            </h2>
            <p style={{ color: "#6b7280" }} className="max-w-md mx-auto">
              Browse our full range of handcrafted epoxy creations
            </p>
          </div>

          {/* Fixed grid — categories from DB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {homeCats.map((cat, idx) => {
              const isActive = idx === activeCard;
              const matchCat = featuredCategories.find(fc => fc.label === cat.label);
              const icon = matchCat?.icon || <Sparkles className="w-8 h-8 text-[#d4af37]" />;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => { goToCard(idx); startTimer(); }}
                  className="group relative rounded-2xl overflow-hidden text-center flex flex-col items-center transition-all duration-500 cursor-pointer bg-white"
                  style={{
                    minHeight: "280px",
                    border: isActive
                      ? "2px solid var(--peacock-eye)"
                      : "1px solid var(--cream-white-border)",
                    boxShadow: isActive ? "0 10px 30px -10px rgba(212,175,55,0.4)" : "0 4px 20px -10px rgba(0,0,0,0.05)",
                    transform: isActive ? "translateY(-4px)" : "translateY(0)",
                  }}
                >
                  {/* Subtle Top Gradient for active state */}
                  {isActive && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--peacock-blue)] to-[var(--peacock-eye)]" />
                  )}

                  <div className="relative z-20 flex flex-col items-center p-8 w-full h-full">
                    {/* Icon Container */}
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        background: isActive ? "rgba(212,175,55,0.05)" : "rgba(15,82,186,0.03)",
                        border: isActive ? "1px solid rgba(212,175,55,0.2)" : "1px solid rgba(15,82,186,0.1)",
                      }}
                    >
                      {icon}
                    </div>

                    <h3
                      className="font-black text-xl mb-3 leading-tight transition-colors"
                      style={{ color: isActive ? "var(--peacock-blue)" : "#1f1f1f" }}
                    >
                      {cat.label}
                    </h3>
                    
                    <p
                      className="text-sm leading-relaxed mb-8 flex-grow transition-colors"
                      style={{ color: "#6b7280" }}
                    >
                      {cat.description}
                    </p>
                    
                    <Link
                      href={cat.storeQuery || "/store"}
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:scale-105 mt-auto w-full justify-center"
                      style={{
                        background: isActive ? "var(--peacock-eye)" : "transparent",
                        color: isActive ? "#ffffff" : "var(--peacock-blue)",
                        border: isActive ? "none" : "1px solid var(--peacock-blue)",
                        boxShadow: isActive ? "0 4px 15px rgba(212,175,55,0.3)" : "none",
                      }}
                    >
                      Explore <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {homeCats.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => { goToCard(idx); startTimer(); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: idx === activeCard ? "28px" : "8px",
                  height: "8px",
                  background: idx === activeCard
                    ? "linear-gradient(90deg, rgb(15,82,186), #008080)"
                    : "rgba(0,0,0,0.15)",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────── */}
      <FeaturedProducts />

      {/* ── Our Process ───────────────────────────────────────── */}
      <OurProcess />

      {/* ── Training Banner ───────────────────────────────────── */}
      <TrainingBanner />

      {/* ── Testimonials ──────────────────────────────────────── */}
      <Testimonials />

      {/* ── Instagram Feed ────────────────────────────────────── */}
      <InstagramFeed />

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
                  color: "#fbbf24",
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
                href="/customservices?tab=custom_orders"
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