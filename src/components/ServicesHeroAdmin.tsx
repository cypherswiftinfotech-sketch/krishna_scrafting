"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Trash2, Upload, ImageIcon, Plus, Save } from "lucide-react";

interface HeroImage {
  id: number;
  mediaUrl: string;
  mediaPublicId: string | null;
  title: string | null;
  createdAt: string;
  orderIndex: number;
}

export default function ServicesHeroAdmin() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);


  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services-hero");
      const data = await res.json();
      setImages(data.images || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };


  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (images.length + files.length > 3) {
      toast.error("You can only have up to 3 images for the Services Hero.");
      return;
    }
    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("media", file);
        formData.append("title", "New Image");
        const res = await fetch("/api/services-hero", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        successCount++;
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    if (successCount > 0) {
      toast.success(`${successCount} image(s) uploaded!`);
      fetchImages();
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this hero image?")) return;
    try {
      const res = await fetch(`/api/services-hero?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Image deleted");
      fetchImages();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  const handleSaveTitle = async (id: number) => {
    try {
      const res = await fetch("/api/services-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editTitle })
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Title updated");
      setEditingId(null);
      fetchImages();
    } catch (e: any) {
      toast.error(e.message || "Error updating title");
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow bg-white" style={{ border: "1px solid var(--cream-white-border)" }}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Services Hero Slider</h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload exactly 3 images to create the masonry layout on the Services page. You can add a title label to each image.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || images.length >= 3}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60 whitespace-nowrap ml-4"
          style={{ background: "var(--blue-gradient)" }}
        >
          <Plus className="w-4 h-4" />
          {uploading ? "Uploading..." : "Add Images"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`py-16 text-center border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <ImageIcon className={`w-12 h-12 mx-auto mb-3 transition-colors ${isDragging ? "text-blue-500" : "text-gray-300"}`} />
          <p className="text-gray-500 font-medium">Click or drag & drop images here</p>
          <p className="text-sm text-gray-400 mt-1">Upload exactly 3 images for the masonry layout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div key={img.id} className="flex flex-col gap-3">
              <div
                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border shadow-sm transition-all hover:shadow-md"
                style={{ borderColor: "var(--cream-white-border)" }}
              >
                <Image src={img.mediaUrl} alt={img.title || `Image ${idx + 1}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {img.title && (
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-lg font-medium shadow-md backdrop-blur-sm">
                    {img.title}
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {idx === 0 ? "Left (Tall)" : idx === 1 ? "Right Top" : "Right Bottom"}
                </div>
              </div>
              
              {/* Title Editor */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                {editingId === img.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="e.g. River tables"
                    />
                    <button
                      onClick={() => handleSaveTitle(img.id)}
                      className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 truncate mr-2">
                      {img.title || "No Label"}
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(img.id);
                        setEditTitle(img.title || "");
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                    >
                      Edit Label
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
