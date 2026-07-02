"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import ImageZoom from "@/components/ImageZoom";

interface ServiceCategory {
  id: number;
  mainCategory: string;
  subCategory: string;
  imageUrl: string | null;
  description: string | null;
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

function ServiceCategoryContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    // Fetch all categories to find the matching one
    fetch(`/api/service-categories`)
      .then((r) => r.json())
      .then((d) => {
        const cat = d.categories?.find((c: any) => c.id === parseInt(id));
        if (cat) {
          setCategory(cat);
          // Fetch products matching this subCategory
          fetch(`/api/products?subCategory=${encodeURIComponent(cat.subCategory)}`)
            .then(r => r.json())
            .then(pd => {
              if (pd.products && pd.products.length > 0) {
                setRecommended(pd.products.slice(0, 4));
              } else {
                // Fallback to featured
                fetch("/api/products?featured=true")
                  .then(r2 => r2.json())
                  .then(pd2 => setRecommended(pd2.products ? pd2.products.slice(0, 4) : []));
              }
            });
        } else {
          router.push("/services");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full" />
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <button
          onClick={() => router.push("/services")}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </button>

        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-sm font-black uppercase tracking-[0.2em] text-amber-600 mb-2 block">
            {category.mainCategory} SERVICES
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
            {category.subCategory}
          </h1>
        </div>

        {/* Center Image */}
        <div className="relative w-full aspect-video md:aspect-[21/9] bg-gray-200 rounded-3xl overflow-hidden shadow-xl mb-10 border border-gray-100">
          <ImageZoom 
             src={category.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"}
             alt={category.subCategory}
             fill={true}
             className="w-full h-full"
             zoomScale={1.5}
          />
        </div>

        {/* Paragraph */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {category.description || `Experience the finest craftsmanship in our bespoke ${category.subCategory} services. Whether you're looking to elevate a residential space or add a touch of premium luxury to a commercial environment, our team specializes in creating custom, high-quality installations tailored exactly to your vision.`}
          </p>
          
          <div className="mt-10">
            <a 
              href={`${WHATSAPP_LINK}?text=Hi, I would like to inquire about your ${category.subCategory} services.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-black rounded-xl shadow-lg shadow-green-500/30 transition-all hover:-translate-y-1"
            >
              <MessageCircle className="w-6 h-6" />
              Inquire on WhatsApp
            </a>
          </div>
        </div>

        {/* Recommended Products */}
        {recommended.length > 0 && (
          <div className="pt-16 border-t border-gray-200">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Recommended for You</h2>
                <p className="text-gray-500">Products perfectly suited for {category.subCategory}.</p>
              </div>
              <Link href={`/store?subCategory=${category.subCategory}`} className="hidden sm:flex items-center gap-2 font-bold hover:underline" style={{ color: "var(--peacock-blue)" }}>
                Explore More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommended.map((product) => (
                <Link key={product.id} href={`/store/${product.id}`} className="group bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all" style={{ borderColor: "var(--cream-white-border)" }}>
                  <div className="relative h-56 bg-gray-50 overflow-hidden">
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
                  <div className="p-5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">{product.subCategory}</p>
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1 mb-2">{product.name}</h3>
                    <p className="font-black text-gray-900">₹{Number(product.price).toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServiceCategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" /></div>}>
      <ServiceCategoryContent />
    </Suspense>
  );
}
