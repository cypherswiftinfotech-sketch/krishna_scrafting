"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  avatarUrl: string | null;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then(res => res.json())
      .then(data => setTestimonials(data.testimonials || []))
      .catch(console.error);
  }, []);

  // Duplicate array to create a seamless infinite scroll
  // Only duplicate if we have at least 1 testimonial, otherwise it's empty
  const scrollData = testimonials.length > 0 ? [...testimonials, ...testimonials, ...testimonials] : [];

  return (
    <section className="py-24 bg-gray-50 overflow-hidden relative">
      <style>{`
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: scrollMarquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
            What Our{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(90deg, rgb(15,82,186), #008080)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Clients Say
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-500">
            Don't just take our word for it. Hear from the people who have transformed their spaces with our art.
          </p>
        </div>
      </div>

      {/* Auto-scrolling Track */}
      <div className="relative w-full">
        {/* Gradient Fades for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

        <div className="animate-marquee gap-6 px-4 py-4">
          {scrollData.map((testimonial, idx) => (
            <div
              key={`${testimonial.id}-${idx}`}
              className="w-[350px] md:w-[400px] flex-shrink-0 bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <div className="flex text-yellow-400 mb-6 gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-8 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
                  <Image 
                    src={testimonial.avatarUrl || "https://i.pravatar.cc/150"} 
                    alt={testimonial.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm font-medium" style={{ color: "#008080" }}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
