"use client";
import React, { useState } from "react";
import QuestionSetList from "./_components/QuestionSetList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import PermissionError from "@/components/shared/PermissionError";

const page = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPermissionError, setShowPermissionError] = useState(false);
  const router = useRouter();

  const handlePermissionError = () => {
    setShowPermissionError(true);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (showPermissionError) {
    return <PermissionError />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between border shadow2  mb-4 rounded-[16px] p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ">
          <h2 className="text-2xl font-semibold text-foreground">
            Question Sets
          </h2>
        </div>
        <div className="flex justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <Input
              placeholder="Search question sets..."
              className="w-full sm:w-64"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Button
            className={`py-2 px-4 font-medium rounded-[16px]  ${
              activeTab === "create"
                ? "text-darkColor bg-main"
                : "text-gray-600 hover:text-darkColor hover:bg-main/90 bg-main"
            }`}
            onClick={() => router.push("/admin/dashboard/question-set/create")}
          >
            Create New Set
          </Button>
        </div>
      </div>

      <QuestionSetList
        searchTerm={searchTerm}
        onPermissionError={handlePermissionError}
      />
    </div>
  );
};

export default page;
