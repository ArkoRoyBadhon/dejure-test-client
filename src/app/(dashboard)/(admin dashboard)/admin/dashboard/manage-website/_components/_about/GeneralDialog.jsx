"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useUpdateAboutMutation,
  useCreateAboutMutation,
} from "@/redux/features/WebManage/About.api";

export default function GeneralDialog({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  aboutData,
  refetch,
}) {
  const [updateAbout, { isLoading: isUpdating }] = useUpdateAboutMutation();
  const [createAbout, { isLoading: isCreating }] = useCreateAboutMutation();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Prepare form data for submission
  const prepareFormData = () => {
    const formDataObj = new FormData();

    // Append text fields
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    formDataObj.append("visionTitle", formData.visionTitle);
    formDataObj.append("visionDescription", formData.visionDescription);
    formDataObj.append("missionTitle", formData.missionTitle);
    formDataObj.append("missionDescription", formData.missionDescription);
    formDataObj.append("coreValueTitle", formData.coreValueTitle);
    formDataObj.append("coreValueDescription", formData.coreValueDescription);

    return formDataObj;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = prepareFormData();

      if (aboutData) {
        await updateAbout({ id: aboutData._id, data: formDataObj }).unwrap();
        toast.success("General section updated successfully");
      } else {
        await createAbout(formDataObj).unwrap();
        toast.success("General section created successfully");
      }

      refetch();
      setIsOpen(false);
    } catch (error) {
      toast.error(error?.data?.error || "Failed to save general section");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="custom-dialog-width max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {aboutData ? "Edit General Section" : "Create General Section"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter title"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                rows={4}
              />
            </div>
          </div>

          {/* Vision Section */}
          <div className="border p-4 rounded-lg">
            <div className="space-y-4">
              <div>
                <Input
                  id="visionTitle"
                  name="visionTitle"
                  value={formData.visionTitle}
                  onChange={handleInputChange}
                  placeholder="Enter vision title"
                />
              </div>
              <div>
                <Label htmlFor="visionDescription">
                  Vision Description
                </Label>
                <Textarea
                  id="visionDescription"
                  name="visionDescription"
                  value={formData.visionDescription}
                  onChange={handleInputChange}
                  placeholder="Enter vision description"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="border p-4 rounded-lg">
            <div className="space-y-4">
              <div>
                <Input
                  id="missionTitle"
                  name="missionTitle"
                  value={formData.missionTitle}
                  onChange={handleInputChange}
                  placeholder="Enter mission title"
                />
              </div>
              <div>
                <Label htmlFor="missionDescription">
                  Mission Description
                </Label>
                <Textarea
                  id="missionDescription"
                  name="missionDescription"
                  value={formData.missionDescription}
                  onChange={handleInputChange}
                  placeholder="Enter mission description"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="border p-4 rounded-lg">
            <div className="space-y-4">
              <div>
                <Input
                  id="coreValueTitle"
                  name="coreValueTitle"
                  value={formData.coreValueTitle}
                  onChange={handleInputChange}
                  placeholder="Enter core value title"
                />
              </div>
              <div>
                <Label htmlFor="coreValueDescription">
                  Core Value Description
                </Label>
                <Textarea
                  id="coreValueDescription"
                  name="coreValueDescription"
                  value={formData.coreValueDescription}
                  onChange={handleInputChange}
                  placeholder="Enter core value description"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isCreating || isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="bg-[#FFB800] hover:bg-[#e6a600]"
            >
              {isCreating || isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}