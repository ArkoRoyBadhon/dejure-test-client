"use client";
import { useState, useEffect } from "react";
import { useGetAllActivityGalleriesQuery } from "@/redux/features/WebManage/Activity.api";

import { DynamicActivityComponent } from "@/app/(dashboard)/(admin dashboard)/admin/dashboard/manage-website/_components/ActivityDialog";

import { useGetAllMixHerosQuery } from "@/redux/features/WebManage/MixHero.api";

export default function ActivityGallery({ visibility }) {
  const {
    data: tabsData,
    isLoading,
    error,
  } = useGetAllActivityGalleriesQuery();
  const [activeTab, setActiveTab] = useState(null);
  const [tabs, setTabs] = useState([]);

  const { data: headerData } = useGetAllMixHerosQuery();

  // Transform backend data to tabs structure
  useEffect(() => {
    if (tabsData && tabsData.length > 0) {
      const formattedTabs = tabsData.map((tab) => ({
        id: tab._id,
        name: tab.tabName,
        // Add any other properties you need from the backend
      }));

      setTabs(formattedTabs);

      // Set the first tab as active if not already set
      if (!activeTab) {
        setActiveTab(formattedTabs[0].id);
      }
    }
  }, [tabsData, activeTab]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="items-center max-w-[1200px] mx-auto mb-4 mt-20">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB800]"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="items-center max-w-[1200px] mx-auto mb-4 mt-20">
        <div className="flex justify-center items-center h-96">
          <div className="text-red-500">Error loading activity tabs</div>
        </div>
      </div>
    );
  }

  // Don't render if no tabs
  if (!tabs.length) {
    return null;
  }

  // Group tabs for mobile display (3-2-1 pattern)
  const mobileTabGroups = [
    tabs.slice(0, 3),
    tabs.slice(3, 5),
    tabs.slice(5, 6),
  ];

  return (
    <div className="items-center max-w-[1200px] mx-auto mb-4 mt-20 lg:px-4 xl:px-0">
      <header className="text-center mb-8 mt-1 md:mt-20">
        {headerData?.map((data, index) => (
          <div key={index}>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#74767C]">
              {data.miniTitle1}
            </h3>
            <h1 className="text-3xl md:text-[40px] py-1 Z font-bold text-[#141B34] line-clamp-2">
              {data.Title1}
            </h1>
          </div>
        ))}
      </header>

      {/* PC version (hidden on mobile) */}
      <nav className="mb-8 hidden md:flex justify-center overflow-x-auto pb-2">
        <div className="flex space-x-1 sm:space-x-2 p-1 rounded-md">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border rounded-lg text-sm font-bold ${
                activeTab === tab.id
                  ? "bg-blue text-white shadow-md"
                  : "bg-white text-[#74767C] hover:bg-gray-100"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </nav>

      {/* MBL version (hidden on PC) */}
      <nav className="mb-8 flex flex-col gap-2 md:hidden">
        {mobileTabGroups.map((tabGroup, groupIndex) => (
          <div key={groupIndex} className="flex justify-center gap-2">
            {tabGroup.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 border rounded-lg text-sm font-bold ${
                  activeTab === tab.id
                    ? "bg-[#FFB800] shadow-md"
                    : "bg-white text-[#74767C] hover:bg-gray-100"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Render corresponding component */}
      <div className="mt-6">
        {activeTab && <DynamicActivityComponent tabId={activeTab} />}
      </div>
    </div>
  );
}
