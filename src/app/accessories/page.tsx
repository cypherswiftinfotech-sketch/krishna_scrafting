"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingCart, Heart, Star, ArrowRight, BookOpen, X,
  ChevronRight, ChevronLeft, ChevronDown, ChevronUp, Mail,
  Palette, Droplets, FlaskConical, Box, PaintBucket, ShieldCheck, 
  Sparkles, Coins, Pipette, Flower2, Trees, Clock, Lightbulb, Brush, Package, Gift
} from "lucide-react";
import toast from "react-hot-toast";

// MOCK DATA (To be replaced with DB data later)
const CATEGORIES = [
  { name: "Pigments", icon: <Palette className="w-8 h-8" />, color: "from-pink-300 to-rose-400", textCol: "text-rose-500", desc: "Vibrant colors for every mood" },
  { name: "Resins", icon: <Droplets className="w-8 h-8" />, color: "from-cyan-300 to-blue-400", textCol: "text-blue-500", desc: "Crystal clear epoxy pours" },
  { name: "Hardeners", icon: <FlaskConical className="w-8 h-8" />, color: "from-emerald-300 to-teal-400", textCol: "text-teal-500", desc: "Perfect curing guaranteed" },
  { name: "Silicone Molds", icon: <Box className="w-8 h-8" />, color: "from-orange-300 to-amber-400", textCol: "text-orange-500", desc: "Endless shapes & designs" },
  { name: "Mixing Tools", icon: <PaintBucket className="w-8 h-8" />, color: "from-purple-300 to-fuchsia-400", textCol: "text-fuchsia-500", desc: "Blend effortlessly" },
  { name: "Safety Equipment", icon: <ShieldCheck className="w-8 h-8" />, color: "from-red-300 to-rose-500", textCol: "text-red-500", desc: "Protect yourself while crafting" },
  { name: "Glitters", icon: <Sparkles className="w-8 h-8" />, color: "from-yellow-200 to-amber-300", textCol: "text-amber-500", desc: "Add some premium sparkle" },
  { name: "Metallic Powders", icon: <Coins className="w-8 h-8" />, color: "from-slate-300 to-zinc-400", textCol: "text-slate-600", desc: "Luxurious metallic finishes" },
  { name: "Alcohol Inks", icon: <Pipette className="w-8 h-8" />, color: "from-indigo-300 to-blue-500", textCol: "text-indigo-500", desc: "Mesmerizing fluid art effects" },
  { name: "Dry Flowers", icon: <Flower2 className="w-8 h-8" />, color: "from-pink-200 to-rose-300", textCol: "text-pink-500", desc: "Natural touch for your resin" },
  { name: "Wood Bases", icon: <Trees className="w-8 h-8" />, color: "from-amber-500 to-orange-700", textCol: "text-amber-700", desc: "Rustic foundation pieces" },
  { name: "Clock Mechanisms", icon: <Clock className="w-8 h-8" />, color: "from-gray-400 to-slate-600", textCol: "text-slate-700", desc: "Create timeless functional art" },
  { name: "LED Lights", icon: <Lightbulb className="w-8 h-8" />, color: "from-yellow-300 to-orange-400", textCol: "text-yellow-600", desc: "Illuminate your masterpiece" },
  { name: "Polishing Materials", icon: <Brush className="w-8 h-8" />, color: "from-cyan-300 to-blue-500", textCol: "text-cyan-600", desc: "Achieve mirror-like finishes" },
  { name: "Packaging Materials", icon: <Package className="w-8 h-8" />, color: "from-stone-300 to-stone-400", textCol: "text-stone-600", desc: "Professional delivery solutions" },
  { name: "Gift Accessories", icon: <Gift className="w-8 h-8" />, color: "from-rose-300 to-pink-500", textCol: "text-rose-500", desc: "Perfect presents and addons" }
];

const MOCK_PRODUCTS = [
  { id: 1, name: "Ocean Blue Pigment", rating: 4.8, price: 499, stock: 25, img: "/placeholder.jpg" },
  { id: 2, name: "Metallic Gold Powder", rating: 4.9, price: 799, stock: 12, img: "/placeholder.jpg" },
  { id: 3, name: "Crystal Clear Resin Kit", rating: 5.0, price: 2499, stock: 5, img: "/placeholder.jpg" },
  { id: 4, name: "Premium Torch", rating: 4.7, price: 1299, stock: 40, img: "/placeholder.jpg" },
  { id: 5, name: "Safety Kit (Mask & Gloves)", rating: 4.6, price: 599, stock: 100, img: "/placeholder.jpg" },
];

