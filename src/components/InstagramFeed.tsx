"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

interface InstagramPost {
  id: number;
  imageUrl: string;
  postLink: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    fetch("/api/instagram")
      .then(res => res.json())
      .then(data => setPosts(data.posts || []))
      .catch(console.error);
  }, []);
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ color: "var(--peacock-blue)" }}
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span className="text-sm font-bold tracking-wider uppercase" style={{ color: "var(--peacock-blue)" }}>
                Follow Us
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              On{" "}
              <span
                style={{
                  backgroundImage: "var(--blue-gradient)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Instagram
              </span>
            </h2>
          </div>
          
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all hover:-translate-y-1"
            style={{
              background: "var(--blue-gradient)",
              color: "#ffffff",
              boxShadow: "0 4px 14px rgba(15,82,186,0.3)",
            }}
          >
            @SriKrishnaCrafting
          </Link>
        </div>

        {/* Feed Grid */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={post.postLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-sm w-[calc(50%-0.5rem)] md:w-[calc(25%-1.125rem)] max-w-[300px]"
            >
              {/* Image */}
              <Image
                src={post.imageUrl}
                alt="Instagram post"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-white font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
}
