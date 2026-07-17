"use client";

import { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface PortfolioRequest {
  id: number;
  portfolioId: number;
  portfolioTitle: string;
  customerName: string;
  customerPhone: string;
  message: string | null;
  status: string;
  createdAt: string;
}

export default function PortfolioRequestsAdmin() {
  const [requests, setRequests] = useState<PortfolioRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/portfolio/requests");
      const data = await res.json();
      if (res.ok) {
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    
    try {
      const res = await fetch(`/api/portfolio/requests/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Request deleted");
        fetchRequests();
      } else {
        toast.error("Failed to delete request");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting request");
    }
  };

  if (loading) return <div>Loading requests...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900">Custom Order Requests ({requests.length})</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/80 text-gray-900 border-b border-gray-100 uppercase tracking-wider text-[10px] font-bold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Requested Item</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    <div className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{req.customerName}</div>
                    <div className="text-xs text-gray-500 font-mono mt-1">{req.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {req.portfolioTitle}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate" title={req.message || ""}>
                    {req.message || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`https://wa.me/${req.customerPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors mr-2"
                    >
                      WhatsApp
                    </a>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="inline-flex items-center p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
