"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Star, Video, Image as ImageIcon, Columns } from "lucide-react";

interface Story {
  id: number;
  type: string;
  mediaUrl: string | null;
  secondaryMediaUrl: string | null;
  title: string | null;
  description: string | null;
  sortOrder: number;
}

export default function SuccessStoriesAdmin() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const [type, setType] = useState("review");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [secondaryMediaFile, setSecondaryMediaFile] = useState<File | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/student-success-stories");
      const data = await res.json();
      setStories(data.stories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("type", type);
    if (mediaFile) formData.append("media", mediaFile);
    if (secondaryMediaFile) formData.append("secondaryMedia", secondaryMediaFile);

    try {
      const res = await fetch("/api/student-success-stories", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add story");
      
      toast.success("Story added successfully!");
      setIsAdding(false);
      setMediaFile(null);
      setSecondaryMediaFile(null);
      fetchStories();
    } catch (err: any) {
      toast.error(err.message || "Error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this story?")) return;
    try {
      const res = await fetch(`/api/student-success-stories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete story");
      toast.success("Story deleted");
      fetchStories();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Student Success Stories</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); }} 
          className="btn-peacock"
        >
          {isAdding ? "Cancel" : "Add New Story"}
        </button>
      </div>

      {isAdding && (
        <div className="p-6 rounded-2xl shadow mb-8 bg-white border" style={{ borderColor: "var(--cream-white-border)" }}>
          <h3 className="text-xl font-bold mb-4">Add Success Story</h3>
          
          <div className="flex gap-4 mb-6">
            {["review", "video", "gallery", "before_after"].map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 transition-colors ${type === t ? "bg-gradient-to-r from-[#0f52ba] to-[#008080] text-white border-transparent bg-clip-border bg-gradient-to-r from-[#0f52ba] to-[#008080]" : "bg-gray-50 hover:bg-gray-100"}`}
              >
                {t === "review" && <Star className="w-4 h-4" />}
                {t === "video" && <Video className="w-4 h-4" />}
                {t === "gallery" && <ImageIcon className="w-4 h-4" />}
                {t === "before_after" && <Columns className="w-4 h-4" />}
                {t.replace("_", " ").toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                {type === "review" ? "Student Name" : "Title (Optional)"}
              </label>
              <input name="title" className="w-full p-2 border rounded" required={type === "review"} />
            </div>

            {(type === "review" || type === "gallery" || type === "before_after") && (
              <div>
                <label className="block text-sm font-semibold mb-1">
                  {type === "review" ? "Review Content" : "Description (Optional)"}
                </label>
                <textarea name="description" rows={3} className="w-full p-2 border rounded" required={type === "review"} />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-1">
                {type === "video" ? "Video Upload" : type === "before_after" ? "Before Image" : "Main Media Upload"}
              </label>
              <input type="file" accept={type === "video" ? "video/*" : "image/*"} required={type !== "review"} onChange={(e) => setMediaFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded bg-white" />
            </div>

            {type === "before_after" && (
              <div>
                <label className="block text-sm font-semibold mb-1">After Image</label>
                <input type="file" accept="image/*" required onChange={(e) => setSecondaryMediaFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded bg-white" />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-1">Sort Order</label>
              <input name="sortOrder" type="number" defaultValue={0} className="w-full p-2 border rounded" />
            </div>

            <button type="submit" disabled={submitLoading} className="btn-peacock mt-4">
              {submitLoading ? "Saving..." : "Save Story"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading stories...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map(story => (
            <div key={story.id} className="bg-white border rounded-2xl p-5 flex flex-col hover:shadow-lg transition-all" style={{ borderColor: "var(--cream-white-border)" }}>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                {story.type === "review" && <Star className="w-3 h-3" />}
                {story.type === "video" && <Video className="w-3 h-3" />}
                {story.type === "gallery" && <ImageIcon className="w-3 h-3" />}
                {story.type === "before_after" && <Columns className="w-3 h-3" />}
                {story.type.replace("_", " ")}
              </span>

              {story.type === "before_after" ? (
                <div className="flex gap-2 mb-4 h-32">
                  <img src={story.mediaUrl!} alt="Before" className="w-1/2 h-full object-cover rounded-xl" />
                  <img src={story.secondaryMediaUrl!} alt="After" className="w-1/2 h-full object-cover rounded-xl" />
                </div>
              ) : story.type === "video" ? (
                <video src={story.mediaUrl!} className="w-full h-40 object-cover rounded-xl mb-4" controls />
              ) : story.mediaUrl ? (
                <img src={story.mediaUrl} alt={story.title || ""} className="w-full h-40 object-cover rounded-xl mb-4" />
              ) : null}

              {story.title && <h3 className="font-bold text-lg mb-2 line-clamp-1">{story.title}</h3>}
              {story.description && <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">"{story.description}"</p>}
              
              <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                <button onClick={() => handleDelete(story.id)} className="w-full bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors !py-2 !text-sm">Delete Story</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
