"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Search, X, ChevronRight, Tags, Plus, Store } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface StoreHeroImage {
  id: number;
  mediaUrl: string;
}

function StoreHeroSlider() {
  const [images, setImages] = useState<StoreHeroImage[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/store-hero")
      .then((r) => r.json())
      .then((d) => {
        setImages(d.images || []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const doubled = [...images, ...images]; // duplicate for seamless loop

  if (!loaded) {
    return (
      <div className="w-full h-[52vh] min-h-[380px] bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  // No images → elegant gradient fallback
  if (images.length === 0) {
    return (
      <div
        className="relative w-full h-[52vh] min-h-[380px] overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0d3b6e 0%, #135db6 50%, #1a73e8 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative text-center text-white px-4">
          <div className="inline-flex items-center gap-3 mb-4 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">
            <Store className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-wide">Premium Handcrafted Products</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-lg text-white">
            Our <span className="text-amber-300">Store</span>
          </h1>
          <p className="text-xl text-white/80 max-w-xl mx-auto font-medium">
            Discover premium handcrafted products made with passion and precision.
          </p>
        </div>
      </div>
    );
  }

  // Single image → full-width static hero
  if (images.length === 1) {
    return (
      <div className="relative w-full h-[52vh] min-h-[380px] overflow-hidden">
        <Image src={images[0].mediaUrl} alt="Store hero" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center px-10 md:px-20">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-black mb-3 drop-shadow-lg text-white">
              Our <span className="text-amber-300">Store</span>
            </h1>
            <p className="text-lg text-white/80 max-w-md font-medium">
              Discover premium handcrafted products.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Multiple images → continuous auto-scroll marquee
  const totalWidth = images.length * 100; // vw units

  return (
    <div className="relative w-full h-[52vh] min-h-[380px] overflow-hidden bg-gray-900">
      {/* Scrolling strip */}
      <div
        className="absolute inset-0 flex"
        style={{
          width: `${doubled.length * 100}vw`,
          animation: `storeMarquee ${images.length * 6}s linear infinite`,
        }}
      >
        {doubled.map((img, i) => (
          <div key={i} className="relative flex-shrink-0" style={{ width: "100vw", height: "100%" }}>
            <Image
              src={img.mediaUrl}
              alt={`Store hero ${i + 1}`}
              fill
              className="object-cover"
              priority={i < 2}
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/10" />

      {/* Text Overlay */}
      <div className="absolute inset-0 flex items-center px-8 md:px-16 lg:px-24">
        <div className="text-white">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 text-sm font-semibold tracking-wide">
            <Store className="w-4 h-4" />
            Premium Handcrafted Products
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 drop-shadow-lg leading-tight text-white">
            Our <span className="text-amber-300">Store</span>
          </h1>
          <p className="text-lg text-white/80 max-w-lg font-medium leading-relaxed">
            Discover premium handcrafted products made with passion and precision.
          </p>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-white/50 transition-all"
            style={{
              animation: `dotActive ${images.length * 6}s ${i * 6}s linear infinite`,
            }}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes storeMarquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-${totalWidth}vw); }
          }
          @keyframes dotActive {
            0%, ${100 / images.length - 1}%   { background-color: rgba(255,255,255,0.9); width: 20px; border-radius: 4px; }
            ${100 / images.length}%, 100%      { background-color: rgba(255,255,255,0.35); width: 8px; border-radius: 9999px; }
          }
        `
      }} />
    </div>
  );
}

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string | null;
  mainCategory: string;
  subCategory: string;
  description: string | null;
  stock: number;
  featured: boolean;
}

interface ProductCategory {
  id: number;
  mainCategory: string;
  subCategory: string;
}

function StoreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const initialMainCat = searchParams.get("main") || searchParams.get("mainCategory") || "Home Products";
  const initialSubCat = searchParams.get("sub") || searchParams.get("subCategory") || "";
  
  const [activeMainCat, setActiveMainCat] = useState(initialMainCat);
  const [activeSubCat, setActiveSubCat] = useState(initialSubCat);
  
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAllStore, setShowAllStore] = useState(false);

  useEffect(() => {
    fetch("/api/product-categories")
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeMainCat) params.set("mainCategory", activeMainCat);
    if (activeSubCat) params.set("subCategory", activeSubCat);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeMainCat, activeSubCat]);

  const handleMainCatChange = (main: string) => {
    setActiveMainCat(main);
    setActiveSubCat(""); // Reset sub category on main change
    const params = new URLSearchParams(searchParams.toString());
    params.set("main", main);
    params.delete("sub");
    router.push(`/store?${params.toString()}`, { scroll: false });
  };

  const handleSubCatChange = (sub: string) => {
    setActiveSubCat(sub);
    const params = new URLSearchParams(searchParams.toString());
    if (sub) params.set("sub", sub);
    else params.delete("sub");
    router.push(`/store?${params.toString()}`, { scroll: false });
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: `${product.mainCategory} / ${product.subCategory}`,
    });
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const filtered = products.filter((p) =>
    search
      ? p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const mainCategories = Array.from(new Set(categories.map(c => c.mainCategory)));
  const subCategories = categories.filter(c => c.mainCategory === activeMainCat).map(c => c.subCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Main Categories Sidebar (or top nav on mobile) */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border p-4 sticky top-24" style={{ borderColor: "var(--cream-white-border)" }}>
            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <Tags className="w-5 h-5" style={{ color: "var(--peacock-blue)" }} /> 
              Categories
            </h3>
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
              {mainCategories.map(mainCat => (
                <button
                  key={mainCat}
                  onClick={() => handleMainCatChange(mainCat)}
                  className={cn(
                    "flex justify-between items-center px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap",
                    activeMainCat === mainCat
                      ? "bg-peacock-blue text-white shadow-md"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  )}
                  style={{ background: activeMainCat === mainCat ? "var(--blue-gradient)" : undefined }}
                >
                  {mainCat}
                  {activeMainCat === mainCat && <ChevronRight className="w-4 h-4 hidden lg:block" />}
                </button>
              ))}
              {mainCategories.length === 0 && (
                <div className="text-sm text-gray-400 p-2">Loading categories...</div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full lg:w-3/4">
          {/* Search & Subcategories */}
          <div className="mb-8 space-y-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                suppressHydrationWarning
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all shadow-sm"
                style={{ borderColor: "var(--cream-white-border)", outlineColor: "var(--peacock-blue)" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {subCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSubCatChange("")}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
                    !activeSubCat
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  )}
                >
                  All in {activeMainCat}
                </button>
                {subCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleSubCatChange(sub)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-semibold transition-all border",
                      activeSubCat === sub
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    )}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border animate-pulse shadow-sm" style={{ borderColor: "var(--cream-white-border)" }}>
                  <div className="h-56 bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-8 bg-gray-200 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg font-medium">No products found in this category.</p>
              {(search || activeSubCat) && (
                <button
                  onClick={() => { setSearch(""); setActiveSubCat(""); }}
                  className="mt-4 font-bold hover:underline"
                  style={{ color: "var(--peacock-blue)" }}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {(showAllStore ? filtered : filtered.slice(0, filtered.length >= 3 ? filtered.length - (filtered.length % 3) : filtered.length)).map((product) => (
                  <div
                  key={product.id}
                  className="group bg-white border rounded-2xl overflow-hidden transition-all hover:shadow-xl relative flex flex-col"
                  style={{ borderColor: "var(--cream-white-border)" }}
                >
                  <Link href={`/store/${product.id}`} className="block relative h-56 bg-gray-50 overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-5xl text-gray-300">📦</div>
                    )}
                    {product.featured && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-black text-[10px] uppercase tracking-wider font-black px-2 py-1 rounded-md shadow-sm">
                        Featured
                      </span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-white font-bold text-sm bg-red-600 px-4 py-1.5 rounded-full shadow-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </Link>

                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      {product.subCategory}
                    </span>
                    <Link href={`/store/${product.id}`}>
                      <h3 className="text-gray-900 font-black text-lg hover:text-amber-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    {product.description && (
                      <p className="text-gray-500 text-sm mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-end justify-between mt-auto pt-5">
                      <div>
                        <span className="text-xl font-black text-gray-900">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                        <p className="text-xs font-semibold text-green-600 mt-0.5">
                          {product.stock > 0 ? `${product.stock} in stock` : "Unavailable"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="p-3 bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              
              {filtered.length >= 3 && filtered.length % 3 !== 0 && (
                <div className="mt-12 text-center">
                  <button onClick={() => setShowAllStore(!showAllStore)} className="px-8 py-3 rounded-full border-2 border-[#135db6] text-[#135db6] font-bold hover:bg-[#135db6] hover:text-white transition-all">
                    {showAllStore ? "View Less" : "View More Products"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StorePage() {
  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      {/* Hero Slider — outside Suspense so it loads immediately */}
      <StoreHeroSlider />
      <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin" /></div>}>
        <StoreContent />
      </Suspense>
    </div>
  );
}
