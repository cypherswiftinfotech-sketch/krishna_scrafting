"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Upload, X, Plus } from "lucide-react";

export default function CustomSolutionsAdmin({ activeSection }: { activeSection?: "hero" | "solutions" | "projects" | "reviews" | "inquiries" }) {
  const [activeSubTab, setActiveSubTab] = useState<"hero" | "solutions" | "projects" | "reviews" | "inquiries">("hero");

  useEffect(() => {
    if (activeSection) {
      setActiveSubTab(activeSection);
    }
  }, [activeSection]);

  // Hero State
  const [heroSettings, setHeroSettings] = useState<{ heroVideoUrl: string | null } | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroLoading, setHeroLoading] = useState(false);

  // Solutions State
  const [solutions, setSolutions] = useState<any[]>([]);
  const [isAddingSolution, setIsAddingSolution] = useState(false);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [solutionLoading, setSolutionLoading] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<any[]>([]);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null);
  const [afterImageFile, setAfterImageFile] = useState<File | null>(null);
  const [projectLoading, setProjectLoading] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState<any[]>([]);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState<"all" | "quote" | "site_visit">("all");
  const [inquiryCols, setInquiryCols] = useState({
    name: true,
    email: true,
    phone: true,
    location: true,
    projectType: true,
    budget: false,
    date: true,
    message: false,
    image: true
  });

  useEffect(() => {
    fetchHero();
    fetchSolutions();
    fetchProjects();
    fetchReviews();
    fetchInquiries();
  }, []);

  const fetchHero = async () => {
    try {
      const res = await fetch("/api/custom-solutions/hero");
      const data = await res.json();
      setHeroSettings(data.settings);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSolutions = async () => {
    try {
      const res = await fetch("/api/custom-solutions/solutions");
      const data = await res.json();
      setSolutions(data.solutions || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/custom-solutions/projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/custom-solutions/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/custom-solutions/inquiries");
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Handlers for Hero
  const handleHeroSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHeroLoading(true);
    const formData = new FormData();
    if (heroFile) formData.set("video", heroFile);
    try {
      const res = await fetch("/api/custom-solutions/hero", { method: "PUT", body: formData });
      if (!res.ok) throw new Error("Failed to update hero video");
      toast.success("Hero video updated!");
      fetchHero();
      setHeroFile(null);
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setHeroLoading(false);
    }
  };

  // Handlers for Solutions
  const handleSolutionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSolutionLoading(true);
    const formData = new FormData(e.currentTarget);
    if (solutionFile) formData.set("image", solutionFile);
    
    // Add additional files to form data
    const fileInput = document.getElementById('additional-images-input') as HTMLInputElement;
    if (fileInput && fileInput.files) {
      Array.from(fileInput.files).forEach((file) => {
        formData.append("additionalImages", file);
      });
    }

    try {
      const res = await fetch("/api/custom-solutions/solutions", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to add solution card");
      toast.success("Solution card added!");
      fetchSolutions();
      setIsAddingSolution(false);
      setSolutionFile(null);
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setSolutionLoading(false);
    }
  };

  const handleDeleteSolution = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/custom-solutions/solutions/${id}`, { method: "DELETE" });
      toast.success("Deleted successfully");
      fetchSolutions();
    } catch (e: any) {
      toast.error("Failed to delete");
    }
  };

  // Handlers for Projects
  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProjectLoading(true);
    const formData = new FormData(e.currentTarget);
    if (beforeImageFile) formData.set("beforeImage", beforeImageFile);
    if (afterImageFile) formData.set("afterImage", afterImageFile);
    try {
      const res = await fetch("/api/custom-solutions/projects", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to add project");
      toast.success("Project added!");
      fetchProjects();
      setIsAddingProject(false);
      setBeforeImageFile(null);
      setAfterImageFile(null);
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setProjectLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/custom-solutions/projects/${id}`, { method: "DELETE" });
      toast.success("Deleted successfully");
      fetchProjects();
    } catch (e: any) {
      toast.error("Failed to delete");
    }
  };

  // Handlers for Reviews
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewLoading(true);
    const formData = new FormData(e.currentTarget);
    if (reviewFile) formData.set("avatar", reviewFile);
    try {
      const res = await fetch("/api/custom-solutions/reviews", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to add review");
      toast.success("Review added!");
      fetchReviews();
      setIsAddingReview(false);
      setReviewFile(null);
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/custom-solutions/reviews/${id}`, { method: "DELETE" });
      toast.success("Deleted successfully");
      fetchReviews();
    } catch (e: any) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Custom Services Page Admin</h2>
      
      {!activeSection && (
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
          {(["hero", "solutions", "projects", "reviews", "inquiries"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${activeSubTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
            >
              {tab === "hero" ? "Hero Video" : tab === "solutions" ? "Services Cards" : tab === "projects" ? "Recent Projects" : tab === "reviews" ? "Customer Reviews" : "Inquiries & Leads"}
            </button>
          ))}
        </div>
      )}

      {activeSubTab === "hero" && (
        <div className="max-w-2xl">
          <p className="text-gray-600 mb-6">Upload the background video for the Custom Services hero section.</p>
          
          {heroSettings?.heroVideoUrl && (
            <div className="mb-6">
              <p className="text-sm font-semibold mb-2">Current Video:</p>
              <video src={heroSettings.heroVideoUrl} className="w-full max-h-64 rounded-xl object-cover border" controls muted />
            </div>
          )}

          <form onSubmit={handleHeroSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">New Background Video</label>
              <input type="file" accept="video/*" onChange={(e) => setHeroFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border border-gray-200 bg-gray-50" />
            </div>
            <button type="submit" disabled={heroLoading} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
              {heroLoading ? "Saving..." : "Save Hero Video"}
            </button>
          </form>
        </div>
      )}

      {activeSubTab === "solutions" && (
        <div>
          {!isAddingSolution ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">Manage the 6 Services cards displayed on the page.</p>
                <button onClick={() => setIsAddingSolution(true)} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700">
                  <Plus className="w-4 h-4" /> Add Service
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {solutions.map((s) => (
                  <div key={s.id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white relative">
                    {s.imageUrl ? (
                      <img src={s.imageUrl} alt={s.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400">No Image</div>
                    )}
                    <h3 className="font-bold text-lg">{s.title}</h3>
                    <p className="text-sm text-gray-500 mb-2 h-10 overflow-hidden">{s.description}</p>
                    {s.additionalImages && JSON.parse(s.additionalImages).length > 0 && (
                      <p className="text-xs text-blue-600 font-semibold mb-2 bg-blue-50 px-2 py-1 rounded inline-block">
                        +{JSON.parse(s.additionalImages).length} more images
                      </p>
                    )}
                    
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 mb-1 cursor-pointer hover:text-blue-600 flex items-center gap-1">
                        <Upload className="w-3 h-3" /> Add Images
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            if (!e.target.files?.length) return;
                            const toastId = toast.loading("Uploading additional images...");
                            const formData = new FormData();
                            Array.from(e.target.files).forEach(f => formData.append("additionalImages", f));
                            try {
                              const res = await fetch(`/api/custom-solutions/solutions/${s.id}`, {
                                method: "PUT",
                                body: formData
                              });
                              if (!res.ok) throw new Error("Upload failed");
                              toast.success("Images added successfully", { id: toastId });
                              fetchSolutions();
                            } catch (err) {
                              toast.error("Failed to add images", { id: toastId });
                            }
                          }}
                        />
                      </label>
                    </div>

                    <button onClick={() => handleDeleteSolution(s.id)} className="w-full py-2 mt-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-xl bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add Service Card</h3>
                <button onClick={() => setIsAddingSolution(false)} className="text-gray-500 hover:text-black"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSolutionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Title</label>
                  <input name="title" required className="w-full p-2 rounded border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Description (Subtitle)</label>
                  <input name="description" className="w-full p-2 rounded border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Sort Order</label>
                  <input name="sortOrder" type="number" defaultValue={0} className="w-full p-2 rounded border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Main Cover Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setSolutionFile(e.target.files?.[0] || null)} required className="w-full p-2 rounded border border-gray-200 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Additional Images (Optional, for service detail page)</label>
                  <input id="additional-images-input" type="file" multiple accept="image/*" className="w-full p-2 rounded border border-gray-200 bg-white" />
                  <p className="text-xs text-gray-500 mt-1">Select multiple images at once (Ctrl+Click or Cmd+Click)</p>
                </div>
                <button type="submit" disabled={solutionLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  {solutionLoading ? "Adding..." : "Add Service Card"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "projects" && (
        <div>
          {!isAddingProject ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">Manage Recent Projects with before/after photos.</p>
                <button onClick={() => setIsAddingProject(true)} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                    <div className="flex gap-2 mb-4 h-32">
                      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                        {p.beforeImageUrl ? <img src={p.beforeImageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Before</div>}
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
                        {p.afterImageUrl ? <img src={p.afterImageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">After</div>}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg">{p.title}</h3>
                    <p className="text-sm text-gray-500">{p.city} • {p.costRange}</p>
                    <button onClick={() => handleDeleteProject(p.id)} className="w-full py-2 mt-4 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-2xl bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add Recent Project</h3>
                <button onClick={() => setIsAddingProject(false)} className="text-gray-500 hover:text-black"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Project Title</label>
                  <input name="title" required className="w-full p-2 rounded border border-gray-200" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">City</label>
                    <input name="city" className="w-full p-2 rounded border border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Cost Range</label>
                    <input name="costRange" placeholder="e.g. ₹1.5L - ₹2L" className="w-full p-2 rounded border border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Time Taken</label>
                    <input name="timeTaken" placeholder="e.g. 5 Days" className="w-full p-2 rounded border border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sort Order</label>
                    <input name="sortOrder" type="number" defaultValue={0} className="w-full p-2 rounded border border-gray-200" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea name="description" rows={3} className="w-full p-2 rounded border border-gray-200" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Before Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setBeforeImageFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border border-gray-200 bg-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">After Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setAfterImageFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border border-gray-200 bg-white" />
                  </div>
                </div>
                <button type="submit" disabled={projectLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  {projectLoading ? "Adding..." : "Add Project"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "reviews" && (
        <div>
          {!isAddingReview ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">Manage Customer Reviews.</p>
                <button onClick={() => setIsAddingReview(true)} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700">
                  <Plus className="w-4 h-4" /> Add Review
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map((r) => (
                  <div key={r.id} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
                        {r.avatarUrl ? <img src={r.avatarUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">👤</div>}
                      </div>
                      <div>
                        <h3 className="font-bold">{r.name}</h3>
                        <p className="text-xs text-yellow-500">{"★".repeat(r.rating)}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic mb-4">"{r.text}"</p>
                    <button onClick={() => handleDeleteReview(r.id)} className="w-full py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="max-w-xl bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Add Customer Review</h3>
                <button onClick={() => setIsAddingReview(false)} className="text-gray-500 hover:text-black"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Customer Name</label>
                  <input name="name" required className="w-full p-2 rounded border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Review Text</label>
                  <textarea name="text" required rows={3} className="w-full p-2 rounded border border-gray-200" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Rating (1-5)</label>
                    <input name="rating" type="number" min={1} max={5} defaultValue={5} className="w-full p-2 rounded border border-gray-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sort Order</label>
                    <input name="sortOrder" type="number" defaultValue={0} className="w-full p-2 rounded border border-gray-200" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Customer Photo/Video (Optional)</label>
                  <input type="file" accept="image/*,video/*" onChange={(e) => setReviewFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border border-gray-200 bg-white" />
                </div>
                <button type="submit" disabled={reviewLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                  {reviewLoading ? "Adding..." : "Add Review"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeSubTab === "inquiries" && (
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <p className="text-gray-600">Manage all quote requests and site visit bookings.</p>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setInquiryFilter("all")} 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${inquiryFilter === "all" ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
              >
                All
              </button>
              <button 
                onClick={() => setInquiryFilter("quote")} 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${inquiryFilter === "quote" ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
              >
                Quotes
              </button>
              <button 
                onClick={() => setInquiryFilter("site_visit")} 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${inquiryFilter === "site_visit" ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
              >
                Site Visits
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-500 mb-3 tracking-wider uppercase">Show/Hide Columns:</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(inquiryCols).map(([col, isVisible]) => (
                <label key={col} className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white shadow-sm">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => setInquiryCols(prev => ({ ...prev, [col]: !prev[col as keyof typeof inquiryCols] }))}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">{col.replace(/([A-Z])/g, ' $1').trim()}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    {inquiryCols.name && <th className="px-6 py-4">Name</th>}
                    {inquiryCols.email && <th className="px-6 py-4">Email</th>}
                    {inquiryCols.phone && <th className="px-6 py-4">Phone</th>}
                    {inquiryCols.location && <th className="px-6 py-4">Location</th>}
                    {inquiryCols.projectType && <th className="px-6 py-4">Project Type</th>}
                    {inquiryCols.budget && <th className="px-6 py-4">Budget</th>}
                    {inquiryCols.date && <th className="px-6 py-4">Appointment/Date</th>}
                    <th className="px-6 py-4">Type</th>
                    {inquiryCols.message && <th className="px-6 py-4">Message</th>}
                    {inquiryCols.image && <th className="px-6 py-4">Image</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inquiries
                    .filter(inq => inquiryFilter === "all" || inq.type === inquiryFilter)
                    .map((inq) => (
                    <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                      {inquiryCols.name && <td className="px-6 py-4 font-medium text-gray-900">{inq.name || "Unknown"}</td>}
                      {inquiryCols.email && <td className="px-6 py-4 text-gray-500">{inq.email || "-"}</td>}
                      {inquiryCols.phone && <td className="px-6 py-4 text-gray-500">{inq.phone || "-"}</td>}
                      {inquiryCols.location && <td className="px-6 py-4 text-gray-500">{inq.city || "-"} {inq.state ? `, ${inq.state}` : ''}</td>}
                      {inquiryCols.projectType && (
                        <td className="px-6 py-4">
                          {inq.projectType ? <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{inq.projectType}</span> : "-"}
                        </td>
                      )}
                      {inquiryCols.budget && <td className="px-6 py-4 text-gray-500">{inq.budget || "-"}</td>}
                      {inquiryCols.date && (
                        <td className="px-6 py-4 text-gray-500">
                          {inq.preferredDate ? `Appt: ${inq.preferredDate}` : ''}
                          {inq.preferredDate && <br />}
                          <span className="text-xs text-gray-400">Sent: {new Date(inq.createdAt).toLocaleDateString()}</span>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${inq.type === 'quote' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {inq.type === 'site_visit' ? 'Site Visit' : inq.type}
                        </span>
                      </td>
                      {inquiryCols.message && (
                        <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate" title={inq.description}>
                          {inq.description || "-"}
                        </td>
                      )}
                      {inquiryCols.image && (
                        <td className="px-6 py-4">
                          {inq.imageUrl ? (
                            <a href={inq.imageUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                              View Image
                            </a>
                          ) : "-"}
                        </td>
                      )}
                    </tr>
                  ))}
                  
                  {inquiries.filter(inq => inquiryFilter === "all" || inq.type === inquiryFilter).length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                        No {inquiryFilter !== 'all' ? (inquiryFilter === 'site_visit' ? 'site visit' : inquiryFilter) : ''} inquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4">
            {inquiries
              .filter(inq => inquiryFilter === "all" || inq.type === inquiryFilter)
              .map(inq => (
                <div key={inq.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                    <h4 className="font-bold text-gray-900 text-lg">{inq.name || "Unknown"}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${inq.type === 'quote' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {inq.type === 'site_visit' ? 'Site Visit' : inq.type}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 flex flex-col gap-2">
                    {inquiryCols.phone && <div className="flex justify-between"><span className="font-semibold text-gray-700">Phone:</span> <span>{inq.phone || "-"}</span></div>}
                    {inquiryCols.email && <div className="flex justify-between"><span className="font-semibold text-gray-700">Email:</span> <span className="truncate max-w-[200px]">{inq.email || "-"}</span></div>}
                    {inquiryCols.location && <div className="flex justify-between"><span className="font-semibold text-gray-700">Location:</span> <span>{inq.city || "-"} {inq.state ? `, ${inq.state}` : ''}</span></div>}
                    {inquiryCols.projectType && <div className="flex justify-between"><span className="font-semibold text-gray-700">Project Type:</span> <span>{inq.projectType || "-"}</span></div>}
                    {inquiryCols.budget && <div className="flex justify-between"><span className="font-semibold text-gray-700">Budget:</span> <span>{inq.budget || "-"}</span></div>}
                    {inquiryCols.date && (
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-700">Date/Time:</span>
                        <span className="text-gray-500">
                          {inq.preferredDate ? `Appt: ${inq.preferredDate}` : 'No specific date'} (Sent: {new Date(inq.createdAt).toLocaleDateString()})
                        </span>
                      </div>
                    )}
                    {inquiryCols.message && (
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-gray-700">Message:</span>
                        <span className="bg-gray-50 p-2 rounded border border-gray-100 text-gray-500">{inq.description || "-"}</span>
                      </div>
                    )}
                    {inquiryCols.image && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold text-gray-700">Reference Image:</span> 
                        <span>
                          {inq.imageUrl ? (
                            <a href={inq.imageUrl} target="_blank" rel="noreferrer" className="px-3 py-1 bg-blue-50 text-blue-600 rounded font-medium text-xs hover:bg-blue-100 transition-colors">
                              View Image
                            </a>
                          ) : "-"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
            ))}
            
            {inquiries.filter(inq => inquiryFilter === "all" || inq.type === inquiryFilter).length === 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500 shadow-sm">
                No {inquiryFilter !== 'all' ? (inquiryFilter === 'site_visit' ? 'site visit' : inquiryFilter) : ''} inquiries found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
