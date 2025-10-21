"use client";
import { useState } from "react";
import HomeGallery from "./_components/gallery";
import HomeActivity from "./_components/homeactivity";
import HomeHeroManage from "./_components/_HomeHero/HomeHeroManage";
import BlogHeroManage from "./_components/BlogHero";
import CareerHeroManage from "./_components/CareerHero";
import ShopHeroManage from "./_components/ShopHero";
import TimelineHeroManage from "./_components/TimelineHero";
import FreeHeroManage from "./_components/FreeHero";
import ManageFeatures from "./_components/Feature";
import ManageInterCourses from "./_components/InterCourses";
import ManageDownloadApp from "./_components/DownloadApp";
import ContactManage from "./_components/ContactManage";
import SocialResourcesManage from "./_components/Social";
import TestomonialManagePage from "./_components/testomonials";
import FooterManage from "./_components/FooterManage";
import ManageAbout from "./_components/About";
import PermissionError from "@/components/shared/PermissionError";

export default function ManageWebsite() {
  const [selectedOption, setSelectedOption] = useState("home");
  const [hasPermissionError, setHasPermissionError] = useState(false);

  // Menu items data
  const menuItems = [
    { id: "home", label: "Home Settings", icon: "🏠" },
    { id: "home-features", label: "Features & Services", icon: "⚙️" },
    { id: "home-courses", label: "Interactive Courses", icon: "📚" },
    { id: "home-gallery", label: "Home Gallery", icon: "🖼️" },
    { id: "home-activity", label: "Home Activity", icon: "📊" },
    { id: "app", label: "App Download", icon: "📱" },
    { id: "contact", label: "Manage Contact", icon: "📞" },
    { id: "social", label: "Social Resources", icon: "🌐" },
    { id: "testomonial", label: "Testimonial", icon: "💬" },
    { id: "blog", label: "Blog Page", icon: "📝" },
    { id: "job", label: "Job Portal", icon: "💼" },
    { id: "free", label: "Free Resources", icon: "🎁" },
    { id: "timeline", label: "Timeline", icon: "📅" },
    { id: "shop", label: "Shop", icon: "🛒" },
    { id: "about", label: "About", icon: "ℹ️" },
    { id: "footer", label: "Footer", icon: "🔗" },
  ];

  if (hasPermissionError) {
    return <PermissionError />;
  }

  return (
    <div className="container mx-auto px-4 py-4 h-[100vh] flex flex-col">
      {/* Page Header */}
      <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-[#141B34] font-bold text-xl">
            MANAGE WEBSITE
          </span>
        </div>
        <div className="text-sm text-gray-500">Admin Panel</div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 mt-2 gap-1">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md md:mr-4 mb-4 md:mb-0 flex-shrink-0 flex flex-col max-h-[calc(100vh-120px)] pb-2">
          <h3 className="font-semibold text-gray-700 mb-4 px-6 pt-4">
            WEBSITE SECTIONS
          </h3>
          <ul
            className="space-y-2 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-gray-100 flex-1"
            style={{ maxHeight: "calc(100vh - 170px)" }}
          >
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => setSelectedOption(item.id)}
                className={`cursor-pointer py-3 px-4 rounded-lg flex items-center transition-colors ${
                  selectedOption === item.id
                    ? "bg-amber-100 text-gray-900 font-medium border-l-4 border-amber-500"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4 p-2 bg-white rounded-lg shadow-md overflow-y-auto max-h-[calc(100vh-120px)]">
          {selectedOption === "home" && <HomeHeroManage setHasPermissionError={setHasPermissionError} />}
          {selectedOption === "home-features" && <ManageFeatures />}
          {selectedOption === "home-courses" && <ManageInterCourses />}
          {selectedOption === "home-gallery" && <HomeGallery />}
          {selectedOption === "home-activity" && (
            <HomeActivity visible={true} />
          )}
          {selectedOption === "app" && <ManageDownloadApp />}
          {selectedOption === "contact" && <ContactManage />}
          {selectedOption === "social" && <SocialResourcesManage />}
          {selectedOption === "testomonial" && <TestomonialManagePage />}
          {selectedOption === "blog" && <BlogHeroManage />}
          {selectedOption === "job" && <CareerHeroManage />}
          {selectedOption === "free" && <FreeHeroManage />}
          {selectedOption === "timeline" && <TimelineHeroManage />}
          {selectedOption === "shop" && <ShopHeroManage />}
          {selectedOption === "about" && <ManageAbout />}
          {selectedOption === "footer" && <FooterManage />}
        </div>
      </div>
    </div>
  );
}
