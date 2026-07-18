"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CheckCircle, ChevronDown, ChevronUp, MapPin, Calculator, Calendar, Upload, MessageCircle, Phone, X, Target, FileText, PenTool, Hammer, Wrench, ChevronsRight, ChevronsLeft, ChevronsDown } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const PROCESS_STEPS = [
  { title: "Consultation", desc: "Understand your vision and requirements.", icon: MessageCircle },
  { title: "Requirement Discussion", desc: "Detailed analysis of materials and scope.", icon: Target },
  { title: "Site Visit & Design", desc: "Expert assessment of the space.", icon: MapPin },
  { title: "Quotation", desc: "Transparent pricing and timelines.", icon: FileText },
  { title: "Design Approval", desc: "Finalizing the resin layout and colors.", icon: PenTool },
  { title: "Production", desc: "Crafting the materials with precision.", icon: Hammer },
  { title: "Installation", desc: "Professional, seamless application.", icon: Wrench },
  { title: "Final Handover", desc: "Quality check and client approval.", icon: CheckCircle2 }
];

const FAQS = [
  { q: "How many days does flooring take?", a: "Typically 3 to 7 days depending on the area and complexity." },
  { q: "Can it be installed over existing tiles?", a: "Yes, we prepare the existing surface properly before installation." },
  { q: "Is it waterproof?", a: "Yes, epoxy creates a seamless, 100% waterproof barrier." },
  { q: "Is it scratch resistant?", a: "It is highly durable and scratch-resistant, perfect for high traffic areas." },
  { q: "Warranty?", a: "We provide a standard 5-year warranty against peeling or bubbling." }
];

const PrimaryButton = ({ children, onClick, className = "", icon = null }: any) => (
  <button 
    onClick={onClick} 
    className={`bg-gradient-to-r from-[#135db6] to-[#008493] text-white-force font-bold rounded-full hover:shadow-[0_8px_20px_rgba(19,93,182,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 ${className}`}
  >
    {children} {icon}
  </button>
);

const OutlineButton = ({ children, onClick, className = "", icon = null }: any) => (
  <button 
    onClick={onClick} 
    className={`bg-white border-2 border-[#135db6] text-[#135db6] font-bold rounded-full hover:bg-gray-50 transition-all flex items-center justify-center gap-2 ${className}`}
  >
    {children} {icon}
  </button>
);

