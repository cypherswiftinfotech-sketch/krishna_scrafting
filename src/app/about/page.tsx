import Link from "next/link";
import { Users, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-16 min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-amber-500/20 border-2 border-amber-500/40 rounded-full flex items-center justify-center mx-auto">
          <Users className="w-16 h-16 text-amber-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
          <Clock className="w-4 h-4 text-black" />
        </div>
      </div>

      <h1 className="text-5xl font-black mb-4" style={{ fontFamily: "var(--font-heading)", color: "#1f1f1f" }}>Sri Krishna Crafting</h1>
      <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-6 py-2 mb-6">
        <span className="text-amber-400 font-bold text-lg">Premium Craftsmanship</span>
      </div>
      <p className="text-gray-500 text-lg max-w-lg mb-10">
        At Sri Krishna Crafting, our story is forged with the same precision and elegance we bring to every product. We blend timeless tradition with modern design to deliver exquisite creations that stand the test of time.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/store"
          className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all hover:scale-105"
        >
          Explore Our Products
        </Link>
        <Link
          href="/contact"
          className="px-8 py-3 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 font-bold rounded-xl transition-all"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
