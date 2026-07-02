"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface ProductCategory {
  id: number;
  mainCategory: string;
  subCategory: string;
}

interface CategoriesAdminProps {
  type: "products" | "services";
}

export default function CategoriesAdmin({ type }: CategoriesAdminProps) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [mainCategory, setMainCategory] = useState("Home Products");
  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const endpoint = type === "products" ? "/api/product-categories" : "/api/service-categories";
      const res = await fetch(endpoint);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCategory.trim()) return;
    
    setLoading(true);
    try {
      const endpoint = type === "products" ? "/api/product-categories" : "/api/service-categories";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mainCategory, subCategory }),
      });
      if (!res.ok) throw new Error("Failed to add category");
      toast.success("Category added!");
      setSubCategory("");
      setIsAdding(false);
      fetchCategories();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const endpoint = type === "products" ? `/api/product-categories/${id}` : `/api/service-categories/${id}`;
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      toast.success("Category deleted");
      fetchCategories();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  const groupedCategories = categories.reduce((acc, cat) => {
    if (!acc[cat.mainCategory]) acc[cat.mainCategory] = [];
    acc[cat.mainCategory].push(cat);
    return acc;
  }, {} as Record<string, ProductCategory[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage {type === "products" ? "Product" : "Service"} Categories</h2>
        <button onClick={() => setIsAdding(!isAdding)} className="btn-peacock">
          {isAdding ? "Cancel" : "Add Sub Category"}
        </button>
      </div>

      {isAdding && (
        <div className="p-6 rounded-2xl shadow mb-8" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Main Category</label>
                <select 
                  value={mainCategory} 
                  onChange={(e) => setMainCategory(e.target.value)}
                  className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" 
                  style={{ borderColor: "var(--cream-white-border)" }}
                >
                  {type === "products" ? (
                    <>
                      <option value="Home Products">Home Products</option>
                      <option value="Commercial Products">Commercial Products</option>
                    </>
                  ) : (
                    <>
                      <option value="HOME">HOME</option>
                      <option value="COMMERCIALS">COMMERCIALS</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Sub Category Name</label>
                <input 
                  value={subCategory} 
                  onChange={(e) => setSubCategory(e.target.value)} 
                  required 
                  placeholder="e.g. Tables"
                  className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" 
                  style={{ borderColor: "var(--cream-white-border)" }} 
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-peacock mt-4">
              {loading ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {Object.entries(groupedCategories).map(([mainCat, subCats]) => (
          <div key={mainCat} className="p-6 rounded-2xl shadow" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
            <h3 className="text-xl font-black mb-4 text-gray-900 border-b pb-2">{mainCat}</h3>
            {subCats.length === 0 ? (
              <p className="text-gray-500 text-sm">No subcategories yet.</p>
            ) : (
              <ul className="space-y-2">
                {subCats.map(cat => (
                  <li key={cat.id} className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <span className="font-medium text-gray-800">{cat.subCategory}</span>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
