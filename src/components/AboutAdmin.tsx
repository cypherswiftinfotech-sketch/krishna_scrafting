"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface AboutSettings {
  storyTitle: string;
  storyText: string;
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  heroImageUrl?: string | null;
}

interface AboutGalleryImage {
  id: number;
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

interface AboutPartner {
  id: number;
  name: string;
  role: string | null;
  bio: string | null;
  imageUrl: string | null;
  sortOrder: number;
}

export default function AboutAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<"settings" | "gallery" | "partners">("settings");

  // Settings State
  const [settings, setSettings] = useState<AboutSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  // Gallery State
  const [gallery, setGallery] = useState<AboutGalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  
  // Partners State
  const [partners, setPartners] = useState<AboutPartner[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [editPartner, setEditPartner] = useState<AboutPartner | null>(null);
  const [partnerFile, setPartnerFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSettings();
    fetchGallery();
    fetchPartners();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      setSettings(data.settings);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/about/gallery");
      const data = await res.json();
      setGallery(data.images || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/about/partners");
      const data = await res.json();
      setPartners(data.partners || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSettingsLoading(true);
    const formData = new FormData(e.currentTarget);
    if (heroImageFile) formData.set("heroImage", heroImageFile);
    
    try {
      const res = await fetch("/api/about", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update settings");
      toast.success("About settings updated!");
      setHeroImageFile(null);
      fetchSettings();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGalleryLoading(true);
    const formData = new FormData(e.currentTarget);
    if (galleryFile) formData.set("image", galleryFile);
    
    try {
      const res = await fetch("/api/about/gallery", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to upload image");
      toast.success("Gallery image uploaded!");
      setIsAddingGallery(false);
      setGalleryFile(null);
      fetchGallery();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/about/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Image deleted");
      fetchGallery();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPartnersLoading(true);
    const formData = new FormData(e.currentTarget);
    if (partnerFile) formData.set("image", partnerFile);
    
    const method = editPartner ? "PUT" : "POST";
    const url = editPartner ? `/api/about/partners/${editPartner.id}` : "/api/about/partners";
    
    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save partner");
      toast.success(editPartner ? "Partner updated!" : "Partner created!");
      setIsAddingPartner(false);
      setEditPartner(null);
      setPartnerFile(null);
      fetchPartners();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setPartnersLoading(false);
    }
  };

  const handleDeletePartner = async (id: number) => {
    if (!confirm("Delete this partner?")) return;
    try {
      const res = await fetch(`/api/about/partners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Partner deleted");
      fetchPartners();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        {(["settings", "gallery", "partners"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 font-semibold text-sm transition-colors capitalize rounded-xl ${
              activeSubTab === tab ? "bg-peacock-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ backgroundColor: activeSubTab === tab ? "var(--peacock-blue)" : undefined, color: activeSubTab === tab ? "#fff" : undefined }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeSubTab === "settings" && (
        <div className="p-6 rounded-2xl shadow" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
          <h2 className="text-2xl font-bold mb-6">About Page Settings</h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-6 w-full">
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Story Section</h3>
              <div>
                <label className="block text-sm font-semibold mb-1">Story Title</label>
                <input name="storyTitle" defaultValue={settings?.storyTitle || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Story Text</label>
                <textarea name="storyText" defaultValue={settings?.storyText || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} rows={4} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Hero Image</label>
                {settings?.heroImageUrl && (
                  <div className="mb-2">
                    <img src={settings.heroImageUrl} alt="Hero" className="h-32 object-cover rounded shadow" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
                  className="w-full p-2 rounded border focus:ring-2 outline-none transition-all"
                  style={{ borderColor: "var(--cream-white-border)" }}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Mission Section</h3>
              <div>
                <label className="block text-sm font-semibold mb-1">Mission Title</label>
                <input name="missionTitle" defaultValue={settings?.missionTitle || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Mission Text</label>
                <textarea name="missionText" defaultValue={settings?.missionText || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} rows={3} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2">Vision Section</h3>
              <div>
                <label className="block text-sm font-semibold mb-1">Vision Title</label>
                <input name="visionTitle" defaultValue={settings?.visionTitle || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Vision Text</label>
                <textarea name="visionText" defaultValue={settings?.visionText || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} rows={3} />
              </div>
            </div>

            <button type="submit" disabled={settingsLoading} className="btn-peacock mt-4 w-full sm:w-auto">
              {settingsLoading ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>
      )}

      {activeSubTab === "gallery" && (
        <div>
          {!isAddingGallery ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">About Gallery ({gallery.length})</h2>
                <button onClick={() => setIsAddingGallery(true)} className="btn-peacock">Add Image</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((p) => (
                  <div key={p.id} className="relative group rounded-xl overflow-hidden shadow border border-gray-200">
                    <img src={p.imageUrl} alt={p.caption || ""} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => handleDeleteGallery(p.id)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 rounded-2xl shadow w-full" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add Gallery Image</h2>
                <button onClick={() => setIsAddingGallery(false)} className="text-gray-500 hover:text-black">Cancel</button>
              </div>
              <form onSubmit={handleGallerySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Caption (Optional)</label>
                  <input name="caption" className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Sort Order</label>
                  <input name="sortOrder" type="number" defaultValue="0" className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setGalleryFile(e.target.files?.[0] || null)} required className="w-full p-2 rounded border" style={{ borderColor: "var(--cream-white-border)" }} />
                </div>
                <button type="submit" disabled={galleryLoading} className="btn-peacock mt-4 w-full sm:w-auto">
                  {galleryLoading ? "Uploading..." : "Upload Image"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "partners" && (
        <div>
          {!isAddingPartner && !editPartner ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Supporting Partners ({partners.length})</h2>
                <button onClick={() => setIsAddingPartner(true)} className="btn-peacock">Add Partner</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl shadow flex flex-col" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
                    <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="object-cover w-full h-full" /> : <span className="text-gray-400">No Image</span>}
                    </div>
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <p className="text-sm font-medium text-amber-600 mb-2">{p.role}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{p.bio}</p>
                    <div className="mt-auto pt-4 flex gap-2">
                      <button onClick={() => setEditPartner(p)} className="flex-1 btn-peacock-outline !text-sm !py-1.5">Edit</button>
                      <button onClick={() => handleDeletePartner(p.id)} className="flex-1 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors !text-sm !py-1.5">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 rounded-2xl shadow w-full" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{editPartner ? "Edit Partner" : "Add Partner"}</h2>
                <button onClick={() => { setIsAddingPartner(false); setEditPartner(null); }} className="text-gray-500 hover:text-black">Cancel</button>
              </div>
              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Name</label>
                  <input name="name" defaultValue={editPartner?.name || ""} required className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Role</label>
                    <input name="role" defaultValue={editPartner?.role || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sort Order</label>
                    <input name="sortOrder" type="number" defaultValue={editPartner?.sortOrder || 0} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Bio</label>
                  <textarea name="bio" defaultValue={editPartner?.bio || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setPartnerFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border" style={{ borderColor: "var(--cream-white-border)" }} />
                  {editPartner?.imageUrl && <p className="mt-2 text-sm text-green-600">Current image will be kept if you don&apos;t upload a new one.</p>}
                </div>
                <button type="submit" disabled={partnersLoading} className="btn-peacock mt-4 w-full sm:w-auto">
                  {partnersLoading ? "Saving..." : "Save Partner"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
