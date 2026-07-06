"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart, ArrowLeft, ArrowRight, Plus, Minus, Star, Package,
  Share2, Heart, CheckCircle, Truck, Shield, RotateCcw
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import ImageZoom from "@/components/ImageZoom";

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string | null;
  category: string;
  description: string | null;
  stock: number;
  featured: boolean;
  relatedProductIds: string | null;
}

const categoryLabels: Record<string, string> = {
  pen: "Premium Pen",
  watch: "Handcrafted Watch",
  table: "Resin River Table",
  nameplate: "Custom Nameplate",
};

const categoryIcons: Record<string, string> = {
  pen: "✒️", watch: "⌚", table: "🪵", nameplate: "🪧",
};

const highlights = [
  { icon: <Truck className="w-4 h-4" />, text: "Free shipping on all orders" },
  { icon: <Shield className="w-4 h-4" />, text: "Lifetime craftsmanship warranty" },
  { icon: <RotateCcw className="w-4 h-4" />, text: "Easy 7-day returns" },
  { icon: <CheckCircle className="w-4 h-4" />, text: "100% handmade & quality checked" },
];

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product);
        setRelated(d.related || []);
      })
      .catch(() => router.push("/store"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
      });
    }
    toast.success(`${product.name} ×${qty} added to cart! 🛒`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-gray-900 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg">Product not found</p>
        <Link href="/store" className="text-amber-600 hover:underline font-medium">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-body)" }}>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/store" className="hover:text-black transition-colors">Store</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              {product.imageUrl ? (
                <ImageZoom
                  src={product.imageUrl}
                  alt={product.name}
                  fill={true}
                  className="w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-8xl">
                  {categoryIcons[product.category] || "📦"}
                </div>
              )}
              {product.featured && (
                <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow">
                  <Star className="w-3 h-3 fill-white" /> Featured
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category */}
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 mb-3">
              {categoryLabels[product.category] || product.category}
            </span>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
              {product.name}
            </h1>

            {/* Rating placeholder */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-gray-500">Handcrafted with love</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black" style={{ color: "#b45309" }}>
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                Free Shipping
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed text-base">{product.description}</p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100 my-6"></div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-4 h-4 text-gray-400" />
              <span className={product.stock > 0 ? "text-green-600 text-sm font-semibold" : "text-red-500 text-sm font-semibold"}>
                {product.stock > 0 ? `✓ In Stock — ${product.stock} units available` : "✗ Out of Stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                {/* Quantity */}
                <div className="flex items-center gap-6 mb-6">
                  <span className="text-sm font-semibold text-gray-700">Quantity</span>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-3 py-4 text-lg font-bold text-white rounded-xl transition-all hover:scale-[1.02] shadow-lg"
                    style={{ background: "var(--blue-gradient)" }}
                  >
                    Shop — ₹{(Number(product.price) * qty).toLocaleString("en-IN")}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setWishlisted(!wishlisted)}
                    className={`w-14 flex items-center justify-center rounded-xl border transition-all ${wishlisted ? "bg-red-50 border-red-200" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  </button>
                </div>

                <Link
                  href="/cart"
                  className="text-center py-3.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors mb-6 block"
                >
                  View Cart & Checkout
                </Link>
              </>
            )}

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                  <span className="text-amber-600">{h.icon}</span>
                  {h.text}
                </div>
              ))}
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="mt-6 flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share this product
            </button>
          </div>
        </div>

        {/* Product Details Tabs */}
        {product.description && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-black text-gray-900 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-widest text-xs">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-3 uppercase tracking-widest text-xs">Specifications</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["Category", categoryLabels[product.category] || product.category],
                      ["Material", "Premium Epoxy Resin"],
                      ["Finish", "High-gloss, UV Resistant"],
                      ["Availability", product.stock > 0 ? `In Stock (${product.stock} units)` : "Out of Stock"],
                      ["Shipping", "Free across India"],
                    ].map(([key, val]) => (
                      <tr key={key} className="border-b border-gray-100">
                        <td className="py-3 pr-4 font-medium text-gray-700 w-1/3">{key}</td>
                        <td className="py-3 text-gray-600">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-black text-gray-900 mb-8" style={{ fontFamily: "var(--font-heading)" }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/store/${rp.id}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all"
                >
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    {rp.imageUrl ? (
                      <Image
                        src={rp.imageUrl}
                        alt={rp.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl">
                        {categoryIcons[rp.category] || "📦"}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-gray-900 font-semibold text-sm line-clamp-2 mb-1">{rp.name}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{rp.category}</p>
                    <p className="font-black text-amber-700">
                      ₹{Number(rp.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
