"use client";
import Image from "next/image";
import { useGetAllContactsQuery } from "@/redux/features/WebManage/Contact.api";
import { useGetAllSocialsQuery } from "@/redux/features/WebManage/Social.api";
import { Phone } from "lucide-react";

import Loader from "@/components/shared/Loader";
export default function ContactAndResources() {
  const { data: contacts, isLoading, error } = useGetAllContactsQuery();
  const { data: socials, Loading, isError, refetch } = useGetAllSocialsQuery();
  const socialData =
    socials && socials.length > 0
      ? socials[0]
      : {
          ytTitle: "ফ্রি ভিডিও লাইব্রেরি",
          ytBtnTitle: "ভিডিও দেখো",
          ytBtnLink: "",
          ytImage: null,
          fbTitle: "ফেসবুক গ্রুপ",
          fbBtnTitle: "গ্রুপে যুক্ত হও",
          fbBtnLink: "",
          fbImage: null,
        };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-8 text-center">Failed to load contact data</div>;
  }

  const contactData =
    contacts && contacts.length > 0
      ? contacts[0]
      : {
          title: "আমাদের পরামর্শদাতার সাথে কথা বলুন",
          subTitle: "যে কোনো প্রয়োজনে কল করো এখনই",
          time: "সকাল ৯টা - রাত ১০ টা",
          number: "996477",
          rate: "* যেকোনো নাম্বার থেকে সাধারণ কল রেট *",
          image: "/image_woman.svg",
        };

  return (
    <div className="flex justify-center items-center py-16 px-4 md:px-0 mt-4 lg:px-4 xl:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1200px] w-full">
        {/* Left Section: Talk to our Advisor */}
        <div className="bg-[#F2F7FC] rounded-xl shadow-lg  pt-8 flex flex-col justify-between relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04] z-0 pointer-events-none" />

          {/* div1 */}
          <div className="relative pl-6  z-10">
            <h2 className="text-[26px] Z font-semibold text-gray-800 mb-2">
              {contactData.title}
            </h2>
            <p className="text-sm sm:text-base font-bold text-[#74767C] mb-1">
              {contactData.subTitle}
            </p>
            <p className="text-[12px] font-bold text-[#141B34] mb-1">
              {contactData.time}
            </p>
          </div>

          {/* div2 */}
          <div className="flex items-end justify-between relative z-10">
            <div className="mb-6 relative pl-6 ">
              <button className="flex items-center px-4 md:px-8 py-2 rounded-xl text-white bg-[#0020B2] font-bold gap-1 hover:bg-blue-500 transition-colors">
                <Phone className="w-5 h-5 text-white" />
                {contactData.number}
              </button>
              <p className="text-xs mt-4 w-[90%] md:w-full">
                {contactData.rate}
              </p>
            </div>

            <div className="relative w-36 h-48">
              <Image
                src={
                  contactData.image?.startsWith("http") ||
                  contactData.image?.startsWith("/")
                    ? contactData.image
                    : `${process.env.NEXT_PUBLIC_API_URL}/${contactData.image}`
                }
                alt="Advisor"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Right Section stays static */}
        <div className="flex flex-col gap-6 h-full">
          {/* Free Video Library */}
          <div className="rounded-xl shadow-lg flex items-center justify-between overflow-hidden relative h-1/2 bg-[#F2F7FC] border">
            <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04] z-0 pointer-events-none" />
            <div className="flex-grow relative gap-4 pl-6 w-full">
              <h2 className="text-xl Z font-semibold text-gray-800 mb-4 whitespace-nowrap">
                {socialData.ytTitle}
              </h2>
              <a
                href={socialData.ytBtnLink}
                className="flex items-center bg-[#FF0000] text-white font-bold py-3 px-1 md:px-6 rounded-xl shadow-md hover:bg-red-700 gap-1 transition-colors w-[164px] text-sm justify-center"
              >
                <img src="/computer-video.svg" alt="" />
                {socialData.ytBtnTitle}
              </a>
            </div>
            <div className="relative">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${socialData.ytImage}`}
                alt="Video Library Thumbnail"
              />
            </div>
          </div>
          {/* Facebook Group */}
          <div className="rounded-xl shadow-lg flex items-center h-1/2 bg-[#F2F7FC] p-6 overflow-hidden relative border gap-4">
            <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center opacity-[.04] z-0 pointer-events-none" />
            <div className="flex-grow relative gap-2 md:gap-0">
              <h3 className="text-lg Z sm:text-xl font-semibold text-gray-800 mb-4">
                {socialData.fbTitle}
              </h3>
              <a
                href={socialData.fbBtnLink}
                className="flex items-center bg-gradient-to-b from-[#26B7FF] to-[#0064E1] text-white font-bold px-1 py-3 md:px-6 rounded-xl shadow-md hover:opacity-90 gap-1 transition-opacity text-sm justify-center w-[164px]"
              >
                <img src="/user-group.svg" alt="" />
                {socialData.fbBtnTitle}
              </a>
            </div>
            <div className="relative">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${socialData.fbImage}`}
                alt="fb logo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
