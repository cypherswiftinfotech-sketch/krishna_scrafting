"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Heart, MessageSquare, Share2, ArrowRight, Image as ImageIcon } from "lucide-react";

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
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.blog) setBlog(d.blog);
        else router.push("/blogs");
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch("/api/blogs")
      .then(r => r.json())
      .then(d => {
        if (d.blogs) {
          setRelatedBlogs(d.blogs.filter((b: Blog) => b.id.toString() !== id).slice(0, 3));
        }
      })
      .catch(console.error);
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
            className="object-cover" 
            priority
          />
          {/* Softer Gradient Overlay to let the image shine through */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>
      )}
      
      {/* Fallback dark bg if no image */}
      {!blog.imageUrl && <div className="fixed inset-0 bg-[#0a0a0a] z-0" />}

      {/* Content wrapper */}
      <div className="relative z-10 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-screen flex flex-col">
        
        <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-12 self-start bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <ArrowLeft className="w-4 h-4" /> Back to Magazine
        </Link>

        <div className="mb-8">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-600 to-teal-500 text-[#ffffff] text-xs font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(45,212,191,0.3)] mb-6">
            {blog.category}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[1.1] mb-6 text-[#ffffff] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] shadow-black" style={{ fontFamily: "var(--font-heading)" }}>
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400 text-sm font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-teal-400" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span className="text-blue-400">Sri Krishna Crafting</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl flex-1 flex flex-col">
          <div className="prose prose-invert prose-lg max-w-none flex-1">
            {blog.content.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index} className="mb-6 text-gray-200 leading-relaxed font-medium">
                  {paragraph}
                </p>
              ) : <br key={index} />
            ))}
          </div>

          {/* Interaction Section */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${liked ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} /> {liked ? 'Liked' : 'Like'}
                </button>
                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-teal-400 transition-colors">
                  <MessageSquare className="w-5 h-5" /> Comment
                </button>
              </div>
              <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-blue-400 transition-colors">
                <Share2 className="w-5 h-5" /> Share
              </button>
            </div>
            
            {/* Simple Comment Box */}
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <textarea 
                  placeholder="Add a comment..." 
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors resize-none h-20"
                />
                <button className="self-end px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-teal-400 hover:text-white transition-colors">
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 text-[#ffffff] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] shadow-black" style={{ fontFamily: "var(--font-heading)" }}>
              More from The Magazine
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map(rb => (
                <Link key={rb.id} href={`/blogs/${rb.id}`} className="block group">
                  <div className="bg-[#111]/80 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-800 hover:border-teal-500/50 transition-all duration-500 hover:-translate-y-2 shadow-xl h-full flex flex-col">
                    
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900">
                      {rb.imageUrl ? (
                        <Image 
                          src={rb.imageUrl} 
                          alt={rb.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                          <ImageIcon className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2 py-0.5 bg-black/60 backdrop-blur-md border border-white/20 text-[#ffffff] text-[9px] font-black uppercase tracking-widest rounded-full">
                          {rb.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-base font-bold leading-tight mb-2 line-clamp-2" style={{ color: "#ffffff" }}>
                        {rb.title}
                      </h4>
                      <div className="mt-auto flex items-center gap-1.5 text-teal-400 text-[10px] font-bold uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
                        Read <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
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
