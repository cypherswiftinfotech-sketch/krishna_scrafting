"use client";
import React, { useState, MouseEvent, useRef } from 'react';
import Image from 'next/image';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  zoomScale?: number;
  width?: number;
  height?: number;
  fill?: boolean;
}

export default function ImageZoom({ 
  src, 
  alt, 
  className = '', 
  zoomScale = 1.5,
  width,
  height,
  fill = false
}: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <div 
         className="w-full h-full transition-transform duration-700 ease-in-out relative"
         style={{ 
           transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`, 
           transform: isZoomed ? `scale(${zoomScale})` : 'scale(1)' 
         }}
      >
        {fill ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
}
