"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Filter, Search, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string | null;
  category: string;
  description: string | null;
  stock: number;
  featured: boolean;
}

const categories = [
  { key: "", label: "All Products", icon: "🛍️" },
  { key: "pen", label: "Pens", icon: "✒️" },
  { key: "watch", label: "Watches", icon: "⌚" },
  { key: "table", label: "Table Decor", icon: "🪵" },
  { key: "nameplate", label: "Nameplates", icon: "🪧" },
];

function StoreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const initialCategory = searchParams.get("category") || "";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const url = activeCategory
      ? `/api/products?category=${activeCategory}`
      : "/api/products";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    const params = new URLSearchParams(searchParams.toString());
    if (key) params.set("category", key);
    else params.delete("category");
    router.push(`/store?${params.toString()}`);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
    });
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const filtered = products.filter((p) =>
    search
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">
          Our <span className="text-amber-400">Store</span>
        </h1>
        <p className="text-gray-400">Premium laser-engraved products</p>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        <Filter className="w-5 h-5 text-gray-400 self-center mr-1" />
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
              activeCategory === cat.key
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25"
                : "bg-gray-900 text-gray-300 border border-gray-700 hover:border-amber-500/50 hover:text-amber-400"
            )}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-800" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
                <div className="h-8 bg-gray-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-400 text-lg">No products found</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-amber-400 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/10"
            >
              <Link href={`/store/${product.id}`}>
                <div className="relative h-48 bg-gray-800 overflow-hidden">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-5xl">
                      {categories.find((c) => c.key === product.category)?.icon || "📦"}
                    </div>
                  )}
                  {product.featured && (
                    <span className="absolute top-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-lg">
                      Featured
                    </span>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-sm bg-red-500/80 px-3 py-1 rounded-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  {product.category}
                </span>
                <Link href={`/store/${product.id}`}>
                  <h3 className="text-white font-bold mt-1 hover:text-amber-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                {product.description && (
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xl font-black text-amber-400">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                    <p className="text-xs text-gray-500">
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black rounded-xl transition-all hover:scale-105"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StorePage() {
  return (
    <div className="pt-16 bg-gray-950 min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-amber-400">Loading...</div></div>}>
        <StoreContent />
      </Suspense>
    </div>
  );
}
