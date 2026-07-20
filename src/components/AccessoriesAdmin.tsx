"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit2 } from "lucide-react";

interface AccessoriesKit {
  id: number;
  name: string;
  contains: string;
  price: string;
  imageUrl: string | null;
  sortOrder: number;
}

export default function AccessoriesAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<"settings" | "kits" | "guides" | "newsletter">("settings");

  // Settings State
  const [settings, setSettings] = useState<any>(null);
  const [settingsFile, setSettingsFile] = useState<File | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Kits State
  const [kits, setKits] = useState<AccessoriesKit[]>([]);
  const [isAddingKit, setIsAddingKit] = useState(false);
  const [editKit, setEditKit] = useState<AccessoriesKit | null>(null);
  const [kitFile, setKitFile] = useState<File | null>(null);
  const [kitLoading, setKitLoading] = useState(false);

  // Guides State
  const [guides, setGuides] = useState<any[]>([]);
  const [isAddingGuide, setIsAddingGuide] = useState(false);
  const [editGuide, setEditGuide] = useState<any | null>(null);
  const [guideFile, setGuideFile] = useState<File | null>(null);
  const [guideLoading, setGuideLoading] = useState(false);

  // Newsletter State
  const [subscribers, setSubscribers] = useState<any[]>([]);

  useEffect(() => {
    fetchKits();
    fetchSettings();
    fetchGuides();
    fetchSubscribers();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/accessories/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchKits = async () => {
    try {
      const res = await fetch("/api/accessories/kits");
      if (res.ok) {
        const data = await res.json();
        setKits(data.kits);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGuides = async () => {
    try {
      const res = await fetch("/api/accessories/guides");
      if (res.ok) {
        const data = await res.json();
        setGuides(data.guides);
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

  const handleKitSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setKitLoading(true);
    const formData = new FormData(e.currentTarget);
    if (kitFile) formData.append("image", kitFile);

    const url = editKit ? `/api/accessories/kits/${editKit.id}` : "/api/accessories/kits";
    const method = editKit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        toast.success(editKit ? "Kit updated!" : "Kit added!");
        setIsAddingKit(false);
        setEditKit(null);
        setKitFile(null);
        fetchKits();
      } else {
        toast.error("Failed to save kit");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setKitLoading(false);
    }
  };

  const handleDeleteKit = async (id: number) => {
    if (!confirm("Are you sure you want to delete this kit?")) return;
    try {
      const res = await fetch(`/api/accessories/kits/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Kit deleted");
        fetchKits();
      } else {
        toast.error("Failed to delete kit");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleGuideSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGuideLoading(true);
    const formData = new FormData(e.currentTarget);
    if (guideFile) formData.append("image", guideFile);

    const url = editGuide ? `/api/accessories/guides/${editGuide.id}` : "/api/accessories/guides";
    const method = editGuide ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: formData });
      if (res.ok) {
        toast.success(editGuide ? "Guide updated!" : "Guide added!");
        setIsAddingGuide(false);
        setEditGuide(null);
        setGuideFile(null);
        fetchGuides();
      } else {
        toast.error("Failed to save guide");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setGuideLoading(false);
    }
  };

  const handleDeleteGuide = async (id: number) => {
    if (!confirm("Are you sure you want to delete this guide?")) return;
    try {
      const res = await fetch(`/api/accessories/guides/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Guide deleted");
        fetchGuides();
      } else {
        toast.error("Failed to delete guide");
      }
    } catch (err) {
      toast.error("An error occurred");
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

  const handleSettingsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSettingsLoading(true);
    const formData = new FormData();
    if (settingsFile) formData.append("video", settingsFile);

    try {
      const res = await fetch("/api/accessories/settings", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Settings saved!");
        setSettingsFile(null);
        fetchSettings();
      } else {
        toast.error("Failed to save settings");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Accessories Page Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage content for the Accessories page</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto pb-2">
        {(["settings", "kits", "guides", "newsletter"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`pb-2 px-1 font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeSubTab === tab ? "border-[#135db6] text-[#135db6]" : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab === "settings" ? "Hero Media" : tab === "kits" ? "Package Kits" : tab === "guides" ? "Learning Guides" : "Newsletter Subscribers"}
          </button>
        ))}
      </div>

      {activeSubTab === "settings" && (
        <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100 w-full">
          <h3 className="text-xl font-bold mb-6">Hero Section Configuration</h3>
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Background Media (Video or Image)</label>
              <input type="file" accept="video/*,image/*" onChange={(e) => setSettingsFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border bg-white border-gray-300" />
              {settings?.heroVideoUrl && <p className="mt-2 text-sm text-green-600 font-medium">Currently using custom background media.</p>}
            </div>
            <button type="submit" disabled={settingsLoading} className="px-6 py-2 bg-[#135db6] text-white rounded-lg font-bold hover:bg-[#0f4b94] transition-colors mt-4">
              {settingsLoading ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      )}

      {activeSubTab === "kits" && (
        <div>
          {!isAddingKit && !editKit ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Package Kits ({kits.length})</h3>
                <button onClick={() => setIsAddingKit(true)} className="px-4 py-2 bg-[#135db6] text-white rounded-lg font-semibold hover:bg-[#0f4b94] transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Kit
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {kits.map((kit) => (
                  <div key={kit.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col">
                    <div className="h-40 bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                      {kit.imageUrl ? (
                        <img src={kit.imageUrl} alt={kit.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
                      )}
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow">
                        ₹{kit.price}
                      </div>
                    </div>
                    <h4 className="font-bold text-lg mb-1">{kit.name}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{kit.contains}</p>
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => setEditKit(kit)} className="flex-1 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 text-sm">
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button onClick={() => handleDeleteKit(kit.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-sm">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
                {kits.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    No kits found. Click "Add Kit" to create one.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 w-full mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{editKit ? "Edit Kit" : "Add New Kit"}</h3>
                <button onClick={() => { setIsAddingKit(false); setEditKit(null); }} className="text-gray-500 hover:text-black">Cancel</button>
              </div>
              <form onSubmit={handleKitSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Kit Name</label>
                  <input name="name" defaultValue={editKit?.name || ""} required className="w-full p-2 rounded border focus:ring-2 outline-none transition-all border-gray-300" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Price (₹)</label>
                    <input name="price" type="number" step="0.01" defaultValue={editKit?.price || ""} required className="w-full p-2 rounded border focus:ring-2 outline-none transition-all border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sort Order</label>
                    <input name="sortOrder" type="number" defaultValue={editKit?.sortOrder || 0} required className="w-full p-2 rounded border focus:ring-2 outline-none transition-all border-gray-300" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Contains (Items, comma separated)</label>
                  <textarea name="contains" defaultValue={editKit?.contains || ""} required placeholder="e.g. Resin, Hardener, Pigments, Cups" className="w-full p-2 rounded border focus:ring-2 outline-none transition-all border-gray-300" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Kit Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setKitFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border border-gray-300 bg-white" />
                  {editKit?.imageUrl && <p className="mt-2 text-sm text-green-600">Current image will be kept if you don't upload a new one.</p>}
                </div>
                <button type="submit" disabled={kitLoading} className="px-6 py-3 w-full bg-[#135db6] text-white rounded-lg font-bold hover:bg-[#0f4b94] transition-colors disabled:opacity-50 mt-4">
                  {kitLoading ? "Saving..." : "Save Kit"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "guides" && (
        <div>
          {!isAddingGuide && !editGuide ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Learning Guides ({guides.length})</h3>
                <button onClick={() => setIsAddingGuide(true)} className="px-4 py-2 bg-[#135db6] text-white rounded-lg font-semibold hover:bg-[#0f4b94] transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Guide
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map((guide) => (
                  <div key={guide.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex gap-4">
                    <div className="w-1/3 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                      {guide.imageUrl ? (
                        <img src={guide.imageUrl} alt={guide.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h4 className="font-bold text-lg mb-1">{guide.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{guide.content}</p>
                      <div className="flex gap-2 mt-auto">
                        <button onClick={() => setEditGuide(guide)} className="flex-1 py-1.5 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 text-sm">
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => handleDeleteGuide(guide.id)} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-sm">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {guides.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    No learning guides found. Click "Add Guide" to create one.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 w-full mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{editGuide ? "Edit Guide" : "Add New Guide"}</h3>
                <button onClick={() => { setIsAddingGuide(false); setEditGuide(null); }} className="text-gray-500 hover:text-black">Cancel</button>
              </div>
              <form onSubmit={handleGuideSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Guide Title</label>
                  <input name="title" defaultValue={editGuide?.title || ""} required className="w-full p-2 rounded border focus:ring-2 outline-none transition-all border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Guide Content</label>
                  <textarea name="content" defaultValue={editGuide?.content || ""} required placeholder="Explain the concept..." className="w-full p-2 rounded border focus:ring-2 outline-none transition-all border-gray-300" rows={5} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Guide Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setGuideFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border border-gray-300 bg-white" />
                  {editGuide?.imageUrl && <p className="mt-2 text-sm text-green-600">Current image will be kept if you don't upload a new one.</p>}
                </div>
                <button type="submit" disabled={guideLoading} className="px-6 py-3 w-full bg-[#135db6] text-white rounded-lg font-bold hover:bg-[#0f4b94] transition-colors disabled:opacity-50 mt-4">
                  {guideLoading ? "Saving..." : "Save Guide"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "newsletter" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Newsletter Subscribers ({subscribers.length})</h3>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
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
      )}
    </div>
  );
}
