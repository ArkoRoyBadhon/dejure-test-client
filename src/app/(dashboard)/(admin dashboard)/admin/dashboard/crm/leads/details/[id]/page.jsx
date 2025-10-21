"use client";

import { useState, useEffect, useRef } from "react";
import {
  useGetLeadByIdQuery,
  useUpdateLeadMutation,
  useUploadLeadProfileImageMutation,
} from "@/redux/features/crm/crm.api";
import {
  User,
  NotebookText,
  ArrowLeft,
  Activity,
  List,
  Bookmark,
  Smartphone,
  Monitor,
  BookOpen,
  Users,
  MessageSquare,
  CalendarDays,
  Search,
  Plus,
  Pencil,
  History,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import CallDialer from "../../../_components/CallDialer";
import leadTabs from "./LeadTab";

export default function LeadDetailsPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const {
    data: response,
    isLoading,
    refetch,
  } = useGetLeadByIdQuery(id, {
    skip: !id,
  });
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const [uploadLeadProfileImage, { isLoading: isUploadingImage }] =
    useUploadLeadProfileImageMutation();
  const lead = response?.data;
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("quick-view");

  const handleFieldUpdate = async (field, value) => {
    if (value && typeof value === "string" && value.trim() === "") {
      toast.error(({ id, closeToast }) => (
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>{`${field} cannot be empty.`}</div>
        </div>
      ));
      return;
    }

    try {
      await updateLead({ id, [field]: value }).unwrap();
      refetch();
      toast.success(`${field} updated successfully.`);
    } catch (error) {
      toast.error(
        `Failed to update ${field}. ${error?.data?.message || error.message}`
      );
    }
  };

  const handleAddAlternatePhone = async () => {
    const updatedPhones = [...(lead?.alternatePhoneNumbers || []), ""];
    await handleFieldUpdate("alternatePhoneNumbers", updatedPhones);
  };

  const handleUpdateAlternatePhone = async (index, value) => {
    const updatedPhones = [...(lead?.alternatePhoneNumbers || [])];
    updatedPhones[index] = value;
    await handleFieldUpdate("alternatePhoneNumbers", updatedPhones);
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>No file selected.</div>
        </div>
      );
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>Only JPEG, PNG, or GIF files are allowed.</div>
        </div>
      );
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 5MB.");
      return;
    }

    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("profileImage", file); // Make sure this matches what your backend expects

      await uploadLeadProfileImage({ id, formData }).unwrap();
      refetch();
      toast.success(
        <div className="space-y-1">
          <div className="font-semibold">Success</div>
          <div>Profile image uploaded successfully.</div>
        </div>
      );
    } catch (error) {
      console.error("Profile image upload error:", error);
      toast.error(
        <div className="space-y-1">
          <div className="font-semibold">Error</div>
          <div>
            {error?.data?.message ||
              "Failed to upload profile image. Please try again."}
          </div>
        </div>
      );
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (!id) {
    return (
      <div className="text-red p-4">Error: No lead ID provided in the URL.</div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-main" />
      </div>
    );
  }

  if (!lead) {
    return <div className="text-red p-4">Lead not found</div>;
  }

  const getInitial = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const renderTabContent = (tabId) => {
    const fields = leadTabs[tabId];
    if (!fields) return null;

    const label = tabId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <Card className="p-5 border-l-4 border-gray1">
        <h2 className="text-lg font-semibold text-main mb-4">{label}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <InfoField
              key={field.name}
              label={field.label}
              value={lead[field.name] || ""}
              fieldName={field.name}
              onUpdate={handleFieldUpdate}
              isTextarea={field.type === "textarea"}
              type={field.type}
              options={field.options}
            />
          ))}
          {tabId === "personal-info" && (
            <>
              {(lead.alternatePhoneNumbers || []).map((phone, index) => (
                <InfoField
                  key={`alt-phone-${index}`}
                  label={`Alternate Phone ${index + 1}`}
                  value={phone}
                  fieldName={`alternatePhoneNumbers[${index}]`}
                  onUpdate={(field, value) =>
                    handleUpdateAlternatePhone(index, value)
                  }
                  type="text"
                />
              ))}
              <div className="md:col-span-2">
                <Button
                  variant="outline"
                  className="mt-2 hover:bg-blue/80 hover:text-white gap-1"
                  onClick={handleAddAlternatePhone}
                  disabled={isUpdating}
                >
                  <Plus className="h-4 w-4" />
                  Add Alternate Phone Number
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header Section */}
      <Card className="p-5 border-l-4 border-gray1">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Profile Image with Hover Upload Icon */}
            <div className="relative group">
              {lead.profileImg ? (
                <div className="rounded-full p-0.5 bg-gradient-to-r from-main to-green">
                  <Image
                    src={lead.profileImg}
                    alt={lead.fullName}
                    width={200}
                    height={200}
                    className="rounded-full object-cover border-2 border-white size-20"
                  />
                </div>
              ) : (
                <div className="rounded-full p-0.5 bg-gray2">
                  <Image
                    src="/assets/image/avatar.webp"
                    alt="User Avatar"
                    width={200}
                    height={200}
                    className="rounded-full object-cover border-2 border-white size-20"
                  />
                </div>
              )}
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={triggerFileInput}
              >
                <Upload className="h-6 w-6 text-white" />
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                ref={fileInputRef}
                className="hidden"
                onChange={handleProfileImageUpload}
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold capitalize text-main">
                {lead.fullName}
              </h1>
              <p className="text-sm">
                {lead.institution || "De Jure"} | Class {lead.class || "C10"} |{" "}
                {lead.passingYear || "2026"}
              </p>
              <Badge className="mt-2 bg-main/70 rounded text-stone-700 px-2 py-1 capitalize flex items-center gap-1 group hover:bg-main/90 transition-colors">
                {lead.stage?.replaceAll("_", " ") || "Stage N/A"}
                <Pencil className="size-3" />
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="bg-blue/80 hover:bg-blue text-white hover:text-white gap-1"
            >
              <Activity className="h-4 w-4" />
              <span>App Activity</span>
            </Button>
            <Link href={`/admin/dashboard/crm/leads/activity/${lead._id}`}>
              <Button
                variant="outline"
                className="hover:bg-blue/80 hover:text-white gap-1"
              >
                <History className="h-4 w-4" />
                <span>Activity</span>
              </Button>
            </Link>
            <Link href={`/admin/dashboard/crm/leads/task/${lead._id}`}>
              <Button
                variant="outline"
                className="hover:bg-blue/80 hover:text-white gap-1"
              >
                <Bookmark className="h-4 w-4" />
                <span>Task</span>
              </Button>
            </Link>
            <Link href={`/admin/dashboard/crm/leads/note/${lead._id}`}>
              <Button
                variant="outline"
                className="hover:bg-blue/80 hover:text-white gap-1"
              >
                <NotebookText className="h-4 w-4" />
                <span>Note</span>
              </Button>
            </Link>
            <CallDialer leadPhoneNumber={lead.phone} />
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div>
        <div className="inline-flex flex-wrap items-start gap-1 sm:gap-0.5 border-b pb-1 bg-[#EEEEEE] p-1 rounded-xl overflow-x-auto">
          {Object.keys(leadTabs).map((tabId) => {
            const icons = {
              "quick-view": Search,
              "personal-info": User,
              "guardians-info": Users,
              "tech-adoption": Smartphone,
              "studying-habits": BookOpen,
              events: CalendarDays,
              "inbound-query": MessageSquare,
            };
            const Icon = icons[tabId];
            const label = tabId
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

            return (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`px-3 py-1 sm:px-4 sm:py-2 shadow-lg rounded-md text-xs sm:text-sm flex items-center gap-1 ${
                  activeTab === tabId ? "bg-main" : "bg-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span
                  className={`${
                    activeTab === tabId
                      ? "text-[#141B34] font-bold"
                      : "text-[#74767C] font-bold"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4">{renderTabContent(activeTab)}</div>
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="hover:bg-main/10 hover:text-main gap-1"
        >
          <ArrowLeft className="h-4 w-4 text-main" />
          Back
        </Button>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  fieldName,
  onUpdate,
  isTextarea = false,
  type = "text",
  options = [],
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const inputRef = useRef(null);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (inputValue !== value) {
      onUpdate(fieldName, inputValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isTextarea) {
      handleBlur();
    } else if (e.key === "Escape") {
      setInputValue(value || "");
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (type !== "select" && type !== "boolean") {
        inputRef.current.select();
      }
    }
  }, [isEditing, type]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        handleBlur();
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, inputValue]);

  const renderInputField = () => {
    if (!isEditing) {
      return (
        <div
          className="flex items-center h-11 px-4 py-2 rounded-[10px] border border-gray-300 bg-gray2 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={handleClick}
        >
          {value || "Not provided"}
        </div>
      );
    }

    switch (type) {
      case "textarea":
        return (
          <Textarea
            ref={inputRef}
            className="w-full h-20 px-4 py-3 rounded-[16px] border border-gray-300 bg-gray1 text-sm resize-none focus-visible:ring-2 focus-visible:ring-blue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        );
      case "select":
        return (
          <Select
            value={inputValue}
            onValueChange={setInputValue}
            onOpenChange={(open) => !open && handleBlur()}
          >
            <SelectTrigger
              ref={inputRef}
              className="w-full bg-gray1 px-4 py-2 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-gray1"
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "boolean":
        return (
          <Select
            value={inputValue}
            onValueChange={setInputValue}
            onOpenChange={(open) => !open && handleBlur()}
          >
            <SelectTrigger
              ref={inputRef}
              className="w-full bg-gray1 px-4 py-2 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-gray1"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        );
      case "date":
        return (
          <Input
            ref={inputRef}
            type="date"
            className="w-full bg-gray1 px-4 py-2 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-gray1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        );
      case "number":
        return (
          <Input
            ref={inputRef}
            type="number"
            className="w-full bg-gray1 px-4 py-2 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-gray1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        );
      default:
        return (
          <Input
            ref={inputRef}
            className="w-full bg-gray1 px-4 py-2 rounded-[10px] border border-gray-300 focus:ring-2 focus:ring-gray1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium mb-1">{label}</label>
      {renderInputField()}
    </div>
  );
}
