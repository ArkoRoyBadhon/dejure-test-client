"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDeleteCategoryMutation } from "@/redux/features/category/category.api";
import { useState } from "react";

export default function AdminCategoryCard({ category, onManage }) {
  const [deleteCategory] = useDeleteCategoryMutation();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete "${category.title}"?`
    );
    if (confirmed) {
      try {
        await deleteCategory(category._id).unwrap();
        alert("Category deleted successfully.");
      } catch (err) {
        alert("Failed to delete category.");
        console.error(err);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border flex flex-col items-center text-center ">
      <div className="w-full bg-gray-100 rounded-md overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${category.thumbnail}`}
          alt={category.title}
          width={400}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold">{category.title}</h2>
      <p
        className={`text-sm font-medium mb-3 ${
          category.isActive ? "text-green-600" : "text-red-600"
        }`}
      >
        {category.isActive ? "Active" : "Inactive"}
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-main cursor-pointer"
          onClick={onManage}
        >
          Manage
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className=" cursor-pointer"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