export default function CustomSolutionsPage() {
  const router = useRouter();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Dynamic Data
  const [heroVideo, setHeroVideo] = useState<string | null>(null);
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [showAllSolutions, setShowAllSolutions] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  
  // Modal State
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [imageSelectModalOpen, setImageSelectModalOpen] = useState(false);
  const [selectedSolutionImage, setSelectedSolutionImage] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Calculator State
  const [calcLength, setCalcLength] = useState("");
  const [calcWidth, setCalcWidth] = useState("");
  
  // Submit Loading
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [visitLoading, setVisitLoading] = useState(false);
  
  const area = Number(calcLength) * Number(calcWidth);
  const resin = (area * 0.15).toFixed(1); // Mock formula
  const budget = (area * 350).toLocaleString("en-IN"); // Mock formula ₹350/sqft
  
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, imagesRes, solRes, projRes, revRes] = await Promise.all([
          fetch("/api/custom-solutions/hero"),
          fetch("/api/services-hero"),
          fetch("/api/custom-solutions/solutions"),
          fetch("/api/custom-solutions/projects"),
          fetch("/api/custom-solutions/reviews")
        ]);
        
        const heroData = await heroRes.json();
        const imagesData = await imagesRes.json();
        const solData = await solRes.json();
        const projData = await projRes.json();
        const revData = await revRes.json();
        
        setHeroVideo(heroData.settings?.heroVideoUrl || null);
        setHeroImages(imagesData.images || []);
        setSolutions(solData.solutions || []);
        setProjects(projData.projects || []);
        setReviews(revData.reviews || []);
      } catch (error) {
        console.error("Error fetching custom solutions data", error);
      } finally {
        setDataLoaded(true);
      }
    };
    
    fetchData();
  }, []);

  const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setQuoteLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("type", "quote");
      if (selectedSolutionImage) {
        formData.append("selectedImageUrl", selectedSolutionImage.url);
        formData.append("selectedImageId", selectedSolutionImage.id.toString());
      }
      const res = await fetch("/api/custom-solutions/inquiries", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Submission failed");
      
      toast.success("Quote request submitted successfully!");
      
      const text = `Hi, I would like to request a quote for ${formData.get("projectType")}.
Name: ${formData.get("name")}
Phone: ${formData.get("phone")}
City: ${formData.get("city") || 'N/A'}
Area: ${formData.get("area") || 'N/A'} sq.ft
Budget: ${formData.get("budget") || 'N/A'}
Requirement: ${formData.get("description") || 'N/A'}`;
      const whatsappUrl = `https://wa.me/917204468429?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      
      setQuoteModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Error submitting form");
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleVisitSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVisitLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("type", "visit");
      const res = await fetch("/api/custom-solutions/inquiries", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Submission failed");
      
      toast.success("Site visit requested successfully!");
      
      const text = `Hi, I would like to book a site visit.
Preferred Date: ${formData.get("preferredDate")}
Preferred Time: ${formData.get("preferredTime") || 'N/A'}
Address: ${formData.get("address")}
Map Link: ${formData.get("mapLocation") || 'N/A'}`;
      const whatsappUrl = `https://wa.me/917204468429?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      
      setVisitModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Error submitting form");
    } finally {
      setVisitLoading(false);
    }
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#135db6]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#135db6] rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold tracking-widest uppercase">Preparing Experience...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 selection:bg-[#135db6]/20">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex items-center bg-white pt-8 lg:pt-10 pb-16 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left: Text Content */}
          <div className="flex flex-col items-start z-10 relative">
            <div className="inline-block px-5 py-1.5 rounded-full border border-[#135db6] text-[#135db6] text-xs font-bold tracking-widest uppercase mb-8 mt-4">
              Custom Solutions
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 mb-6 leading-[1.1] font-serif">
              Transform your<br />space with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493] font-bold">premium<br />epoxy<br />craftsmanship</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-md font-medium leading-relaxed">
              Custom epoxy flooring, river tables, wall panels and corporate installations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <PrimaryButton 
                onClick={() => setQuoteModalOpen(true)} 
                className="px-8 py-4 text-lg w-full sm:w-auto shadow-lg"
              >
                Request quote
              </PrimaryButton>
              <OutlineButton 
                onClick={() => setVisitModalOpen(true)} 
                className="px-8 py-4 text-lg w-full sm:w-auto border-2 border-gray-200 text-gray-700 hover:border-[#135db6] hover:text-[#135db6] hover:bg-transparent"
              >
                Book site visit
              </OutlineButton>
            </div>
          </div>

          {/* Right: Masonry Images */}
          <div className="relative w-full h-[500px] md:h-[600px]">
            {heroImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Left tall image */}
                <div className="relative h-full rounded-[2rem] overflow-hidden shadow-xl group bg-gray-100">
                  {heroImages[0]?.mediaUrl ? (
                    <>
                      <Image src={heroImages[0].mediaUrl} alt={heroImages[0].title || "Service 1"} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      {heroImages[0].title && (
                        <div className="absolute bottom-6 left-6 right-6">
                          <span className="text-white-force text-2xl md:text-3xl font-black drop-shadow-2xl leading-tight block">{heroImages[0].title}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <div className="w-16 h-16 mb-4 rounded-full bg-gray-200 flex items-center justify-center">📷</div>
                      <span className="font-medium text-sm">More images coming soon</span>
                    </div>
                  )}
                </div>
                
                {/* Right stacked images */}
                <div className="flex flex-col gap-4 h-full">
                  {/* Top right */}
                  <div className="relative h-1/2 rounded-[2rem] overflow-hidden shadow-xl group bg-gray-100">
                    {heroImages[1]?.mediaUrl ? (
                      <>
                        <Image src={heroImages[1].mediaUrl} alt={heroImages[1].title || "Service 2"} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        {heroImages[1].title && (
                          <div className="absolute bottom-5 left-5 right-5">
                            <span className="text-white-force text-xl md:text-2xl font-black drop-shadow-2xl leading-tight block">{heroImages[1].title}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50/50">
                        <span className="font-medium text-sm">Image Slot</span>
                      </div>
                    )}
                  </div>
                  {/* Bottom right */}
                  <div className="relative h-1/2 rounded-[2rem] overflow-hidden shadow-xl group bg-gray-100">
                    {heroImages[2]?.mediaUrl ? (
                      <>
                        <Image src={heroImages[2].mediaUrl} alt={heroImages[2].title || "Service 3"} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        {heroImages[2].title && (
                          <div className="absolute bottom-5 left-5 right-5">
                            <span className="text-white-force text-xl md:text-2xl font-black drop-shadow-2xl leading-tight block">{heroImages[2].title}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50/50">
                        <span className="font-medium text-sm">Image Slot</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-[2rem] flex items-center justify-center text-gray-500">
                Please upload 3 images via Admin Panel
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. OUR SOLUTIONS */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Solutions</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full mb-8"></div>
          {solutions.length === 0 && <p className="text-gray-500">No solutions added yet. Manage them in the Admin Panel.</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.length > 0 ? (showAllSolutions ? solutions : solutions.slice(0, Math.max(3, solutions.length - (solutions.length % 3)))).map((sol) => (
            <div key={sol.id} onClick={() => router.push(`/customservices/${sol.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`)} className="group relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent z-10" />
                {sol.imageUrl ? (
                  <img src={sol.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={sol.title} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-4xl group-hover:scale-110 transition-transform duration-700">📸</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-[#ffffff] drop-shadow-md mb-1">{sol.title}</h3>
                  <p className="text-[#ffffff] drop-shadow-md text-sm">{sol.description}</p>
                </div>
              </div>
              <div className="p-5 flex justify-between items-center text-[#135db6] font-semibold group-hover:bg-gray-50 transition-colors">
                <span>Request details</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )) : null}
        </div>
        
        {solutions.length > Math.max(3, solutions.length - (solutions.length % 3)) && (
          <div className="mt-12 flex justify-center">
            <OutlineButton 
              onClick={() => setShowAllSolutions(!showAllSolutions)} 
              className="px-8 py-3 text-sm"
            >
              {showAllSolutions ? "View Less" : "View More"}
            </OutlineButton>
          </div>
        )}
      </section>

      {/* 3. OUR PROCESS (Snake grid layout) */}
      <section className="py-24 bg-gray-50 relative border-y border-gray-200 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Process</span>
            </h2>
            <p className="text-gray-600">From concept to perfection, step by step.</p>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex flex-col items-center">
            {Array.from({ length: Math.ceil(PROCESS_STEPS.length / 2) }).map((_, rowIndex) => {
              const isEvenRow = rowIndex % 2 === 0;
              const item1 = PROCESS_STEPS[rowIndex * 2];
              const item2 = PROCESS_STEPS[rowIndex * 2 + 1];

              return (
                <div key={rowIndex} className="flex w-full max-w-4xl relative mb-20">
                  {/* Vertical connecting dashed line to previous row */}
                  {rowIndex > 0 && (
                    <div 
                      className={`absolute -top-20 h-20 w-[2px] border-l-[3px] border-dashed border-[#135db6]/40 ${!isEvenRow ? "right-[25%]" : "left-[25%]"}`} 
                    >
                       <ChevronsDown className="absolute -bottom-4 -left-3 w-6 h-6 text-[#135db6]/60" />
                    </div>
                  )}
                  
                  {isEvenRow ? (
                     // Left to Right (1 -> 2)
                     <>
                       <div className="w-1/2 flex justify-center relative">
                          {item1 && (
                            <div className="flex flex-col items-center text-center max-w-[220px]">
                              <div className="w-24 h-24 rounded-full border-[3px] border-[#135db6] text-[#135db6] flex items-center justify-center mb-6 bg-white relative z-10 shadow-[0_0_20px_rgba(19,93,182,0.15)]">
                                <item1.icon className="w-10 h-10" />
                              </div>
                              <h3 className="font-bold text-lg text-gray-900 mb-2">{rowIndex * 2 + 1}. {item1.title}</h3>
                              <p className="text-sm text-gray-500 leading-tight">{item1.desc}</p>
                            </div>
                          )}
                          {/* Horizontal dashed line */}
                          {item2 && (
                            <div className="absolute top-12 left-[50%] w-full border-t-[3px] border-dashed border-[#135db6]/40 -z-0">
                               <ChevronsRight className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 text-[#135db6]/60 bg-gray-50 px-1" />
                            </div>
                          )}
                       </div>
                       <div className="w-1/2 flex justify-center relative">
                          {item2 && (
                            <div className="flex flex-col items-center text-center max-w-[220px]">
                              <div className="w-24 h-24 rounded-full border-[3px] border-[#135db6] text-[#135db6] flex items-center justify-center mb-6 bg-white relative z-10 shadow-[0_0_20px_rgba(19,93,182,0.15)]">
                                <item2.icon className="w-10 h-10" />
                              </div>
                              <h3 className="font-bold text-lg text-gray-900 mb-2">{rowIndex * 2 + 2}. {item2.title}</h3>
                              <p className="text-sm text-gray-500 leading-tight">{item2.desc}</p>
                            </div>
                          )}
                       </div>
                     </>
                  ) : (
                     // Right to Left (4 <- 3)
                     <>
                       <div className="w-1/2 flex justify-center relative">
                          {item2 && (
                            <div className="flex flex-col items-center text-center max-w-[220px]">
                              <div className="w-24 h-24 rounded-full border-[3px] border-[#135db6] text-[#135db6] flex items-center justify-center mb-6 bg-white relative z-10 shadow-[0_0_20px_rgba(19,93,182,0.15)]">
                                <item2.icon className="w-10 h-10" />
                              </div>
                              <h3 className="font-bold text-lg text-gray-900 mb-2">{rowIndex * 2 + 2}. {item2.title}</h3>
                              <p className="text-sm text-gray-500 leading-tight">{item2.desc}</p>
                            </div>
                          )}
                       </div>
                       <div className="w-1/2 flex justify-center relative">
                          {item1 && (
                            <div className="flex flex-col items-center text-center max-w-[220px]">
                              <div className="w-24 h-24 rounded-full border-[3px] border-[#135db6] text-[#135db6] flex items-center justify-center mb-6 bg-white relative z-10 shadow-[0_0_20px_rgba(19,93,182,0.15)]">
                                <item1.icon className="w-10 h-10" />
                              </div>
                              <h3 className="font-bold text-lg text-gray-900 mb-2">{rowIndex * 2 + 1}. {item1.title}</h3>
                              <p className="text-sm text-gray-500 leading-tight">{item1.desc}</p>
                            </div>
                          )}
                          {/* Horizontal dashed line */}
                          {item2 && (
                            <div className="absolute top-12 right-[50%] w-full border-t-[3px] border-dashed border-[#135db6]/40 -z-0">
                               <ChevronsLeft className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 text-[#135db6]/60 bg-gray-50 px-1" />
                            </div>
                          )}
                       </div>
                     </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Layout */}
          <div className="flex md:hidden flex-col items-center gap-12 relative">
            <div className="absolute top-10 bottom-10 left-1/2 w-[3px] bg-transparent border-l-[3px] border-dashed border-[#135db6]/40 -translate-x-1/2"></div>
            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center max-w-[250px] bg-gray-50 relative z-10 p-2">
                <div className="w-20 h-20 rounded-full border-[3px] border-[#135db6] text-[#135db6] flex items-center justify-center mb-4 bg-white shadow-md">
                  <step.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{idx + 1}. {step.title}</h3>
                <p className="text-sm text-gray-500 leading-tight">{step.desc}</p>
                {idx < PROCESS_STEPS.length - 1 && (
                  <ChevronsDown className="absolute -bottom-10 text-[#135db6]/60 w-6 h-6 z-20 bg-gray-50 py-1" />
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. RECENT PROJECTS (Auto scroll) */}
      <section className="py-24 px-4 overflow-hidden bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Recent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full"></div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide px-4 md:px-20">
          {projects.length > 0 ? projects.map((proj) => (
            <div key={proj.id} className="snap-center shrink-0 w-[350px] md:w-[450px] bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden hover:shadow-2xl transition-all cursor-pointer group">
              <div className="relative h-60 flex">
                <div className="w-1/2 bg-gray-100 flex items-center justify-center text-gray-400 border-r border-white relative overflow-hidden">
                  <span className="absolute top-2 left-2 bg-white/90 text-xs px-2 py-1 rounded shadow-sm text-gray-800 font-semibold z-10">Before</span>
                  {proj.beforeImageUrl ? <img src={proj.beforeImageUrl} className="absolute inset-0 w-full h-full object-cover" /> : "📷"}
                </div>
                <div className="w-1/2 bg-gray-200 flex items-center justify-center text-gray-500 relative overflow-hidden">
                  <span className="absolute top-2 right-2 bg-gradient-to-r from-[#135db6] to-[#008493] text-xs px-2 py-1 rounded shadow-sm text-white-force font-bold z-10">After</span>
                  {proj.afterImageUrl ? <img src={proj.afterImageUrl} className="absolute inset-0 w-full h-full object-cover" /> : "📸"}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#135db6] transition-colors">{proj.title}</h3>
                  <span className="text-sm font-semibold bg-[#135db6]/10 px-2 py-1 rounded text-[#135db6] whitespace-nowrap ml-2">{proj.costRange}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">{proj.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {proj.city}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {proj.timeTaken}</span>
                </div>
                <button onClick={() => setQuoteModalOpen(true)} className="w-full mt-6 py-3 bg-gray-50 hover:bg-[#135db6]/5 rounded-xl text-[#135db6] font-bold transition-colors flex justify-center items-center gap-2 border border-gray-100">
                  Discuss a Similar Project <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )) : (
             <p className="text-center text-gray-500 w-full">No projects added yet.</p>
          )}
        </div>
      </section>

      {/* 5. REQUEST QUOTE / BOOK VISIT BUTTONS */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row gap-6 justify-center">
          <button onClick={() => setQuoteModalOpen(true)} className="flex-1 py-8 px-8 bg-white border border-gray-200 shadow-xl shadow-gray-200/50 rounded-3xl flex flex-col items-center gap-4 hover:-translate-y-2 hover:shadow-2xl hover:border-[#135db6]/30 transition-all group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#135db6]/10 to-[#008493]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calculator className="w-10 h-10 text-[#135db6]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Get Free Quote</h3>
            <p className="text-gray-500 text-center">Share your requirements and get a detailed estimate.</p>
          </button>
          
          <button onClick={() => setVisitModalOpen(true)} className="flex-1 py-8 px-8 bg-white border border-gray-200 shadow-xl shadow-gray-200/50 rounded-3xl flex flex-col items-center gap-4 hover:-translate-y-2 hover:shadow-2xl hover:border-[#008493]/30 transition-all group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#008493]/10 to-[#135db6]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-10 h-10 text-[#008493]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Book Site Inspection</h3>
            <p className="text-gray-500 text-center">Schedule our expert team to visit your location.</p>
          </button>
        </div>
      </section>

      {/* 6. EPOXY FLOORING CALCULATOR */}
      <section className="py-24 px-4 max-w-6xl mx-auto bg-white">
        <div className="bg-white rounded-[3rem] border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#135db6]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#008493]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Epoxy Flooring <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Calculator</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full mb-4"></div>
            <p className="text-gray-500">Get an instant estimate for your next flooring project.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-12 relative z-10">
            <div className="flex-1 flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Length (Feet)</label>
                <input 
                  type="number" 
                  value={calcLength} 
                  onChange={(e) => setCalcLength(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 text-lg transition-all"
                  placeholder="e.g. 20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Width (Feet)</label>
                <input 
                  type="number" 
                  value={calcWidth} 
                  onChange={(e) => setCalcWidth(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-gray-900 focus:outline-none focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 text-lg transition-all"
                  placeholder="e.g. 15"
                />
              </div>
            </div>
            
            <div className="flex-1 bg-gradient-to-br from-[#135db6] to-[#008493] rounded-3xl p-8 shadow-2xl flex flex-col justify-center gap-6 text-[#ffffff] relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10 text-[#ffffff]">
                <Calculator className="w-64 h-64" />
              </div>
              <div className="relative z-10 flex justify-between items-end border-b border-[#ffffff]/20 pb-4">
                <span className="font-medium text-[#ffffff]/80">Approx Area</span>
                <span className="text-2xl font-bold text-[#ffffff]">{area > 0 ? area : 0} <span className="text-sm text-[#ffffff]/60">sq.ft</span></span>
              </div>
              <div className="relative z-10 flex justify-between items-end border-b border-[#ffffff]/20 pb-4">
                <span className="font-medium text-[#ffffff]/80">Estimated Resin</span>
                <span className="text-2xl font-bold text-[#ffffff]">{area > 0 ? resin : 0} <span className="text-sm text-[#ffffff]/60">KGs</span></span>
              </div>
              <div className="relative z-10 flex justify-between items-end pt-2">
                <span className="font-bold text-lg text-[#ffffff]">Estimated Budget</span>
                <span className="text-4xl font-black text-[#ffffff]">₹{area > 0 ? budget : 0}*</span>
              </div>
              <p className="relative z-10 text-xs text-[#ffffff]/80 mt-2">*This is a rough estimate. Actual costs may vary based on design complexity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE US */}
      <section className="py-24 bg-gray-50 relative border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Choose Us</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: "💎", title: "Premium Resin" },
              { icon: "👷‍♂️", title: "Experienced Team" },
              { icon: "🎨", title: "Customized Design" },
              { icon: "⏳", title: "Long Life Finish" },
              { icon: "🛠️", title: "Professional Installation" },
              { icon: "🇮🇳", title: "Pan India Service" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-3xl p-8 flex flex-col items-center text-center hover:-translate-y-2 transition-transform shadow-lg shadow-gray-200/50">
                <div className="text-5xl mb-6 bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center shadow-inner">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQs */}
      <section className="py-24 px-4 max-w-4xl mx-auto bg-white">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Questions</span>
          </h2>
        </div>
        
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === idx ? "border-[#135db6] shadow-md bg-white" : "border-gray-200 bg-gray-50 hover:border-[#135db6]/50"}`}>
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
              >
                <span className={`font-bold text-lg ${openFaq === idx ? "text-[#135db6]" : "text-gray-800"}`}>{faq.q}</span>
                <span className={`p-2 rounded-full transition-colors ${openFaq === idx ? "bg-[#135db6]/10 text-[#135db6]" : "bg-white text-gray-400"}`}>
                  {openFaq === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>
              <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === idx ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CUSTOMER REVIEWS (Scrollable) */}
      <section className="py-24 bg-gray-50 border-y border-gray-200 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Reviews</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#135db6] to-[#008493] mx-auto rounded-full"></div>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-12 snap-x scrollbar-hide px-4 md:px-20">
          {reviews.length > 0 ? reviews.map((review) => (
            <div key={review.id} className="snap-center shrink-0 w-[300px] md:w-[400px] bg-white rounded-3xl p-8 border border-gray-200 shadow-xl shadow-gray-200/50 flex flex-col justify-between">
              <div>
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(review.rating)].map((_, i) => <span key={i}>★</span>)}
                </div>
                <p className="text-gray-700 text-lg mb-6 italic font-medium">"{review.text}"</p>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl shadow-inner overflow-hidden">
                  {review.avatarUrl ? <img src={review.avatarUrl} className="w-full h-full object-cover" /> : "👤"}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-[#135db6] font-medium">Verified Client</p>
                </div>
              </div>
            </div>
          )) : (
            <p className="w-full text-center text-gray-500">No reviews added yet.</p>
          )}
        </div>
      </section>

      {/* 10. CTA */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-[#135db6]/5 via-white to-[#008493]/5" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
            Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#135db6] to-[#008493]">Space?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12">Connect with our experts today and bring your vision to reality.</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <PrimaryButton onClick={() => setQuoteModalOpen(true)} className="w-full sm:w-auto px-10 py-5 text-lg">
              Request Quote
            </PrimaryButton>
            <OutlineButton onClick={() => window.location.href='tel:+917204468429'} className="w-full sm:w-auto px-10 py-5 text-lg" icon={<Phone className="w-5 h-5" />}>
              Call Now
            </OutlineButton>
            <a href="https://wa.me/917204468429" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#0f52ba] to-[#008080] hover:opacity-90 text-white-force font-bold rounded-full transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3 text-lg border-0">
              <MessageCircle className="w-6 h-6" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* MODALS */}

      {/* Image Selection Modal */}
      {imageSelectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-hidden">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl w-full max-w-5xl relative p-8">
            <button onClick={() => setImageSelectModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Select a Reference Image</h2>
            <p className="text-gray-500 mb-6">Choose an image that best matches your requirement.</p>
            
            <div className="flex gap-4 overflow-x-auto snap-x pb-4">
              {[...solutions.filter((s:any) => s.imageUrl).map((s:any) => ({id: s.id, url: s.imageUrl, title: s.title})), ...projects.filter((p:any) => p.afterImageUrl).map((p:any) => ({id: p.id, url: p.afterImageUrl, title: p.title}))].map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setSelectedSolutionImage(img);
                    setImageSelectModalOpen(false);
                    setQuoteModalOpen(true);
                  }}
                  className="snap-center shrink-0 w-[250px] md:w-[300px] aspect-video relative rounded-2xl overflow-hidden cursor-pointer border-4 border-transparent hover:border-[#135db6] transition-all group"
                >
                  <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-[#135db6] text-white-force px-4 py-2 rounded-full font-bold">Select</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {quoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 pb-20 sm:p-10 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl w-full max-w-2xl relative my-auto p-8 md:p-10">
            <button onClick={() => setQuoteModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Get Free Quote</h2>
            <p className="text-gray-500 mb-8">Fill the details below and our team will get back to you with an estimate.</p>
            
            {selectedSolutionImage && (
              <div className="mb-6 p-4 bg-[#135db6]/5 border border-[#135db6]/20 rounded-xl flex items-center gap-4">
                <img src={selectedSolutionImage.url} className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Selected Reference:</p>
                  <p className="text-xs text-gray-500">{selectedSolutionImage.title}</p>
                  <button type="button" onClick={() => setSelectedSolutionImage(null)} className="text-xs text-red-500 mt-1 hover:underline">Remove</button>
                </div>
              </div>
            )}
            
            <form onSubmit={handleQuoteSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label><input name="name" type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Phone</label><input name="phone" type="tel" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Email</label><input name="email" type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">City</label><input name="city" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">State</label><input name="state" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Project Type</label><select name="projectType" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all"><option>Epoxy Flooring</option><option>River Table</option><option>Wall Panel</option></select></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Area (sq.ft)</label><input name="area" type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Budget</label><input name="budget" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
                <div><label className="block text-sm font-bold text-gray-700 mb-1">Preferred Date</label><input name="preferredDate" type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Upload Images</label>
                  <label className={`w-full bg-gray-50 border-2 ${selectedFile ? 'border-[#135db6] bg-[#135db6]/5' : 'border-gray-200 border-dashed'} rounded-xl px-4 py-3 text-gray-500 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#135db6] hover:bg-[#135db6]/5 transition-colors`}>
                    {selectedFile ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-[#135db6]" />
                        <span className="text-sm font-medium text-[#135db6] truncate w-full text-center">{selectedFile.name}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> 
                        <span className="text-sm">Click to Upload</span>
                      </>
                    )}
                    <input type="file" name="image" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Describe Requirement</label><textarea name="description" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all"></textarea></div>
              <PrimaryButton type="submit" className="w-full py-4 text-lg" disabled={quoteLoading}>{quoteLoading ? "Submitting..." : "Submit Request"}</PrimaryButton>
            </form>
          </div>
        </div>
      )}

      {/* Visit Modal */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 pb-20 sm:p-10 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl w-full max-w-md relative my-auto p-8 md:p-10">
            <button onClick={() => setVisitModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-100 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Book Site Visit</h2>
            <p className="text-gray-500 mb-8">Schedule an inspection.</p>
            
            <form onSubmit={handleVisitSubmit} className="space-y-6">
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Select Date</label><input name="preferredDate" type="date" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Select Time</label><input name="preferredTime" type="time" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Address</label><textarea name="address" required rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all"></textarea></div>
              <div><label className="block text-sm font-bold text-gray-700 mb-1">Google Map Location (Link)</label><input name="mapLocation" type="url" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-[#135db6] focus:ring-2 focus:ring-[#135db6]/20 focus:outline-none transition-all" /></div>
              <PrimaryButton type="submit" className="w-full py-4 text-lg" disabled={visitLoading}>{visitLoading ? "Booking..." : "Confirm Booking"}</PrimaryButton>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
