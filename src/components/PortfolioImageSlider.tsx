"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PortfolioImageSlider({ images, title }: { images: string[], title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 group">
      <div className="aspect-[4/3] sm:aspect-video relative">
        <Image 
          src={images[currentIndex]}
          alt={`${title} - image ${currentIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
      </div>

      {images.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white/80 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white/80 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-gray-900" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
