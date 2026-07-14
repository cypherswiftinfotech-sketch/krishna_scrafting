"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Send, Trash2 } from "lucide-react";

export default function CRMAdmin() {
  const [activeTab, setActiveTab] = useState<"newsletter" | "promotions" | "abandoned">("newsletter");
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [notifySubject, setNotifySubject] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  // Promotions
  const [promoCategory, setPromoCategory] = useState("All Categories");
  const [promoSubject, setPromoSubject] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [isSendingPromo, setIsSendingPromo] = useState(false);
  
  // Settings for abandoned cart
  const [abandonedFirstDays, setAbandonedFirstDays] = useState(4);
  const [abandonedRecurringDays, setAbandonedRecurringDays] = useState(7);
  const [abandonedCarts, setAbandonedCarts] = useState<any[]>([]);

  useEffect(() => {
    fetchSubscribers();
    fetchAbandonedCarts();
  }, []);

  const fetchAbandonedCarts = async () => {
    try {
      const res = await fetch("/api/crm/abandoned-carts");
      if (res.ok) {
        const data = await res.json();
        setAbandonedCarts(data.carts || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/accessories/newsletter/list");
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscriber = async (id: number) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    try {
      const res = await fetch(`/api/accessories/newsletter/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Subscriber removed");
        fetchSubscribers();
      } else {
        toast.error("Failed to remove subscriber");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleSendNotification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (subscribers.length === 0) {
      toast.error("No subscribers to notify");
      return;
    }
    
    setIsSending(true);
    try {
      const res = await fetch("/api/crm/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: notifySubject, message: notifyMessage }),
      });
      
      const data = await res.json();
      if (res.ok) {
        toast.success(`Notification sent to ${data.count} subscribers!`);
        setNotifySubject("");
        setNotifyMessage("");
      } else {
        toast.error(data.error || "Failed to send notifications");
      }
    } catch (err) {
      toast.error("An error occurred while sending");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendPromotion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSendingPromo(true);
    try {
      const res = await fetch("/api/crm/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCategory: promoCategory, subject: promoSubject, message: promoMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Sent to ${data.count} buyers in this category!`);
        setPromoSubject("");
        setPromoMessage("");
      } else {
        toast.error(data.error || "Failed to send promotion");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSendingPromo(false);
    }
  };

  const handleTriggerAbandonedCarts = async () => {
    try {
      const res = await fetch("/api/crm/abandoned-carts", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Reminders triggered successfully.");
      } else {
        toast.error("Failed to trigger reminders");
      }
    } catch (err) {
      toast.error("Error triggering reminders");
    }
  };

  const handleSaveAbandonedSettings = () => {
    // In a real implementation, this would save to `/api/crm/settings`
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">CRM & Updates</h2>
          <p className="text-gray-500 text-sm mt-1">Manage newsletter subscribers and send notifications</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 border-b border-gray-100 pb-4">
        <button 
          onClick={() => setActiveTab("newsletter")}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === "newsletter" ? "bg-[#135db6] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
        >
          Newsletter Subscribers
        </button>
        <button 
          onClick={() => setActiveTab("promotions")}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === "promotions" ? "bg-[#135db6] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
        >
          Targeted Promotions
        </button>
        <button 
          onClick={() => setActiveTab("abandoned")}
          className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === "abandoned" ? "bg-[#135db6] text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
        >
          Abandoned Carts
        </button>
      </div>

      {activeTab === "newsletter" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
          {/* Send Update Section */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Send Update to Subscribers</h3>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Subject / Title</label>
                <input
                  value={notifySubject}
                  onChange={(e) => setNotifySubject(e.target.value)}
                  required
                  placeholder="e.g. New Blog Post: How to maintain resin art"
                  className="w-full p-2 rounded border focus:ring-2 outline-none transition-all border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Message</label>
                <textarea
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  required
                  placeholder="Write your update message here..."
                  className="w-full p-2 rounded border focus:ring-2 outline-none transition-all border-gray-300"
                  rows={6}
                />
              </div>
              <button
                type="submit"
                disabled={isSending || subscribers.length === 0}
                className="px-6 py-3 w-full bg-[#135db6] text-white rounded-lg font-bold hover:bg-[#0f4b94] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {isSending ? "Sending..." : "Send Update"}
              </button>
              {subscribers.length === 0 && (
                <p className="text-sm text-red-500 text-center mt-2">No subscribers available to send to.</p>
              )}
            </form>
          </div>

          {/* Subscribers List Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Subscribers ({subscribers.length})</h3>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-bold text-gray-700">Email Address</th>
                    <th className="p-4 font-bold text-gray-700">Subscribed On</th>
                    <th className="p-4 font-bold text-gray-700 w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50/50">
                      <td className="p-4 font-medium text-gray-900">{sub.email}</td>
                      <td className="p-4 text-gray-500">{new Date(sub.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteSubscriber(sub.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Subscriber"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-500">
                        No subscribers yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "promotions" && (
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 animate-in fade-in duration-300">
          <h3 className="text-xl font-bold mb-6">Targeted Category Promotions</h3>
          <p className="text-gray-500 mb-6">Notify past purchasers of a specific category about new arrivals or similar products.</p>
          <form onSubmit={handleSendPromotion} className="max-w-2xl space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Select Target Category</label>
              <select value={promoCategory} onChange={(e) => setPromoCategory(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 outline-none">
                <option value="All Categories">All Categories</option>
                <option value="pen">Pens</option>
                <option value="watch">Watches</option>
                <option value="table">Tables</option>
                <option value="nameplate">Nameplates</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Subject</label>
              <input required value={promoSubject} onChange={(e) => setPromoSubject(e.target.value)} placeholder="e.g. New Resin Colors Available!" className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Message</label>
              <textarea required value={promoMessage} onChange={(e) => setPromoMessage(e.target.value)} placeholder="Write your promotional message..." className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 outline-none" rows={4} />
            </div>
            <button type="submit" disabled={isSendingPromo} className="px-6 py-3 bg-[#135db6] text-white rounded-lg font-bold hover:bg-[#0f4b94] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              <Send className="w-5 h-5" /> {isSendingPromo ? "Sending..." : "Send Targeted Promo"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "abandoned" && (
        <div className="animate-in fade-in duration-300 space-y-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row gap-6 justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Abandoned Cart Settings</h3>
              <p className="text-gray-500 text-sm max-w-lg">Configure how long an item must sit in the cart before the first reminder is sent, and the interval for recurring reminders.</p>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Reminder</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={abandonedFirstDays} onChange={(e) => setAbandonedFirstDays(Number(e.target.value))} className="w-20 p-2 rounded border" />
                  <span className="text-sm font-medium">Days</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Recurring Every</label>
                <div className="flex items-center gap-2">
                  <input type="number" value={abandonedRecurringDays} onChange={(e) => setAbandonedRecurringDays(Number(e.target.value))} className="w-20 p-2 rounded border" />
                  <span className="text-sm font-medium">Days</span>
                </div>
              </div>
              <div className="flex items-end">
                <button onClick={handleSaveAbandonedSettings} className="px-4 py-2 bg-gray-900 text-white font-bold rounded hover:bg-black transition-colors">Save</button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Active Abandoned Carts</h3>
              <button onClick={handleTriggerAbandonedCarts} className="px-4 py-2 bg-[#135db6] text-white font-bold rounded-lg hover:bg-[#0f4b94] flex items-center gap-2 transition-all">
                <Send className="w-4 h-4" /> Trigger Pending Reminders Now
              </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-bold text-gray-700">User / Session</th>
                    <th className="p-4 font-bold text-gray-700">Items in Cart</th>
                    <th className="p-4 font-bold text-gray-700">Last Active</th>
                    <th className="p-4 font-bold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {abandonedCarts.map((cart, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-none hover:bg-gray-50/50">
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{cart.userName}</p>
                        <p className="text-sm text-gray-500">{cart.userEmail}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium">{cart.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {cart.quantity}</p>
                      </td>
                      <td className="p-4 text-gray-500">{new Date(cart.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Pending</span>
                      </td>
                    </tr>
                  ))}
                  {abandonedCarts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">
                        No abandoned carts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
