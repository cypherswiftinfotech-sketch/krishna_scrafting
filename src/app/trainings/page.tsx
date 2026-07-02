"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Training {
  id: number;
  title: string;
  category: string;
  description: string | null;
  duration: string | null;
  price: string;
  language: string | null;
  seats: number | null;
  imageUrl: string | null;
}

const CATEGORIES = [
  "All",
  "Beginner Training",
  "Advanced Resin Course",
  "Business Masterclass",
  "Online Course",
  "Offline Workshop",
  "Certification"
];

// Placeholder for top carousel
const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop"
];

export default function TrainingsPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = activeCat === "All" ? "/api/trainings" : `/api/trainings?category=${encodeURIComponent(activeCat)}`;
    fetch(url)
      .then(r => r.json())
      .then(d => setTrainings(d.trainings || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCat]);

  return (
    <div className="pt-16 min-h-screen bg-gray-50 pb-20">
      
      {/* Auto Scrolling Carousel Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] bg-gray-900 overflow-hidden">
        {/* Infinite CSS Animation for Carousel */}
        <div className="absolute inset-0 flex animate-marquee">
          {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((img, i) => (
            <div key={i} className="relative w-screen h-full flex-shrink-0">
              <Image src={img} alt="Training" fill className="object-cover opacity-60" />
            </div>
          ))}
        </div>
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/40">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Professional <span className="text-amber-400">Trainings</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl font-medium">
            Elevate your skills with our masterclasses, workshops, and certification programs.
          </p>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-300vw); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
            width: 600vw;
          }
        `}} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Categories */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Explore Categories</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-full font-bold transition-all text-sm border-2",
                  activeCat === cat 
                    ? "bg-gray-900 text-white border-gray-900 shadow-md" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />)}
          </div>
        ) : trainings.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium text-lg">No trainings found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trainings.map(course => (
              <Link 
                key={course.id} 
                href={`/trainings/${course.id}`}
                className="group flex flex-col bg-white rounded-xl overflow-hidden border transition-all hover:shadow-xl hover:border-gray-300"
                style={{ borderColor: "var(--cream-white-border)" }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {course.imageUrl ? (
                    <Image src={course.imageUrl} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><PlayCircle className="w-12 h-12" /></div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                
                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{course.category}</p>
                  
                  {/* Rating placeholder */}
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs font-bold text-amber-600">4.8</span>
                    <div className="flex">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                    </div>
                    <span className="text-xs text-gray-400">(120)</span>
                  </div>

                  <div className="mt-auto pt-2">
                    <p className="font-black text-gray-900 text-lg">
                      ₹{Number(course.price).toLocaleString("en-IN")}
                    </p>
                    {course.price !== "0" && (
                      <p className="text-[10px] text-gray-400 line-through">
                        ₹{(Number(course.price) * 1.5).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
