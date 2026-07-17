"use client";

import React, { useState } from "react";
import Image from "next/image";

interface PortfolioTabsProps {
  description: string | null;
  review: string | null;
  reviewPhotoUrl: string | null;
  clientExperience: string | null;
}

export default function PortfolioTabs({ description, review, reviewPhotoUrl, clientExperience }: PortfolioTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "PRODUCT DETAILS" },
    { id: "reviews", label: "RATINGS AND REVIEWS" },
    { id: "experience", label: "CLIENT EXPERIENCE" },
  ];

  return (
    <div className="mt-16 w-full max-w-4xl">
      <div className="flex flex-wrap gap-3 mb-8 pb-4 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 rounded-lg shadow-sm border ${
              activeTab === tab.id 
                ? "bg-[#135db6] text-white border-[#135db6] shadow-md scale-[1.02]" 
                : "bg-white text-gray-600 border-gray-200 hover:border-[#135db6] hover:text-[#135db6]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">
        {activeTab === "description" && (
          <div className="prose max-w-none animate-in fade-in duration-500">
            <p className="text-gray-600 leading-relaxed text-lg md:text-xl whitespace-pre-wrap font-medium">
              {description || "A beautiful custom epoxy creation crafted with precision and care."}
            </p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="animate-in fade-in duration-500">
            {review || reviewPhotoUrl ? (
              <div className="flex flex-col md:flex-row gap-8">
                {reviewPhotoUrl && (
                  <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                      <Image src={reviewPhotoUrl} alt="Review" fill className="object-cover" />
                    </div>
                  </div>
                )}
                {review && (
                  <div className="relative flex-1 p-8 md:p-10 bg-gray-50 rounded-2xl border border-gray-200">
                    <div className="absolute -top-6 left-8 text-6xl text-blue-300 font-serif">"</div>
                    <p className="text-gray-700 italic leading-relaxed relative z-10 text-xl font-medium">
                      {review}
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="w-10 h-[2px] bg-blue-700"></div>
                      <p className="text-sm uppercase tracking-widest font-black text-blue-700">Client Feedback</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No reviews yet for this project.</p>
            )}
          </div>
        )}

        {activeTab === "experience" && (
          <div className="prose max-w-none animate-in fade-in duration-500">
            {clientExperience ? (
              <p className="text-gray-600 leading-relaxed text-lg md:text-xl whitespace-pre-wrap font-medium">
                {clientExperience}
              </p>
            ) : (
              <p className="text-gray-500 italic">No client experience details provided for this project.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
