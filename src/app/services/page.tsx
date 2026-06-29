"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface Service {
  id: number;
  title: string;
  description: string | null;
  category: string;
  imageUrl: string | null;
  features: string | null;
}

const tabs = [
  { key: "custom_orders", label: "Custom Orders", icon: "🎨", desc: "Personalized laser engraving for any item" },
  { key: "corporate_gifts", label: "Corporate Gifts", icon: "🏢", desc: "Bulk orders for businesses and events" },
  { key: "flooring", label: "Flooring", icon: "🏗️", desc: "Custom laser-cut flooring designs" },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") || "custom_orders";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/services?category=${activeTab}`)
      .then((r) => r.json())
      .then((d) => setServices(d.services || []))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    router.push(`/services?tab=${key}`);
  };

  const currentTab = tabs.find((t) => t.key === activeTab);

  return (
    <div className="pt-16 min-h-screen bg-gray-950">
      {/* Header */}
      <div className="relative py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
        <h1 className="relative text-5xl font-black text-white mb-4">
          Our <span className="text-amber-400">Services</span>
        </h1>
        <p className="relative text-gray-400 text-lg">
          Professional laser engraving services tailored to your needs
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Sub-menu Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "flex-1 flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all text-center",
                activeTab === tab.key
                  ? "bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/10"
                  : "bg-gray-900 border-gray-800 hover:border-amber-500/50"
              )}
            >
              <span className="text-3xl">{tab.icon}</span>
              <span
                className={cn(
                  "font-bold",
                  activeTab === tab.key ? "text-amber-400" : "text-gray-300"
                )}
              >
                {tab.label}
              </span>
              <span className="text-xs text-gray-500">{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{currentTab?.icon}</div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {currentTab?.label} Services Coming Soon
            </h3>
            <p className="text-gray-400 mb-8">
              We&apos;re preparing amazing {currentTab?.label.toLowerCase()} services for you.
            </p>
            <a
              href="mailto:info@laserpro.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all"
            >
              <Mail className="w-5 h-5" /> Inquire Now
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all hover:shadow-xl hover:shadow-amber-500/10"
              >
                {service.imageUrl && (
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-black text-white mb-3">{service.title}</h3>
                  {service.description && (
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                  )}
                  {service.features && (
                    <ul className="space-y-2">
                      {service.features
                        .split("\n")
                        .filter(Boolean)
                        .map((f, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                    </ul>
                  )}
                  <a
                    href="mailto:info@laserpro.com"
                    className="mt-6 flex items-center justify-center gap-2 w-full py-3 border border-amber-500/50 text-amber-400 font-bold rounded-xl hover:bg-amber-500/10 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Get a Quote
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="text-amber-400">Loading...</div></div>}>
      <ServicesContent />
    </Suspense>
  );
}
