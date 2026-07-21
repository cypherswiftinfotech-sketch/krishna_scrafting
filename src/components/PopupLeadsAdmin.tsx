"use client";

import { useState, useEffect } from "react";

interface PopupLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  createdAt: string;
}

export default function PopupLeadsAdmin() {
  const [leads, setLeads] = useState<PopupLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/popup-leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow" style={{ border: "1px solid var(--cream-white-border)" }}>
      <h2 className="text-2xl font-bold mb-6">Popup Form Leads</h2>
      
      {loading ? (
        <p className="text-gray-500">Loading leads...</p>
      ) : leads.length === 0 ? (
        <p className="text-gray-500">No popup leads found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--cream-white-border)" }}>
                <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider text-gray-500">Date</th>
                <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider text-gray-500">Source Page</th>
                <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider text-gray-500">Name</th>
                <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider text-gray-500">Email</th>
                <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider text-gray-500">Phone</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50 transition-colors" style={{ borderColor: "var(--cream-white-border)" }}>
                  <td className="py-4 px-4 text-sm">{new Date(lead.createdAt).toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md capitalize ${lead.source === 'home' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">{lead.name}</td>
                  <td className="py-4 px-4 text-gray-600">{lead.email}</td>
                  <td className="py-4 px-4 text-gray-600">{lead.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
