"use client";
import { Button } from "@/components/ui/button";
import {
  useGetAllPhotoGalleriesQuery,
  useUpdatePhotoGalleryMutation,
} from "@/redux/features/WebManage/PhotoGallery.api";
import {
  useGetAllMixHerosQuery,
  useUpdateMixHeroMutation,
} from "@/redux/features/WebManage/MixHero.api";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit, Save, X } from "lucide-react";

import Loader from "@/components/shared/Loader";
export default function HomeGallery() {
  const {
    data: galleryData,
    isLoading,
    isError,
    refetch,
  } = useGetAllPhotoGalleriesQuery();

  const { data: headerData } = useGetAllMixHerosQuery();
  const [updateMixHero, { isLoading: isUpdating }] = useUpdateMixHeroMutation();
  const [updatePhotoGallery] = useUpdatePhotoGalleryMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
    image6: "",
    image7: "",
    image8: "",
    image9: "",
    image10: "",
  });

  // State for editable header fields
  const [editableData, setEditableData] = useState({
    miniTitle3: "",
    Title3: "",
  });
  const [mixHeroId, setMixHeroId] = useState("");

  const [selectedImages, setSelectedImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  // Set gallery data when API data is available
  useEffect(() => {
    if (galleryData && galleryData.length > 0) {
      const data = galleryData[0];
      setFormData({
        image1: data.image1 || "",
        image2: data.image2 || "",
        image3: data.image3 || "",
        image4: data.image4 || "",
        image5: data.image5 || "",
        image6: data.image6 || "",
        image7: data.image7 || "",
        image8: data.image8 || "",
        image9: data.image9 || "",
        image10: data.image10 || "",
      });
    }
  }, [galleryData]);

  // Initialize editable data and ID when headerData is available
  useEffect(() => {
    if (headerData && headerData.length > 0) {
      const firstMixHero = headerData[0];
      setEditableData({
        miniTitle3: firstMixHero.miniTitle3 || "",
        Title3: firstMixHero.Title3 || "",
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

  const handleImageUpload = (imageIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImages((prev) => ({ ...prev, [imageIndex]: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => ({
          ...prev,
          [imageIndex]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (imageIndex) => {
    setFormData((prev) => ({ ...prev, [imageIndex]: "" }));
    setSelectedImages((prev) => {
      const newSelected = { ...prev };
      delete newSelected[imageIndex];
      return newSelected;
    });
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[imageIndex];
      return newPreviews;
    });
  };

  const handleSave = async () => {
    try {
      const updatedData = new FormData();

      // Add the image index that we're updating
      Object.keys(selectedImages).forEach((imageIndex) => {
        updatedData.append(
          "updatedImageIndex",
          imageIndex.replace("image", "")
        );
        updatedData.append("images", selectedImages[imageIndex]);
      });

      // Add any images that are being removed (set to empty string)
      Object.entries(formData).forEach(([key, value]) => {
        if (value === "" && !selectedImages[key]) {
          updatedData.append(key, "");
        }
      });

      await updatePhotoGallery({
        id: galleryData[0]._id,
        data: updatedData,
      }).unwrap();

      toast.success("Gallery updated successfully!");
      setIsEditing(false);
      setSelectedImages({});
      setImagePreviews({});
      refetch();
    } catch (error) {
      toast.error("Update failed!", {
        description: error?.data?.message || "Something went wrong.",
      });
    }
  };

  const handleCancel = () => {
    if (galleryData && galleryData.length > 0) {
      const data = galleryData[0];
      setFormData({
        image1: data.image1 || "",
        image2: data.image2 || "",
        image3: data.image3 || "",
        image4: data.image4 || "",
        image5: data.image5 || "",
        image6: data.image6 || "",
        image7: data.image7 || "",
        image8: data.image8 || "",
        image9: data.image9 || "",
        image10: data.image10 || "",
      });
    }
    setSelectedImages({});
    setImagePreviews({});
    setIsEditing(false);
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading data!</div>;

  return (
    <div className="items-center max-w-[1200px] mx-auto">
      {/* Header Section - Same as Activity Component */}
      <header className="text-center mb-8 mt-1 md:mt-20">
        {/* Display current header data */}
        <div className="mb-4">
          <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#74767C]">
            {editableData.miniTitle3}
          </h3>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#141B34] leading-tight">
            {editableData.Title3}
          </h1>
        </div>

        {/* Editable MixHero fields */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mini Title
              </label>
              <input
                type="text"
                value={editableData.miniTitle3}
                onChange={(e) =>
                  handleInputChange("miniTitle3", e.target.value)
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
                value={editableData.Title3}
                onChange={(e) => handleInputChange("Title3", e.target.value)}
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

      <div className="relative bg-[#FFB80033] rounded-[60px] overflow-x-hidden mx-auto px-0 pt-8">
        {/* hero bg */}
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

        {/* Gallery Images */}
        <div className="hidden md:block">
          <div className="flex justify-center items-center gap-2 px-4">
            {[1, 2, 3, 4, 5].map((index) => (
              <div key={index} className="relative group">
                {(formData[`image${index}`] ||
                  imagePreviews[`image${index}`]) && (
                  <>
                    <img
                      src={
                        imagePreviews[`image${index}`] ||
                        `${process.env.NEXT_PUBLIC_API_URL}/${
                          formData[`image${index}`]
                        }`
                      }
                      className="w-[200px] h-[160px] rounded-2xl object-cover mb-48 "
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeImage(`image${index}`)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </>
                )}
                {isEditing &&
                  !formData[`image${index}`] &&
                  !imagePreviews[`image${index}`] && (
                    <label className="w-[200px] h-[160px] border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer mb-48">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(`image${index}`, e)}
                        className="hidden"
                      />
                      <span className="text-gray-500">Add Image {index}</span>
                    </label>
                  )}
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 px-4 mb-12 -mt-32">
            {[6, 7, 8, 9, 10].map((index) => (
              <div key={index} className="relative group">
                {(formData[`image${index}`] ||
                  imagePreviews[`image${index}`]) && (
                  <>
                    <img
                      src={
                        imagePreviews[`image${index}`] ||
                        `${process.env.NEXT_PUBLIC_API_URL}/${
                          formData[`image${index}`]
                        }`
                      }
                      className="w-[200px] h-[160px] rounded-2xl object-cover mb-4 "
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeImage(`image${index}`)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </>
                )}
                {isEditing &&
                  !formData[`image${index}`] &&
                  !imagePreviews[`image${index}`] && (
                    <label className="w-[200px] h-[160px] border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer mb-48 ">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(`image${index}`, e)}
                        className="hidden"
                      />
                      <span className="text-gray-500">
                        Image {index} (Size : 420x300 px){" "}
                        <a
                          href="https://imageresizer.com/"
                          className="underline text-blue-600"
                        >
                          Resizer
                        </a>
                      </span>
                    </label>
                  )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
              <div key={index} className="relative group">
                {(formData[`image${index}`] ||
                  imagePreviews[`image${index}`]) && (
                  <>
                    <img
                      src={
                        imagePreviews[`image${index}`] ||
                        `${process.env.NEXT_PUBLIC_API_URL}/${
                          formData[`image${index}`]
                        }`
                      }
                      className="w-full h-32 rounded-2xl object-cover"
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeImage(`image${index}`)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </>
                )}
                {isEditing &&
                  !formData[`image${index}`] &&
                  !imagePreviews[`image${index}`] && (
                    <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(`image${index}`, e)}
                        className="hidden"
                      />
                      <span className="text-gray-500 text-sm">
                        Image {index}
                      </span>
                    </label>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Gallery Button */}
      <div className="flex justify-center p-4">
        {isEditing ? (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-1">
              <Save size={16} />
              Save Gallery
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1"
          >
            <Edit size={16} />
            Edit Gallery
          </Button>
        )}
      </div>
    </div>
  );
}
