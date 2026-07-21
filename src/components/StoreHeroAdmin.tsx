"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Trash2, Upload, ImageIcon, Plus, GripVertical } from "lucide-react";

interface StoreHeroImage {
  id: number;
  mediaUrl: string;
  mediaPublicId: string | null;
  createdAt: string;
  orderIndex: number;
}

export default function StoreHeroAdmin() {
  const [images, setImages] = useState<StoreHeroImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/shop-hero");
      const data = await res.json();
      setImages(data.images || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let successCount = 0;
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append("media", file);
        const res = await fetch("/api/shop-hero", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload failed");
        successCount++;
      } catch (e: any) {
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
      const res = await fetch(`/api/shop-hero?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Image deleted");
      fetchImages();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  return (
    <div className="p-6 rounded-2xl shadow bg-white" style={{ border: "1px solid var(--cream-white-border)" }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Hero Slider</h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload images that will auto-scroll continuously on the Store page hero section.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-60"
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

      {/* Upload Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative mb-6 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50"
        style={{ borderColor: "var(--cream-white-border)" }}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => {
          e.preventDefault();
          handleUpload(e.dataTransfer.files);
        }}
      >
        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-gray-500 font-medium">
          {uploading ? "Uploading images..." : "Click or drag & drop images here"}
        </p>
        <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WebP. Upload multiple at once.</p>
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-video rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="py-16 text-center">
          <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No hero images yet.</p>
          <p className="text-sm text-gray-300 mt-1">Upload images to display them in the store hero slider.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100 border shadow-sm transition-all hover:shadow-md"
              style={{ borderColor: "var(--cream-white-border)" }}
            >
              <Image
                src={img.mediaUrl}
                alt={`Hero image ${idx + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                  title="Delete image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-sm text-gray-400 mt-4 text-center">
          {images.length} image{images.length !== 1 ? "s" : ""} — hover over an image to delete it.
          These images will auto-scroll on the Store page.
        </p>
      )}
    </div>
  );
}
