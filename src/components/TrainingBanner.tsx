"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

interface TrainingBannerSettings {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  mediaUrl: string | null;
}

export default function TrainingBanner() {
  const [settings, setSettings] = useState<TrainingBannerSettings | null>(null);

  useEffect(() => {
    fetch("/api/training-banner")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
      .catch(console.error);
  }, []);

  if (!settings) return null; // or a skeleton loader

  const isVideo = settings.mediaUrl?.match(/\.(mp4|webm|ogg)$/i) || settings.mediaUrl?.includes("video/upload");
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[400px] md:min-h-[500px]">
        {/* Background Image / Video */}
        <div className="absolute inset-0 z-0">
          {isVideo ? (
            <video
              src={settings.mediaUrl!}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={settings.mediaUrl || "https://images.unsplash.com/photo-1596489370007-96a8dc5884ba?auto=format&fit=crop&q=80&w=1600"}
              alt={settings.headline}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          )}
          {/* Soft Overlay for text readability without hiding the image */}
          <div className="absolute inset-0 bg-black/30 transition-colors duration-500 hover:bg-black/20"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 md:px-12 w-full max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-black text-[#ffffff] mb-6 drop-shadow-lg shadow-black">
            {settings.headline}
          </h2>
          <p className="text-lg md:text-xl text-[#ffffff] mb-10 max-w-2xl mx-auto font-medium drop-shadow-md shadow-black">
            {settings.subheadline}
          </p>
          <Link
            href={settings.ctaLink}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgb(15,82,186) 0%, #008080 100%)",
              color: "#ffffff",
              boxShadow: "0 8px 25px rgba(15,82,186,0.5)",
            }}
          >
            {settings.ctaText}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
