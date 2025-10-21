"use client";
import {
  useGetAllMixHerosQuery,
  useUpdateMixHeroMutation,
} from "@/redux/features/WebManage/MixHero.api";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function TimelineManagePage() {
  const { data: headerData } = useGetAllMixHerosQuery();
  const [updateMixHero, { isLoading: isUpdating }] = useUpdateMixHeroMutation();

  // State for editable header fields
  const [editableData, setEditableData] = useState({
    miniTitle4: "",
    Title4: "",
  });
  const [mixHeroId, setMixHeroId] = useState("");

  // Initialize editable data and ID when headerData is available
  useEffect(() => {
    if (headerData && headerData.length > 0) {
      const timelineHeroData = headerData[0];
      setEditableData({
        miniTitle4: timelineHeroData.miniTitle4 || "",
        Title4: timelineHeroData.Title4 || "",
      });
      setMixHeroId(timelineHeroData._id || "");
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
      toast.success("Timeline header updated successfully");
    } catch (error) {
      toast.error("Error updating timeline header");
    }
  };

  return (
    <div className="flex flex-col items-center max-w-[1200px] mx-auto p-4 mt-8">
      {/* Header Section */}
      <header className="text-center mb-8 w-full">
        <div className="mb-4">
          <h2 className="font-bold text-[#141b34] text-4xl tracking-[-0.88px] leading-[60px] hidden md:block">
            📆 {editableData.Title4}
          </h2>
          <h3 className="text-md  mb-2 text-[#74767C]">
            {editableData.miniTitle4}
          </h3>

          <h2 className="font-bold text-[#141b34] text-xl block md:hidden">
            {editableData.Title4.split(" ").length > 5
              ? editableData.Title4.split(" ").slice(0, 5).join(" ") +
                " <br />" +
                editableData.Title4.split(" ").slice(5).join(" ")
              : editableData.Title4}
          </h2>
        </div>
      </header>

      {/* Editable MixHero fields */}
      {/* Editable MixHero fields */}
      <div className="p-4 border rounded-lg bg-gray-50 max-w-[1200px] mx-auto w-full">
        <div className="grid grid-cols-1  gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={editableData.Title4}
              onChange={(e) => handleInputChange("Title4", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Enter main title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mini Title
            </label>
            <input
              type="text"
              value={editableData.miniTitle4}
              onChange={(e) => handleInputChange("miniTitle4", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Enter mini title"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleUpdateMixHero}
            disabled={isUpdating}
            className="px-4 py-2 bg-[#FFB800] font-semibold rounded-md hover:bg-[#e6a600] disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Timeline Header"}
          </button>
        </div>
      </div>
    </div>
  );
}
