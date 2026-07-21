"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

interface PopupFormProps {
  delayMs: number;
  source: string;
  title: string;
  subtitle: string;
}

export default function PopupForm({ delayMs, source, title, subtitle }: PopupFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if this specific popup has already been shown
    const hasSeen = localStorage.getItem(`popupShown_${source}`);
    if (hasSeen) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      // Mark as shown so it never pops up again on this device/browser
      localStorage.setItem(`popupShown_${source}`, "true");
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, source]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/popup-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      
      toast.success("Thank you! We will get back to you shortly.");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 bg-gray-50 border-b border-gray-100 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            {title}
          </h2>
          <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-1.5">
              Your Name
            </label>
            <input 
              required
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-[#0f52ba] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-1.5">
              Email Address
            </label>
            <input 
              required
              type="email"
              placeholder="e.g. you@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-[#0f52ba] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 tracking-wider uppercase mb-1.5">
              Phone Number
            </label>
            <input 
              required
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:border-[#0f52ba] outline-none transition-all"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-[#0f52ba] text-white font-bold rounded-xl hover:bg-[#0c4296] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "SUBMIT REQUEST"}
          </button>
        </form>
      </div>
    </div>
  );
}
