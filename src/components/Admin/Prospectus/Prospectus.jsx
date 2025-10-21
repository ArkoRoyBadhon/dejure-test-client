"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Download, FileUp } from "lucide-react";
import { toast } from "sonner";
import { useUpdateCourseMutation } from "@/redux/features/course/course.api";

const Prospectus = ({ course }) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const [updateCourse] = useUpdateCourseMutation();

  const [file, setFile] = useState(null);
  const [prospectusImageFile, setProspectusImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Get prospectus URL from course data
  const prospectusUrl = course?.prospectus
    ? `${process.env.NEXT_PUBLIC_API_URL}/${course.prospectus}`
    : null;

  // Get prospectus image URL from course data
  const prospectusImageUrl = course?.prospectusImage
    ? `${process.env.NEXT_PUBLIC_API_URL}/${course.prospectusImage}`
    : null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const handleProspectusImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/jpg" ||
        selectedFile.type === "image/png")
    ) {
      setProspectusImageFile(selectedFile);
    } else {
      toast.error("Please select a valid image file (JPEG, JPG, PNG)");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file); // Changed to match backend
      formData.append("prospectus_file", "true");

      await updateCourse({
        id: course._id,
        patch: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).unwrap();

      toast.success("Prospectus uploaded successfully");
      setFile(null);
      // You might want to refresh the course data here
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.data?.message || "Failed to upload prospectus");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProspectusImageUpload = async () => {
    if (!prospectusImageFile) {
      toast.error("Please select an image file first");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("prospectusImage", prospectusImageFile);
      formData.append("prospectusImage", "true");

      await updateCourse({
        id: course._id,
        patch: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).unwrap();

      toast.success("Prospectus image uploaded successfully");
      setProspectusImageFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.data?.message || "Failed to upload prospectus image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!prospectusUrl) return;

    try {
      // Fetch the PDF file
      const response = await fetch(prospectusUrl);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "prospectus.pdf";

      // Trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download prospectus");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Program Prospectus</h1>
        {prospectusUrl && (
          <Button onClick={handleDownload} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        )}
      </div>

      {isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Prospectus</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full max-w-md">
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                id="prospectus-upload"
              />
              <label
                htmlFor="prospectus-upload"
                className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                <FileUp className="h-4 w-4 mr-2" />
                {file ? file.name : "Choose PDF file"}
              </label>
            </div>
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold my-4">Prospectus PDF</h3>
            {prospectusUrl ? (
              <div className="w-full h-[80vh]">
                <iframe
                  src={`${prospectusUrl}#toolbar=0`}
                  className="w-full h-full border-0"
                  title="Prospectus Preview"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-lg text-gray-500 mb-4">
                  No prospectus available
                </p>
                {isAdmin && (
                  <p className="text-sm text-gray-400">
                    Upload a PDF to make it available to users
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Upload Prospectus Image
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full max-w-md">
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleProspectusImageChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                id="prospectus-image-upload"
              />
              <label
                htmlFor="prospectus-image-upload"
                className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
              >
                <FileUp className="h-4 w-4 mr-2" />
                {prospectusImageFile
                  ? prospectusImageFile.name
                  : "Choose Image file"}
              </label>
            </div>
            <Button
              onClick={handleProspectusImageUpload}
              disabled={!prospectusImageFile || isUploading}
              className="gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </div>

          {prospectusImageUrl && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold my-4">Prospectus Image</h3>
              <div className="w-full max-w-2xl mx-auto">
                <img
                  src={prospectusImageUrl}
                  alt="Prospectus Image"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* <div className="bg-white p-6 rounded-lg shadow-md"></div> */}
    </div>
  );
};

export default Prospectus;
