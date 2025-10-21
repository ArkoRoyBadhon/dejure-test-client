"use client";

import { Eye, Download } from "lucide-react";
import Image from "next/image";
import { useGetAllFreeResourcesQuery } from "@/redux/features/free-resources/free-resources.api";

import Loader from "@/components/shared/Loader";
export default function FreeStudyMaterials() {
  // Fetch free resources dynamically
  const { data: resources, isLoading, isError } = useGetAllFreeResourcesQuery();

  const getFileUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL}/${path}`;
  };

  return (
    <section className=" bg-main/20 py-24 rounded-[50px] relative">
      {/* Background opacity image */}
      <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-5" />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-4 md:px-0 ">
        {/* Header */}
        <div className="flex items-center justify-start gap-4 mb-8">
          <Image
            alt=""
            src={"/assets/image/library.png"}
            width={40}
            height={40}
          />
          <h2 className="text-darkColor font-bold md:text-3xl Z text-2xl">
            ফ্রি স্টাডি মেটেরিয়ালস
          </h2>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead className="mb-2 block">
            <tr className="grid grid-cols-3 gap-2">
              <th className="col-span-2 bg-gray2 text-darkColor rounded-2xl shadow text-sm font-bold border p-2.5 text-left">
                শিরোনাম
              </th>
              <th className="col-span-1 bg-gray2 text-darkColor rounded-2xl shadow text-sm font-bold border p-2.5 text-center">
                একশন
              </th>
            </tr>
          </thead>

          <tbody className="space-y-2 text-darkColor">
            {isLoading ? (
              <tr className="grid grid-cols-3 gap-2">
                <td className="col-span-3 text-center py-10"><Loader /></td>
              </tr>
            ) : isError ? (
              <tr className="grid grid-cols-3 gap-2">
                <td className="col-span-3 text-center py-10">
                  Failed to load resources
                </td>
              </tr>
            ) : !resources || resources.length === 0 ? (
              <tr className="grid grid-cols-3 gap-2">
                <td className="col-span-3 text-center py-10">
                  No resources found
                </td>
              </tr>
            ) : (
              resources.map((res) => (
                <tr key={res._id} className="grid grid-cols-3 gap-2">
                  {/* Title */}
                  <td className="col-span-2 bg-white text-[18px] rounded-2xl shadow text-sm border p-2.5 text-left">
                    {res.title}
                  </td>

                  {/* Actions */}
                  <td className="col-span-1 flex items-center gap-2">
                    {/* View Button */}
                    <a
                      href={getFileUrl(res.file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 group flex items-center justify-center gap-2.5 text-sm font-medium px-4 py-3 rounded-2xl bg-white hover:bg-main duration-300"
                    >
                      <Eye size={16} className="text-black" />
                      <span className="hidden sm:block">ভিউ করুন</span>
                    </a>

                    {/* Download Button */}
                    <a
                      href={getFileUrl(res.file)}
                      download
                      className="flex-1 group flex items-center justify-center gap-2.5 text-sm font-medium px-4 py-3 rounded-2xl bg-white text-black hover:bg-main  duration-300"
                    >
                      <Download size={16} className="text-black  " />
                      <span className="hidden sm:block">ডাউনলোড</span>
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
