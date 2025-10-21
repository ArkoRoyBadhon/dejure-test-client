"use client";
import Image from "next/image";
import {
  useGetAllAppDownloadsQuery,
  useGetAllAppDownloadsPublicQuery,
} from "@/redux/features/WebManage/appDownload.api";
import { useSelector } from "react-redux";
import { isTokenExpired } from "@/Utils/tokenUtils";
import Loader from "@/components/shared/Loader";

export default function DownloadApp() {
  const { token } = useSelector((state) => state.auth);

  // Smart data loading - try authenticated first, fallback to public
  const {
    data: appDownloads,
    isLoading: isLoadingAuth,
    error: errorAuth,
  } = useGetAllAppDownloadsQuery(undefined, {
    skip: !token || isTokenExpired(token), // Skip if no token or expired
  });

  const {
    data: appDownloadsPublic,
    isLoading: isLoadingPublic,
    error: errorPublic,
  } = useGetAllAppDownloadsPublicQuery(undefined, {
    skip: token && !isTokenExpired(token), // Skip if we have valid token
  });

  // Determine which data to use
  const isLoading = isLoadingAuth || isLoadingPublic;
  const error = errorAuth || errorPublic;
  const appDownloadsToUse = appDownloads || appDownloadsPublic;

  // Fallback data for when API fails or token is expired
  const fallbackAppData = {
    title: "ডাউনলোড করুন ডিজুরি App",
    subTitle:
      "লাইভ ক্লাসের বেস্ট এক্সপেরিয়েন্স পেতে, এখনই ডাউনলোড করুন ডিজুরি অ্যাপ",
    image: "/assets/image/mobile.png",
  };

  if (isLoading) {
    return (
      <div className="py-16 md:pb-28 md:pt-20 p-4 md:px-0 text-center">
        <Loader />
      </div>
    );
  }

  // Use fallback data if there's an error or token is expired
  let appData = fallbackAppData;

  if (appDownloadsToUse && appDownloadsToUse.length > 0) {
    appData = appDownloadsToUse[0];
    console.log("Using API data for app download section:", appData.title);
  } else {
    console.log("Using fallback data for app download section");
  }

  return (
    <div className="py-16 md:pb-28 md:pt-20 p-4 md:px-0 lg:px-4 xl:px-0">
      <div className="max-w-[1200px] mx-auto relative bg-[#FFB800] rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/image/home-hero-bg.png')] bg-cover bg-center z-[0] opacity-[.04]" />

        <div className="flex flex-col md:flex-row items-center relative z-[1] pt-12 md:pt-0">
          {/* Left Part */}
          <div className="flex flex-col space-y-6 flex-[2] pl-0 md:pl-16 text-center md:text-start">
            <h1 className="font-bold text-3xl text-white px-2 md:px-0">
              {appData.title}
            </h1>

            {/* Subtitle */}
            <h2 className="text-md text-white hidden md:block">
              {appData?.subTitle ||
                "লাইভ ক্লাসের বেস্ট এক্সপেরিয়েন্স পেতে, এখনই ডাউনলোড করুন ডিজুরি অ্যাপ"}
            </h2>
            <h2 className="text-md block md:hidden px-2">
              {appData?.subTitle}
            </h2>

            {/* Store Links */}
            <div className="flex gap-2 justify-center md:justify-start p-2 md:p-0">
              {appData?.playStoreLink && (
                <a
                  href={appData.playStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/g2.svg" alt="Google Play Store" />
                </a>
              )}
              {appData?.appStoreLink && (
                <a
                  href={appData.appStoreLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/g1.svg" alt="Apple App Store" />
                </a>
              )}
            </div>
          </div>

          {/* Right Part */}
          <div className="flex justify-end items-center w-[493px] h-[350px] md:h-fit">
            <Image
              src={
                appData?.image
                  ? `${process.env.NEXT_PUBLIC_API_URL}/${appData.image}`
                  : "/mobile.png"
              }
              alt="App Preview"
              height={350}
              width={268}
              className="w-[493px] h-[350px] md:h-[457px] md:-mt-14 mt-8 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
