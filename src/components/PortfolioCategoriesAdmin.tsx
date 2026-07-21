"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, MoveUp, MoveDown } from "lucide-react";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
  type: string;
  sortOrder: number;
}

export default function PortfolioCategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "main",
    sortOrder: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/portfolio-categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/api/portfolio-categories/${editingId}`
        : "/api/portfolio-categories";
      
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save category");
      
      toast.success(editingId ? "Category updated" : "Category added");
      resetForm();
      fetchCategories();
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/portfolio-categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      toast.success("Category deleted");
      fetchCategories();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete category");
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      type: cat.type,
      sortOrder: cat.sortOrder,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", type: "main", sortOrder: 0 });
  };

  const mainCategories = categories.filter(c => c.type === "main").sort((a,b) => a.sortOrder - b.sortOrder);
  const subCategories = categories.filter(c => c.type === "sub").sort((a,b) => a.sortOrder - b.sortOrder);

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-black text-[#0f52ba]">Portfolio Categories</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 border border-gray-200 rounded-xl p-5 bg-gray-50">
          <h3 className="font-bold mb-4">{editingId ? "Edit Category" : "Add New Category"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:border-[#0f52ba] focus:ring-1 focus:ring-[#0f52ba] outline-none"
                placeholder="e.g. Epoxy Table"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:border-[#0f52ba] outline-none"
              >
                <option value="main">Main Category (Below Title)</option>
                <option value="sub">Sub Category (Top Tabs)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                className="w-full p-2 border border-gray-300 rounded focus:border-[#0f52ba] outline-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-[#0f52ba] text-white px-4 py-2 rounded font-bold hover:bg-[#0c4296] transition-colors"
              >
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-bold hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 block"></span>
              Sub Categories (Top Level Tabs)
            </h3>
            {subCategories.length === 0 ? (
              <p className="text-gray-400 text-sm">No sub categories found.</p>
            ) : (
              <div className="grid gap-2">
                {subCategories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded font-mono">{cat.sortOrder}</span>
                      <span className="font-semibold text-gray-800">{cat.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0f52ba] block"></span>
              Main Categories (Pill Buttons)
            </h3>
            {mainCategories.length === 0 ? (
              <p className="text-gray-400 text-sm">No main categories found.</p>
            ) : (
              <div className="grid gap-2">
                {mainCategories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded font-mono">{cat.sortOrder}</span>
                      <span className="font-semibold text-gray-800">{cat.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