const MOCK_NEW_ARRIVALS = [
  { id: 6, name: "Neon Glow Pigments", rating: 5.0, price: 899, stock: 50, img: "/placeholder.jpg", badge: "NEW" },
  { id: 7, name: "Geode Mold Set", rating: 4.9, price: 1499, stock: 30, img: "/placeholder.jpg", badge: "NEW" },
  { id: 8, name: "Alcohol Ink Bundle", rating: 4.8, price: 1999, stock: 15, img: "/placeholder.jpg", badge: "NEW" },
];

const GUIDES = [
  { title: "How to use pigments", img: "/placeholder.jpg", content: "Mix 10% pigment into your resin carefully..." },
  { title: "How to choose resin", img: "/placeholder.jpg", content: "For deep pours use casting resin. For coating use epoxy..." },
  { title: "Safety Guide", img: "/placeholder.jpg", content: "Always wear gloves and a respirator when mixing chemicals..." },
];

const FAQS = [
  { q: "Difference between resin types", a: "Casting resin is for thick pours (tables), coating resin is for thin protective layers." },
  { q: "How much resin required?", a: "Use our Resin Calculator to get an exact estimate based on your dimensions." },
  { q: "Shelf life", a: "Unopened resin typically lasts 12 months in a cool, dry place." },
  { q: "Storage", a: "Store at room temperature between 20-25°C away from direct sunlight." },
];

const REVIEWS = [
  { id: 1, name: "Aarav S.", text: "The pigments are incredibly vibrant!", rating: 5 },
  { id: 2, name: "Priya M.", text: "Best resin I have ever used. Bubble-free.", rating: 5 },
  { id: 3, name: "Karan T.", text: "The beginner kit had everything I needed to start.", rating: 4 },
];

