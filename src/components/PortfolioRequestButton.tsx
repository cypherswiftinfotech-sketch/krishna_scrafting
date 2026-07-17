"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function PortfolioRequestButton({ 
  portfolioId, 
  portfolioTitle 
}: { 
  portfolioId: number, 
  portfolioTitle: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const message = `Hi, I am interested in getting a project similar to "${portfolioTitle}".`;
      const res = await fetch("/api/portfolio/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portfolioId,
          portfolioTitle,
          customerName: name,
          customerPhone: phone,
          message,
        }),
      });

      if (res.ok) {
        // Redirect to WhatsApp
        const whatsappNumber = "919019772277"; // fallback or hardcoded
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
        setIsOpen(false);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-6 w-full py-3 bg-[#0f52ba] text-white font-bold rounded-xl shadow hover:shadow-lg hover:bg-[#008080] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
      >
        <MessageCircle className="w-5 h-5" />
        Request the same
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                Request Custom Order
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                You are inquiring about <strong>{portfolioTitle}</strong>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Your Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0f52ba] outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0f52ba] outline-none transition-all"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 py-4 bg-[#0f52ba] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#008080] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
              >
                {loading ? "Processing..." : "Continue to WhatsApp"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
