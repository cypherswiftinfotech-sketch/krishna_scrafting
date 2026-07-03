"use client";
import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Plus, Trash2, Pencil, Check, X, ChevronDown, ChevronRight,
  GripVertical, FolderOpen, Tag,
} from "lucide-react";

interface Category {
  id: number;
  mainCategory: string;
  subCategory: string;
  mainSortOrder: number;
  subSortOrder: number;
}

interface GroupedMain {
  name: string;
  sortOrder: number;
  subs: Category[];
}

interface CategoriesAdminProps {
  type: "products" | "services";
}

const inputCls =
  "w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all";
const inputStyle = { borderColor: "var(--cream-white-border)" };

export default function CategoriesAdmin({ type }: CategoriesAdminProps) {
  const endpoint = type === "products" ? "/api/product-categories" : "/api/service-categories";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedMains, setExpandedMains] = useState<Set<string>>(new Set());

  /* ── Add/Edit state for Main Category ── */
  const [showAddMain, setShowAddMain] = useState(false);
  const [newMainName, setNewMainName] = useState("");
  const [newMainSort, setNewMainSort] = useState(0);
  const [editingMain, setEditingMain] = useState<string | null>(null);
  const [editMainName, setEditMainName] = useState("");
  const [editMainSort, setEditMainSort] = useState(0);

  /* ── Add/Edit state for Sub Category ── */
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");
  const [newSubSort, setNewSubSort] = useState(0);
  const [editingSub, setEditingSub] = useState<Category | null>(null);
  const [editSubName, setEditSubName] = useState("");
  const [editSubSort, setEditSubSort] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      console.error("Failed to fetch categories");
    }
  }, [endpoint]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  /* ── Derive grouped structure ── */
  const grouped: GroupedMain[] = (() => {
    const map: Record<string, GroupedMain> = {};
    for (const cat of categories) {
      if (!map[cat.mainCategory]) {
        map[cat.mainCategory] = { name: cat.mainCategory, sortOrder: cat.mainSortOrder, subs: [] };
      }
      map[cat.mainCategory].subs.push(cat);
    }
    return Object.values(map).sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  })();

  const mainNames = grouped.map(g => g.name);

  /* ────────────────────────────────────
     MAIN CATEGORY OPERATIONS
  ──────────────────────────────────── */

  const handleAddMain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMainName.trim()) return;
    // A main category is created by adding a placeholder sub (we'll let user add subs after)
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainCategory: newMainName.trim(),
          subCategory: "__placeholder__",
          mainSortOrder: newMainSort,
          subSortOrder: 0,
        }),
      });
      if (!res.ok) throw new Error("Failed to create main category");
      toast.success(`Main category "${newMainName.trim()}" created!`);
      setNewMainName("");
      setNewMainSort(0);
      setShowAddMain(false);
      setExpandedMains(prev => new Set(prev).add(newMainName.trim()));
      fetchCategories();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditMain = async (oldName: string) => {
    if (!editMainName.trim()) return;
    setLoading(true);
    try {
      // Update ALL rows that belong to this main category
      const rowsToUpdate = categories.filter(c => c.mainCategory === oldName);
      await Promise.all(
        rowsToUpdate.map(cat =>
          fetch(`${endpoint}/${cat.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mainCategory: editMainName.trim(), mainSortOrder: editMainSort }),
          })
        )
      );
      toast.success("Main category updated!");
      setEditingMain(null);
      fetchCategories();
    } catch {
      toast.error("Failed to update main category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMain = async (mainName: string) => {
    if (!confirm(`Delete main category "${mainName}" and ALL its sub-categories?`)) return;
    setLoading(true);
    try {
      const rowsToDelete = categories.filter(c => c.mainCategory === mainName);
      await Promise.all(
        rowsToDelete.map(cat =>
          fetch(`${endpoint}/${cat.id}`, { method: "DELETE" })
        )
      );
      toast.success("Main category deleted!");
      fetchCategories();
    } catch {
      toast.error("Failed to delete main category");
    } finally {
      setLoading(false);
    }
  };

  /* ────────────────────────────────────
     SUB CATEGORY OPERATIONS
  ──────────────────────────────────── */

  const handleAddSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !addingSubFor) return;
    setLoading(true);
    try {
      // Determine mainSortOrder from existing rows for this main
      const existingMain = categories.find(c => c.mainCategory === addingSubFor);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainCategory: addingSubFor,
          subCategory: newSubName.trim(),
          mainSortOrder: existingMain?.mainSortOrder ?? 0,
          subSortOrder: newSubSort,
        }),
      });
      if (!res.ok) throw new Error("Failed to add sub-category");
      toast.success("Sub-category added!");
      setNewSubName("");
      setNewSubSort(0);
      setAddingSubFor(null);
      fetchCategories();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSub = async (cat: Category) => {
    setLoading(true);
    try {
      const res = await fetch(`${endpoint}/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subCategory: editSubName.trim(), subSortOrder: editSubSort }),
      });
      if (!res.ok) throw new Error("Failed to update sub-category");
      toast.success("Sub-category updated!");
      setEditingSub(null);
      fetchCategories();
    } catch {
      toast.error("Failed to update sub-category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSub = async (cat: Category) => {
    if (!confirm(`Delete sub-category "${cat.subCategory}"?`)) return;
    try {
      await fetch(`${endpoint}/${cat.id}`, { method: "DELETE" });
      toast.success("Sub-category deleted!");
      fetchCategories();
    } catch {
      toast.error("Failed to delete sub-category");
    }
  };

  const toggleExpand = (name: string) => {
    setExpandedMains(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const label = type === "products" ? "Product" : "Service";

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage {label} Categories</h2>
        <button
          onClick={() => { setShowAddMain(!showAddMain); setEditingMain(null); }}
          className="btn-peacock flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showAddMain ? "Cancel" : "Add Main Category"}
        </button>
      </div>

      {/* Add Main Category Form */}
      {showAddMain && (
        <div className="p-5 rounded-2xl shadow mb-6" style={{ backgroundColor: "#fff", border: "1px solid var(--cream-white-border)" }}>
          <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <FolderOpen className="w-4 h-4" style={{ color: "var(--peacock-blue)" }} />
            New Main Category
          </p>
          <form onSubmit={handleAddMain} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold mb-1 text-gray-600">Category Name</label>
              <input
                value={newMainName}
                onChange={e => setNewMainName(e.target.value)}
                placeholder="e.g. Home Products"
                required
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <div className="w-28">
              <label className="block text-xs font-semibold mb-1 text-gray-600">Sort Order</label>
              <input
                type="number"
                value={newMainSort}
                onChange={e => setNewMainSort(Number(e.target.value))}
                className={inputCls}
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-peacock flex items-center gap-1 h-[38px]">
              <Check className="w-4 h-4" /> Create
            </button>
          </form>
        </div>
      )}

      {/* No categories */}
      {grouped.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No categories yet. Add one above.</p>
        </div>
      )}

      {/* Main Category Cards */}
      <div className="space-y-4">
        {grouped.map(group => {
          const isExpanded = expandedMains.has(group.name);
          const isEditingThisMain = editingMain === group.name;
          // Filter out placeholder subs
          const realSubs = group.subs
            .filter(s => s.subCategory !== "__placeholder__")
            .sort((a, b) => a.subSortOrder - b.subSortOrder || a.subCategory.localeCompare(b.subCategory));

          return (
            <div
              key={group.name}
              className="rounded-2xl shadow-sm overflow-hidden"
              style={{ backgroundColor: "#fff", border: "1px solid var(--cream-white-border)" }}
            >
              {/* Main Category Row */}
              <div className="flex items-center gap-3 px-5 py-4" style={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />

                {isEditingThisMain ? (
                  <div className="flex flex-1 flex-wrap gap-2 items-center">
                    <input
                      value={editMainName}
                      onChange={e => setEditMainName(e.target.value)}
                      className={`${inputCls} flex-1 min-w-[160px]`}
                      style={inputStyle}
                      autoFocus
                    />
                    <div className="flex items-center gap-1">
                      <label className="text-xs text-gray-500 whitespace-nowrap">Sort:</label>
                      <input
                        type="number"
                        value={editMainSort}
                        onChange={e => setEditMainSort(Number(e.target.value))}
                        className={`${inputCls} w-20`}
                        style={inputStyle}
                      />
                    </div>
                    <button
                      onClick={() => handleEditMain(group.name)}
                      disabled={loading}
                      className="btn-peacock !py-1.5 !px-3 flex items-center gap-1 text-sm"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={() => setEditingMain(null)}
                      className="p-2 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => toggleExpand(group.name)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {isExpanded
                        ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                      <span className="font-black text-gray-900">{group.name}</span>
                      <span className="ml-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {realSubs.length} sub{realSubs.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">· order: {group.sortOrder}</span>
                    </button>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          setEditingMain(group.name);
                          setEditMainName(group.name);
                          setEditMainSort(group.sortOrder);
                          setShowAddMain(false);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                        title="Edit main category"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMain(group.name)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete main category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Sub Categories (expandable) */}
              {isExpanded && (
                <div className="px-5 pb-4">
                  {/* Sub list */}
                  {realSubs.length === 0 ? (
                    <p className="text-sm text-gray-400 italic py-2">No sub-categories yet.</p>
                  ) : (
                    <ul className="space-y-1.5 mb-3 mt-2">
                      {realSubs.map(sub => {
                        const isEditingThisSub = editingSub?.id === sub.id;
                        return (
                          <li
                            key={sub.id}
                            className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100"
                          >
                            <GripVertical className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                            <Tag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />

                            {isEditingThisSub ? (
                              <div className="flex flex-1 flex-wrap gap-2 items-center">
                                <input
                                  value={editSubName}
                                  onChange={e => setEditSubName(e.target.value)}
                                  className={`${inputCls} flex-1 min-w-[140px] !py-1`}
                                  style={inputStyle}
                                  autoFocus
                                />
                                <div className="flex items-center gap-1">
                                  <label className="text-xs text-gray-500 whitespace-nowrap">Sort:</label>
                                  <input
                                    type="number"
                                    value={editSubSort}
                                    onChange={e => setEditSubSort(Number(e.target.value))}
                                    className={`${inputCls} w-16 !py-1`}
                                    style={inputStyle}
                                  />
                                </div>
                                <button
                                  onClick={() => handleEditSub(sub)}
                                  disabled={loading}
                                  className="btn-peacock !py-1 !px-2.5 flex items-center gap-1 text-xs"
                                >
                                  <Check className="w-3 h-3" /> Save
                                </button>
                                <button
                                  onClick={() => setEditingSub(null)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <span className="flex-1 text-sm font-medium text-gray-800">{sub.subCategory}</span>
                                <span className="text-xs text-gray-400 mr-2">order: {sub.subSortOrder}</span>
                                <button
                                  onClick={() => {
                                    setEditingSub(sub);
                                    setEditSubName(sub.subCategory);
                                    setEditSubSort(sub.subSortOrder);
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded transition-colors"
                                  title="Edit sub-category"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSub(sub)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 rounded transition-colors"
                                  title="Delete sub-category"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* Add Sub Category inline */}
                  {addingSubFor === group.name ? (
                    <form
                      onSubmit={handleAddSub}
                      className="flex flex-wrap gap-2 items-end mt-3 p-3 rounded-xl bg-blue-50 border border-blue-100"
                    >
                      <div className="flex-1 min-w-[160px]">
                        <label className="block text-xs font-semibold mb-1 text-gray-600">Sub Category Name</label>
                        <input
                          value={newSubName}
                          onChange={e => setNewSubName(e.target.value)}
                          placeholder="e.g. Wall Art"
                          required
                          autoFocus
                          className={inputCls}
                          style={inputStyle}
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-semibold mb-1 text-gray-600">Sort Order</label>
                        <input
                          type="number"
                          value={newSubSort}
                          onChange={e => setNewSubSort(Number(e.target.value))}
                          className={inputCls}
                          style={inputStyle}
                        />
                      </div>
                      <button type="submit" disabled={loading} className="btn-peacock !py-2 !px-3 flex items-center gap-1 text-sm h-[38px]">
                        <Check className="w-3.5 h-3.5" /> Add
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingSubFor(null)}
                        className="p-2 text-gray-400 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => {
                        setAddingSubFor(group.name);
                        setNewSubName("");
                        setNewSubSort(0);
                      }}
                      className="mt-2 flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-80"
                      style={{ color: "var(--peacock-blue)" }}
                    >
                      <Plus className="w-4 h-4" /> Add Sub-Category
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
