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
            viewTab === "orders" ? "bg-[#1c1d1f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setViewTab("users")}
          className={`px-4 py-2 font-bold text-sm uppercase tracking-wider rounded-md transition-colors ${
            viewTab === "users" ? "bg-[#1c1d1f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user.id} className="bg-white border rounded-xl p-5 hover:shadow-lg transition-all" style={{ borderColor: "var(--cream-white-border)" }}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                  {user.role}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-1">{user.email}</p>
              {user.phone && <p className="text-gray-500 text-sm mb-3">Phone: {user.phone}</p>}
              <p className="text-xs text-gray-400 mt-4">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {users.length === 0 && (
            <div className="col-span-full py-8 text-center text-gray-500">No users found.</div>
          )}
        </div>
      )}
    </div>
  );
}
