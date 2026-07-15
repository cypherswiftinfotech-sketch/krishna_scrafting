"use client";
import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  CheckCircle, 
  Award, 
  BookOpen, 
  PlayCircle, 
  Phone, 
  Download, 
  Users, 
  Star, 
  Briefcase, 
  ArrowDown,
  X,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface BannerSettings {
  mediaUrl: string;
  whatsappNumber?: string;
}

interface Training {
  id: number;
  title: string;
  category: string;
  description: string | null;
  duration: string | null;
  price: string;
  language: string | null;
  seats: number | null;
  imageUrl: string | null;
}

interface Story {
  id: number;
  title: string;
  category: string;
  videoUrl: string;
}

const TICKER_ITEMS = [
  "100% Practical Training",
  "ISO Certified Institute",
  "Lifetime Support",
  "Business Mentorship",
  "Premium Materials"
];

const JOURNEY_STEPS = [
  "Beginner", "Foundation", "Intermediate", "Professional", "Master", "Business", "Trainer"
];

const WHAT_YOU_LEARN = [
  { title: "Resin Science", desc: "Understand resin chemistry, curing process, ratios and professional applications." },
  { title: "Material Selection", desc: "Learn how to select the right resin, pigments, wood, tools and accessories." },
  { title: "Coating Techniques", desc: "Master crystal-clear coating for tables, artwork and decorative surfaces." },
  { title: "Casting Techniques", desc: "Deep pour casting, object embedding and river table creation." },
  { title: "Furniture Manufacturing", desc: "Design and manufacture premium epoxy furniture." },
  { title: "Epoxy Flooring", desc: "Industrial, commercial and decorative flooring systems." },
  { title: "Wall Art & Home Décor", desc: "Luxury wall panels, clocks, trays, tables and customized décor." },
  { title: "Quality Control", desc: "Professional finishing, polishing, repairs and quality inspection." },
  { title: "Business & Marketing", desc: "Pricing, branding, quotations, portfolio creation and lead generation." }
];

const PRACTICAL_EXPERIENCE = [
  "Live Demonstrations",
  "Individual Practical Sessions",
  "Guided Project Work",
  "Professional Tool Usage",
  "Factory-Style Production Process",
  "Product Finishing Techniques",
  "Material Handling",
  "Business Guidance"
];

const PRODUCTS_CREATE = [
  "Resin Coasters", "Serving Trays", "Resin Clocks", "Wall Art", "River Tables", 
  "Dining Tables", "Coffee Tables", "Luxury Furniture", "Metallic Flooring Samples", 
  "Corporate Gifts", "Name Plates", "Decorative Panels"
];

const CAREERS = [
  "Professional Resin Artist", "Furniture Manufacturer", "Epoxy Flooring Contractor", 
  "Corporate Project Vendor", "Workshop Trainer", "Interior Product Manufacturer", 
  "Luxury Home Décor Brand", "Business Owner", "Freelancer", "Export Product Manufacturer"
];

const WHY_CHOOSE_US = [
  { title: "Industry Expert Trainers", desc: "Learn directly from professionals with real production experience." },
  { title: "International Standard Curriculum", desc: "Designed to match global industry practices and manufacturing standards." },
  { title: "100% Practical Learning", desc: "Every module includes live practical sessions." },
  { title: "Small Batch Training", desc: "Personal attention for every participant." },
  { title: "Premium Materials & Tools", desc: "Practice with professional-grade equipment." },
  { title: "Lifetime Technical Support", desc: "Continuous guidance even after course completion." },
  { title: "Business Mentorship", desc: "Learn how to start and scale your own business." },
  { title: "Certification", desc: "Receive a professional certification after successful assessment." }
];

const CORPORATE_TRAINING = [
  "Interior Designers", "Furniture Manufacturers", "Architects", "Construction Companies", 
  "Educational Institutions", "Design Colleges", "Corporate Innovation Teams", "Manufacturing Companies"
];

