import Link from "next/link";
import { GraduationCap, Clock } from "lucide-react";

export default function TrainingPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-amber-500/20 border-2 border-amber-500/40 rounded-full flex items-center justify-center mx-auto">
          <GraduationCap className="w-16 h-16 text-amber-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
          <Clock className="w-4 h-4 text-black" />
        </div>
      </div>

      <h1 className="text-5xl font-black text-white mb-4">Training</h1>
      <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-6 py-2 mb-6">
        <span className="text-amber-400 font-bold text-lg">Coming Soon</span>
      </div>
      <p className="text-gray-400 text-lg max-w-lg mb-4">
        Professional laser engraving training programs are in development. Learn from industry experts and master the art of laser engraving.
      </p>
      <p className="text-gray-500 text-sm max-w-md mb-10">
        Courses will cover machine operation, design software, material selection, safety protocols, and business development.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl w-full">
        {[
          { title: "Beginner", desc: "Machine basics & safety", icon: "🌱" },
          { title: "Intermediate", desc: "Advanced techniques", icon: "⚡" },
          { title: "Professional", desc: "Business & scaling", icon: "🏆" },
        ].map((course) => (
          <div
            key={course.title}
            className="bg-gray-900 border border-gray-800 rounded-xl p-4 opacity-60"
          >
            <div className="text-3xl mb-2">{course.icon}</div>
            <h3 className="text-white font-bold text-sm">{course.title}</h3>
            <p className="text-gray-400 text-xs mt-1">{course.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/contact"
          className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all hover:scale-105"
        >
          Get Notified
        </Link>
        <Link
          href="/"
          className="px-8 py-3 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 font-bold rounded-xl transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
