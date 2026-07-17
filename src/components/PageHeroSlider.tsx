"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface HeroImage {
  id: number;
  mediaUrl: string;
}

interface Props {
  apiPath: string;
  title: string;           // e.g. "The Resin"
  titleHighlight: string;  // e.g. "Magazine" — rendered in amber
  subtitle: string;
  highlightColor?: string; // defaults to amber-300
  highlightClassName?: string; // takes precedence over highlightColor
  overlayFrom?: string;    // tailwind gradient-from color class
  fallbackGradient?: string; // inline CSS gradient for no-image state
  badge?: string;          // small pill badge text above title
}

export default function PageHeroSlider({
  apiPath,
  title,
  titleHighlight,
  subtitle,
  highlightColor = "#fcd34d",   // amber-300
  highlightClassName,
  fallbackGradient = "linear-gradient(135deg, #0d3b6e 0%, #135db6 50%, #1a73e8 100%)",
  badge,
}: Props) {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(apiPath)
      .then((r) => r.json())
      .then((d) => { setImages(d.images || []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [apiPath]);

  const doubled = [...images, ...images];
  const totalWidth = images.length * 100;

  if (!loaded) {
    return (
      <div className="w-full h-[52vh] min-h-[380px] bg-gray-900 animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const textOverlay = (
    <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24">
      <div className="text-white-force">
        {badge && (
          <div className="inline-flex items-center gap-2 mb-4 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 text-sm font-semibold tracking-wide">
            {badge}
          </div>
        )}
        <h1
          className="text-5xl md:text-6xl font-black mb-4 drop-shadow-lg leading-tight"
          style={{ color: "#ffffff" }}
        >
          <span style={{ color: "#ffffff" }}>{title}</span>{" "}
          <span 
            className={highlightClassName} 
            style={highlightClassName ? undefined : { color: highlightColor }}
          >
            {titleHighlight}
          </span>
        </h1>
        <p className="text-lg text-white/80 max-w-xl font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );

  // No images — gradient fallback
  if (images.length === 0) {
    return (
      <div
        className="relative w-full h-[52vh] min-h-[380px] overflow-hidden"
        style={{ background: fallbackGradient }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        {textOverlay}
      </div>
    );
  }

  // Single image
  if (images.length === 1) {
    return (
      <div className="relative w-full h-[52vh] min-h-[380px] overflow-hidden">
        <Image src={images[0].mediaUrl} alt="Hero" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />
        {textOverlay}
      </div>
    );
  }

  // Multiple images — continuous marquee
  return (
    <div className="relative w-full h-[52vh] min-h-[380px] overflow-hidden bg-gray-900">
      <div
        className="absolute inset-0 flex"
        style={{
          width: `${doubled.length * 100}vw`,
          animation: `heroMarquee_${images.length} ${images.length * 6}s linear infinite`,
        }}
      >
        {doubled.map((img, i) => (
          <div key={i} className="relative flex-shrink-0" style={{ width: "100vw", height: "100%" }}>
            <Image
              src={img.mediaUrl}
              alt={`Hero ${i + 1}`}
              fill
              className="object-cover"
              priority={i < 2}
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/10" />

      {textOverlay}

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full bg-white/50"
            style={{
              animation: `dotActive_${images.length} ${images.length * 6}s ${i * 6}s linear infinite`,
            }}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes heroMarquee_${images.length} {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-${totalWidth}vw); }
          }
          @keyframes dotActive_${images.length} {
            0%, ${100 / images.length - 1}%  { background-color: rgba(255,255,255,0.9); width: 20px; border-radius: 4px; }
            ${100 / images.length}%, 100%     { background-color: rgba(255,255,255,0.35); width: 8px; border-radius: 9999px; }
          }
        `
      }} />
    </div>
  );
}
