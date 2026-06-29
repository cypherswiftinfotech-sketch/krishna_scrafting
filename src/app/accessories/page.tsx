import Link from "next/link";
import { Clock, Bell } from "lucide-react";

export default function AccessoriesPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-amber-500/20 border-2 border-amber-500/40 rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Clock className="w-16 h-16 text-amber-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
          <Bell className="w-4 h-4 text-black" />
        </div>
      </div>

      <h1 className="text-5xl font-black text-white mb-4">
        Accessories
      </h1>
      <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-6 py-2 mb-6">
        <span className="text-amber-400 font-bold text-lg">Coming Soon</span>
      </div>
      <p className="text-gray-400 text-lg max-w-md mb-10">
        We&apos;re curating an exclusive collection of premium accessories. Stay tuned for something extraordinary!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/store"
          className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all hover:scale-105"
        >
          Browse Our Store
        </Link>
        <Link
          href="/"
          className="px-8 py-3 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 font-bold rounded-xl transition-all"
        >
          Back to Home
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="mt-20 grid grid-cols-3 gap-8 opacity-20">
        {["⌚", "💎", "🎁", "✨", "🏆", "💍"].map((emoji, i) => (
          <div key={i} className="text-4xl">{emoji}</div>
        ))}
      </div>
    </div>
  );
}
