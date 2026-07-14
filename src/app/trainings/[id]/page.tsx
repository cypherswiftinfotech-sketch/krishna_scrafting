"use client";
import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, Globe, Clock, Users, User, Check, PlayCircle, Shield, RotateCcw, ChevronRight, 
  BookOpen, Award, CheckCircle, Briefcase, ChevronDown, Download, Phone, ArrowDown, Layout, Target, Zap, Settings, PenTool,
  FlaskConical, Scale, Activity, Wrench, Palette, Thermometer, Paintbrush, CheckSquare
} from "lucide-react";
import toast from "react-hot-toast";

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
  videoUrl: string | null;
  fullDetails: string | null;
}

import { DEFAULT_DETAILS } from "@/lib/trainingDefaults";


export default function TrainingDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Training | null>(null);
  const [details, setDetails] = useState<typeof DEFAULT_DETAILS>(DEFAULT_DETAILS);
  const [related, setRelated] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeModule, setActiveModule] = useState("01");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showOverviewMore, setShowOverviewMore] = useState(false);
  const [showOutcomesMore, setShowOutcomesMore] = useState(false);
  const [showProjectsMore, setShowProjectsMore] = useState(false);
  const [showBenefitsMore, setShowBenefitsMore] = useState(false);
  const [expandedTools, setExpandedTools] = useState({ tools: false, materials: false, safety: false });
  const [activeMethodologyStep, setActiveMethodologyStep] = useState(0);
  const [showModal, setShowModal] = useState(false); // Counselling
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [banner, setBanner] = useState<{ mediaUrl: string; whatsappNumber?: string } | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/trainings/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.training) {
          setCourse(d.training);
          if (d.training.fullDetails) {
            try {
              const parsed = JSON.parse(d.training.fullDetails);
              // Merge with default to ensure no missing sections
              setDetails({ ...DEFAULT_DETAILS, ...parsed });
            } catch (e) {}
          }
          fetch(`/api/trainings?category=${encodeURIComponent(d.training.category)}`)
            .then((r2) => r2.json())
            .then((d2) => {
              if (d2.trainings) {
                setRelated(d2.trainings.filter((t: Training) => t.id !== d.training.id).slice(0, 8));
              }
            });
        } else {
          router.push("/trainings");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch("/api/training-banner")
      .then(r => r.json())
      .then(d => {
        if (d.settings) setBanner(d.settings);
      })
      .catch(console.error);
  }, [id, router]);

  const handleCounsellingSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      message: `Enquiry for course: ${course?.title}`,
      productInterest: "Course Counselling"
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
    }
  };

  const handleEnrollSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      message: `Direct Enrollment Request for course: ${course?.title}`,
      productInterest: `Enrollment: ${course?.title}`
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Enrollment request submitted successfully!");
        setShowEnrollModal(false);
      } else {
        toast.error("Failed to submit enrollment request.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0f52ba] rounded-full animate-spin" />
      </div>
    );
  if (!course) return null;

  const originalPrice = (Number(course.price) * 1.5).toLocaleString("en-IN");
  
  // The layout follows the exact structure provided by the user
  return (
    <div className="bg-white min-h-screen pt-[72px]" style={{ fontFamily: "var(--font-body)" }}>

      {/* SECTION 1: HERO SECTION */}
      <section className="relative bg-gray-900 text-white overflow-hidden py-24">
        {banner?.mediaUrl ? (
          banner.mediaUrl.match(/\.(mp4|webm)$/i) ? (
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30">
              <source src={banner.mediaUrl} />
            </video>
          ) : (
            <div className="absolute inset-0">
              <Image src={banner.mediaUrl} alt="Background" fill className="object-cover opacity-30" />
            </div>
          )
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-[#008080] text-white font-bold rounded-full text-xs uppercase tracking-widest mb-6">
            {course.category}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            {details.hero.heading}
          </h1>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto mb-10 whitespace-pre-line leading-relaxed">
            {details.hero.paragraph}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-bold text-gray-300 mb-10">
            {details.hero.duration && <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-[#00a8e8]" /> {details.hero.duration}</div>}
            {details.hero.level && <div className="flex items-center gap-2"><Target className="w-5 h-5 text-[#00a8e8]" /> {details.hero.level}</div>}
            {details.hero.mode && <div className="flex items-center gap-2"><Users className="w-5 h-5 text-[#00a8e8]" /> {details.hero.mode}</div>}
            {details.hero.type && <div className="flex items-center gap-2"><Layout className="w-5 h-5 text-[#00a8e8]" /> {details.hero.type}</div>}
            {details.hero.certificate && <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-[#00a8e8]" /> {details.hero.certificate}</div>}
            {course.language && <div className="flex items-center gap-2"><Globe className="w-5 h-5 text-[#00a8e8]" /> Language: {course.language}</div>}
            {details.hero.support && <div className="flex items-center gap-2"><RotateCcw className="w-5 h-5 text-[#00a8e8]" /> {details.hero.support}</div>}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => setShowEnrollModal(true)} className="px-8 py-4 bg-gradient-to-r from-[#0f52ba] to-[#008080] hover:opacity-90 text-white font-bold rounded-full shadow-[0_0_20px_rgba(15,82,186,0.4)] transition-all hover:scale-105 flex items-center gap-2">
              Enroll Now <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => toast.success("Brochure downloading...")} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full backdrop-blur border border-white/20 transition-all flex items-center gap-2">
              <Download className="w-5 h-5" /> Download Course Brochure
            </button>
            <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-white hover:bg-gray-100 text-[#0f52ba] font-bold rounded-full shadow-lg transition-all flex items-center gap-2">
              <Phone className="w-5 h-5" /> Book Free Counselling
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: COURSE OVERVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-sm font-bold text-[#008080] uppercase tracking-widest mb-2">{details.overview.heading}</h2>
          <h3 className="text-3xl md:text-4xl font-black text-[#0f52ba] mb-8" style={{ fontFamily: "var(--font-heading)" }}>
            {details.overview.subheading}
          </h3>
          
          <div className="relative">
            <div className={`text-lg text-gray-600 leading-relaxed text-left whitespace-pre-line overflow-hidden transition-all duration-500 ${showOverviewMore ? "max-h-[2000px]" : "max-h-48"}`}>
              {details.overview.content}
            </div>
            {!showOverviewMore && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent flex items-end justify-center">
                <button onClick={() => setShowOverviewMore(true)} className="flex items-center gap-1 font-bold text-[#0f52ba] hover:underline">
                  View More <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
            {showOverviewMore && (
              <button onClick={() => setShowOverviewMore(false)} className="mt-4 flex items-center justify-center w-full gap-1 font-bold text-[#0f52ba] hover:underline">
                View Less
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: WHY CHOOSE THIS COURSE */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-[#008080] uppercase tracking-widest mb-2">{details.whyChoose.heading}</h2>
            <h3 className="text-3xl md:text-4xl font-black text-[#0f52ba] mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              {details.whyChoose.subheading}
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto whitespace-pre-line">{details.whyChoose.intro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {details.whyChoose.reasons.map((reason, i) => {
              const icons = [<Target key="1" />, <Layout key="2" />, <Users key="3" />, <Settings key="4" />, <CheckCircle key="5" />, <Briefcase key="6" />, <RotateCcw key="7" />, <Globe key="8" />];
              return (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#0f52ba] hover:-translate-y-1 transition-all group">
                  <div className="w-12 h-12 bg-[#0f52ba]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0f52ba] transition-colors">
                    <div className="text-[#0f52ba] group-hover:text-white transition-colors">{icons[i % icons.length]}</div>
                  </div>
                  <h4 className="font-bold text-[#0f52ba] mb-2">{reason.title}</h4>
                  <p className="text-sm text-gray-600">{reason.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: WHO CAN JOIN */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scrollRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll-right { animation: scrollRight 30s linear infinite; }
          .animate-scroll-left { animation: scrollLeft 30s linear infinite; }
          .fade-edges-x {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          }
        `}} />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            
            {/* Left Column (Text) */}
            <div className="lg:col-span-2">
              <h2 className="text-4xl md:text-5xl font-black text-[#0f52ba] mb-6" style={{ fontFamily: "var(--font-heading)" }}>{details.whoCanJoin.heading}</h2>
              <p className="text-gray-600 text-lg mb-8 whitespace-pre-line leading-relaxed">{details.whoCanJoin.intro}</p>
              <div className="p-6 bg-cyan-50 rounded-2xl border-l-4 border-[#008080]">
                <p className="font-bold text-[#008080]">{details.whoCanJoin.outro}</p>
              </div>
            </div>

            {/* Right Column (Scrolling Points) */}
            <div className="lg:col-span-3 relative h-[400px] flex flex-col justify-center gap-6 overflow-hidden fade-edges-x">
              <h3 className="text-xl font-bold text-[#0f52ba] mb-6 text-center">{details.whoCanJoin.listTitle}</h3>
              
              {/* Row 1: Right Scroll */}
              <div className="flex w-[200%] animate-scroll-right gap-6">
                {[...details.whoCanJoin.points.slice(0, 10), ...details.whoCanJoin.points.slice(0, 10)].map((pt, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-4 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 shrink-0 hover:scale-105 transition-transform">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm whitespace-nowrap">{pt}</span>
                  </div>
                ))}
              </div>

              {/* Row 2: Left Scroll */}
              <div className="flex w-[200%] animate-scroll-left gap-6">
                {[...details.whoCanJoin.points.slice(10, 20), ...details.whoCanJoin.points.slice(10, 20)].map((pt, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-4 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 shrink-0 hover:scale-105 transition-transform">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="font-bold text-gray-800 text-sm whitespace-nowrap">{pt}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: LEARNING OUTCOMES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-[#008080] uppercase tracking-widest mb-2">{details.learningOutcomes.heading}</h2>
            <h3 className="text-3xl md:text-4xl font-black text-[#0f52ba] mb-4" style={{ fontFamily: "var(--font-heading)" }}>{details.learningOutcomes.subheading}</h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto whitespace-pre-line">{details.learningOutcomes.intro}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
            {details.learningOutcomes.points.slice(0, showOutcomesMore ? details.learningOutcomes.points.length : 8).map((point, i) => {
              const outcomeIcons = [
                <FlaskConical key="0" className="w-5 h-5 text-white" />,
                <Scale key="1" className="w-5 h-5 text-white" />,
                <Activity key="2" className="w-5 h-5 text-white" />,
                <Wrench key="3" className="w-5 h-5 text-white" />,
                <CheckSquare key="4" className="w-5 h-5 text-white" />,
                <Palette key="5" className="w-5 h-5 text-white" />,
                <Thermometer key="6" className="w-5 h-5 text-white" />,
                <Paintbrush key="7" className="w-5 h-5 text-white" />
              ];
              return (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0f52ba] to-[#008080] rounded-full flex items-center justify-center shrink-0 group-hover:opacity-90 transition-opacity shadow-sm">
                    {outcomeIcons[i % outcomeIcons.length]}
                  </div>
                  <span className="text-[#0f172a] font-medium text-sm leading-relaxed">{point}</span>
                </div>
              );
            })}
          </div>

          <div className="text-center mb-16">
            <button 
              onClick={() => setShowOutcomesMore(!showOutcomesMore)}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-[#0f52ba] to-[#008080] text-white font-bold hover:opacity-90 transition-all flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
            >
              {showOutcomesMore ? "View Less" : "View More"} <ChevronDown className={`w-5 h-5 transition-transform ${showOutcomesMore ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="mt-16 w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-gradient-to-r from-[#0f52ba] to-[#008080] py-5 overflow-hidden shadow-xl">
            <div className="flex w-max animate-scroll-left text-white text-sm md:text-base font-bold tracking-widest uppercase">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-8 px-4 shrink-0">
                  <span>Certification of Completion</span>
                  <span className="text-[#008080]">♦</span>
                  <span>Practical Hands-on Training</span>
                  <span className="text-[#008080]">♦</span>
                  <span>Business Startup Guidance</span>
                  <span className="text-[#008080]">♦</span>
                  <span>Lifetime Technical Support</span>
                  <span className="text-[#008080]">♦</span>
                  <span>Expert Instructors</span>
                  <span className="text-[#008080]">♦</span>
                  <span>Industry Recognized</span>
                  <span className="text-[#008080]">♦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: COMPLETE CURRICULUM (Dynamic Layout) */}
      <section className="py-20 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-[#008080] uppercase tracking-widest mb-2">{details.curriculum.heading}</h2>
            <h3 className="text-3xl md:text-4xl font-black text-[#0f52ba] mb-4" style={{ fontFamily: "var(--font-heading)" }}>{details.curriculum.subheading}</h3>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">{details.curriculum.intro}</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Module List */}
            <div className="w-full lg:w-1/2 flex flex-col gap-2">
              {details.curriculum.modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(mod.id)}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between group ${activeModule === mod.id ? "bg-[#0f52ba] text-white border-[#0f52ba] shadow-lg shadow-blue-900/20" : "bg-white border-gray-200 hover:border-[#0f52ba] hover:shadow"}`}
                >
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-widest mb-1 block ${activeModule === mod.id ? "text-blue-200" : "text-gray-400"}`}>Module {mod.id}</span>
                    <span className="font-bold text-lg">{mod.title}</span>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${activeModule === mod.id ? "text-white" : "text-gray-400 group-hover:text-[#0f52ba]"}`} />
                </button>
              ))}
            </div>

            {/* Right side: Module Details */}
            <div className="w-full lg:w-1/2">
              {details.curriculum.modules.map((mod) => (
                activeModule === mod.id && (
                  <div key={mod.id} className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-xl animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex flex-wrap items-center justify-between mb-6 pb-6 border-b border-gray-100 gap-4">
                      <div>
                        <span className="text-[#0f52ba] font-black uppercase tracking-widest text-sm mb-2 block">Module {mod.id}</span>
                        <h4 className="text-3xl font-black text-[#0f52ba]" style={{ fontFamily: "var(--font-heading)" }}>{mod.title}</h4>
                      </div>
                      <div className="bg-gradient-to-r from-[#0f52ba] to-[#008080] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm">
                        <Clock className="w-4 h-4 text-cyan-200" /> Duration: {mod.duration}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h5 className="font-bold text-lg text-[#0f52ba] mb-2">Module Overview</h5>
                      <p className="text-gray-600 leading-relaxed">{mod.overview}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h5 className="font-bold text-lg text-[#0f52ba] mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#008080]" /> Topics Covered</h5>
                        <ul className="space-y-2">
                          {mod.topics.map((t, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#008080] mt-2 shrink-0"></div> {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-8">
                        {mod.activities.length > 0 && (
                          <div>
                            <h5 className="font-bold text-lg text-[#0f52ba] mb-4 flex items-center gap-2"><Layout className="w-5 h-5 text-[#0f52ba]" /> Practical Activities</h5>
                            <ul className="space-y-2">
                              {mod.activities.map((t, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#0f52ba] mt-2 shrink-0"></div> {t}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {mod.skills.length > 0 && (
                          <div>
                            <h5 className="font-bold text-lg text-[#0f52ba] mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-amber-600" /> Skills You'll Gain</h5>
                            <ul className="space-y-2">
                              {mod.skills.map((t, i) => (
                                <li key={i} className="flex items-start gap-2 text-gray-800 font-medium">
                                  <Check className="w-4 h-4 text-green-500 mt-1 shrink-0" /> {t}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: METHODOLOGY */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-[#008080] uppercase tracking-widest mb-2">Process</h2>
            <h3 className="text-3xl md:text-4xl font-black text-[#0f52ba] mb-6" style={{ fontFamily: "var(--font-heading)" }}>
              {details.methodology.heading}
            </h3>
            <p className="text-gray-600 text-lg">
              {details.methodology.intro}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left side: Step Details */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              {details.methodology.steps.map((step, i) => (
                activeMethodologyStep === i && (
                  <div key={i} className="bg-white rounded-3xl p-8 md:p-10 border border-gray-200 shadow-xl animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
                      <div>
                        <span className="text-[#008080] font-bold tracking-widest uppercase text-sm mb-2 block">Step {i + 1}</span>
                        <h4 className="text-2xl font-black text-[#0f172a]">{step.title}</h4>
                      </div>
                    </div>
                    <div className="mb-8">
                      <p className="text-gray-600 leading-relaxed text-lg">{step.desc}</p>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Right side: Steps List */}
            <div className="w-full lg:w-1/2 flex flex-col gap-2 order-1 lg:order-2">
              {details.methodology.steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMethodologyStep(i)}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between group ${activeMethodologyStep === i ? "bg-[#0f52ba] text-white border-[#0f52ba] shadow-lg shadow-blue-900/20" : "bg-white border-gray-200 hover:border-[#0f52ba] hover:shadow"}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${activeMethodologyStep === i ? "bg-white/20 text-white" : "bg-[#0f52ba]/10 text-[#0f52ba]"}`}>
                      {i + 1}
                    </div>
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-widest mb-1 block ${activeMethodologyStep === i ? "text-blue-200" : "text-gray-400"}`}>Step {i + 1}</span>
                      <span className="font-bold text-lg">{step.title}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${activeMethodologyStep === i ? "text-white" : "text-gray-400 group-hover:text-[#0f52ba]"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: PRACTICAL PROJECTS */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#0f52ba] mb-4" style={{ fontFamily: "var(--font-heading)" }}>{details.projects.heading}</h2>
            <h3 className="text-xl font-bold text-[#0f52ba] mb-4">{details.projects.sub1}</h3>
            <p className="text-gray-600 text-lg max-w-4xl mx-auto whitespace-pre-line">{details.projects.desc1}</p>
          </div>

          <h3 className="text-2xl font-black text-[#0f52ba] mb-8 text-center">{details.projects.sub2}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {details.projects.list.slice(0, showProjectsMore ? details.projects.list.length : (Math.floor(details.projects.list.length / 3) * 3 || details.projects.list.length)).map((proj, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0f52ba] to-[#008080] rounded-xl flex items-center justify-center text-white mb-6 transform group-hover:scale-110 transition-transform">
                  <PenTool className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-black text-[#0f52ba] mb-3">{proj.title}</h4>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{proj.desc}</p>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-3">Skills Covered</h5>
                  <div className="flex flex-wrap gap-2">
                    {proj.skills.map((skill, j) => (
                      <span key={j} className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-md">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {details.projects.list.length > (Math.floor(details.projects.list.length / 3) * 3 || details.projects.list.length) && (
            <div className="flex justify-center mb-16">
              <button 
                onClick={() => setShowProjectsMore(!showProjectsMore)}
                className="px-8 py-3 rounded-full border-2 border-[#0f52ba] text-[#0f52ba] font-bold hover:bg-[#0f52ba] hover:text-white transition-all flex items-center gap-2"
              >
                {showProjectsMore ? "View Less" : "View More Projects"}
                <ChevronRight className={`w-5 h-5 transition-transform ${showProjectsMore ? "-rotate-90" : "rotate-90"}`} />
              </button>
            </div>
          )}
          
          {details.projects.list.length <= (Math.floor(details.projects.list.length / 3) * 3 || details.projects.list.length) && (
            <div className="mb-16"></div>
          )}

          {/* Mastered Skills */}
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-[#0f52ba] mb-2">{details.projects.masteredSkillsSub}</h3>
              <p className="text-gray-600">{details.projects.masteredSkillsDesc}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {details.projects.masteredSkillsList.map((skill, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-[#0f52ba]/5 rounded-lg text-[#0f52ba] font-medium text-sm border border-[#0f52ba]/10 hover:border-[#008080]/30 transition-colors">
                  <Check className="w-4 h-4 text-[#008080] shrink-0" /> {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: TOOLS & MATERIALS */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 text-[#0f172a]" style={{ fontFamily: "var(--font-heading)" }}>{details.toolsAndMaterials.heading}</h2>
            <p className="text-[#008080] text-lg font-bold tracking-wider mb-4 uppercase">{details.toolsAndMaterials.subheading}</p>
            <p className="text-gray-600 max-w-3xl mx-auto">{details.toolsAndMaterials.desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {/* Card 1: Professional Tools */}
            <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className="p-8 pb-2 flex-shrink-0">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                  <h3 className="text-xl font-bold text-gray-900">Professional Tools</h3>
                </div>
                <div className="flex items-center justify-center py-6">
                  <Settings className="w-16 h-16 text-[#00a8e8]" strokeWidth={1.5} />
                </div>
              </div>
              
              <div className="m-4 mt-0 p-6 bg-gray-50/50 rounded-2xl flex-grow flex flex-col">
                <ul className="space-y-4 text-gray-700 flex-grow">
                  {(expandedTools.tools ? details.toolsAndMaterials.tools : details.toolsAndMaterials.tools.slice(0, 5)).map((t, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium"><CheckCircle className="w-5 h-5 text-gray-800 shrink-0" /> {t}</li>
                  ))}
                </ul>
                {details.toolsAndMaterials.tools.length > 5 && (
                  <button 
                    onClick={() => setExpandedTools({...expandedTools, tools: !expandedTools.tools})} 
                    className="mt-6 w-full py-2 text-sm font-bold text-[#00a8e8] hover:text-[#008080] transition-colors flex items-center justify-center gap-1"
                  >
                    {expandedTools.tools ? "View Less" : `View All ${details.toolsAndMaterials.tools.length}`} <ChevronDown className={`w-4 h-4 transition-transform ${expandedTools.tools ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: Premium Materials */}
            <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full transform md:-translate-y-4 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gray-100 text-gray-800 text-xs font-bold px-4 py-1.5 rounded-b-xl z-20">
                Core Materials
              </div>
              
              <div className="p-8 pb-2 flex-shrink-0 mt-4">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                  <h3 className="text-xl font-bold text-gray-900">Premium Materials</h3>
                </div>
                <div className="flex items-center justify-center py-6">
                  <Zap className="w-16 h-16 text-[#0f52ba]" strokeWidth={1.5} />
                </div>
              </div>
              
              <div className="m-4 mt-0 p-6 bg-gray-50/50 rounded-2xl flex-grow flex flex-col">
                <ul className="space-y-4 text-gray-700 flex-grow">
                  {(expandedTools.materials ? details.toolsAndMaterials.materials : details.toolsAndMaterials.materials.slice(0, 5)).map((t, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium"><CheckCircle className="w-5 h-5 text-gray-800 shrink-0" /> {t}</li>
                  ))}
                </ul>
                {details.toolsAndMaterials.materials.length > 5 && (
                  <button 
                    onClick={() => setExpandedTools({...expandedTools, materials: !expandedTools.materials})} 
                    className="mt-6 w-full py-2 text-sm font-bold text-[#0f52ba] hover:text-[#0f52ba]/80 transition-colors flex items-center justify-center gap-1"
                  >
                    {expandedTools.materials ? "View Less" : `View All ${details.toolsAndMaterials.materials.length}`} <ChevronDown className={`w-4 h-4 transition-transform ${expandedTools.materials ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Card 3: Safety Equipment */}
            <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
              <div className="p-8 pb-2 flex-shrink-0">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                  <h3 className="text-xl font-bold text-gray-900">Safety Equipment</h3>
                </div>
                <div className="flex items-center justify-center py-6">
                  <Shield className="w-16 h-16 text-[#008080]" strokeWidth={1.5} />
                </div>
              </div>
              
              <div className="m-4 mt-0 p-6 bg-gray-50/50 rounded-2xl flex-grow flex flex-col">
                <ul className="space-y-4 text-gray-700 flex-grow">
                  {(expandedTools.safety ? details.toolsAndMaterials.safety : details.toolsAndMaterials.safety.slice(0, 5)).map((t, i) => (
                    <li key={i} className="flex gap-3 text-sm font-medium"><CheckCircle className="w-5 h-5 text-gray-800 shrink-0" /> {t}</li>
                  ))}
                </ul>
                {details.toolsAndMaterials.safety.length > 5 && (
                  <button 
                    onClick={() => setExpandedTools({...expandedTools, safety: !expandedTools.safety})} 
                    className="mt-6 w-full py-2 text-sm font-bold text-[#008080] hover:text-[#008080]/80 transition-colors flex items-center justify-center gap-1"
                  >
                    {expandedTools.safety ? "View Less" : `View All ${details.toolsAndMaterials.safety.length}`} <ChevronDown className={`w-4 h-4 transition-transform ${expandedTools.safety ? "rotate-180" : ""}`} />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 13 & 14: CAREERS & BUSINESS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div>
              <div className="mb-10">
                <h2 className="text-3xl font-black text-[#0f52ba] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{details.careers.heading}</h2>
                <p className="text-[#0f52ba] font-bold mb-4">{details.careers.subheading}</p>
                <p className="text-gray-600">{details.careers.desc}</p>
              </div>
              
              <div className="mb-8">
                <h4 className="font-bold text-[#0f52ba] mb-4 uppercase tracking-widest text-sm">Career Options</h4>
                <div className="flex flex-wrap gap-2">
                  {details.careers.options.map((opt, i) => (
                    <span key={i} className="bg-blue-50 text-blue-800 border border-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium">{opt}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#0f52ba] mb-4 uppercase tracking-widest text-sm">Industries You Can Work With</h4>
                <div className="flex flex-wrap gap-2">
                  {details.careers.industries.map((ind, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium">{ind}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm">
              <h2 className="text-3xl font-black text-[#0f52ba] mb-2" style={{ fontFamily: "var(--font-heading)" }}>{details.business.heading}</h2>
              <p className="text-[#008080] font-bold mb-4">{details.business.subheading}</p>
              <p className="text-gray-600 mb-8 whitespace-pre-line">{details.business.desc}</p>

              <div className="mb-8">
                <h4 className="font-bold text-[#0f52ba] mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-[#008080]" /> Start Your Own Business In</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {details.business.startList.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700"><Check className="w-4 h-4 text-green-500" /> {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#0f52ba] mb-4 flex items-center gap-2"><Layout className="w-5 h-5 text-[#008080]" /> Business Skills Introduced</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {details.business.skillsList.map((skill, i) => (
                    <span key={i} className="bg-white border border-gray-200 shadow-sm text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">{skill}</span>
                  ))}
                </div>
                <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 text-sm font-medium leading-relaxed">
                  {details.business.advancedDesc}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 15: TRAINING BENEFITS */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#0f52ba]" style={{ fontFamily: "var(--font-heading)" }}>{details.benefits.heading}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {details.benefits.list.slice(0, showBenefitsMore ? details.benefits.list.length : 16).map((benefit, i) => {
              const benefitIcons = [
                <Target key="0" className="w-5 h-5 text-white" />,
                <PlayCircle key="1" className="w-5 h-5 text-white" />,
                <Briefcase key="2" className="w-5 h-5 text-white" />,
                <BookOpen key="3" className="w-5 h-5 text-white" />,
                <Wrench key="4" className="w-5 h-5 text-white" />,
                <CheckSquare key="5" className="w-5 h-5 text-white" />,
                <Star key="6" className="w-5 h-5 text-white" />,
                <Award key="7" className="w-5 h-5 text-white" />,
                <Settings key="8" className="w-5 h-5 text-white" />,
                <Target key="9" className="w-5 h-5 text-white" />,
                <Users key="10" className="w-5 h-5 text-white" />,
                <Globe key="11" className="w-5 h-5 text-white" />
              ];
              return (
                <div key={i} className="bg-white border border-gray-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#0f52ba] to-[#008080] rounded-full flex items-center justify-center shrink-0 group-hover:opacity-90 transition-opacity shadow-sm">
                    {benefitIcons[i % benefitIcons.length]}
                  </div>
                  <span className="font-medium text-gray-800 text-sm leading-tight">{benefit}</span>
                </div>
              );
            })}
          </div>

          {details.benefits.list.length > 16 && (
            <div className="text-center mb-12">
              <button 
                onClick={() => setShowBenefitsMore(!showBenefitsMore)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#0f52ba] to-[#008080] text-white font-bold hover:opacity-90 transition-all flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
              >
                {showBenefitsMore ? "View Less" : "View More"} <ChevronDown className={`w-5 h-5 transition-transform ${showBenefitsMore ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}

          <p className="text-center text-gray-500 text-sm font-medium">{details.benefits.disclaimer}</p>
        </div>
      </section>

      {/* SECTION 17: WHY ACADEMY */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#0f52ba] mb-6" style={{ fontFamily: "var(--font-heading)" }}>{details.academy.heading}</h2>
          <p className="text-gray-600 text-lg mb-10 whitespace-pre-line">{details.academy.desc}</p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {details.academy.points.map((pt, i) => (
              <span key={i} className="px-5 py-2 bg-gray-50 border border-gray-200 rounded-full font-bold text-gray-800">{pt}</span>
            ))}
          </div>
          <p className="font-bold text-xl text-[#0f52ba] italic">{details.academy.outro}</p>
        </div>
      </section>

      {/* SECTION 16: FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f52ba]" style={{ fontFamily: "var(--font-heading)" }}>{details.faq.heading}</h2>
          </div>
          <div className="space-y-4">
            {details.faq.items.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow transition-shadow">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-[#0f52ba] pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-gray-600 whitespace-pre-line border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 19: CONTINUE LEARNING */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0f52ba] mb-4" style={{ fontFamily: "var(--font-heading)" }}>{details.continueLearning.heading}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{details.continueLearning.desc}</p>
          </div>
          <div className="flex flex-col items-center justify-center max-w-3xl mx-auto gap-4">
            {(() => {
              let displayCourses: any[] = [...related];
              if (displayCourses.length < details.continueLearning.courses.length) {
                const needed = details.continueLearning.courses.length - displayCourses.length;
                displayCourses = [...displayCourses, ...details.continueLearning.courses.slice(0, needed)];
              }
              return displayCourses.map((c: any, i: number) => {
                const courseName = c.title || c.name;
                const courseLevel = c.category || c.level || `Level ${i + 2}`;
                return (
                  <div key={i} className="w-full flex flex-col items-center gap-4">
                    <Link href={`/trainings/${courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="w-full group">
                      <div className="w-full bg-white border border-gray-200 p-6 rounded-2xl flex items-center justify-between group-hover:border-[#0f52ba] group-hover:shadow-[0_4px_20px_rgba(15,82,186,0.08)] transition-all shadow-sm group-hover:-translate-y-1">
                        <div>
                          <span className="text-xs font-bold text-[#008080] uppercase tracking-widest block mb-1">{courseLevel}</span>
                          <h4 className="text-xl font-bold text-[#0f52ba] transition-colors">{courseName}</h4>
                        </div>
                        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-[#0f52ba] transition-colors" />
                      </div>
                    </Link>
                    {i < displayCourses.length - 1 && <ArrowDown className="w-6 h-6 text-gray-300" />}
                  </div>
                );
              });
            })()}
          </div>
          <p className="text-center text-gray-500 mt-12 font-medium">{details.continueLearning.outro}</p>
        </div>
      </section>

      {/* SECTION 18: READY TO BEGIN */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6" style={{ fontFamily: "var(--font-heading)" }}>{details.readyToBegin.heading}</h2>
          <h3 className="text-xl md:text-2xl font-bold text-[#008080] mb-6">{details.readyToBegin.subheading}</h3>
          <p className="text-gray-600 text-lg mb-12 max-w-3xl mx-auto whitespace-pre-line">{details.readyToBegin.desc}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => setShowEnrollModal(true)} className="px-8 py-4 bg-gradient-to-r from-[#0f52ba] to-[#008080] hover:opacity-90 text-white font-bold rounded-full shadow-[0_4px_20px_rgba(15,82,186,0.2)] transition-all hover:-translate-y-1 text-lg flex items-center gap-2">
              Enroll in the Next Batch <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-white border border-gray-200 text-gray-800 font-bold rounded-full shadow-sm transition-all flex items-center gap-2 hover:border-[#0f52ba] hover:text-[#0f52ba] hover:-translate-y-1">
              <Phone className="w-5 h-5" /> Book a Free Counselling Session
            </button>
            <button onClick={() => toast.success("Brochure downloading...")} className="px-8 py-4 bg-transparent border-2 border-[#0f52ba] text-[#0f52ba] hover:bg-[#0f52ba] hover:text-white font-bold rounded-full transition-all hover:-translate-y-1">
              Download the Course Brochure
            </button>
          </div>
        </div>
      </section>

      {/* COUNSELLING MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full">
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-[#0f52ba] mb-2">Book Free Counselling</h3>
              <p className="text-gray-500 text-sm">Fill your details and our training expert will call you.</p>
            </div>
            
            <form onSubmit={handleCounsellingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0f52ba]" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0f52ba]" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email (Optional)</label>
                <input name="email" type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0f52ba]" placeholder="john@example.com" />
              </div>
              <button type="submit" className="w-full mt-6 py-4 bg-gradient-to-r from-[#0f52ba] to-[#008080] hover:opacity-90 text-white font-bold rounded-xl transition-all">
                Request Call Back
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ENROLLMENT MODAL */}
      {showEnrollModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEnrollModal(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowEnrollModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full">
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-[#0f52ba] mb-2">Enroll Now</h3>
              <p className="text-gray-500 text-sm">Submit your details for: <span className="font-bold text-[#0f52ba]">{course.title}</span></p>
            </div>
            
            <form onSubmit={handleEnrollSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0f52ba]" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0f52ba]" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#0f52ba]" placeholder="john@example.com" />
              </div>
              <button type="submit" className="w-full mt-6 py-4 bg-gradient-to-r from-[#0f52ba] to-[#008080] hover:opacity-90 text-white font-bold rounded-xl transition-all">
                Submit Enrollment Request
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
