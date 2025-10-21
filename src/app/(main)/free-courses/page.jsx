"use client";

import { useGetAllProductsQuery } from "@/redux/features/Products/Products.api";
import DownloadApp from "../_components/AppDownload";
import ContactAndResources from "../_components/ContactAndResources";
import CommonPageHero from "../_components/home/CommonPageHero";
import FreeStudyMaterials from "./_components/FreeStudyMaterials";
import BookCardContainer from "@/components/shared/BookCardContainer";
import { useGetAllFreeResourceHerosQuery } from "@/redux/features/WebManage/FreeHero.api";

const FreeCourses = () => {
  // Fetch all products
  const { data: allProducts = [], isLoading } = useGetAllProductsQuery();
  const { data: freeResourceHeroData, isError } =
    useGetAllFreeResourceHerosQuery();

  const mainData = freeResourceHeroData?.[0];

  // Filter free products
  const freeProducts = allProducts.filter((product) => product.isFree === true);

  return (
    <div>
      <CommonPageHero
        badgeText={mainData?.miniTitle || "ফ্রি রিসোর্সেস"}
        title={mainData?.title || "সবার জন্য উন্মুক্ত প্রস্তুতির সহায়তা"}
        description={
          mainData?.subTitle ||
          "শেখা শুরু করুন একদম বিনামূল্যে, পরীক্ষা জয়ের পথে আপনার প্রথম ধাপ হতে পারে এখান থেকেই।"
        }
        imageSrc={mainData?.image || "/assets/image/education_concept.png"}
      />
      <FreeStudyMaterials />

      <BookCardContainer
        iconSrc={"/assets/icons/book-open.png"}
        title={"ফ্রি বুকস"}
        products={freeProducts}
      />

      <ContactAndResources />
      <DownloadApp />
    </div>
  );
};

export default FreeCourses;
