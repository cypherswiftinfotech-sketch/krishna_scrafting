"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Globe, Clock, Users, Check, PlayCircle, Shield, RotateCcw, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

interface Training {
  id: number;
  title: string;
  category: string;
  description: string | null;
  duration: string | null;
  price: string;
  language: string | null;
  seats: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  learnings: string | null;
}

export default function TrainingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Training | null>(null);
  const [related, setRelated] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/trainings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.training) {
          setCourse(d.training);
          fetch(`/api/trainings?category=${encodeURIComponent(d.training.category)}`)
            .then((r2) => r2.json())
            .then((d2) => {
              if (d2.trainings) {
                setRelated(d2.trainings.filter((t: Training) => t.id !== d.training.id).slice(0, 8));
              }
            });
        } else {
          router.push("/trainings");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleBookSlot = () => {
    toast.success("Slot booked! Our team will reach out to you shortly.");
  };

  if (loading)
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  if (!course) return null;

  const originalPrice = (Number(course.price) * 1.5).toLocaleString("en-IN");
  const learningBullets = course.learnings
    ? course.learnings.split("\n").map((l) => l.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-white min-h-screen">

      {/* Dark Header Banner with video background */}
      <div className="relative bg-[#1c1d1f] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-gray-800">
        {course.videoUrl && (
          <video
            key={course.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          >
            <source src={course.videoUrl} />
          </video>
        )}
        {/* Semi-transparent overlay — dark enough for text, light enough to see the video */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 lg:pr-10">
            <div className="flex gap-2 text-sm font-bold text-white mb-6">
              <Link href="/trainings" className="hover:text-amber-400 transition-colors">Trainings</Link>
              <span className="text-white/60">&gt;</span>
              <span className="text-amber-400">{course.category}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white drop-shadow-lg">{course.title}</h1>
            {course.description && (
              <p className="text-lg text-white/80 mb-6 line-clamp-2 drop-shadow">{course.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
              <div className="flex items-center gap-1 text-amber-400 font-bold drop-shadow">
                4.8
                <div className="flex">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-amber-400" />)}
                </div>
              </div>
              <span className="text-white underline drop-shadow">(1,245 ratings)</span>
              <span className="text-white/80 drop-shadow">15,340 students</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
              {course.language && <span className="flex items-center gap-1.5 drop-shadow"><Globe className="w-4 h-4" /> {course.language}</span>}
              {course.duration && <span className="flex items-center gap-1.5 drop-shadow"><Clock className="w-4 h-4" /> {course.duration}</span>}
              {course.seats && <span className="flex items-center gap-1.5 drop-shadow"><Users className="w-4 h-4" /> {course.seats} Seats Left</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">

        {/* Floating Right Card */}
        <div className="lg:absolute lg:right-8 lg:-top-64 w-full lg:w-[340px] bg-white border border-gray-200 rounded-lg shadow-xl mb-10 lg:mb-0 z-10 overflow-hidden">
          <div className="relative aspect-video bg-gray-900 group cursor-pointer">
            {course.imageUrl ? (
              <Image src={course.imageUrl} alt={course.title} fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Preview</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-16 h-16 text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center font-bold text-white drop-shadow-md">Preview this course</div>
          </div>

          <div className="p-6">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-black text-gray-900">₹{Number(course.price).toLocaleString("en-IN")}</span>
              {course.price !== "0" && <span className="text-gray-500 line-through">₹{originalPrice}</span>}
            </div>

            <button
              onClick={handleBookSlot}
              className="w-full py-4 bg-[#a435f0] hover:bg-[#8710d8] text-white font-bold text-lg rounded-md transition-colors mb-4"
            >
              Book Slot
            </button>
            <p className="text-center text-xs text-gray-500 mb-6">30-Day Money-Back Guarantee</p>

            <div className="space-y-3 text-sm text-gray-700">
              <p className="font-bold text-gray-900">This course includes:</p>
              {course.duration && <p className="flex items-center gap-3"><PlayCircle className="w-4 h-4" /> {course.duration} on-demand video</p>}
              {course.language && <p className="flex items-center gap-3"><Globe className="w-4 h-4" /> Taught in {course.language}</p>}
              <p className="flex items-center gap-3"><Shield className="w-4 h-4" /> Certificate of completion</p>
              <p className="flex items-center gap-3"><RotateCcw className="w-4 h-4" /> Full lifetime access</p>
            </div>
          </div>
        </div>

        {/* Left Content */}
        <div className="w-full lg:w-2/3 lg:pr-10">

          {/* What You'll Learn — dynamic from admin */}
          {learningBullets.length > 0 && (
            <div className="border border-gray-300 p-6 rounded-sm mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">What you&apos;ll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                {learningBullets.map((bullet, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 mt-0.5 text-gray-900 flex-shrink-0" />
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {course.description && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Description</h2>
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                {course.description}
              </div>
            </div>
          )}

          {/* Related / Also Bought — Horizontal Scrollable Row */}
          {related.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Students also bought</h2>
                <Link href="/trainings" className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
                  See all <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Horizontal scroll container */}
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300">
                {related.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/trainings/${rel.id}`}
                    className="flex-shrink-0 w-56 snap-start bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="relative h-36 bg-gray-100 overflow-hidden">
                      {rel.imageUrl ? (
                        <Image
                          src={rel.imageUrl}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <PlayCircle className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                        {rel.title}
                      </h3>
                      {rel.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{rel.description}</p>
                      )}
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mb-1">
                        4.8 <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{rel.category}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-gray-900 text-sm">₹{Number(rel.price).toLocaleString("en-IN")}</span>
                        {rel.price !== "0" && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{(Number(rel.price) * 1.5).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
