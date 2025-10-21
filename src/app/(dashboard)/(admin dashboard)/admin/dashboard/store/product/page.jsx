"use client";

import ProductCard from "@/components/shared/ProductCard";
import Link from "next/link";
import { CreateProductDialog } from "./_components/CreateProductDialog";
import { useGetAllProductsQuery } from "@/redux/features/Products/Products.api";
import { useGetAllproductCategoriesQuery } from "@/redux/features/Products/ProductCategory.api";
import { ProductsFilters } from "./_components/ProductsFilters";
import { filterProducts } from "./_components/_utils/filters";
import { useState } from "react";

export default function ProductPage() {
  const { data: Products, isLoading } = useGetAllProductsQuery();
  const { data: categories } = useGetAllproductCategoriesQuery();
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "all",
  });

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      category: "all",
    });
  };

  const filteredProducts = filterProducts(Products || [], filters);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="rounded-xl shadow-md">
        <div className="px-6 py-4 bg-[#fff8e5] rounded-t-xl border hidden md:flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[#141B34] font-bold text-xl">
              MANAGE PRODUCT
            </span>
          </div>
          <div>
            <CreateProductDialog />
          </div>
        </div>

        <div className="px-2 py-2 bg-[#fff8e5] rounded-t-xl border flex flex-col justify-between items-center md:hidden gap-2">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="text-sm text-gray-500">
              <Link
                href="/admin/dashboard/store/dashboard"
                className="text-gray-400 hover:underline"
              >
                Store
              </Link>
              <span className="mx-1">›</span>
              <span className="text-gray-700 font-medium">Products</span>
            </div>
            <div>
              <CreateProductDialog />
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-[#141B34] font-bold text-lg">
              PRODUCTS MANAGEMENT MBL
            </span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-b-xl">
          {/* Add the filters component */}
          <ProductsFilters
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            categories={categories || []}
          />

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col h-full rounded-xl overflow-hidden relative animate-pulse border shadow-sm"
                >
                  <div className="absolute top-2 right-2 z-10">
                    <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="relative flex items-center justify-center pt-8">
                    <div className="h-[180px] w-[130px] bg-gray-300"></div>
                  </div>
                  <div className="flex flex-col flex-1 p-4">
                    <div className="flex-1">
                      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-center items-center gap-2 text-sm">
                        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {Products?.length > 0
                ? "No products match your filters."
                : "No products found."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
