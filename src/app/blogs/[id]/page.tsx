"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  createdAt: string;
}

export default function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.blog) setBlog(d.blog);
        else router.push("/blogs");
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-gray-800 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-black text-white relative font-sans selection:bg-teal-500/30">
      
      {/* Background Image fixed covering the entire screen */}
      {blog.imageUrl && (
        <div className="fixed inset-0 z-0">
          <Image 
            src={blog.imageUrl} 
            alt={blog.title} 
            fill 
            className="object-cover opacity-30" 
            priority
          />
          {/* Gradient Overlays to ensure text is fully visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/95" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
      )}
      
      {/* Fallback dark bg if no image */}
      {!blog.imageUrl && <div className="fixed inset-0 bg-[#0a0a0a] z-0" />}

      {/* Content wrapper */}
      <div className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen flex flex-col">
        
        <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-12 self-start bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <ArrowLeft className="w-4 h-4" /> Back to Magazine
        </Link>

        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(45,212,191,0.3)] mb-6">
            {blog.category}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[1.1] mb-6 text-white drop-shadow-2xl" style={{ fontFamily: "var(--font-heading)" }}>
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-teal-400" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span className="text-blue-400">Sri Krishna Crafting</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl flex-1">
          <div className="prose prose-invert prose-lg max-w-none">
            {blog.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index} className="mb-6 text-gray-200 leading-relaxed font-medium">
                  {paragraph}
                </p>
              ) : <br key={index} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
