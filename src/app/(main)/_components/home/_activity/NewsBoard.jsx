"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useGetAllActivityGalleriesQuery,
  useUpdateActivityGalleryMutation,
} from "@/redux/features/WebManage/Activity.api";
import Image from "next/image";
import { toast } from "sonner";

export const NewsboardComponent = ({ ok }) => {
  const {
    data: galleries,
    isLoading,
    error,
    refetch,
  } = useGetAllActivityGalleriesQuery();

  const [updateActivityGallery, { isLoading: isUpdating }] =
    useUpdateActivityGalleryMutation();

  // Use the fifth gallery data if available (index 4)
  const gallery = galleries && galleries.length > 4 ? galleries[4] : null;
  const activities = gallery?.activities || [];

  // Create individual forms for each activity
  const [activityForms, setActivityForms] = useState(
    Array(6).fill({ title: "", image: undefined })
  );

  // Set form data when API data is available
  useEffect(() => {
    if (activities.length > 0) {
      const formattedActivities = activities.map((activity) => ({
        title: activity.title || "",
        image: activity.image || undefined,
      }));

      // Pad with empty activities if needed
      while (formattedActivities.length < 6) {
        formattedActivities.push({ title: "", image: undefined });
      }

      setActivityForms(formattedActivities);
    }
  }, [activities]);

  const handleImageChange = (index, files) => {
    if (files && files.length > 0) {
      const newActivities = [...activityForms];
      newActivities[index].image = files[0];
      setActivityForms(newActivities);
    }
  };

  const handleTitleChange = (index, value) => {
    const newActivities = [...activityForms];
    newActivities[index].title = value;
    setActivityForms(newActivities);
  };

  const updateSingleActivity = async (index, activityData) => {
    try {
      if (!gallery) {
        toast.error("No gallery found to update");
        return;
      }

      const formData = new FormData();

      // Send individual fields instead of array structure
      formData.append(`activities[${index}][title]`, activityData.title || "");

      if (activityData.image instanceof File) {
        formData.append(`image`, activityData.image);
      } else if (activityData.image && typeof activityData.image === "string") {
        formData.append(`activities[${index}][image]`, activityData.image);
      }

      await updateActivityGallery({
        id: gallery._id,
        data: formData,
      }).unwrap();

      toast.success(`Activity ${index + 1} updated successfully`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.error || "Failed to update activity");
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB800]"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-red-500">Error loading activities</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Preview Section */}
      <div>
        {/* For PC */}
        <div className="hidden md:flex flex-row items-center gap-6">
          {/* Left Part */}
          <div className="h-[650px] w-[588px] flex flex-row gap-6">
            {/* 1st column */}
            <div className="w-full flex flex-col gap-6">
              {/* Top box - 405px */}
              <div className="h-[405px] w-full flex flex-col">
                <div className="h-[calc(405px-40px)] w-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      activities[0]?.image || "/placeholder-image.jpg"
                    }`}
                    alt={activities[0]?.title || "Placeholder"}
                    height={405}
                    width={588}
                    unoptimized
                    className="h-full w-full object-cover rounded-t-xl"
                  />
                </div>
                <div className="h-[40px] text-center text-sm flex items-center justify-center rounded-b-xl bg-[#FFB80033] font-bold text-[#141B34] text-[16px]">
                  {activities[0]?.title || "Coming soon"}
                </div>
              </div>

              {/* Bottom box - 220px */}
              <div className="h-[220px] w-full flex flex-col">
                <div className="h-[calc(220px-40px)] w-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      activities[1]?.image || "/placeholder-image.jpg"
                    }`}
                    alt={activities[1]?.title || "Placeholder"}
                    height={405}
                    width={588}
                    unoptimized
                    className="h-full w-full object-cover rounded-t-xl"
                  />
                </div>
                <div className="h-[40px] text-center text-sm flex items-center justify-center rounded-b-xl bg-[#FFB80033] font-bold text-[#141B34] text-[16px]">
                  {activities[1]?.title || "Coming soon"}
                </div>
              </div>
            </div>

            {/* 2nd column */}
            <div className="w-full flex flex-col gap-6">
              {/* Top box - 220px */}
              <div className="h-[220px] w-full flex flex-col">
                <div className="h-[calc(220px-40px)] w-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      activities[2]?.image || "/placeholder-image.jpg"
                    }`}
                    alt={activities[2]?.title || "Placeholder"}
                    height={405}
                    width={588}
                    unoptimized
                    className="h-full w-full object-cover rounded-t-xl"
                  />
                </div>
                <div className="h-[40px] text-center text-sm flex items-center justify-center rounded-b-xl bg-[#FFB80033] font-bold text-[#141B34] text-[16px]">
                  {activities[2]?.title || "Coming soon"}
                </div>
              </div>

              {/* Bottom box - 405px */}
              <div className="h-[405px] w-full flex flex-col">
                <div className="h-[calc(405px-40px)] w-full">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${
                      activities[3]?.image || "/placeholder-image.jpg"
                    }`}
                    alt={activities[3]?.title || "Placeholder"}
                    height={405}
                    width={588}
                    unoptimized
                    className="h-full w-full object-cover rounded-t-xl"
                  />
                </div>
                <div className="h-[40px] text-center text-sm flex items-center justify-center rounded-b-xl bg-[#FFB80033] font-bold text-[#141B34] text-[16px]">
                  {activities[3]?.title || "Coming soon"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Part */}
          <div className="h-[650px] w-[588px] flex flex-col justify-between gap-6">
            {/* Top - 425px */}
            <div className="h-[425px] w-full flex flex-col">
              <div className="h-[calc(425px-40px)] w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${
                    activities[4]?.image || "/placeholder-image.jpg"
                  }`}
                  alt={activities[4]?.title || "Placeholder"}
                  height={405}
                  width={588}
                  unoptimized
                  className="h-full w-full object-cover rounded-t-xl"
                />
              </div>
              <div className="h-[40px] text-center text-sm flex items-center justify-center rounded-b-xl bg-[#FFB80033] font-bold text-[#141B34] text-[16px]">
                {activities[4]?.title || "Coming soon"}
              </div>
            </div>

            {/* Bottom - 200px */}
            <div className="h-[200px] w-full flex flex-col">
              <div className="h-[calc(200px-40px)] w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${
                    activities[5]?.image || "/placeholder-image.jpg"
                  }`}
                  alt={activities[5]?.title || "Placeholder"}
                  height={405}
                  width={588}
                  unoptimized
                  className="h-full w-full object-cover rounded-t-xl"
                />
              </div>
              <div className="h-[40px] text-center text-sm flex items-center justify-center rounded-b-xl bg-[#FFB80033] font-bold text-[#141B34] text-[16px]">
                {activities[5]?.title || "Coming soon"}
              </div>
            </div>
          </div>
        </div>

        {/* For Mobile */}
        <div className="block md:hidden p-4">
          <div className="flex flex-col gap-6">
            {activities.slice(0, 6).map((activity, index) => (
              <div key={index} className="w-full flex flex-col">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${
                    activity?.image || "/placeholder-image.jpg"
                  }`}
                  alt={activity?.title || "Placeholder"}
                  height={405}
                  width={588}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="h-[40px] text-center text-sm flex items-center justify-center rounded-b-xl bg-[#FFB80033] font-bold text-[#141B34] text-[16px]">
                  {activity?.title || "Coming soon"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Form Section */}
      {ok && (
        <div className="bg-white rounded-2xl shadow-[0px_8px_40px_rgba(0,0,0,0.1)] p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Activities</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activityForms.map((activity, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <h3 className="font-medium">Activity {index + 1}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title
                    </label>
                    <Input
                      placeholder="Enter activity title"
                      value={activity.title}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Image
                    </label>
                    <div className="space-y-2">
                      {activities[index]?.image && (
                        <div className="flex items-center gap-2 mb-2">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}/${activities[index].image}`}
                            alt="Current image"
                            width={80}
                            height={60}
                            className="rounded-md object-cover"
                          />
                          <span className="text-sm text-gray-500">
                            Current image
                          </span>
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(index, e.target.files)
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => updateSingleActivity(index, activity)}
                    disabled={isUpdating}
                    className="bg-[#FFB800] hover:bg-[#e6a600] w-full"
                  >
                    {isUpdating
                      ? "Updating..."
                      : `Update Activity ${index + 1}`}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