// Reusable Components
const PrimaryButton = ({ children, className = "", onClick, icon }: any) => (
  <button suppressHydrationWarning onClick={onClick} className={`relative group overflow-hidden bg-gradient-to-r from-[#135db6] to-[#008493] text-[#ffffff] font-bold rounded-full transition-all hover:shadow-[0_0_20px_rgba(19,93,182,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 ${className}`}>
    <span className="relative z-10 flex items-center gap-2">{children} {icon}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-[#008493] to-[#135db6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </button>
);

const ProductCard = ({ product }: any) => (
  <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg shadow-gray-200/40 hover:-translate-y-2 hover:shadow-2xl transition-all group flex flex-col h-full relative">
    {product.badge && (
      <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${product.badge === 'NEW' ? 'bg-[#ff4d4d]' : 'bg-[#135db6]'}`}>
        {product.badge}
      </div>
    )}
    <button suppressHydrationWarning className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
      <Heart className="w-5 h-5" />
    </button>
    <div className="relative h-56 overflow-hidden bg-gray-50">
      <img src={product.imageUrl || product.img || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-1 text-yellow-400 mb-2 text-sm">
        <Star className="w-4 h-4 fill-current" />
        <span className="text-gray-600 font-medium ml-1">{product.rating}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight flex-grow">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
      
      <div className="flex items-end justify-between mt-auto pt-4 border-t border-gray-100">
        <div>
          <span className="text-2xl font-black text-[#135db6]">₹{product.price}</span>
        </div>
        <button suppressHydrationWarning onClick={() => toast.success("Added to cart")} className="w-10 h-10 rounded-full bg-gray-50 text-gray-900 flex items-center justify-center hover:bg-[#135db6] hover:text-white transition-colors border border-gray-200 hover:border-transparent">
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);


export default function AccessoriesPage() {
  const [selectedKit, setSelectedKit] = useState<any>(null);
  const [activeGuide, setActiveGuide] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [kits, setKits] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showAllKits, setShowAllKits] = useState(false);
  const [showAllGuides, setShowAllGuides] = useState(false);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [kitsRes, settingsRes, countRes, guidesRes, bestSellersRes, newArrivalsRes, testimonialsRes, catsRes] = await Promise.all([
          fetch("/api/accessories/kits"),
          fetch("/api/accessories/settings"),
          fetch("/api/accessories/newsletter"),
          fetch("/api/accessories/guides"),
          fetch("/api/products?mainCategory=Accessories&featured=true&limit=8"),
          fetch("/api/products?mainCategory=Accessories&limit=6"),
          fetch("/api/testimonials"),
          fetch("/api/product-categories")
        ]);
        
        if (catsRes.ok) {
          const data = await catsRes.json();
          setCategoriesData(data.categories || []);
        }

        if (kitsRes.ok) {
          const data = await kitsRes.json();
          setKits(data.kits);
        }
        
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings(data.settings);
          // If no video, don't wait for video to load
          if (!data.settings?.heroVideoUrl) {
            setVideoLoaded(true);
          }
        } else {
          setVideoLoaded(true);
        }

        if (countRes.ok) {
          const data = await countRes.json();
          setSubscriberCount(data.count);
        }

        if (guidesRes.ok) {
          const data = await guidesRes.json();
          setGuides(data.guides);
        }

        if (bestSellersRes.ok) {
          const data = await bestSellersRes.json();
          setBestSellers(data.products.map((p: any) => ({ ...p, rating: 4.8 })));
        }

        if (newArrivalsRes.ok) {
          const data = await newArrivalsRes.json();
          setNewArrivals(data.products.map((p: any) => ({ ...p, badge: 'NEW', rating: 5 })));
        }

        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json();
          setTestimonials(data.testimonials);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        setVideoLoaded(true);
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = async (e: any) => {
    e.preventDefault();
    if (!email) return;

    try {
      const res = await fetch("/api/accessories/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Subscribed to newsletter!");
        setEmail("");
        setSubscriberCount((prev) => prev !== null ? prev + 1 : 1);
      } else {
        toast.error("Failed to subscribe. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 selection:bg-[#135db6]/20">
      
      {/* FULL SCREEN LOADING OVERLAY */}
      {(!videoLoaded || isFetching) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#135db6] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-gray-600 animate-pulse">Loading Accessories...</p>
          </div>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden group">
          {settings?.heroVideoUrl ? (
            settings?.heroVideoUrl?.match(/\.(mp4|webm|ogg)$/i) || settings?.heroVideoUrl?.includes("video/upload") ? (
              <video 
                src={settings.heroVideoUrl} 
                autoPlay 
                muted 
                loop 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                onLoadedData={() => setVideoLoaded(true)}
              />
            ) : (
              <img 
                src={settings.heroVideoUrl}
                alt="Accessories Hero"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                onLoad={() => setVideoLoaded(true)}
              />
            )
          ) : (
            <div className="absolute inset-0 bg-gray-100" />
          )}
          <div className="absolute inset-0 bg-black/40 z-10 transition-colors duration-700 group-hover:bg-black/30" />
        </div>
        
        <div className="relative z-20 text-center max-w-5xl px-4 flex flex-col items-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-[#ffffff] text-sm font-semibold tracking-widest uppercase mb-6 backdrop-blur-sm">
            Premium Epoxy Accessories
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#ffffff] mb-6 leading-tight drop-shadow-lg">
            Everything You Need to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4db4ff] to-[#00d0e8] drop-shadow-md">Create Beautiful Resin Art</span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-5 mt-10">
            <PrimaryButton className="px-10 py-5 text-lg" onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}>
              Shop Now
            </PrimaryButton>
            <button suppressHydrationWarning 
              onClick={() => document.getElementById('kits')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 text-lg bg-white/10 border-2 border-white text-[#ffffff] font-bold rounded-full hover:bg-white hover:text-[#135db6] transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Explore Kits
            </button>
          </div>
        </div>
      </section>

      {/* 2. SHOP CATEGORIES */}
      <section id="shop" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Category</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const dbCat = categoriesData.find(c => c.subCategory === cat.name);
            const imageUrl = dbCat?.imageUrl;
            
            return (
              <Link key={idx} href={`/store?mainCategory=Accessories&subCategory=${encodeURIComponent(cat.name)}`} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer flex flex-col">
                <div className="h-36 flex items-center justify-center relative overflow-hidden bg-gray-100">
                  {imageUrl ? (
                    <img src={imageUrl} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <img src="/placeholder.jpg" alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30 grayscale" />
                  )}
                  
                  {/* Icon Container (only show if no image uploaded) */}
                  {!imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className={`p-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm transform group-hover:scale-110 transition-transform duration-300 text-gray-500`}>
                        {cat.icon}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 text-center flex flex-col flex-grow justify-center">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{dbCat?.description || cat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. BEST SELLERS */}
      <section className="py-24 bg-gray-50 border-y border-gray-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Sellers</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] rounded-full"></div>
            </div>
            <button suppressHydrationWarning className="hidden md:flex items-center gap-2 text-[#135db6] font-bold hover:text-[#008493] transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
            {(bestSellers.length > 0 ? bestSellers : MOCK_PRODUCTS).map((product) => (
              <div key={product.id} className="snap-start shrink-0 w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FULL PACKAGE KITS */}
      <section id="kits" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Full Package <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Kits</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">Everything you need bundled together at a discounted price.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(showAllKits ? kits : kits.slice(0, kits.length >= 3 ? kits.length - (kits.length % 3) : kits.length)).map((kit) => (
            <div key={kit.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:border-[#135db6]/50 transition-all flex flex-col group cursor-pointer" onClick={() => setSelectedKit(kit)}>
              <div className="h-64 relative bg-gray-100 overflow-hidden">
                <img src={kit.imageUrl || "/placeholder.jpg"} alt={kit.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-[#135db6] font-bold px-6 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center gap-2">View Details <ArrowRight className="w-4 h-4"/></span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-black text-[#135db6] shadow-lg">
                  ₹{kit.price}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow text-center">
                <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-[#135db6] transition-colors">{kit.name}</h3>
                <p className="text-gray-500 mb-6 line-clamp-2">{kit.contains}</p>
                <button suppressHydrationWarning className="w-full py-3 bg-gray-50 hover:bg-[#135db6]/10 text-[#135db6] font-bold rounded-xl transition-colors border border-gray-100">
                  View Kit Contents
                </button>
              </div>
            </div>
          ))}
          {kits.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 font-medium">
              Loading kits...
            </div>
          )}
        </div>
        
        {kits.length >= 3 && kits.length % 3 !== 0 && (
          <div className="mt-12 text-center">
            <button onClick={() => setShowAllKits(!showAllKits)} className="px-8 py-3 rounded-full border-2 border-[#135db6] text-[#135db6] font-bold hover:bg-[#135db6] hover:text-white transition-all">
              {showAllKits ? "View Less" : "View More Kits"}
            </button>
          </div>
        )}
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-24 bg-white text-gray-900 overflow-hidden relative border-y border-gray-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#135db6]/5 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#008493]/5 rounded-full blur-[100px] translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              New <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Arrivals</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600">Discover our latest additions to the store.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(newArrivals.length > 0 ? newArrivals : MOCK_NEW_ARRIVALS).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. LEARNING CORNER */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Corner</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600">Master the art of resin with our expert guides.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(showAllGuides ? guides : guides.slice(0, guides.length >= 3 ? guides.length - (guides.length % 3) : guides.length)).map((guide, idx) => (
            <div key={guide.id} className="relative h-[400px] rounded-3xl overflow-hidden group shadow-lg">
              <img src={guide.imageUrl || "/placeholder.jpg"} alt={guide.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/60 transition-opacity duration-300 group-hover:bg-black/70" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-3xl font-black text-[#ffffff] drop-shadow-lg mb-4">{guide.title}</h3>
                
                <div className="mb-6">
                  <p className="text-[#ffffff] drop-shadow-md text-lg line-clamp-3">{guide.content}</p>
                </div>
                
                <Link 
                  href={`/accessories/guides/${guide.id}`}
                  className="self-start px-6 py-3 bg-white/20 hover:bg-white text-[#ffffff] hover:text-[#1f1f1f] backdrop-blur-sm rounded-full font-bold transition-all flex items-center gap-2"
                >
                  Read Guide <BookOpen className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
          {guides.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 font-medium">
              Loading guides...
            </div>
          )}
        </div>
        
        {guides.length >= 3 && guides.length % 3 !== 0 && (
          <div className="mt-12 text-center">
            <button onClick={() => setShowAllGuides(!showAllGuides)} className="px-8 py-3 rounded-full border-2 border-[#135db6] text-[#135db6] font-bold hover:bg-[#135db6] hover:text-white transition-all">
              {showAllGuides ? "View Less" : "View More Guides"}
            </button>
          </div>
        )}
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="py-24 bg-gray-50 border-y border-gray-200 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Reviews</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full"></div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide px-4 md:px-20">
          {(testimonials.length > 0 ? testimonials : REVIEWS).map((review) => (
            <div key={review.id} className="snap-center shrink-0 w-[300px] md:w-[400px] bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
              <div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-gray-700 text-lg mb-6 italic font-medium">"{review.content || review.text}"</p>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                {review.avatarUrl ? (
                  <img src={review.avatarUrl} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-[#135db6]/10 text-[#135db6] rounded-full flex items-center justify-center font-bold text-xl">
                    {review.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-[#135db6] font-medium">{review.role || "Verified Buyer"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQs */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Questions</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full"></div>
        </div>
        
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === idx ? "border-[#135db6] shadow-md bg-white" : "border-gray-200 bg-gray-50 hover:border-[#135db6]/50"}`}>
              <button suppressHydrationWarning 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className={`font-bold text-lg ${openFaq === idx ? "text-[#135db6]" : "text-gray-800"}`}>{faq.q}</span>
                <span className={`p-2 rounded-full transition-colors ${openFaq === idx ? "bg-[#135db6]/10 text-[#135db6]" : "bg-white text-gray-400"}`}>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>
              <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === idx ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KIT MODAL */}
      {selectedKit && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button suppressHydrationWarning onClick={() => setSelectedKit(null)} className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:text-red-500 shadow-md hover:bg-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col md:flex-row min-h-[400px]">
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100">
                <img src={selectedKit.imageUrl || "/placeholder.jpg"} alt={selectedKit.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full font-black text-[#135db6] shadow-lg text-xl">
                  ₹{selectedKit.price}
                </div>
              </div>
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
                <div className="inline-block px-3 py-1 bg-[#135db6]/10 text-[#135db6] text-xs font-bold uppercase tracking-wider rounded-full mb-4 w-max">Full Package Kit</div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">{selectedKit.name}</h2>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Kit Contains:</h4>
                <ul className="space-y-3 mb-8 flex-grow overflow-y-auto pr-4">
                  {selectedKit.contains.split(",").map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 font-medium">
                      <div className="w-2 h-2 rounded-full bg-[#008493] mt-2 shrink-0" /> 
                      <span>{item.trim()}</span>
                    </li>
                  ))}
                </ul>
                <PrimaryButton onClick={() => { toast.success("Added Kit to Cart"); setSelectedKit(null); }} className="w-full py-5 text-xl mt-auto shadow-xl">
                  Buy Complete Kit
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. NEWSLETTER */}
      <section className="py-32 relative overflow-hidden bg-white border-t border-gray-200">
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <Mail className="w-16 h-16 text-[#135db6] mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Join Our Resin Community</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Get exclusive tips, early access to new launches, and special offers delivered to your inbox.</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mb-10">
            <input suppressHydrationWarning 
              type="email" 
              required 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-6 py-4 rounded-full text-gray-900 text-lg bg-white border-2 border-gray-100 focus:outline-none focus:ring-4 focus:ring-[#1a56db]/20 focus:border-[#1a56db] transition-all shadow-sm"
            />
            <button suppressHydrationWarning type="submit" className="px-10 py-4 bg-[#1a56db] text-white font-semibold text-lg rounded-full hover:bg-[#1e40af] transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap">
              Join waitlist
            </button>
          </form>

          {subscriberCount !== null && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <div className="flex -space-x-4">
                <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-green-100" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="User 1" />
                <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-yellow-100" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede" alt="User 2" />
                <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-blue-100" src="https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=ffdfbf" alt="User 3" />
                <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-pink-100" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=d1d4f9" alt="User 4" />
                <img className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-orange-100" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=b6e3f4" alt="User 5" />
              </div>
              
              <div className="flex items-center bg-gray-100 rounded-full pl-1 pr-6 py-1 shadow-inner border border-gray-200">
                <div className="w-10 h-10 bg-[#1a56db] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {subscriberCount}
                </div>
                <span className="ml-3 text-gray-600 font-medium tracking-wide">Joined already</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
