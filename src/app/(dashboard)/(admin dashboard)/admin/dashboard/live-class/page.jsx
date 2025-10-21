"use client";

import LiveClassCard from "@/components/shared/LiveClassCard";
import CreateLiveClassModal from "@/components/shared/Modals/CreateLiveClassModal";
import PermissionError from "@/components/shared/PermissionError";
import { Input } from "@/components/ui/input";
import { useGetLiveClassesQuery } from "@/redux/features/liveClass/liveClass.api";
import { useState } from "react";

export default function AllLiveClasses() {
  const {
    data,
    isLoading,
    error: LiveClassError,
  } = useGetLiveClassesQuery(undefined);
  const liveClasses = data?.data || [];
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <p>লোড হচ্ছে...</p>;
  if (LiveClassError?.data?.message === "Insufficient module permissions")
    return <PermissionError />;

  return (
    <div className="p-4 overflow-y-auto h-[calc(100vh-80px)] no-scrollbar">
      <div className="flex justify-between bg-white border shadow2 mb-4 rounded-[16px] p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-foreground">লাইভ ক্লাস</h2>
        </div>
        <div className="flex justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
            <Input
              placeholder="Search Live class..."
              className="w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <CreateLiveClassModal />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {liveClasses.map((cls) => (
          <LiveClassCard key={cls._id} cls={cls} />
        ))}
      </div>
    </div>
  );
}
