"use client";
import { useGetAllMixHerosQuery } from "@/redux/features/WebManage/MixHero.api";
import { useGetAllPhotoGalleriesQuery } from "@/redux/features/WebManage/PhotoGallery.api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Gallery() {
  const { data: galleryData } = useGetAllPhotoGalleriesQuery();
  const { data: headerData } = useGetAllMixHerosQuery();
  // ✅ Header state
  const [header, setHeader] = useState({
    miniTitle3: "",
    Title3: "",
  });

  const [formData, setFormData] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
    image6: "",
    image7: "",
    image8: "",
    image9: "",
    image10: "",
  });

  // Set form data when API data is available
  useEffect(() => {
    if (galleryData && galleryData.length > 0) {
      const data = galleryData[0]; // Take first gallery data
      setFormData({
        image1: data.image1 || "",
        image2: data.image2 || "",
        image3: data.image3 || "",
        image4: data.image4 || "",
        image5: data.image5 || "",
        image6: data.image6 || "",
        image7: data.image7 || "",
        image8: data.image8 || "",
        image9: data.image9 || "",
        image10: data.image10 || "",
      });
    }
  }, [galleryData]);
  // Fill header data dynamically
  useEffect(() => {
    if (headerData && headerData.length > 0) {
      const hero = headerData[0];
      setHeader({
        miniTitle3: hero.miniTitle3 || "",
        Title3: hero.Title3 || "",
      });
    }
  }, [headerData]);

  return (
    <div className="relative bg-[#FFB80033] rounded-[60px] max-w-[100vw] w-full overflow-x-hidden mx-auto px-0">
      {/* hero bg */}
      <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

      {/* Section-1 (For PC Only) */}

      <header className="text-center mt-24 px-4 hidden md:block space-y-6">
        <h1 className="text-[40px] font-bold text-[#141B34]  line-clamp-2 Z">
          {header.Title3}
        </h1>
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#74767C]">
          {header.miniTitle3}
        </h3>
      </header>

      {/* Section-1 for MBL (Mobile Only) */}
      <div className="text-center mt-24 px-4 block md:hidden">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 Z line-clamp-2">
          {header.Title3}
        </h1>
        <p className="text-xl text-[#141B34]">{header.miniTitle3}</p>
      </div>
      {/* Section-2: PC only */}
      <div className="hidden md:block -mt-12">
        <div className="flex justify-center items-center gap-8 px-4">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image1}`}
            className="w-[420px] h-[300px] rounded-2xl object-cover mb-48 rotate-[8deg]"
          />
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image2}`}
            className="w-[420px] h-[300px] rounded-2xl object-cover mb-16 rotate-[8deg]"
          />
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image3}`}
            className="w-[420px] h-[300px] rounded-2xl object-cover"
          />
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image4}`}
            className="w-[420px] h-[300px] rounded-2xl object-cover mb-16 -rotate-[8deg]"
          />
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image5}`}
            className="w-[420px] h-[300px] rounded-2xl object-cover mb-48 -rotate-[8deg]"
          />
        </div>

        <div className="flex justify-center items-center gap-8 px-4 mb-12 -mt-32">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image6}`}
            className="w-[420px] h-[300px] rounded-2xl object-cover mb-48 rotate-[8deg]"
          />
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image7}`}
            className="w-[420px] h-[300px] rounded-2xl object-cover mb-16 rotate-[8deg]"
          />

          <div className="relative min-w-[420px] min-h-[300px]">
            {formData.image8 ? (
              <div className="relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image8}`}
                  className="w-[420px] h-[300px] rounded-2xl object-cover"
                />
                <div className="absolute bottom-2 inset-x-4 text-center">
                  <Link href="/contact-support" className="block">
                    <button className="w-full px-6 py-3 bg-blue hover:bg-blue-500 text-white font-semibold rounded-lg shadow-lg border">
                      De JURE সম্পর্কে আরো জানুন
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-[420px] h-[300px] rounded-2xl bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image9}`}
            className="w-[420px] h-[300px] rounded-2xl object-cover mb-16 -rotate-[8deg]"
          />
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image10}`}
            className="w-[420px] h-[300px] rounded-2xl object-cover mb-48 -rotate-[8deg]"
          />
        </div>
      </div>

      {/* Section-2: Mobile only */}
      <div className="block md:hidden pb-12">
        <div className="flex justify-center items-center gap-4 px-4 mt-12">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image2}`}
            className="w-[150px] h-[120px] rounded-lg object-cover mb-8 rotate-[8deg]"
          />
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image3}`}
            className="w-[150px] h-[120px] rounded-lg object-cover"
          />
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image4}`}
            className="w-[150px] h-[120px] rounded-lg object-cover mb-8 -rotate-[8deg]"
          />
        </div>
        <div className="flex justify-center items-center gap-4 px-4">
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image7}`}
            className="w-[150px] h-[120px] rounded-lg object-cover mb-8 rotate-[8deg]"
          />
          <div className="relative min-w-[150px] min-h-[120px]">
            {formData.image8 ? (
              <div className="relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image8}`}
                  className="w-[150px] h-[120px] rounded-2xl object-cover"
                />
                <div className="absolute bottom-0 inset-x-2 text-center">
                  <Link href="/contact-support" className="block">
                    <button className="w-full  py-1 bg-blue hover:bg-blue-500 text-white font-md text-[8px] line-clamp-1 rounded-sm shadow-lg border">
                      De JURE সম্পর্কে আরো জানুন
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-[420px] h-[300px] rounded-2xl bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}/${formData.image9}`}
            className="w-[150px] h-[120px] rounded-lg object-cover mb-8 -rotate-[8deg]"
          />
        </div>
      </div>
    </div>
  );
}
