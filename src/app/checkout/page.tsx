"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, CreditCard, MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

const WHATSAPP_NUMBER = "918319668016"; // +91 831 966 8016

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ shippingAddress: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const total = totalPrice();

  const buildWhatsappMessage = (oId: number, address: string, notes: string) => {
    const itemLines = items
      .map(({ product, quantity }) => {
        const imgLine = product.imageUrl ? `\n  🖼️ ${product.imageUrl}` : "";
        return `• ${product.name} ×${quantity} — ₹${(Number(product.price) * quantity).toLocaleString("en-IN")}${imgLine}`;
      })
      .join("\n\n");

    const message = `🛍️ *New Order from Sri Krishna Crafting*

*Order ID:* #${oId}
*Customer:* ${user?.name || "Guest"}
*Phone/Email:* ${user?.email || "-"}

*Items:*
${itemLines}

*Total:* ₹${total.toLocaleString("en-IN")}

*Shipping Address:*
${address}

${notes ? `*Special Instructions:*\n${notes}` : ""}

Thank you! 🙏`;

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: form.shippingAddress,
          notes: form.notes,
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      const oId = data.order.id;
      setOrderId(oId);

      // Build WhatsApp URL before clearing cart
      const waUrl = buildWhatsappMessage(oId, form.shippingAddress, form.notes);
      setWhatsappUrl(waUrl);

      clearCart();
      setDone(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="pt-24 min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-green-100 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            Order Placed!
          </h1>
          <p className="text-gray-500 mb-2">
            Your order <span className="font-bold text-black">#{orderId}</span> has been confirmed.
          </p>
          <p className="text-gray-400 text-sm mb-8">
            Our team will contact you shortly to confirm the details and payment.
          </p>

          {/* WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-white mb-4 transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle className="w-5 h-5" />
            Send Order to WhatsApp
          </a>

          <div className="flex flex-col gap-3">
            <Link
              href="/account"
              className="py-3 font-bold rounded-xl transition-all text-white"
              style={{ backgroundColor: "#b45309" }}
            >
              View My Orders
            </Link>
            <Link
              href="/store"
              className="py-3 border border-gray-300 text-gray-700 hover:text-black font-bold rounded-xl transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>

        <h1 className="text-4xl font-black text-gray-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Checkout
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          After placing your order, you can send it directly to our WhatsApp for quick confirmation.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" /> Delivery Details
            </h2>
            <form onSubmit={handleOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user?.name || ""}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Shipping Address *
                </label>
                <textarea
                  rows={4}
                  placeholder="House/Flat, Street, City, PIN Code, State"
                  value={form.shippingAddress}
                  onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Special Instructions <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Any special instructions for your order..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 font-black text-white rounded-xl transition-all hover:opacity-90 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#b45309" }}
              >
                {loading ? "Placing Order..." : `Place Order — ₹${total.toLocaleString("en-IN")}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 h-fit shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">
                    {product.name} ×{quantity}
                  </span>
                  <span className="text-gray-900 font-medium flex-shrink-0">
                    ₹{(Number(product.price) * quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-between items-center text-xl font-black">
                <span className="text-gray-900">Total</span>
                <span style={{ color: "#b45309" }}>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">✓ Free shipping included</p>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-xs leading-relaxed">
                After placing your order, a WhatsApp button will appear to send your order details directly to us for quick confirmation.
              </p>
            </div>

            <div className="mt-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-amber-700 text-xs leading-relaxed">
                🔒 Payment will be collected upon delivery or via bank transfer after confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
