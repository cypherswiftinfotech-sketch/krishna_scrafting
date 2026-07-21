"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
  const { user } = useAuthStore();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const total = totalPrice();

  const handleCheckout = () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    router.push("/checkout");
  };

  const categoryIcons: Record<string, string> = {
    pen: "✒️", watch: "⌚", table: "🪵", nameplate: "🪧",
  };

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6">
        <ShoppingCart className="w-20 h-20 text-gray-700" />
        <h2 className="text-3xl font-black text-white">Your cart is empty</h2>
        <p className="text-gray-400">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/shop"
          className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all"
        >
          <ShoppingBag className="w-5 h-5" /> Browse Store
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-black text-white mb-8">
          Shopping <span className="text-amber-400">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex gap-4"
              >
                <div className="relative w-24 h-24 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-3xl">
                      {categoryIcons[product.category] || "📦"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs text-amber-400 font-semibold uppercase">
                        {product.category}
                      </span>
                      <h3 className="text-white font-bold truncate">{product.name}</h3>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(product.id);
                        toast.success("Item removed");
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-700 text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-white font-bold w-6 text-center text-sm">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-700 text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-amber-400 font-black text-lg">
                      ₹{(Number(product.price) * quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                clearCart();
                toast.success("Cart cleared");
              }}
              className="text-sm text-gray-500 hover:text-red-400 transition-colors mt-2"
            >
              Clear entire cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-bold text-xl mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate mr-2">
                      {product.name} ×{quantity}
                    </span>
                    <span className="text-gray-300 flex-shrink-0">
                      ₹{(Number(product.price) * quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-semibold">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                <div className="flex justify-between mt-4 text-xl font-black">
                  <span className="text-white">Total</span>
                  <span className="text-amber-400">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl transition-all hover:scale-105 shadow-lg shadow-amber-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                href="/shop"
                className="block text-center mt-4 text-amber-400 hover:text-amber-300 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <ShoppingBag className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">Ready to Checkout?</h2>
              <p className="text-gray-400">
                Please create an account or log in to complete your purchase and track your orders.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/register"
                className="block w-full text-center py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="block w-full text-center py-3 border border-amber-500/50 text-amber-400 font-bold rounded-xl hover:bg-amber-500/10 transition-colors"
              >
                Log In
              </Link>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="block w-full text-center py-3 text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
