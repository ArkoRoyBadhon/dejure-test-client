"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save } from "lucide-react";
import Loader from "@/components/shared/Loader";
import {
  useGetAllHomeCoursesQuery,
  useUpdateHomeCourseMutation,
} from "@/redux/features/WebManage/HomeCourses.api";

export default function ManageInterCourses() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({ title: "", subTitle: "" });

  const {
    data: homeCourses,
    isLoading,
    error,
    refetch,
  } = useGetAllHomeCoursesQuery();
  const [updateHomeCourse] = useUpdateHomeCourseMutation();

  useEffect(() => {
    if (homeCourses && homeCourses.length > 0) {
      setEditingData(homeCourses[0]);
    }
  }, [homeCourses]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original data when canceling
      if (homeCourses && homeCourses.length > 0) {
        setEditingData(homeCourses[0]);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleFieldChange = (field, value) => {
    setEditingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      if (homeCourses && homeCourses.length > 0) {
        await updateHomeCourse({
          id: homeCourses[0]._id,
          data: editingData,
        }).unwrap();
        setIsEditing(false);
        refetch();
      }
    } catch (error) {}
  };

  const handleSaveNew = async () => {
    try {
    } catch (error) {}
  };

  if (isLoading) return <Loader />;
  if (error)
    return <div className="p-6 border">Error loading home courses</div>;

  return (
    <div className="p-6 border relative">
      {homeCourses && homeCourses.length > 0 ? (
        <>
          <h3 className="flex flex-col md:flex-row text-center items-center justify-center gap-4 md:gap-2.5 text-darkColor text-3xl md:text-4xl font-bold leading-[120%]">
            <Image
              alt="Live Stream icon"
              src="/assets/icons/live-streaming.png"
              height={40}
              width={40}
              className="w-10 h-10"
            />
            {isEditing ? (
              <Input
                value={editingData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className=" font-bold text-center"
              />
            ) : (
              editingData.title
            )}
          </h3>
          <p className="text-[20px] md:text-2xl text-[#74767C] mt-4 text-center">
            {isEditing ? (
              <Input
                value={editingData.subTitle}
                onChange={(e) => handleFieldChange("subTitle", e.target.value)}
                className=" text-center"
              />
            ) : (
              editingData.subTitle
            )}
          </p>
        </>
      ) : (
        <div className="text-center">
          <p className="text-gray-500 mb-4">No home course data found</p>
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={editingData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div>
              <Label htmlFor="new-subtitle">Subtitle</Label>
              <Input
                id="new-subtitle"
                value={editingData.subTitle}
                onChange={(e) => handleFieldChange("subTitle", e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>
            <Button onClick={handleSaveNew} className="w-full">
              Create Home Course
            </Button>
          </div>
        </div>
      )}

      {/* Edit/Save Button */}
      <div className=" flex items-center justify-center mt-8">
        {homeCourses && homeCourses.length > 0 ? (
          isEditing ? (
            <div className="flex gap-2">
              <Button onClick={handleEditToggle} variant="outline" size="sm">
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                size="sm"
                className="flex items-center gap-1"
              >
                <Save size={16} />
                Save
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleEditToggle}
              size="sm"
              className="flex items-center gap-1"
            >
              <Edit size={16} />
              Edit
            </Button>
          )
        ) : (
          <Button
            onClick={handleSaveNew}
            size="sm"
            className="flex items-center gap-1"
          >
            <Save size={16} />
            Create
          </Button>
        )}
      </div>
    </div>
  );
}
