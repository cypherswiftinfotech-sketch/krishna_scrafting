"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  createdAt: string;
}

const CATEGORIES = [
  "All",
  "How to start epoxy business",
  "Flooring maintenance",
  "Resin safety",
  "Design inspiration"
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let url = "/api/blogs";
    if (activeCategory !== "All") {
      url += `?category=${encodeURIComponent(activeCategory)}`;
    }
    
    fetch(url)
      .then(r => r.json())
      .then(d => setBlogs(d.blogs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 font-sans selection:bg-teal-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-teal-400 to-blue-600" style={{ fontFamily: "var(--font-heading)" }}>
            The Resin Magazine
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium uppercase tracking-widest">
            Expert insights, business tips, and design inspiration.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === c 
                  ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-[0_0_15px_rgba(45,212,191,0.5)] scale-105" 
                  : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-800 border-t-teal-500 rounded-full animate-spin" />
          </div>
        ) : (
          /* Masonry-style Grid */
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {blogs.map(blog => (
              <Link key={blog.id} href={`/blogs/${blog.id}`} className="block break-inside-avoid group">
                <div className="bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-teal-500/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
                  
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-900">
                    {blog.imageUrl ? (
                      <Image 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-80 group-hover:opacity-100" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                        <ImageIcon className="w-16 h-16" />
                      </div>
                    )}
                    
                    {/* Dark gradient overlay for text readability at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        {blog.category}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h2 className="text-xl font-bold leading-tight mb-3 text-white drop-shadow-lg line-clamp-3">
                        {blog.title}
                      </h2>
                      <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        Read Story <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!loading && blogs.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">
            No stories found in this category.
          </div>
        )}

      </div>
    </div>
  );
}
