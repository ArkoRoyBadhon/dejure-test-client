"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useGetAllproductCategoriesQuery } from "@/redux/features/Products/ProductCategory.api";
import { useGetAllProductsQuery } from "@/redux/features/Products/Products.api";

import DownloadApp from "../_components/AppDownload";
import ShopHero from "./_components/shopHero";
// import ProductCategory from "./_components/ProductCategory";
import CategoryProducts from "./_components/CategoryProducts";
import BestSellingProduct from "./_components/bestSellingProduct";
import ProductCategory from "./_components/productCategory";

export default function ShopPage() {
  const { data: categories = [] } = useGetAllproductCategoriesQuery();
  const { data: allProducts = [] } = useGetAllProductsQuery();

  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const sectionRefs = useRef({});

  // Group products by category

  const productsByCategory = useMemo(() => {
    const grouped = {};
    allProducts
      .filter((product) => product.isFree === false) // Filter out free products
      .forEach((product) => {
        const catId = product.category?._id;
        if (catId) {
          if (!grouped[catId]) grouped[catId] = [];
          grouped[catId].push(product);
        }
      });
    return grouped;
  }, [allProducts]);

  // Scroll when category changes
  useEffect(() => {
    if (activeCategoryId && sectionRefs.current[activeCategoryId]) {
      sectionRefs.current[activeCategoryId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeCategoryId]);

  return (
    <div className="min-h-screen">
      <ShopHero />
      <ProductCategory
        activeCategoryId={activeCategoryId}
        setActiveCategoryId={setActiveCategoryId}
      />
      <BestSellingProduct />

      {categories.map((category, index) => (
        <CategoryProducts
          key={category._id}
          category={category}
          products={productsByCategory[category._id] || []}
          sectionRef={(el) => (sectionRefs.current[category._id] = el)}
          index={index} // pass index
        />
      ))}

      <DownloadApp />
    </div>
  );
}
