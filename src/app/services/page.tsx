"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCategory {
  id: number;
  mainCategory: string;
  subCategory: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string | null;
  mainCategory: string;
  subCategory: string;
}

const WHATSAPP_NUMBER = "+917204468429";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`;

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("bulk") || name.includes("corporate") || name.includes("order")) return "📦";
  if (name.includes("counter") || name.includes("kitchen") || name.includes("top")) return "🍳";
  if (name.includes("floor") || name.includes("tile")) return "🧊";
  if (name.includes("mandir") || name.includes("temple")) return "🕉️";
  if (name.includes("table") || name.includes("furniture") || name.includes("desk")) return "🪑";
  if (name.includes("wall") || name.includes("art") || name.includes("decor")) return "🖼️";
  if (name.includes("gift") || name.includes("souvenir")) return "🎁";
  if (name.includes("jewelry") || name.includes("accessory") || name.includes("ring")) return "💍";
  return "✨";
};

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = searchParams.get("tab") || "HOME";
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch service categories
    fetch("/api/service-categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(console.error);

    // Fetch recommended products (featured or just all)
    fetch("/api/products?featured=true")
      .then((r) => r.json())
      .then((d) => {
        // If no featured, just take the first 4
        if (d.products && d.products.length > 0) {
          setRecommendedProducts(d.products.slice(0, 4));
        } else {
          fetch("/api/products")
            .then(r => r.json())
            .then(d2 => setRecommendedProducts(d2.products ? d2.products.slice(0, 4) : []));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    router.push(`/services?tab=${key}`, { scroll: false });
  };

  const activeSubCategories = categories.filter(c => c.mainCategory === activeTab);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="py-16 text-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
          Our <span style={{ color: "var(--peacock-blue)" }}>Services</span>
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Discover our specialized bespoke categories for residential and commercial spaces. Elevate your environment with premium craftsmanship.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Main Tabs (HOME / COMMERCIALS) */}
        <div className="flex justify-center gap-4 mb-12">
          {["HOME", "COMMERCIALS"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={cn(
                "px-8 py-4 rounded-xl font-black text-lg transition-all border-2",
                activeTab === tab
                  ? "bg-peacock-blue text-white shadow-lg border-peacock-blue"
                  : "bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-700"
              )}
              style={activeTab === tab ? { backgroundColor: "var(--peacock-blue)", borderColor: "var(--peacock-blue)" } : {}}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Subcategories Grid */}
        <div className="mb-24">
          <h2 className="text-2xl font-black text-gray-900 mb-8 text-center uppercase tracking-widest">{activeTab} SERVICES</h2>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : activeSubCategories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">No services found for {activeTab}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {activeSubCategories.map(cat => (
                <Link 
                  key={cat.id} 
                  href={`/services/${cat.id}`}
                  className="bg-white border rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-all hover:shadow-xl group" 
                  style={{ borderColor: "var(--cream-white-border)" }}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="text-2xl" style={{ color: "var(--peacock-blue)" }}>{getCategoryIcon(cat.subCategory)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{cat.subCategory}</h3>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recommendation System */}
        {recommendedProducts.length > 0 && (
          <div className="mb-24">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Trending {activeTab === "HOME" ? "Decor" : "Essentials"}</h2>
                <p className="text-gray-500">Best products handpicked for your spaces.</p>
              </div>
              <Link href="/store" className="hidden sm:flex items-center gap-2 font-bold hover:underline" style={{ color: "var(--peacock-blue)" }}>
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <Link key={product.id} href={`/store/${product.id}`} className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all" style={{ borderColor: "var(--cream-white-border)" }}>
                  <div className="relative h-48 bg-gray-50 overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl text-gray-300">📦</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{product.subCategory}</p>
                    <h3 className="font-bold text-gray-900 line-clamp-1 mb-2">{product.name}</h3>
                    <p className="font-black text-gray-900">₹{Number(product.price).toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-white border rounded-3xl p-10 md:p-16 text-center shadow-sm relative overflow-hidden" style={{ borderColor: "var(--cream-white-border)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Ready to start your project?</h2>
            <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
              Whether you need customized bulk orders or a single personalized masterpiece, our experts are here to help. Reach out directly on WhatsApp for instant support.
            </p>
            <a 
              href={`${WHATSAPP_LINK}?text=Hi, I would like to inquire about your ${activeTab} services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1"
            >
              <MessageCircle className="w-6 h-6" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" /></div>}>
      <ServicesContent />
    </Suspense>
  );
}
