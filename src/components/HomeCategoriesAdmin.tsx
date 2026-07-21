"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Save, GripVertical, Eye, EyeOff } from "lucide-react";

interface HomeCategory {
  id: number;
  label: string;
  description: string | null;
  imageUrl: string | null;
  storeQuery: string | null;
  sortOrder: number;
  active: boolean;
}

export default function HomeCategoriesAdmin() {
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editItem, setEditItem] = useState<HomeCategory | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    label: "",
    description: "",
    storeQuery: "/shop",
    sortOrder: "0",
    active: "true",
  });

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/home-categories?active=all");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch { toast.error("Failed to load categories"); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setForm({ label: "", description: "", storeQuery: "/shop", sortOrder: String(categories.length + 1), active: "true" });
    setImageFile(null);
    setEditItem(null);
    setIsAdding(true);
  };

  const openEdit = (cat: HomeCategory) => {
    setForm({
      label: cat.label,
      description: cat.description || "",
      storeQuery: cat.storeQuery || "/shop",
      sortOrder: String(cat.sortOrder),
      active: cat.active ? "true" : "false",
    });
    setImageFile(null);
    setEditItem(cat);
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    fd.append("label", form.label);
    fd.append("description", form.description);
    fd.append("storeQuery", form.storeQuery);
    fd.append("sortOrder", form.sortOrder);
    fd.append("active", form.active);
    if (imageFile) fd.append("image", imageFile);

    try {
      const url = editItem ? `/api/home-categories/${editItem.id}` : "/api/home-categories";
      const method = editItem ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(editItem ? "Category updated!" : "Category created!");
      setIsAdding(false);
      fetchCategories();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/home-categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Deleted!");
      fetchCategories();
    } catch (e: any) { toast.error(e.message); }
  };

  const toggleActive = async (cat: HomeCategory) => {
    const fd = new FormData();
    fd.append("label", cat.label);
    fd.append("description", cat.description || "");
    fd.append("storeQuery", cat.storeQuery || "/shop");
    fd.append("sortOrder", String(cat.sortOrder));
    fd.append("active", cat.active ? "false" : "true");
    try {
      await fetch(`/api/home-categories/${cat.id}`, { method: "PUT", body: fd });
      fetchCategories();
    } catch { toast.error("Failed to toggle"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Featured Categories</h2>
          <p className="text-sm text-gray-500 mt-1">Manage the homepage category cards</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, rgb(15,82,186), #008080)" }}
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Add / Edit Form */}
      {isAdding && (
        <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">{editItem ? "Edit Category" : "New Category"}</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Label *</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={e => setForm({ ...form, label: e.target.value })}
                  required
                  placeholder="e.g. Epoxy Tables"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Store Link</label>
                <input
                  type="text"
                  value={form.storeQuery}
                  onChange={e => setForm({ ...form, storeQuery: e.target.value })}
                  placeholder="/shop?category=river-table"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={2}
                placeholder="Short description shown on the card"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {editItem?.imageUrl && !imageFile && (
                  <img src={editItem.imageUrl} alt="" className="mt-2 h-16 rounded-lg object-cover" />
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={e => setForm({ ...form, sortOrder: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                <select
                  value={form.active}
                  onChange={e => setForm({ ...form, active: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="true">Active</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, rgb(15,82,186), #008080)" }}
              >
                <Save className="w-4 h-4" />
                {submitting ? "Saving..." : editItem ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No categories yet. Add your first one!</div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
            >
              <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
              {cat.imageUrl ? (
                <img src={cat.imageUrl} alt={cat.label} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-teal-100 flex-shrink-0 flex items-center justify-center text-2xl">
                  🖼️
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900">{cat.label}</h4>
                <p className="text-xs text-gray-400 truncate">{cat.description || "No description"}</p>
                <p className="text-xs text-blue-500 mt-0.5">{cat.storeQuery}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${cat.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {cat.active ? "Active" : "Hidden"}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleActive(cat)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" title={cat.active ? "Hide" : "Show"}>
                  {cat.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => openEdit(cat)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
