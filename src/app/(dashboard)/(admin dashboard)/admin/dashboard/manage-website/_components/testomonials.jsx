"use client";
import {
  useGetAllMixHerosQuery,
  useUpdateMixHeroMutation,
} from "@/redux/features/WebManage/MixHero.api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ManageTestomonials from "./_testomonial/testomonial";

export default function TestomonialManagePage() {
  const { data: headerData } = useGetAllMixHerosQuery();
  const [updateMixHero, { isLoading: isUpdating }] = useUpdateMixHeroMutation();

  // State for editable header fields
  const [editableData, setEditableData] = useState({
    miniTitle2: "",
    Title2: "",
  });
  const [mixHeroId, setMixHeroId] = useState("");

  // Initialize editable data and ID when headerData is available
  useEffect(() => {
    if (headerData && headerData.length > 0) {
      const firstMixHero = headerData[0];
      setEditableData({
        miniTitle2: firstMixHero.miniTitle2 || "",
        Title2: firstMixHero.Title2 || "",
      });
      setMixHeroId(firstMixHero._id || "");
    }
  }, [headerData]);

  // Function to handle header input changes
  const handleInputChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to handle the header update
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
      toast.success("Header updated successfully");
    } catch (error) {
      toast.error("Error updating header");
    }
  };

  return (
    <div className="flex flex-col items-center max-w-[1200px] mx-auto p-4 mt-8">
      {/* Header Section - Same as Activity and Gallery Components */}
      <header className="text-center mb-8 w-full">
        {/* Display current header data */}
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#74767C]">
            {editableData.miniTitle2}
          </h3>
          <h2 className="font-bold text-[#141b34] text-[40px] tracking-[-0.88px] leading-[60px] hidden md:block">
            {editableData.Title2}
          </h2>
          <h2 className="font-bold text-[#141b34] text-xl block md:hidden">
            {editableData.Title2.split(" ").length > 5
              ? editableData.Title2.split(" ").slice(0, 5).join(" ") +
                " <br />" +
                editableData.Title2.split(" ").slice(5).join(" ")
              : editableData.Title2}
          </h2>
        </div>

        {/* Editable MixHero fields */}
        <div className="p-4 border rounded-lg bg-gray-50 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mini Title
              </label>
              <input
                type="text"
                value={editableData.miniTitle2}
                onChange={(e) =>
                  handleInputChange("miniTitle2", e.target.value)
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
                value={editableData.Title2}
                onChange={(e) => handleInputChange("Title2", e.target.value)}
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

      {/* Rest of your testimonial content goes here */}
      <div className="w-full">
        {/* Your testimonial management components will go here */}
        <ManageTestomonials />
      </div>
    </div>
  );
}
