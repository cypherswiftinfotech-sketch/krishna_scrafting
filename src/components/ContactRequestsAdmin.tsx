"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Edit2, Save, X, Eye } from "lucide-react";

interface ContactRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  productInterest: string;
  budget: string;
  appointmentDate: string;
  message: string;
  imageUrl: string;
  createdAt: string;
}

export default function ContactRequestsAdmin() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Column visibility state
  const [visibleCols, setVisibleCols] = useState({
    name: true,
    email: true,
    phone: true,
    location: true,
    product: true,
    budget: false,
    date: true,
    message: false,
    image: true
  });

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ContactRequest>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact-requests");
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load contact requests");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (req: ContactRequest) => {
    setEditingId(req.id);
    setEditForm({
      name: req.name,
      email: req.email,
      phone: req.phone || "",
      country: req.country || "",
      city: req.city || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/contact-requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Updated successfully");
      cancelEdit();
      fetchData();
    } catch (e) {
      console.error(e);
      toast.error("Error updating contact request");
    }
  };

  const toggleCol = (col: keyof typeof visibleCols) => {
    setVisibleCols(prev => ({ ...prev, [col]: !prev[col] }));
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6" style={{ borderColor: "var(--cream-white-border)" }}>
      <h2 className="text-2xl font-black text-gray-900 mb-6">Form Submissions (Leads)</h2>

      {/* Column Toggles */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Show/Hide Columns:</h3>
        <div className="flex flex-wrap gap-3">
          {Object.keys(visibleCols).map((col) => (
            <label key={col} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-1.5 rounded-lg border hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={visibleCols[col as keyof typeof visibleCols]}
                onChange={() => toggleCol(col as keyof typeof visibleCols)}
                className="w-4 h-4 text-peacock-blue rounded border-gray-300"
              />
              <span className="text-sm font-medium capitalize text-gray-700">{col}</span>
            </label>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading submissions...</div>
      ) : (
        <div className="overflow-x-auto border rounded-lg" style={{ borderColor: "var(--cream-white-border)" }}>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {visibleCols.name && <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Name</th>}
                {visibleCols.email && <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Email</th>}
                {visibleCols.phone && <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Phone</th>}
                {visibleCols.location && <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Location</th>}
                {visibleCols.product && <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Product Interest</th>}
                {visibleCols.budget && <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Budget</th>}
                {visibleCols.date && <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Appointment / Date</th>}
                {visibleCols.message && <th className="px-6 py-3 text-left font-bold text-gray-500 uppercase">Message</th>}
                {visibleCols.image && <th className="px-6 py-3 text-center font-bold text-gray-500 uppercase">Image</th>}
                <th className="px-6 py-3 text-right font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {requests.map(req => {
                const isEditing = editingId === req.id;
                return (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    {visibleCols.name && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input type="text" value={editForm.name || ""} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border rounded px-2 py-1 w-full" />
                        ) : (
                          <span className="font-medium text-gray-900">{req.name}</span>
                        )}
                      </td>
                    )}
                    {visibleCols.email && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input type="email" value={editForm.email || ""} onChange={e => setEditForm({...editForm, email: e.target.value})} className="border rounded px-2 py-1 w-full" />
                        ) : (
                          <span className="text-gray-600">{req.email}</span>
                        )}
                      </td>
                    )}
                    {visibleCols.phone && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <input type="text" value={editForm.phone || ""} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="border rounded px-2 py-1 w-full" />
                        ) : (
                          <span className="text-gray-600">{req.phone || "-"}</span>
                        )}
                      </td>
                    )}
                    {visibleCols.location && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <input type="text" placeholder="City" value={editForm.city || ""} onChange={e => setEditForm({...editForm, city: e.target.value})} className="border rounded px-2 py-1 w-20" />
                            <input type="text" placeholder="Country" value={editForm.country || ""} onChange={e => setEditForm({...editForm, country: e.target.value})} className="border rounded px-2 py-1 w-20" />
                          </div>
                        ) : (
                          <span className="text-gray-600">{(req.city || req.country) ? `${req.city || ""}${req.city && req.country ? ", " : ""}${req.country || ""}` : "-"}</span>
                        )}
                      </td>
                    )}
                    {visibleCols.product && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">{req.productInterest || "-"}</span>
                      </td>
                    )}
                    {visibleCols.budget && (
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">{req.budget || "-"}</td>
                    )}
                    {visibleCols.date && (
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {req.appointmentDate ? (
                          <div className="flex flex-col">
                            <span className="font-bold text-peacock-blue">Appt: {new Date(req.appointmentDate).toLocaleString()}</span>
                            <span className="text-xs text-gray-400">Sent: {new Date(req.createdAt).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Sent: {new Date(req.createdAt).toLocaleDateString()}</span>
                        )}
                      </td>
                    )}
                    {visibleCols.message && (
                      <td className="px-6 py-4 text-gray-600">
                        <p className="line-clamp-2 max-w-xs" title={req.message}>{req.message || "-"}</p>
                      </td>
                    )}
                    {visibleCols.image && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {req.imageUrl ? (
                          <a href={req.imageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-peacock-blue transition-colors">
                            <Eye className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => saveEdit(req.id)} className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEdit} className="p-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(req)} className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-gray-500">
                    No form submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
