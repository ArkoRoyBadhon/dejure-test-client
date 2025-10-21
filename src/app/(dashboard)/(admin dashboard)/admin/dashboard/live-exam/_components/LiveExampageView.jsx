"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LiveExamList from "./LiveExamList";
import PermissionError from "@/components/shared/PermissionError";

const LiveExamPageView = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showPermissionError, setShowPermissionError] = useState(false);

  const handlePermissionError = () => {
    setShowPermissionError(true);
  };

  if (showPermissionError) {
    return <PermissionError />;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between border shadow2 mb-4 rounded-[16px] p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Live Exam Management
          </h2>
        </div>
        <div className="flex justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <Input
              placeholder="Search Live exam..."
              className="w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            className="py-2 px-4 font-medium rounded-[16px] text-darkColor bg-main hover:bg-main/90"
            onClick={() => router.push("/admin/dashboard/live-exam/create")}
          >
            Create New Exam
          </Button>
        </div>
      </div>
      <LiveExamList
        searchTerm={searchTerm}
        onPermissionError={handlePermissionError}
      />
    </div>
  );
};

export default LiveExamPageView;
