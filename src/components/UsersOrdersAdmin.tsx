"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
}

interface OrderItem {
  orderId: number;
  productId: number | null;
  productName: string;
  quantity: number;
  priceAtPurchase: string;
  imageUrl: string | null;
  mainCategory?: string | null;
  subCategory?: string | null;
}

interface Order {
  id: number;
  userId: number | null;
  status: string;
  totalAmount: string;
  shippingAddress: string | null;
  notes: string | null;
  createdAt: string;
  userEmail: string | null;
  userName: string | null;
  items?: OrderItem[];
}

export default function UsersOrdersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewTab, setViewTab] = useState<"users" | "orders">("orders");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, oRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/orders")
      ]);
      const uData = await uRes.json();
      const oData = await oRes.json();
      setUsers(uData.users || []);
      setOrders(oData.orders || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success("Order status updated");
      fetchData(); // refresh
    } catch (e: any) {
      toast.error(e.message || "Error updating status");
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewTab("orders")}
          className={`px-4 py-2 font-bold text-sm uppercase tracking-wider rounded-md transition-colors ${
            viewTab === "orders" ? "bg-[#135db6] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setViewTab("users")}
          className={`px-4 py-2 font-bold text-sm uppercase tracking-wider rounded-md transition-colors ${
            viewTab === "users" ? "bg-[#135db6] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Users
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : viewTab === "orders" ? (
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm" style={{ borderColor: "var(--cream-white-border)" }}>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Products</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.userName || "Guest"}</div>
                    <div className="text-gray-500 text-xs">{order.userEmail || ""}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 bg-gray-50">No Img</div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 leading-tight line-clamp-1" title={item.productName}>{item.productName}</span>
                            {(item.mainCategory || item.subCategory) && (
                              <span className="text-[10px] text-gray-500 mt-0.5">
                                {item.mainCategory} {item.mainCategory && item.subCategory ? '>' : ''} {item.subCategory}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 font-semibold mt-0.5">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                      {(!order.items || order.items.length === 0) && (
                        <span className="text-sm text-gray-400 italic">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">₹{order.totalAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm bg-white cursor-pointer font-medium"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-lg shadow-sm" style={{ borderColor: "var(--cream-white-border)" }}>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.phone || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
