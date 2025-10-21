"use client";

import { useGetAllproductCategoriesQuery } from "@/redux/features/Products/ProductCategory.api";
import ProductCategoryCard from "@/components/shared/ProductCategoryCard";
import { CreateCategoryDialog } from "./_components/CreateCategoryDialog";

import Loader from "@/components/shared/Loader";
export default function ProductCategoryPage() {
  const { data: Categories, isLoading } = useGetAllproductCategoriesQuery();

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="rounded-xl shadow-md">
        {/* Page Header */}
        <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#141B34] font-bold text-xl">
              MANAGE CATEGORY
            </span>
          </div>

          <div>
            <CreateCategoryDialog />
          </div>
        </div>

        {/* Categories List */}
        <div className="p-4">
          {isLoading ? (
            <Loader />
          ) : Categories?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Categories.map((category) => (
                <ProductCategoryCard key={category._id} category={category} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
