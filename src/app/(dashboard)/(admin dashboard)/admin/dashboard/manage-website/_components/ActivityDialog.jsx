"use client";

import { useState, useEffect, act } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import {
  useDeleteActivityGalleryMutation,
  useGetActivityGalleryByIdQuery,
  useUpdateActivityGalleryMutation,
} from "@/redux/features/WebManage/Activity.api";
import { useRouter } from "next/navigation";

export const DynamicActivityComponent = ({ tabId, ok = false }) => {
  // Add router
  const router = useRouter();
  const {
    data: galleryData,
    isLoading,
    error,
    refetch,
  } = useGetActivityGalleryByIdQuery(tabId);

  const [updateActivityGallery, { isLoading: isUpdating }] =
    useUpdateActivityGalleryMutation();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteActivityGallery] = useDeleteActivityGalleryMutation();

  // Add this delete handler
  const handleDelete = async () => {
    try {
      await deleteActivityGallery(gallery._id).unwrap();
      toast.success("Activity gallery deleted successfully");
      setShowDeleteDialog(false);
      router.refresh(); // Refresh the page data
    } catch (error) {
      toast.error("Failed to delete activity gallery");
    }
  };

  const gallery = galleryData || null;
  const activities = gallery?.activities || [];

  // Add state for tab name
  const [tabName, setTabName] = useState(gallery?.name || "");

  // Update tabName when gallery data is loaded
  useEffect(() => {
    if (gallery?.name) {
      setTabName(gallery.name);
    }
  }, [gallery]);

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

  // Update handler for tab name
  const updateTabName = async () => {
    try {
      const formData = new FormData();
      formData.append("tabName", tabName); // Changed from "name" to "tabName"

      await updateActivityGallery({
        id: gallery._id,
        data: formData,
      }).unwrap();

      toast.success("Tab name updated successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.error || "Failed to update tab name");
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
        <div className="bg-white rounded-2xl border shadow-[0px_8px_40px_rgba(0,0,0,0.1)] p-6">
          <div className="flex justify-end mb-4">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">Delete Gallery</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Activity Gallery</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this activity gallery? This
                    action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center border-b-2 pb-4">
            Edit Activities
          </h2>
          {/* Add Tab Name Edit Section */}

          <div className="bg-white rounded-2xl border shadow-[0px_8px_40px_rgba(0,0,0,0.1)] p-1 mb-2">
            <div className="flex items-center gap-4">
              <Input
                value={tabName}
                onChange={(e) => setTabName(e.target.value)}
                placeholder="Enter tab name"
                className="flex-1"
              />
              <Button
                onClick={updateTabName}
                disabled={isUpdating}
                className="bg-[#FFB800] hover:bg-[#e6a600]"
              >
                {isUpdating ? "Updating..." : "Update Tab Name"}
              </Button>
            </div>
          </div>
          <div className="mt-3 p-3 rounded-md bg-gray-50 border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">
              📐 Image Size Recommendations:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>
                Activity 1 & 4 →{" "}
                <span className="font-semibold">405 px height</span>
              </li>
              <li>
                Activity 2 & 3 →{" "}
                <span className="font-semibold">220 px height</span>
              </li>
              <li>
                Activity 5 →{" "}
                <span className="font-semibold">425 px height</span>
              </li>
              <li>
                Activity 6 →{" "}
                <span className="font-semibold">200 px height</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center justify-between">
            {activityForms.map((activity, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg space-y-4 h-[400px]"
              >
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
                    className="bg-[#FFB800] hover:bg-[#e6a600] w-full "
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