const FAQS = [
  { q: "Who can join?", a: "Anyone with a passion for creativity and business. No specific educational background is required." },
  { q: "Do I need prior experience?", a: "No, our courses are designed from the ground up, starting from absolute basics." },
  { q: "Are all materials provided?", a: "Yes, all professional-grade materials and tools are provided during the practical sessions." },
  { q: "Will I receive a certificate?", a: "Yes, you will receive a professional certification upon successful completion of your assessment." },
  { q: "Can I start my own business after training?", a: "Absolutely! Our Business modules specifically teach you how to start, scale, and market your resin business." },
  { q: "Do you provide lifetime support?", a: "Yes, we provide continuous technical guidance and support even after you complete the course." },
  { q: "Can international students join?", a: "Yes, we welcome students from across the globe and ensure our curriculum meets international standards." },
  { q: "Do you provide accommodation?", a: "We can assist with recommendations for nearby accommodations for outstation students." }
];

export default function TrainingsRedesignPage() {
  const [banner, setBanner] = useState<BannerSettings | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showModal, setShowModal] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);

  const WHATSAPP_NUMBER = banner?.whatsappNumber || "918319668016";

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProductIndex((prev) => (prev + 1) % PRODUCTS_CREATE.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/training-banner")
      .then(res => res.json())
      .then(data => {
        if (data.settings) setBanner(data.settings);
        else if (data.banner) setBanner(data.banner);
      })
      .catch(console.error);

    fetch("/api/student-success-stories")
      .then(res => res.json())
      .then(data => setStories(data.stories || []))
      .catch(console.error);

    fetch("/api/trainings")
      .then(res => res.json())
      .then(data => setTrainings(data.trainings || []))
      .catch(console.error);
  }, []);

  const handleCounsellingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingModal(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      message: "I am interested in Free Counselling for Training Programs.",
      productInterest: "Training Counselling"
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Request submitted! We will contact you soon.");
        setShowModal(false);
      } else {
        toast.error("Failed to submit request.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoadingModal(false);
    }
  };

  const scrollToCourses = () => {
    const el = document.getElementById("learning-paths");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-0" style={{ fontFamily: "var(--font-body)" }}>
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative w-full h-screen min-h-[600px] flex flex-col justify-center overflow-hidden bg-black">
        {banner?.mediaUrl ? (
          banner.mediaUrl.match(/\.(mp4|webm)$/i) ? (
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
              <source src={banner.mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <Image src={banner.mediaUrl} alt="Training Background" fill className="object-cover" />
          )
        ) : null}
        
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#ffffff] mb-6 drop-shadow-xl" style={{ fontFamily: "var(--font-heading)", textShadow: "0px 2px 10px rgba(0,0,0,0.8)" }}>
            Become a Certified <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 drop-shadow-md">Epoxy Resin Professional</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-[#ffffff] mb-6 tracking-wide uppercase drop-shadow" style={{ textShadow: "0px 2px 8px rgba(0,0,0,0.8)" }}>
            Professional Epoxy Resin Training & Certification Programs
          </h2>
          <p className="text-lg md:text-xl text-[#e5e7eb] max-w-4xl mx-auto mb-10 leading-relaxed drop-shadow" style={{ textShadow: "0px 1px 5px rgba(0,0,0,0.8)" }}>
            Master premium epoxy resin techniques through hands-on practical training. Learn to create luxury resin products, epoxy furniture, river tables, metallic flooring, home décor, and corporate projects while building a successful creative business.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={scrollToCourses} className="px-8 py-4 bg-gradient-to-r from-[#0f52ba] to-[#008080] hover:opacity-90 text-white font-bold rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(15,82,186,0.4)] flex items-center gap-2 border-0">
              <BookOpen className="w-5 h-5" /> Explore Courses
            </button>
            <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-white hover:bg-gray-100 text-[#0f52ba] font-bold rounded-full transition-all hover:scale-105 shadow-lg flex items-center gap-2">
              <Users className="w-5 h-5" /> Book Free Counselling
            </button>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want to know more about the training programs`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg flex items-center gap-2">
              <Phone className="w-5 h-5" /> WhatsApp Now
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 w-full bg-gradient-to-r from-[#0f52ba] to-[#008080] py-3 overflow-hidden border-t-2 border-white/20 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] z-20">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <span key={idx} className="mx-8 text-white font-bold tracking-wider uppercase text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUSTED BY & CORPORATE */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f52ba] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Trusted by Creative Professionals & Entrepreneurs
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our training methodology is preferred by industry professionals looking to upgrade their skills or start their own manufacturing business.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {CORPORATE_TRAINING.map((corp, i) => (
              <span key={i} className="px-6 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-full shadow-sm hover:border-[#0f52ba] hover:text-[#0f52ba] transition-colors cursor-default">
                {corp}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: COURSE CATALOG */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0f52ba] to-[#008080] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Available Training Programs
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Select a professional certification path that fits your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainings.map((course) => (
              <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group flex flex-col">
                <div className="relative h-64 overflow-hidden">
                  {course.imageUrl ? (
                    <Image src={course.imageUrl} alt={course.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#008080] uppercase tracking-widest shadow-sm">
                    {course.category}
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0f52ba] to-[#008080] mb-4 leading-tight group-hover:text-[#008080] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {course.description || "Comprehensive professional training program designed for career success."}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Duration</span>
                        <span className="font-bold text-gray-900">{course.duration || "Self-Paced"}</span>
                      </div>
                      <Link href={`/trainings/${course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="bg-[#0f52ba] hover:bg-[#008080] text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: LEARNING JOURNEY */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 relative overflow-hidden" id="learning-paths">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#0f52ba]" style={{ fontFamily: "var(--font-heading)" }}>
              Your Learning Journey
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-medium">
              Start your journey from basic resin knowledge to becoming a certified professional.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto py-10">
            <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-1.5 bg-gradient-to-t from-gray-200 via-[#008080] to-[#0f52ba] md:-translate-x-1/2 rounded-full"></div>
            
            <div className="flex flex-col-reverse gap-16">
              {JOURNEY_STEPS.map((step, i) => {
                const isEven = i % 2 === 0;
                const stepIcons = [
                  <PlayCircle key="0" className="w-8 h-8 md:w-10 md:h-10 text-[#0f52ba]" />,
                  <BookOpen key="1" className="w-8 h-8 md:w-10 md:h-10 text-[#0f52ba]" />,
                  <Star key="2" className="w-8 h-8 md:w-10 md:h-10 text-[#0f52ba]" />,
                  <CheckCircle key="3" className="w-8 h-8 md:w-10 md:h-10 text-[#0f52ba]" />,
                  <Award key="4" className="w-8 h-8 md:w-10 md:h-10 text-[#0f52ba]" />,
                  <Briefcase key="5" className="w-8 h-8 md:w-10 md:h-10 text-[#0f52ba]" />,
                  <Users key="6" className="w-8 h-8 md:w-10 md:h-10 text-[#0f52ba]" />
                ];

                return (
                  <div key={i} className={`relative flex items-center group w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}>
                    
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-10 h-10 md:w-14 md:h-14 bg-white rounded-full border-[5px] border-[#0f52ba] z-20 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform group-hover:border-[#008080]">
                      <span className="text-[#0f52ba] font-black text-sm md:text-lg group-hover:text-[#008080]">{i + 1}</span>
                    </div>

                    <div className={`w-full md:w-1/2 flex pl-20 md:pl-0 ${isEven ? 'md:pr-16 md:justify-end' : 'md:pl-16 md:justify-start'}`}>
                      <div className={`w-full max-w-sm bg-white p-6 md:p-6 rounded-3xl shadow-[0_10px_30px_rgba(15,82,186,0.08)] border border-gray-100 group-hover:border-[#0f52ba] group-hover:shadow-[0_20px_40px_rgba(15,82,186,0.18)] transition-all group-hover:-translate-y-2 relative z-10`}>
                        <div className={`flex items-center gap-4 md:gap-5 ${isEven ? 'md:flex-row-reverse' : 'flex-row'}`}>
                          <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm border border-gray-100">
                            {stepIcons[i % stepIcons.length]}
                          </div>
                          <div className={`flex flex-col ${isEven ? 'md:items-end text-right' : 'items-start text-left'}`}>
                            <span className="text-[#008080] font-black text-xs md:text-sm tracking-widest uppercase flex items-center gap-2 mb-1">
                              {isEven ? <span className="hidden md:inline-block w-6 h-0.5 bg-[#008080]"></span> : null}
                              PHASE {i + 1}
                              {!isEven ? <span className="hidden md:inline-block w-6 h-0.5 bg-[#008080]"></span> : null}
                              <span className="inline-block md:hidden w-6 h-0.5 bg-[#008080]"></span>
                            </span>
                            <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0f52ba] to-[#008080] leading-tight">{step}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHAT YOU'LL LEARN */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0f52ba] to-[#008080]" style={{ fontFamily: "var(--font-heading)" }}>
              What You'll Learn
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHAT_YOU_LEARN.map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#008080] transition-colors group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-[#0f52ba]" />
                </div>
                <h3 className="text-lg font-bold text-[#0f52ba] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 & 7: PRACTICAL EXP & PRODUCTS */}
      <section className="py-24 bg-gray-50 text-gray-900 border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#0f52ba]" style={{ fontFamily: "var(--font-heading)" }}>
                Practical Training Experience
              </h2>
              <p className="text-gray-600 mb-10 text-lg">
                Our workshops focus on learning through real projects rather than classroom theory. You'll experience:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {PRACTICAL_EXPERIENCE.map((exp, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:border-[#008080] hover:shadow-md transition-all">
                    <CheckCircle className="w-6 h-6 text-[#0f52ba] shrink-0 mt-0.5" />
                    <span className="font-semibold text-gray-800 leading-tight">{exp}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-[#0f52ba]" style={{ fontFamily: "var(--font-heading)" }}>
                Products You'll Create
              </h2>
              <p className="text-gray-600 mb-10 text-lg">
                During your practical sessions you'll manufacture products like:
              </p>
              <div className="flex flex-wrap gap-4">
                {PRODUCTS_CREATE.map((prod, i) => {
                  const isActive = i === activeProductIndex;
                  return (
                    <span 
                      key={i} 
                      className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-500 transform ${
                        isActive 
                          ? 'bg-white border-2 border-[#008080] text-[#008080] shadow-[0_5px_15px_rgba(0,128,128,0.2)] scale-105' 
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0f52ba] hover:text-[#0f52ba] shadow-sm'
                      }`}
                    >
                      {prod}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: CAREER OPPORTUNITIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0f52ba] to-[#008080]" style={{ fontFamily: "var(--font-heading)" }}>
              Career Opportunities
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              After completing your certification you can work as:
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {CAREERS.map((career, i) => (
              <div key={i} className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-3 hover:border-[#008080] hover:shadow-lg transition-all group">
                <Briefcase className="w-5 h-5 text-[#0f52ba] group-hover:text-[#008080]" />
                <h4 className="font-bold text-[#0f52ba] text-sm">{career}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: WHY CHOOSE US */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0f52ba] to-[#008080] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Why Choose Our Institute?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US.map((reason, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-[#0f52ba]" />
                </div>
                <h3 className="font-bold text-[#0f52ba] mb-2">{reason.title}</h3>
                <p className="text-sm text-gray-600">{reason.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: SUCCESS STORIES */}
      {stories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0f52ba] to-[#008080] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                Student Success Stories
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map(story => (
                <div key={story.id} className="bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100">
                  <div className="relative aspect-video group cursor-pointer">
                    <Image src={`https://img.youtube.com/vi/${story.videoUrl.split("v=")[1]?.split("&")[0]}/maxresdefault.jpg`} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[#0f52ba] mb-2">{story.title}</h3>
                    <span className="inline-block px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-[#008080] uppercase tracking-wider">
                      {story.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 11: FAQS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0f52ba] to-[#008080] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-[#0f52ba]">{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-0 text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12: READY TO BEGIN */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0f52ba] to-[#008080] mb-6" style={{ fontFamily: "var(--font-heading)" }}>
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join hundreds of successful professionals who have built their careers and businesses with our certification programs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setShowModal(true)} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#0f52ba] to-[#008080] hover:opacity-90 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <Users className="w-5 h-5" /> Book Free Counselling
            </button>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I want to join the training program`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* COUNSELLING MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-[#0f52ba] to-[#008080] p-6 text-white flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-wide" style={{ fontFamily: "var(--font-heading)" }}>Book Free Counselling</h3>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-sm">
                Leave your details and our training expert will call you to guide you through the best course options.
              </p>
              
              <form onSubmit={handleCounsellingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                  <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0f52ba] focus:border-[#0f52ba] transition-all outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0f52ba] focus:border-[#0f52ba] transition-all outline-none" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <input name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0f52ba] focus:border-[#0f52ba] transition-all outline-none" placeholder="john@example.com" />
                </div>
                
                <button 
                  disabled={loadingModal}
                  type="submit" 
                  className="w-full py-4 mt-2 bg-gradient-to-r from-[#0f52ba] to-[#008080] hover:opacity-90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loadingModal ? "Submitting..." : "Request Call Back"}
                </button>
                <p className="text-xs text-center text-gray-500 mt-4">Your information is 100% secure.</p>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
