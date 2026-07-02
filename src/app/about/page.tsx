"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, Target, Eye, Star, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface AboutSettings {
  storyTitle: string;
  storyText: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
}

interface AboutGalleryImage {
  id: number;
  imageUrl: string;
  caption: string | null;
}

interface AboutPartner {
  id: number;
  name: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
}

export default function AboutPage() {
  const [settings, setSettings] = useState<AboutSettings | null>(null);
  const [gallery, setGallery] = useState<AboutGalleryImage[]>([]);
  const [partners, setPartners] = useState<AboutPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/about").then((res) => res.json()),
      fetch("/api/about/gallery").then((res) => res.json()),
      fetch("/api/about/partners").then((res) => res.json()),
    ])
      .then(([settingsData, galleryData, partnersData]) => {
        setSettings(settingsData.settings);
        setGallery(galleryData.images || []);
        setPartners(partnersData.partners || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div
          className="w-8 h-8 border-4 border-gray-200 border-t-peacock-blue rounded-full animate-spin"
          style={{ borderTopColor: "var(--peacock-blue)" }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* ── 1. Story Section ───────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 bg-gray-100 border border-gray-200">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-800 uppercase tracking-wider">
              {settings?.storyTitle || "Our Story"}
            </span>
          </div>
          <h1
            className="text-4xl md:text-6xl font-black mb-8 leading-tight animate-fade-in-up"
            style={{ color: "#1f1f1f" }}
          >
            Crafting Memories,{" "}
            <span
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgb(15, 82, 186), #008080)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              One Pour at a Time
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {settings?.storyText ||
              "Sri Krishna Crafting was born from a deep passion for handcrafted beauty. We blend timeless tradition with modern design to deliver exquisite creations that stand the test of time."}
          </p>
        </div>
      </section>

      {/* ── 2. Founder Message (Mission & Vision) ──────────────── */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Founder Message
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mt-6 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                {settings?.missionTitle || "Our Mission"}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {settings?.missionText ||
                  "To craft premium, one-of-a-kind epoxy resin artworks that bring beauty, meaning, and lasting value into everyday spaces and lives."}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                {settings?.visionTitle || "Our Vision"}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {settings?.visionText ||
                  "To be India's most loved handcrafted resin art studio — celebrating artisans, inspiring creativity, and making bespoke art accessible to every home."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Images (Collage) ────────────────────────────────── */}
      {gallery.length > 0 && (
        <section className="py-24 bg-gray-950 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Our Journey in Pictures
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              A glimpse into our creative process, studio moments, and the magic of resin crafting.
            </p>
          </div>

          <div className="w-full max-w-screen-2xl mx-auto px-4">
             <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                {gallery.map((img) => (
                  <div key={img.id} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-lg border border-gray-800">
                    <img 
                      src={img.imageUrl} 
                      alt={img.caption || "Gallery image"} 
                      className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                    />
                    {img.caption && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                         <p className="text-white text-sm font-medium">{img.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </section>
      )}

      {/* ── 4. Supporting Partners (Zigzag) ────────────────────── */}
      {partners.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
                Supporting Partners
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                The pillars of our strength. Meet the incredible individuals who make Sri Krishna Crafting possible.
              </p>
            </div>

            <div className="space-y-24">
              {partners.map((partner, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={partner.id}
                    className={cn(
                      "flex flex-col md:flex-row items-center gap-12 lg:gap-24",
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                  >
                    {/* Image Side */}
                    <div className="w-full md:w-1/2 flex justify-center">
                      <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-8 border-gray-50 bg-gray-100">
                        {partner.imageUrl ? (
                          <img
                            src={partner.imageUrl}
                            alt={partner.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <Star className="w-16 h-16" />
                          </div>
                        )}
                        {/* Decorative ring */}
                        <div className="absolute inset-0 rounded-full border border-gray-200/50" />
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-1/2 text-center md:text-left">
                      <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                        {partner.name}
                      </h3>
                      {partner.role && (
                        <p className="text-xl text-amber-600 font-semibold mb-6">
                          {partner.role}
                        </p>
                      )}
                      {partner.bio && (
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {partner.bio}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Achievements (Coming Soon) ──────────────────────── */}
      <section className="py-32 bg-gray-50 text-center border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <Medal className="w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Achievements
          </h2>
          <p className="text-2xl text-gray-500 font-medium">
            Coming Soon...
          </p>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}} />
    </div>
  );
}
