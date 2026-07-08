"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, LogOut } from "lucide-react";
import AboutAdmin from "@/components/AboutAdmin";
import CategoriesAdmin from "@/components/CategoriesAdmin";
import TrainingsAdmin from "@/components/TrainingsAdmin";
import UsersOrdersAdmin from "@/components/UsersOrdersAdmin";
import BlogsAdmin from "@/components/BlogsAdmin";
import HomeCategoriesAdmin from "@/components/HomeCategoriesAdmin";
import MenuAdmin from "@/components/MenuAdmin";
import ContactRequestsAdmin from "@/components/ContactRequestsAdmin";
import CustomSolutionsAdmin from "@/components/CustomSolutionsAdmin";
import AccessoriesAdmin from "@/components/AccessoriesAdmin";

interface HeroSettings {
  videoUrl: string | null;
  headline: string | null;
  subheadline: string | null;
  ctaText: string | null;
}

interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string | null;
  category: string;
  mainCategory: string;
  subCategory: string;
  description: string | null;
  featured: boolean;
  stock: number;
  active: boolean;
}

interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  imageUrl: string;
  featured: boolean;
  sortOrder: number;
}

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"hero" | "training_banner" | "instagram" | "testimonials" | "products" | "categories" | "service_categories" | "gallery" | "about" | "trainings" | "users_orders" | "blogs" | "home_categories" | "menu_settings" | "contact_requests" | "custom_solutions" | "accessories">("products");

  // Hero State
  const [heroSettings, setHeroSettings] = useState<HeroSettings | null>(null);
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  const [trainingBannerSettings, setTrainingBannerSettings] = useState<any>(null);
  const [trainingBannerLoading, setTrainingBannerLoading] = useState(false);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(false);

  // Form State for Product
  const [isAdding, setIsAdding] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<{id:number, mainCategory:string, subCategory:string}[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("Home Products");

  // Gallery State
  const [gallery, setGallery] = useState<PortfolioItem[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [editGallery, setEditGallery] = useState<PortfolioItem | null>(null);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);

  // On mount, verify session via cookie
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user && d.user.role === "admin") {
          setIsAdmin(true);
          fetchHero();
          fetchTrainingBanner();
          fetchProducts();
          fetchCategories();
          fetchGallery();
          fetchInstagram();
          fetchTestimonials();
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      if (data.user.role !== "admin") throw new Error("Access denied. Admin only.");
      setIsAdmin(true);
      fetchHero();
      fetchTrainingBanner();
      fetchProducts();
      fetchCategories();
      fetchGallery();
      fetchInstagram();
      fetchTestimonials();
      toast.success("Welcome, Admin!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsAdmin(false);
    toast.success("Logged out");
  };

  const fetchHero = async () => {
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      setHeroSettings(data.settings);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?active=all");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/product-categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setGallery(data.portfolio || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleHeroSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHeroLoading(true);
    const formData = new FormData(e.currentTarget);
    if (heroFile) formData.set("video", heroFile);
    try {
      const res = await fetch("/api/hero", { method: "PUT", body: formData });
      if (!res.ok) throw new Error("Failed to update hero settings");
      toast.success("Hero settings updated!");
      fetchHero();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setHeroLoading(false);
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

  const [instagramPosts, setInstagramPosts] = useState<any[]>([]);
  const [instagramLoading, setInstagramLoading] = useState(false);
  const [isAddingInstagram, setIsAddingInstagram] = useState(false);
  const [instagramFile, setInstagramFile] = useState<File | null>(null);

  const fetchInstagram = async () => {
    try {
      const res = await fetch("/api/instagram");
      const data = await res.json();
      setInstagramPosts(data.posts || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInstagramSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInstagramLoading(true);
    const formData = new FormData(e.currentTarget);
    if (instagramFile) formData.set("image", instagramFile);
    try {
      const res = await fetch("/api/instagram", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to add Instagram post");
      toast.success("Post added!");
      setIsAddingInstagram(false);
      setInstagramFile(null);
      fetchInstagram();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setInstagramLoading(false);
    }
  };

  const handleDeleteInstagram = async (id: number) => {
    if (!confirm("Delete this Instagram post?")) return;
    try {
      const res = await fetch(`/api/instagram/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      toast.success("Post deleted");
      fetchInstagram();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  const [testimonialsList, setTestimonialsList] = useState<any[]>([]);
  const [testimonialLoading, setTestimonialLoading] = useState(false);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [testimonialFile, setTestimonialFile] = useState<File | null>(null);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonialsList(data.testimonials || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestimonialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTestimonialLoading(true);
    const formData = new FormData(e.currentTarget);
    if (testimonialFile) formData.set("avatar", testimonialFile);
    try {
      const res = await fetch("/api/testimonials", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to add testimonial");
      toast.success("Testimonial added!");
      setIsAddingTestimonial(false);
      setTestimonialFile(null);
      fetchTestimonials();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setTestimonialLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete testimonial");
      toast.success("Testimonial deleted");
      fetchTestimonials();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  const handleTrainingBannerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrainingBannerLoading(true);
    const formData = new FormData(e.currentTarget);
    // media is already in formData from the form
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

  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProductLoading(true);
    const formData = new FormData(e.currentTarget);
    if (productFile) formData.set("image", productFile);
    const method = editProduct ? "PUT" : "POST";
    const url = editProduct ? `/api/products/${editProduct.id}` : "/api/products";
    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save product");
      toast.success(editProduct ? "Product updated!" : "Product created!");
      setIsAdding(false);
      setEditProduct(null);
      setProductFile(null);
      fetchProducts();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      toast.success("Product deleted");
      fetchProducts();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  const handleGallerySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGalleryLoading(true);
    const formData = new FormData(e.currentTarget);
    if (galleryFile) formData.set("image", galleryFile);
    const method = editGallery ? "PUT" : "POST";
    const url = editGallery ? `/api/portfolio/${editGallery.id}` : "/api/portfolio";
    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save gallery item");
      toast.success(editGallery ? "Gallery item updated!" : "Gallery item created!");
      setIsAddingGallery(false);
      setEditGallery(null);
      setGalleryFile(null);
      fetchGallery();
    } catch (e: any) {
      toast.error(e.message || "Error");
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete gallery item");
      toast.success("Gallery item deleted");
      fetchGallery();
    } catch (e: any) {
      toast.error(e.message || "Error");
    }
  };

  // Loading state while checking auth
  if (!authChecked) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-peacock-blue rounded-full animate-spin" style={{ borderTopColor: "var(--peacock-blue)" }} />
      </div>
    );
  }

  // Login gate
  if (!isAdmin) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f9f6f0" }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black" style={{ fontFamily: "var(--font-heading)", color: "#1f1f1f" }}>Admin Login</h1>
            <p className="text-gray-500 mt-2 text-sm">Sri Krishna Crafting — Admin Panel</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg" style={{ border: "1px solid var(--cream-white-border)" }}>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="admin@example.com"
                  required
                  className="w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none transition-colors"
                  style={{ borderColor: "var(--cream-white-border)" }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5 text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-12 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none transition-colors"
                    style={{ borderColor: "var(--cream-white-border)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className="btn-peacock w-full py-3.5 font-black text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loginLoading ? "Signing in..." : "Sign In to Admin"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black" style={{ fontFamily: "var(--font-heading)", color: "#1f1f1f" }}>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Menu */}
        <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-2xl shadow p-4 h-fit sticky top-24" style={{ border: "1px solid var(--cream-white-border)" }}>
          <div className="flex flex-col gap-1">
            {(["users_orders", "contact_requests", "products", "home_categories", "categories", "service_categories", "gallery", "trainings", "training_banner", "instagram", "testimonials", "blogs", "hero", "about", "menu_settings", "custom_solutions", "accessories"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-left font-semibold rounded-xl transition-all ${activeTab === tab ? "bg-[#135db6] text-white shadow-md translate-x-1" : "text-gray-600 hover:bg-gray-50 hover:translate-x-1"}`}
              >
                {tab === "users_orders" ? "Users & Orders" : tab === "contact_requests" ? "Form Submissions" : tab === "products" ? "Manage Products" : tab === "home_categories" ? "Home Categories" : tab === "categories" ? "Product Categories" : tab === "service_categories" ? "Service Categories" : tab === "trainings" ? "Trainings" : tab === "training_banner" ? "Training Banner" : tab === "instagram" ? "Instagram Feed" : tab === "testimonials" ? "Testimonials" : tab === "blogs" ? "Blogs" : tab === "gallery" ? "Gallery Upload" : tab === "hero" ? "Hero Settings" : tab === "menu_settings" ? "Menu Visibility" : tab === "custom_solutions" ? "Custom Solutions" : tab === "accessories" ? "Accessories Page" : "About Page"}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">

      {activeTab === "contact_requests" && (
        <ContactRequestsAdmin />
      )}

      {activeTab === "custom_solutions" && (
        <div className="p-6 rounded-2xl shadow" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
          <CustomSolutionsAdmin />
        </div>
      )}

      {activeTab === "menu_settings" && (
        <div className="p-6 rounded-2xl shadow" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
          <MenuAdmin />
        </div>
      )}

      {activeTab === "home_categories" && (
        <div className="p-6 rounded-2xl shadow" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
          <HomeCategoriesAdmin />
        </div>
      )}

      {activeTab === "hero" && (
        <div className="p-6 rounded-2xl shadow" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
          <h2 className="text-2xl font-bold mb-6">Hero Section Configuration</h2>
          <form onSubmit={handleHeroSubmit} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-semibold mb-1">Headline</label>
              <input name="headline" defaultValue={heroSettings?.headline || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Subheadline</label>
              <textarea name="subheadline" defaultValue={heroSettings?.subheadline || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} rows={3} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">CTA Text</label>
              <input name="ctaText" defaultValue={heroSettings?.ctaText || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Background Video</label>
              <input type="file" accept="video/*" onChange={(e) => setHeroFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border" style={{ borderColor: "var(--cream-white-border)" }} />
              {heroSettings?.videoUrl && <p className="mt-2 text-sm text-green-600 font-medium">Currently using a custom video.</p>}
            </div>
            <button type="submit" disabled={heroLoading} className="btn-peacock mt-4 w-full sm:w-auto">
              {heroLoading ? "Saving..." : "Save Hero Settings"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "training_banner" && (
        <div className="p-6 rounded-2xl shadow max-w-2xl" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
          <h2 className="text-2xl font-bold mb-6">Home Training Banner</h2>
          <form onSubmit={handleTrainingBannerSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Headline</label>
              <input name="headline" defaultValue={trainingBannerSettings?.headline} required className="w-full p-2 rounded border" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Subheadline</label>
              <textarea name="subheadline" defaultValue={trainingBannerSettings?.subheadline} required rows={3} className="w-full p-2 rounded border" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Button Text</label>
                <input name="ctaText" defaultValue={trainingBannerSettings?.ctaText} required className="w-full p-2 rounded border" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Button Link</label>
                <input name="ctaLink" defaultValue={trainingBannerSettings?.ctaLink} required className="w-full p-2 rounded border" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Background Media (Image or Video)</label>
              <input type="file" name="media" accept="image/*,video/mp4,video/webm" className="w-full p-2 rounded border bg-white" />
              {trainingBannerSettings?.mediaUrl && <p className="mt-2 text-sm text-green-600 font-medium">Current media is active.</p>}
            </div>
            <button type="submit" disabled={trainingBannerLoading} className="btn-peacock mt-4 w-full sm:w-auto">
              {trainingBannerLoading ? "Saving..." : "Save Training Banner"}
            </button>
          </form>
        </div>
      )}

      {activeTab === "instagram" && (
        <div>
          {!isAddingInstagram ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Instagram Feed ({instagramPosts.length})</h2>
                <button onClick={() => setIsAddingInstagram(true)} className="btn-peacock">Add Post</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {instagramPosts.map((post) => (
                  <div key={post.id} className="p-3 rounded-2xl shadow flex flex-col" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
                    <div className="aspect-square rounded-xl overflow-hidden mb-3 relative bg-gray-100">
                      <img src={post.imageUrl} alt="Instagram" className="w-full h-full object-cover" />
                    </div>
                    <a href={post.postLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 truncate mb-3 hover:underline">
                      {post.postLink}
                    </a>
                    <button onClick={() => handleDeleteInstagram(post.id)} className="w-full bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors py-2 text-sm mt-auto">
                      Delete Post
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 rounded-2xl shadow max-w-xl" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add Instagram Post</h2>
                <button onClick={() => { setIsAddingInstagram(false); setInstagramFile(null); }} className="text-gray-500 hover:text-black">Cancel</button>
              </div>
              <form onSubmit={handleInstagramSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Post Link URL</label>
                  <input name="postLink" placeholder="https://instagram.com/p/..." required className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Sort Order (Optional)</label>
                  <input name="sortOrder" type="number" defaultValue={0} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Image Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setInstagramFile(e.target.files?.[0] || null)}
                    className="w-full p-2 rounded border bg-white"
                  />
                </div>
                <button type="submit" disabled={instagramLoading} className="btn-peacock mt-4 w-full sm:w-auto">
                  {instagramLoading ? "Adding..." : "Add Post"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === "testimonials" && (
        <div>
          {!isAddingTestimonial ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Testimonials ({testimonialsList.length})</h2>
                <button onClick={() => setIsAddingTestimonial(true)} className="btn-peacock">Add Testimonial</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonialsList.map((testi) => (
                  <div key={testi.id} className="p-4 rounded-2xl shadow flex flex-col gap-3" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
                    <div className="flex items-center gap-4">
                      {testi.avatarUrl && (
                        <img src={testi.avatarUrl} alt={testi.name} className="w-12 h-12 rounded-full object-cover border" />
                      )}
                      <div>
                        <h3 className="font-bold">{testi.name}</h3>
                        <p className="text-sm text-gray-500">{testi.role}</p>
                      </div>
                    </div>
                    <p className="text-sm italic flex-1">"{testi.content}"</p>
                    <div className="text-xs text-yellow-500 font-bold mb-2">Rating: {testi.rating}/5</div>
                    <button onClick={() => handleDeleteTestimonial(testi.id)} className="w-full bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors py-2 text-sm mt-auto">
                      Delete Testimonial
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 rounded-2xl shadow max-w-xl" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add Testimonial</h2>
                <button onClick={() => { setIsAddingTestimonial(false); setTestimonialFile(null); }} className="text-gray-500 hover:text-black">Cancel</button>
              </div>
              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Customer Name</label>
                    <input name="name" required className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Role/Title (Optional)</label>
                    <input name="role" placeholder="e.g. Interior Designer" className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Testimonial Content</label>
                  <textarea name="content" required rows={3} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Rating (1-5)</label>
                    <input name="rating" type="number" min={1} max={5} defaultValue={5} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sort Order</label>
                    <input name="sortOrder" type="number" defaultValue={0} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Customer Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTestimonialFile(e.target.files?.[0] || null)}
                    className="w-full p-2 rounded border bg-white"
                  />
                </div>
                <button type="submit" disabled={testimonialLoading} className="btn-peacock mt-4 w-full sm:w-auto">
                  {testimonialLoading ? "Adding..." : "Add Testimonial"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <div>
          {!isAdding && !editProduct ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Products ({products.length})</h2>
                <button onClick={() => setIsAdding(true)} className="btn-peacock">Add New Product</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl shadow flex flex-col" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
                    <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center relative">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                      <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">ID: {p.id}</span>
                    </div>
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <p className="text-sm font-medium" style={{ color: "var(--peacock-blue)" }}>
                      ₹{Number(p.price).toLocaleString("en-IN")} • {p.mainCategory} / {p.subCategory}
                    </p>
                    <div className="mt-auto pt-4 flex gap-2">
                      <button onClick={() => setEditProduct(p)} className="flex-1 btn-peacock-outline !text-sm !py-1.5">Edit</button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="flex-1 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors !text-sm !py-1.5">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 rounded-2xl shadow max-w-2xl" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{editProduct ? "Edit Product" : "Add Product"}</h2>
                <button onClick={() => { setIsAdding(false); setEditProduct(null); }} className="text-gray-500 hover:text-black">Cancel</button>
              </div>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Name</label>
                  <input name="name" defaultValue={editProduct?.name || ""} required className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Price</label>
                    <input name="price" type="number" step="0.01" defaultValue={editProduct?.price || ""} required className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Main Category</label>
                    <select 
                      name="mainCategory" 
                      defaultValue={editProduct?.mainCategory || "Home Products"}
                      onChange={(e) => setSelectedMainCategory(e.target.value)}
                      required 
                      className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" 
                      style={{ borderColor: "var(--cream-white-border)" }}
                    >
                      {Array.from(new Set(categories.map(c => c.mainCategory))).map(mc => (
                        <option key={mc} value={mc}>{mc}</option>
                      ))}
                      {categories.length === 0 && <option value="Home Products">Home Products</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sub Category</label>
                    <select 
                      name="subCategory" 
                      defaultValue={editProduct?.subCategory || ""}
                      required 
                      className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" 
                      style={{ borderColor: "var(--cream-white-border)" }}
                    >
                      {categories
                        .filter(c => c.mainCategory === (editProduct ? (editProduct.mainCategory || selectedMainCategory) : selectedMainCategory))
                        .map(c => (
                          <option key={c.id} value={c.subCategory}>{c.subCategory}</option>
                        ))}
                      {categories.length === 0 && <option value="Others">Others</option>}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea name="description" defaultValue={editProduct?.description || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Stock</label>
                    <input name="stock" type="number" defaultValue={editProduct?.stock || 0} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                  </div>
                  <div className="flex items-center gap-2 mt-7">
                    <input name="featured" type="checkbox" id="featured" value="true" defaultChecked={editProduct?.featured || false} className="w-4 h-4" />
                    <label htmlFor="featured" className="text-sm font-semibold">Featured Product</label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Related Product IDs</label>
                  <input name="relatedProductIds" defaultValue={editProduct ? (editProduct as any).relatedProductIds || "" : ""} placeholder="e.g. 3,7,12 (comma separated)" className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                  <p className="text-xs text-gray-500 mt-1">Enter product IDs separated by commas. These will appear as &ldquo;You May Also Like&rdquo; on the product page.</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Product Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setProductFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border" style={{ borderColor: "var(--cream-white-border)" }} />
                  {editProduct?.imageUrl && <p className="mt-2 text-sm text-green-600">Current image will be kept if you don&apos;t upload a new one.</p>}
                </div>
                <button type="submit" disabled={productLoading} className="btn-peacock mt-4 w-full sm:w-auto">
                  {productLoading ? "Saving..." : "Save Product"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === "gallery" && (
        <div>
          {!isAddingGallery && !editGallery ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gallery ({gallery.length})</h2>
                <button onClick={() => setIsAddingGallery(true)} className="btn-peacock">Add Gallery Item</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl shadow flex flex-col" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
                    <div className="h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      {p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="object-cover w-full h-full" /> : <span className="text-gray-400">No Image</span>}
                    </div>
                    <h3 className="font-bold text-lg">{p.title}</h3>
                    <p className="text-sm font-medium" style={{ color: "var(--peacock-blue)" }}>{p.category}</p>
                    <div className="mt-auto pt-4 flex gap-2">
                      <button onClick={() => setEditGallery(p)} className="flex-1 btn-peacock-outline !text-sm !py-1.5">Edit</button>
                      <button onClick={() => handleDeleteGallery(p.id)} className="flex-1 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors !text-sm !py-1.5">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 rounded-2xl shadow max-w-2xl" style={{ backgroundColor: "#ffffff", border: "1px solid var(--cream-white-border)" }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{editGallery ? "Edit Gallery Item" : "Add Gallery Item"}</h2>
                <button onClick={() => { setIsAddingGallery(false); setEditGallery(null); }} className="text-gray-500 hover:text-black">Cancel</button>
              </div>
              <form onSubmit={handleGallerySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Title</label>
                  <input name="title" defaultValue={editGallery?.title || ""} required className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Category</label>
                    <select name="category" defaultValue={editGallery?.category || "Residential"} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }}>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Temple Projects">Temple Projects</option>
                      <option value="International Orders">International Orders</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Sort Order</label>
                    <input name="sortOrder" type="number" defaultValue={editGallery?.sortOrder || 0} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea name="description" defaultValue={editGallery?.description || ""} className="w-full p-2 rounded border focus:ring-2 outline-none transition-all" style={{ borderColor: "var(--cream-white-border)" }} rows={3} />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input name="featured" type="checkbox" id="galleryFeatured" value="true" defaultChecked={editGallery?.featured || false} className="w-4 h-4" />
                  <label htmlFor="galleryFeatured" className="text-sm font-semibold">Featured</label>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setGalleryFile(e.target.files?.[0] || null)} className="w-full p-2 rounded border" style={{ borderColor: "var(--cream-white-border)" }} />
                  {editGallery?.imageUrl && <p className="mt-2 text-sm text-green-600">Current image will be kept if you don&apos;t upload a new one.</p>}
                </div>
                <button type="submit" disabled={galleryLoading} className="btn-peacock mt-4 w-full sm:w-auto">
                  {galleryLoading ? "Saving..." : "Save Gallery Item"}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === "categories" && (
        <CategoriesAdmin type="products" />
      )}

      {activeTab === "service_categories" && (
        <CategoriesAdmin type="services" />
      )}

      {activeTab === "about" && (
        <AboutAdmin />
      )}

      {activeTab === "trainings" && (
        <TrainingsAdmin />
      )}

      {activeTab === "users_orders" && (
        <UsersOrdersAdmin />
      )}

      {activeTab === "blogs" && (
        <BlogsAdmin />
      )}

      {activeTab === "custom_solutions" && (
        <CustomSolutionsAdmin />
      )}

      {activeTab === "accessories" && (
        <AccessoriesAdmin />
      )}
        </div>
      </div>
    </div>
  );
}
