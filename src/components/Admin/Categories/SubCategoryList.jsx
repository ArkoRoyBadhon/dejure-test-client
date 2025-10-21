"use client";

import { useSubCategoryByCategoryIdQuery } from "@/redux/features/category/subcategory.api";
import SubCategoryDropdownMenu from "./SubCategoryDropdownMenu";
import Image from "next/image";

export default function SubCategoryList({
  categoryId,
  onDelete,
  onEdit,
  search = "",
  filterStatus = "ALL",
}) {
  const {
    data: subcategories,
    isLoading,
    isError,
  } = useSubCategoryByCategoryIdQuery(categoryId);

  if (isLoading)
    return <div className="text-center p-4">Loading subcategories...</div>;
  if (isError)
    return (
      <div className="text-center p-4 text-red-500">
        Error loading subcategories
      </div>
    );

  const filteredSubcategories = subcategories
    ?.filter((sub) => sub.name.toLowerCase().includes(search.toLowerCase()))
    ?.filter((sub) => {
      if (filterStatus === "ALL") return true;
      if (filterStatus === "ACTIVE") return sub.isActive;
      if (filterStatus === "INACTIVE") return !sub.isActive;
      return true;
    });

  return (
    <div className="space-y-2">
      {filteredSubcategories?.length > 0 ? (
        filteredSubcategories.map((subcategory) => (
          <div
            key={subcategory._id}
            className="p-3 rounded-lg border border-gray-200 flex justify-between items-center hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3">
              <div>
                {subcategory.thumbnail && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${subcategory.thumbnail}`}
                    alt={subcategory.name}
                    height={10}
                    width={10}
                    unoptimized
                    className="h-10 w-10 object-cover rounded"
                  />
                )}
              </div>
              <div>
                <p className="font-medium">{subcategory.name}</p>
                <p className="text-xs text-gray-500">
                  Listed Courses:{" "}
                  <span className="bg-yellow-100 text-yellow-900 border border-yellow-400 px-1 rounded-full ">
                    0{/* {isLoading ? "..." : categoryCourses?.length || 0} */}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <SubCategoryDropdownMenu
                subcategory={subcategory}
                onEdit={() => onEdit(subcategory._id)}
                onDelete={() => onDelete(subcategory._id)}
              />
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  subcategory.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {subcategory.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-4 text-gray-500">
          No subcategories found for this category
        </div>
      )}
    </div>
  );
}
