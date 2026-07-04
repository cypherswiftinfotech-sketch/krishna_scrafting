"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Package, Edit, Save, X, LogOut, ShoppingBag, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  address?: string | null;
}

interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  quantity: number;
  priceAtPurchase: string;
  imageUrl: string | null;
  category: string | null;
}

interface Order {
  id: number;
  status: string;
  totalAmount: string;
  createdAt: string;
  shippingAddress: string | null;
  items: OrderItem[];
}

export default function AccountPage() {
  const router = useRouter();
  const { setUser, logout } = useAuthStore();

  // Use local state for the verified user (from server cookie check)
  const [user, setLocalUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  // Verify session via cookie on mount — avoids hydration race condition
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setLocalUser(d.user);
          setUser(d.user); // sync zustand store
          setEditForm({
            name: d.user.name,
            phone: d.user.phone || "",
            address: d.user.address || "",
          });
          // Now fetch orders
          return fetch("/api/orders");
        } else {
          router.push("/login");
          return null;
        }
      })
      .then((r) => (r ? r.json() : null))
      .then((d) => {
        if (d) setOrders(d.orders || []);
      })
      .catch(() => router.push("/login"))
      .finally(() => {
        setAuthChecked(true);
        setLoadingOrders(false);
      });
  }, [router, setUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/auth/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = { ...user!, ...data.user };
      setLocalUser(updated);
      setUser(updated);
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    setLocalUser(null);
    toast.success("Logged out");
    router.push("/");
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    processing: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    delivered: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const toggleOrder = (orderId: number) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  // Show spinner while checking auth
  if (!authChecked) {
    return (
      <div className="pt-16 min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-700 border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-16 min-h-screen bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-4xl font-black text-white mb-8">
          My <span className="text-amber-400">Account</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex flex-col items-center text-center mb-6">
                {/* Brand Logo */}
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full pointer-events-none"></div>
                  <img
                    src="/logo.jpeg"
                    alt="Sri Krishna Crafting Logo"
                    className="h-16 w-auto object-contain relative z-10"
                    style={{ filter: "drop-shadow(0px 0px 12px rgba(212, 175, 55, 0.5))" }}
                  />
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <span className="text-black font-black text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-black text-white">{user.name}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <span className="mt-2 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full capitalize">
                  {user.role}
                </span>
              </div>

              {editing ? (
                <div className="space-y-4">
                  {[
                    { id: "name", label: "Name", type: "text" },
                    { id: "phone", label: "Phone", type: "tel" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        value={editForm[f.id as keyof typeof editForm]}
                        onChange={(e) => setEditForm({ ...editForm, [f.id]: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Address</label>
                    <textarea
                      rows={3}
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: "Phone", value: user.phone || "Not provided" },
                    { label: "Address", value: user.address || "Not provided" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                      <p className="text-gray-300 text-sm mt-0.5">{item.value}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => setEditing(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 mt-4 border border-amber-500/50 text-amber-400 font-semibold text-sm rounded-xl hover:bg-amber-500/10 transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit Profile
                  </button>
                </div>
              )}

              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold text-sm rounded-xl hover:bg-amber-500/30 transition-colors"
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-sm rounded-xl hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Package className="w-6 h-6 text-amber-400" /> My Orders
                </h2>
                <Link href="/store" className="text-amber-400 text-sm hover:text-amber-300 flex items-center gap-1">
                  <ShoppingBag className="w-4 h-4" /> Shop More
                </Link>
              </div>

              {loadingOrders ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-800 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400">No orders yet</p>
                  <Link href="/store" className="mt-4 inline-block text-amber-400 hover:underline text-sm">
                    Start shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const isExpanded = expandedOrders.has(order.id);
                    return (
                      <div
                        key={order.id}
                        className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden transition-all"
                      >
                        {/* Order Header — always visible */}
                        <button
                          onClick={() => toggleOrder(order.id)}
                          className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-gray-750 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-white font-bold text-sm">Order #{order.id}</span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColors[order.status] || "bg-gray-700 text-gray-300 border-gray-600"}`}
                              >
                                {order.status}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            {order.shippingAddress && (
                              <p className="text-gray-500 text-xs truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                {order.shippingAddress}
                              </p>
                            )}
                            {/* Thumbnail strip */}
                            {order.items.length > 0 && (
                              <div className="flex gap-1.5 mt-2">
                                {order.items.slice(0, 4).map((item) => (
                                  <div
                                    key={item.id}
                                    className="w-8 h-8 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0 border border-gray-600"
                                  >
                                    {item.imageUrl ? (
                                      <Image
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-xs">📦</div>
                                    )}
                                  </div>
                                ))}
                                {order.items.length > 4 && (
                                  <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-xs text-gray-400 border border-gray-600">
                                    +{order.items.length - 4}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <p className="text-amber-400 font-black text-lg">
                              ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                            </p>
                            {isExpanded
                              ? <ChevronUp className="w-4 h-4 text-gray-400" />
                              : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          </div>
                        </button>

                        {/* Expanded — full product list */}
                        {isExpanded && (
                          <div className="border-t border-gray-700 p-4 space-y-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Items Ordered</p>
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                {/* Product image */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-700 flex-shrink-0 border border-gray-600">
                                  {item.imageUrl ? (
                                    <Image
                                      src={item.imageUrl}
                                      alt={item.productName}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                                  )}
                                </div>
                                {/* Product info */}
                                <div className="flex-1 min-w-0">
                                  {item.category && (
                                    <p className="text-xs text-amber-400 uppercase tracking-wider mb-0.5">{item.category}</p>
                                  )}
                                  {item.productId ? (
                                    <Link
                                      href={`/store/${item.productId}`}
                                      className="font-semibold text-white text-sm hover:text-amber-400 transition-colors line-clamp-1"
                                    >
                                      {item.productName}
                                    </Link>
                                  ) : (
                                    <p className="font-semibold text-white text-sm line-clamp-1">{item.productName}</p>
                                  )}
                                  <p className="text-gray-400 text-xs mt-0.5">
                                    Qty: {item.quantity} &nbsp;×&nbsp; ₹{Number(item.priceAtPurchase).toLocaleString("en-IN")}
                                  </p>
                                </div>
                                {/* Line total */}
                                <p className="text-white font-bold text-sm flex-shrink-0">
                                  ₹{(Number(item.priceAtPurchase) * item.quantity).toLocaleString("en-IN")}
                                </p>
                              </div>
                            ))}
                            {/* Order total row */}
                            <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
                              <span className="text-gray-400 text-sm">{order.items.reduce((s, i) => s + i.quantity, 0)} item(s)</span>
                              <span className="text-amber-400 font-black">
                                Total: ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
