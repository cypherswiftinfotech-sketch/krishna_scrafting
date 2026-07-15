"use client"; // force recompile
import React, { useEffect, useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Upload, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function SolutionDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  
  const [solution, setSolution] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Array of all images (main + additional)
  const [allImages, setAllImages] = useState<string[]>([]);
  // The currently selected image for the form reference
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [quoteLoading, setQuoteLoading] = useState(false);

  useEffect(() => {
    if (!params.slug) return;
    
    // Fetch all solutions and find the match
    fetch("/api/custom-solutions/solutions")
      .then(res => res.json())
      .then(data => {
        const found = data.solutions?.find((s: any) => 
          s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === params.slug
        );
        if (found) {
          setSolution(found);
          
          const imgs = [];
          if (found.imageUrl) imgs.push(found.imageUrl);
          if (found.additionalImages) {
            try {
              const addImgs = JSON.parse(found.additionalImages);
              if (Array.isArray(addImgs)) imgs.push(...addImgs);
            } catch (e) {}
          }
          setAllImages(imgs);
          if (imgs.length > 0) setSelectedImage(imgs[0]);
        } else {
          router.push("/customservices");
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [params.slug, router]);

  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuoteLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("type", "quote");
    
    // If user selected a reference image from the grid, append its URL to description
    if (selectedImage) {
      const currentDesc = formData.get("description") as string;
      formData.set("description", currentDesc + "\n\n[Reference Image Selected: " + selectedImage + "]");
    }

    try {
      const res = await fetch("/api/custom-solutions/inquiries", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Submission failed");
      
      toast.success("Quote request sent successfully!");
      
      const text = `Hi, I would like to request a quote for ${formData.get("projectType")}.
Name: ${formData.get("name")}
Phone: ${formData.get("phone")}
City: ${formData.get("city") || 'N/A'}
Area: ${formData.get("area") || 'N/A'} sq.ft
Budget: ${formData.get("budget") || 'N/A'}
Requirement: ${formData.get("description") || 'N/A'}`;
      
      const whatsappUrl = `https://wa.me/917204468429?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      
      router.push("/customservices");
    } catch (err: any) {
      toast.error("Failed to send request. Try again.");
    } finally {
      setQuoteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#135db6] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!solution) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        <button 
          onClick={() => router.push("/customservices")}
          className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors font-semibold"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Custom Solutions
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{solution.title}</h1>
          {solution.description && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{solution.description}</p>}
        </div>

        {/* Hero Image Grid */}
        {allImages.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Select a Reference Image <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span></h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((imgUrl, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedImage(prev => prev === imgUrl ? null : imgUrl)}
                  className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${selectedImage === imgUrl ? "border-[#135db6] shadow-lg scale-[1.02]" : "border-transparent hover:border-gray-300"}`}
                >
                  <Image src={imgUrl} alt={`${solution.title} ${idx + 1}`} fill className="object-cover" />
                  {selectedImage === imgUrl && (
                    <div className="absolute top-3 right-3 bg-white rounded-full text-[#135db6] shadow-md">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inquiry Form */}
        <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Request a Quote</h2>
            <p className="text-gray-500">Provide your project details and we will get back to you with an estimate.</p>
          </div>

          <form onSubmit={handleQuoteSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                <input name="name" type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                <input name="phone" type="tel" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                <input name="email" type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                <input name="city" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                <input name="state" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Project Type</label>
                <select name="projectType" defaultValue={solution.title} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all">
                  <option value={solution.title}>{solution.title}</option>
                  <option value="Epoxy Flooring">Epoxy Flooring</option>
                  <option value="River Table">River Table</option>
                  <option value="Wall Panel">Wall Panel</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Area (sq.ft)</label>
                <input name="area" type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Budget</label>
                <input name="budget" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Date</label>
                <input name="preferredDate" type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Own Images (Optional)</label>
                <label className="w-full bg-gray-50 border-2 border-gray-200 border-dashed rounded-xl px-4 py-3 text-gray-500 flex items-center justify-center gap-2 cursor-pointer hover:border-[#135db6] hover:bg-[#135db6]/5 transition-colors">
                  <Upload className="w-4 h-4" /> <span className="text-sm">Click to Upload</span>
                  <input type="file" name="image" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Describe Requirement</label>
              <textarea name="description" rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all"></textarea>
            </div>
            <button 
              type="submit" 
              className="w-full bg-[#135db6] hover:bg-[#0f4d99] text-white font-bold py-4 rounded-xl text-lg shadow-lg shadow-[#135db6]/30 transition-all hover:-translate-y-1"
              disabled={quoteLoading}
            >
              {quoteLoading ? "Submitting Request..." : "Submit Request"}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
