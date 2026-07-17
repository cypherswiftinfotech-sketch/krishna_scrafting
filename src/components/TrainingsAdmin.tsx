"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { DEFAULT_DETAILS } from "@/lib/trainingDefaults";
import SuccessStoriesAdmin from "@/components/SuccessStoriesAdmin";

interface Training {
  id: number;
  title: string;
  category: string;
  description: string | null;
  duration: string | null;
  price: string;
  language: string | null;
  seats: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  learnings: string | null;
  fullDetails: string | null;
}

const CATEGORIES = [
  "Beginner Training",
  "Advanced Resin Course",
  "Business Masterclass",
  "Online Course",
  "Offline Workshop",
  "Certification"
];

export default function TrainingsAdmin() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editTraining, setEditTraining] = useState<Training | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [youtubeThumbnailFile, setYoutubeThumbnailFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const [activeSubTab, setActiveSubTab] = useState<"courses" | "banner" | "success_stories">("courses");

  // Banner State
  const [trainingBannerSettings, setTrainingBannerSettings] = useState<any>(null);
  const [trainingBannerLoading, setTrainingBannerLoading] = useState(false);

  useEffect(() => {
    fetchTrainings();
    fetchTrainingBanner();
  }, []);

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/trainings");
      const data = await res.json();
      setTrainings(data.trainings || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrainingBanner = async () => {
    try {
      const res = await fetch("/api/training-banner");
      const data = await res.json();
      setTrainingBannerSettings(data.settings);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTrainingBannerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrainingBannerLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/training-banner", { method: "PUT", body: formData });
      if (!res.ok) throw new Error("Failed to update training banner settings");
      toast.success("Training Banner updated!");
      fetchTrainingBanner();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setTrainingBannerLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData(e.currentTarget);
    if (file) formData.append("image", file);
    if (youtubeThumbnailFile) formData.append("youtubeThumbnail", youtubeThumbnailFile);
    formData.append("videoUrlString", videoUrl);

    const url = editTraining ? `/api/trainings/${editTraining.id}` : "/api/trainings";
    const method = editTraining ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save training");
      
      toast.success(editTraining ? "Training updated" : "Training added");
      setEditTraining(null);
      setIsAdding(false);
      setFile(null);
      setVideoUrl("");
      fetchTrainings();
    } catch (err: any) {
      toast.error(err.message || "Error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this training?")) return;
    try {
      const res = await fetch(`/api/trainings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete training");
      toast.success("Training deleted");
      fetchTrainings();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        {(["courses", "banner", "success_stories"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2 font-semibold text-sm transition-colors capitalize rounded-xl ${
              activeSubTab === tab ? "bg-peacock-blue text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ backgroundColor: activeSubTab === tab ? "var(--peacock-blue)" : undefined, color: activeSubTab === tab ? "#fff" : undefined }}
          >
            {tab === "success_stories" ? "Success Stories" : tab === "banner" ? "Hero Banner" : tab}
          </button>
        ))}
      </div>

      {activeSubTab === "courses" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Manage Trainings</h2>
            <button 
              onClick={() => { setIsAdding(!isAdding); setEditTraining(null); }} 
              className="btn-peacock"
            >
              {isAdding ? "Cancel" : "Add New Training"}
            </button>
          </div>

          {(isAdding || editTraining) && (
            <div className="p-6 rounded-2xl shadow mb-8 bg-white border" style={{ borderColor: "var(--cream-white-border)" }}>
              <h3 className="text-xl font-bold mb-4">{editTraining ? "Edit Training" : "Add Training"}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title</label>
                    <input name="title" defaultValue={editTraining?.title || ""} required className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Category</label>
                    <select name="category" defaultValue={editTraining?.category || CATEGORIES[0]} className="w-full p-2 border rounded">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea name="description" defaultValue={editTraining?.description || ""} rows={3} className="w-full p-2 border rounded" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    What You&apos;ll Learn
                    <span className="text-gray-400 font-normal text-xs ml-2">(one bullet per line — each line becomes a ✓ item)</span>
                  </label>
                  <textarea 
                    name="learnings" 
                    defaultValue={editTraining?.learnings || ""} 
                    rows={5}
                    placeholder={`Master the fundamentals of resin art\nHands-on real-world projects\nBusiness strategies for scaling\nReceive an official certificate`}
                    className="w-full p-2 border rounded font-mono text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Advanced Page Details (JSON)
                    <span className="text-gray-400 font-normal text-xs ml-2">(Optional: Override the 18 dynamic sections with custom JSON. Leave blank to use defaults.)</span>
                  </label>
                  <textarea 
                    name="fullDetails" 
                    defaultValue={editTraining?.fullDetails || JSON.stringify(DEFAULT_DETAILS, null, 2)} 
                    rows={8}
                    className="w-full p-2 border rounded font-mono text-xs bg-gray-50" 
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Price (₹ or Custom)</label>
                    <input name="price" type="text" defaultValue={editTraining?.price || "Custom Price"} required className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Duration</label>
                    <input name="duration" placeholder="e.g. 2 Weeks" defaultValue={editTraining?.duration || ""} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Language</label>
                    <input name="language" defaultValue={editTraining?.language || "English"} className="w-full p-2 border rounded" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Seats</label>
                    <input name="seats" type="number" defaultValue={editTraining?.seats || 10} className="w-full p-2 border rounded" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">Cover Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded" />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">YouTube Video Link <span className="text-gray-400 font-normal text-xs">(for the preview card)</span></label>
                  <input 
                    type="url" 
                    placeholder="https://www.youtube.com/watch?v=..."
                    defaultValue={editTraining?.videoUrl || ""}
                    onChange={(e) => setVideoUrl(e.target.value)} 
                    className="w-full p-2 border rounded" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">YouTube Video Thumbnail (Image) <span className="text-gray-400 font-normal text-xs">(Optional cover for video)</span></label>
                  <input type="file" accept="image/*" onChange={(e) => setYoutubeThumbnailFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded" />
                </div>

                <button type="submit" disabled={submitLoading} className="btn-peacock mt-4">
                  {submitLoading ? "Saving..." : "Save Training"}
                </button>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-gray-500">Loading trainings...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainings.map(training => (
                <div key={training.id} className="bg-white border rounded-2xl p-5 flex flex-col hover:shadow-lg transition-all" style={{ borderColor: "var(--cream-white-border)" }}>
                  {training.imageUrl ? (
                    <img src={training.imageUrl} alt={training.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">No Image</div>
                  )}
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">{training.category}</span>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{training.title}</h3>
                  <p className="font-black text-gray-900 mb-4">₹{Number(training.price).toLocaleString("en-IN")}</p>
                  
                  <div className="mt-auto flex gap-2">
                    <button onClick={() => { setEditTraining(training); setVideoUrl(training.videoUrl || ""); setIsAdding(false); window.scrollTo(0,0); }} className="flex-1 btn-peacock-outline !py-1.5 !text-sm">Edit</button>
                    <button onClick={() => handleDelete(training.id)} className="flex-1 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors !py-1.5 !text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "banner" && (
        <div className="p-6 rounded-2xl shadow max-w-2xl" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Trainings Page Hero Banner</h2>
            <p className="text-gray-500 text-sm">Update the background image/video and the WhatsApp contact number for the Trainings page.</p>
          </div>
          <form onSubmit={handleTrainingBannerSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1">WhatsApp Contact Number</label>
              <input name="whatsappNumber" defaultValue={trainingBannerSettings?.whatsappNumber || "918319668016"} required className="w-full p-3 rounded-xl border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
              <p className="text-xs text-gray-500 mt-1">Include country code (e.g. 91 for India) without the + sign.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">YouTube Video Preview Link <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
              <input name="youtubeVideoUrl" type="url" placeholder="https://www.youtube.com/watch?v=..." defaultValue={trainingBannerSettings?.youtubeVideoUrl || ""} className="w-full p-3 rounded-xl border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
              <p className="text-xs text-gray-500 mt-1">This video will be displayed at the bottom right of the Trainings hero section.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">YouTube Video Thumbnail Background (Image)</label>
              <input type="file" name="youtubeVideoBackground" accept="image/*" className="w-full p-3 rounded-xl border bg-white focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
              {trainingBannerSettings?.youtubeVideoBackgroundUrl && <p className="mt-2 text-sm text-green-600 font-medium">✓ Current thumbnail is active.</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Background Media (Image or Video)</label>
              <input type="file" name="media" accept="image/*,video/mp4,video/webm" className="w-full p-3 rounded-xl border bg-white focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
              {trainingBannerSettings?.mediaUrl && <p className="mt-2 text-sm text-green-600 font-medium">✓ Current media is active.</p>}
            </div>
            
            {/* Hidden fields to preserve schema requirements if needed by backend */}
            <input type="hidden" name="headline" defaultValue={trainingBannerSettings?.headline} />
            <input type="hidden" name="subheadline" defaultValue={trainingBannerSettings?.subheadline} />
            <input type="hidden" name="ctaText" defaultValue={trainingBannerSettings?.ctaText} />
            <input type="hidden" name="ctaLink" defaultValue={trainingBannerSettings?.ctaLink} />

            <button type="submit" disabled={trainingBannerLoading} className="btn-peacock mt-2 w-full sm:w-auto py-3 px-6 text-sm font-bold shadow-md">
              {trainingBannerLoading ? "Saving Changes..." : "Save Banner Settings"}
            </button>
          </form>
        </div>
      )}

      {activeSubTab === "success_stories" && (
        <SuccessStoriesAdmin />
      )}
    </div>
  );
}
