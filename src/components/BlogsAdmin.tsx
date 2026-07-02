"use client";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
}

const CATEGORIES = [
  "How to start epoxy business",
  "Flooring maintenance",
  "Resin safety",
  "Design inspiration"
];

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
    } catch (error) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const toastId = toast.loading("Saving blog...");

    try {
      const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to save blog");
      }

      toast.success(editingId ? "Blog updated!" : "Blog created!", { id: toastId });
      setIsFormOpen(false);
      setEditingId(null);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const openNewForm = () => {
    setEditingId(null);
    setIsFormOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-teal-500">Manage Blogs</h2>
        <button
          onClick={openNewForm}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" /> Add Blog
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-10 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden p-6 relative">
          <button
            onClick={() => setIsFormOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold mb-6">{editingId ? "Edit Blog" : "Create New Blog"}</h3>
          
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input name="title" required className="w-full p-3 border rounded-xl" placeholder="Blog title" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select name="category" required className="w-full p-3 border rounded-xl">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Content</label>
              <textarea name="content" required rows={10} className="w-full p-3 border rounded-xl font-mono text-sm" placeholder="Write your blog content here. You can use multiple paragraphs..." />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Cover Image</label>
              <input type="file" name="image" accept="image/*" className="w-full p-2 border rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            </div>

            <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9d3cff] to-[#7b2cbf] text-white font-bold rounded-xl hover:opacity-90 transition-opacity w-full sm:w-auto justify-center">
              <Save className="w-5 h-5" /> {editingId ? "Update Blog" : "Publish Blog"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col group">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {blog.imageUrl ? (
                  <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {blog.category}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">{blog.content}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  {/* Delete button can be added here if needed */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
