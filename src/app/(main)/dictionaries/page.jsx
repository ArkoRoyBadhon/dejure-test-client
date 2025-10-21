"use client";
import React, { useState } from "react";
import { DictionarySection } from "./_components/dictionary-section";
import { MaxisSection } from "./_components/maxis-section";
import CommonPageHero from "../_components/home/CommonPageHero";
import ContactAndResources from "../_components/ContactAndResources";
import DownloadApp from "../_components/AppDownload";
import { BookOpen, Scale } from "lucide-react";

const page = () => {
  const [activeSection, setActiveSection] = useState("dictionary");

  const tabData = {
    dictionary: {
      title: "আইনি ডিকশনারি",
      description: "আইনি পরিভাষা ও গুরুত্বপূর্ণ শব্দের সংজ্ঞা ও ব্যাখ্যা",
      icon: BookOpen,
      badgeText: "ডিকশনারি",
    },
    maxis: {
      title: "আইনি ম্যাক্সিমস",
      description:
        "ল্যাটিন আইনি নীতি ও ম্যাক্সিমস যা আধুনিক আইনশাস্ত্রের ভিত্তি",
      icon: Scale,
      badgeText: "ম্যাক্সিমস",
    },
  };

  const currentTab = tabData[activeSection];

  return (
    <div>
      {/* Hero Section */}
      <CommonPageHero
        badgeText={currentTab.badgeText}
        title={currentTab.title}
        description={currentTab.description}
        imageSrc="uploads/custom-heroimg.png"
      />

      {/* Tab Navigation */}
      <div className="bg-main/80 py-6 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0">
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveSection("dictionary")}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeSection === "dictionary"
                    ? "bg-white text-darkColor shadow-sm"
                    : "text-gray-600 hover:text-darkColor"
                }`}
              >
                <BookOpen className="h-5 w-5" />
                ডিকশনারি
              </button>
              <button
                onClick={() => setActiveSection("maxis")}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeSection === "maxis"
                    ? "bg-white text-darkColor shadow-sm"
                    : "text-gray-600 hover:text-darkColor"
                }`}
              >
                <Scale className="h-5 w-5" />
                ম্যাক্সিমস
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-gray2 min-h-screen">
        {activeSection === "dictionary" ? (
          <DictionarySection />
        ) : (
          <MaxisSection />
        )}
      </main>

      {/* Footer Components */}
      <ContactAndResources />
      <DownloadApp />
    </div>
  );
};

export default page;
