"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Upload, Trash2, CloudUpload, FileText } from "lucide-react";
import { useState, useEffect } from "react";

export default function AnswerUploadComponent() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 2,
    minutes: 30,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatTime = (time) => {
    return time.toString().padStart(2, "0");
  };

  return (
    <div className="">
      <Card className="rounded-[16px] overflow-hidden mt-8 bg-white p-0">
        {/* Header */}
        <CardHeader className="text-center bg-gray2 p-4">
          <div className="flex items-center justify-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              উত্তর পত্র আপলোড করুন
            </h1>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-8">
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-white hover:bg-blue-50 transition-colors duration-200">
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center gap-4"
              >
                <CloudUpload className="w-16 h-16 text-blue-400" />
                <div className="space-y-2">
                  <p className="text-[16px] text-darkColor">
                    উত্তর পত্র আপলোড করুন
                  </p>
                  <p className="text-sm text-gray-500">
                    ছবি বা PDF ফাইল আপলোড করুন (যত খুশি ফাইল সিলেক্ট করতে
                    পারবেন)
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  ফাইল সিলেক্ট করুন
                </span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
            </div>
          </div>

          {/* File Preview Grid - Now scrollable with unlimited files */}
          {uploadedFiles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-700 mb-4">
                আপলোড করা ফাইল ({uploadedFiles.length})
              </h3>
              <div className="overflow-x-auto">
                <div
                  className="flex gap-4 pb-2"
                  style={{
                    minWidth: `${Math.ceil(uploadedFiles.length / 5) * 100}%`,
                  }}
                >
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="w-40 aspect-[3/4] relative group shrink-0"
                    >
                      <div className="relative h-full border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                        {file.file.type.startsWith("image/") ? (
                          <>
                            <img
                              src={file.preview || "/placeholder.svg"}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-2">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-2">
                              <FileText className="w-6 h-6 text-red-500" />
                            </div>
                            <p className="text-xs text-gray-600 text-center px-1 line-clamp-2">
                              {file.name.replace(/\.[^/.]+$/, "")}
                            </p>
                            <span className="text-[10px] text-gray-400 mt-1">
                              {file.file.type.split("/")[1]}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded flex items-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-main p-4 mt-8 rounded-[16px]">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="text-darkColor font-medium">
            Remaining: {formatTime(timeRemaining.hours)} HRS{" "}
            {formatTime(timeRemaining.minutes)} MIN{" "}
            {formatTime(timeRemaining.seconds)} SEC
          </div>
          <Button
            className="bg-white text-darkColor hover:bg-gray-100 font-semibold px-8 py-2 lg:w-[336px]"
            disabled={uploadedFiles.length === 0}
          >
            SUBMIT
          </Button>
        </div>
      </div>
    </div>
  );
}
