"use client";
import { useState, useEffect } from "react";
import { useGetAllActivityGalleriesQuery } from "@/redux/features/WebManage/Activity.api";
import { DynamicActivityComponent } from "./ActivityDialog";
import { CreateActivityDialog } from "./CreateActivityDialog";
import {
  useGetAllMixHerosQuery,
  useUpdateMixHeroMutation,
} from "@/redux/features/WebManage/MixHero.api";
import { toast } from "sonner";

export default function HomeActivity({ visible }) {
  const {
    data: tabsData,
    isLoading,
    error,
  } = useGetAllActivityGalleriesQuery();
  const [activeTab, setActiveTab] = useState(null);
  const [tabs, setTabs] = useState([]);

  const { data: headerData } = useGetAllMixHerosQuery();
  const [updateMixHero, { isLoading: isUpdating }] = useUpdateMixHeroMutation();

  // State for editable fields
  const [editableData, setEditableData] = useState({
    miniTitle1: "",
    Title1: "",
  });
  const [mixHeroId, setMixHeroId] = useState("");

  // Initialize editable data and ID when headerData is available
  useEffect(() => {
    if (headerData && headerData.length > 0) {
      const firstMixHero = headerData[0];
      setEditableData({
        miniTitle1: firstMixHero.miniTitle1 || "",
        Title1: firstMixHero.Title1 || "",
      });
      setMixHeroId(firstMixHero._id || "");
    }
  }, [headerData]);

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to handle the update
  const handleUpdateMixHero = async () => {
    if (!mixHeroId) {
      toast.error("No MixHero ID found");
      return;
    }

    try {
      await updateMixHero({
        id: mixHeroId,
        data: editableData,
      }).unwrap();
      toast.success("MixHero updated successfully");
    } catch (error) {
      toast.error("Error updating MixHero:", error);
    }
  };

  // Transform backend data to tabs structure
  useEffect(() => {
    if (tabsData && tabsData.length > 0) {
      const formattedTabs = tabsData.map((tab) => ({
        id: tab._id,
        name: tab.tabName,
      }));

      setTabs(formattedTabs);

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
    <div className="items-center max-w-[1200px] mx-auto">
      <header className="text-center mb-8 mt-1 md:mt-20">
        {/* Display current header data */}
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#74767C]">
            {editableData.miniTitle1}
          </h3>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#141B34] leading-tight">
            {editableData.Title1}
          </h1>
        </div>

        {/* Editable MixHero fields */}
        <div className=" p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mini Title
              </label>
              <input
                type="text"
                value={editableData.miniTitle1}
                onChange={(e) =>
                  handleInputChange("miniTitle1", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                placeholder="Enter mini title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Title
              </label>
              <input
                type="text"
                value={editableData.Title1}
                onChange={(e) => handleInputChange("Title1", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                placeholder="Enter main title"
              />
            </div>
          </div>

          <button
            onClick={handleUpdateMixHero}
            disabled={isUpdating}
            className="px-4 py-2 bg-[#FFB800] font-semibold rounded-md hover:bg-[#e6a600] disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Header"}
          </button>
        </div>
      </header>

      {visible && (
        <div className="flex justify-end mb-4">
          <CreateActivityDialog />
        </div>
      )}

      {/* PC version (hidden on mobile) */}
      <nav className="mb-8 hidden md:flex justify-center overflow-x-auto pb-2">
        <div className="flex space-x-1 sm:space-x-2 p-1 rounded-md">
          {tabs.map((tab) => (
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
        {activeTab && <DynamicActivityComponent tabId={activeTab} ok="true" />}
      </div>
    </div>
  );
}
