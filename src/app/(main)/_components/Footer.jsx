"use client";
import { Mail, Phone, MapPin } from "lucide-react";
import { useGetAllFootersQuery } from "@/redux/features/WebManage/Footer.api";
import Image from "next/image";

export function Footer() {
  const { data, isLoading } = useGetAllFootersQuery();
  const footer = data?.[0];

  return (
    <div>
      {/* main Part */}
      <div className="w-full bg-[#F2F7FC]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6  pt-12 sm:pt-16 lg:pt-20 lg:px-4 xl:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info & App Download */}
            <div className="space-y-4 sm:space-y-3">
              <div className="flex items-center justify-center sm:justify-start">
                <Image
                  src={
                    footer?.logo
                      ? `${process.env.NEXT_PUBLIC_API_URL}/${footer?.logo}`
                      : "/logo.svg"
                  }
                  alt="logo"
                  height={80}
                  width={114}
                  unoptimized
                  className="w-[90px] h-[70px] sm:w-[114px] sm:h-[96px]"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                {footer?.logoTitle || "আইনের পথে নিশ্চিত প্রস্তুতি"}
              </p>

              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-bold text-gray-700 mb-3">
                  {footer?.downloadTitle || "অ্যাপ্লিকেশন ডাউনলোড করুন App"}
                </p>
                <div className="flex justify-center sm:justify-start space-x-3">
                  <a
                    href={footer?.playstoreLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img
                      src="/playstore.svg"
                      alt="Play Store"
                      className="w-8 h-8 sm:w-auto sm:h-auto"
                    />
                  </a>
                  <a
                    href={footer?.appstoreLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img
                      src="/apple.svg"
                      alt="App Store"
                      className="w-8 h-8 sm:w-auto sm:h-auto"
                    />
                  </a>
                </div>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-base text-[#141B34] mb-3">
                  {footer?.socialTitle || "কমিউনিটি -এর সাথে কানেক্টেড থাকতে"}
                </p>
                <div className="flex justify-center sm:justify-start space-x-4">
                  <a
                    href={footer?.fbLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img src="/fb.svg" alt="Facebook" className="w-6 h-6" />
                  </a>
                  <a
                    href={footer?.instaLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img
                      src="/instra.svg"
                      alt="Instagram"
                      className="w-6 h-6"
                    />
                  </a>
                  <a
                    href={footer?.linkedinLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img
                      src="/linkedin.svg"
                      alt="LinkedIn"
                      className="w-6 h-6"
                    />
                  </a>
                  <a
                    href={footer?.ytLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <img src="/yt2.svg" alt="YouTube" className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-6 sm:mb-8 text-gray-800">
                {footer?.quickLink?.title || "কুইক লিংক"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href={footer?.quickLink?.blogLink || "#"}
                    className="text-gray-600 hover:text-blue-600 text-sm sm:text-base transition-colors block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer?.quickLink?.blogTitle || "ব্লগ"}
                  </a>
                </li>
                <li>
                  <a
                    href={footer?.quickLink?.privacyLink || "#"}
                    className="text-gray-600 hover:text-blue-600 text-sm sm:text-base transition-colors block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer?.quickLink?.privacyTitle || "প্রাইভেসি পলিসি"}
                  </a>
                </li>
                <li>
                  <a
                    href={footer?.quickLink?.termsLink || "#"}
                    className="text-gray-600 hover:text-blue-600 text-sm sm:text-base transition-colors block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer?.quickLink?.termsTitle || "টার্মস অ্যান্ড কন্ডিশন"}
                  </a>
                </li>
                <li>
                  <a
                    href={footer?.quickLink?.refundLink || "#"}
                    className="text-gray-600 hover:text-blue-600 text-sm sm:text-base transition-colors block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer?.quickLink?.refundTitle || "রিফান্ড পলিসি"}
                  </a>
                </li>
                <li>
                  <a
                    href={footer?.quickLink?.contactSupportLink || "#"}
                    className="text-gray-600 hover:text-blue-600 text-sm sm:text-base transition-colors block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {footer?.quickLink?.contactSupportTitle ||
                      "কন্টাক্ট সাপোর্ট"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-6 sm:mb-8 text-gray-800">
                {footer?.contactsInfo?.title || "যোগাযোগ"}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start justify-center sm:justify-start">
                  <Mail className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600 break-all">
                    {footer?.contactsInfo?.email || "support@dejure.academy"}
                  </span>
                </div>
                <div className="flex items-start justify-center sm:justify-start">
                  <MapPin className="h-4 w-4  mt-0.5 flex-shrink-0 hiden md:block" />
                  <span className="text-sm sm:text-base text-gray-600 -ml-[12px]">
                    {footer?.contactsInfo?.address ||
                      "Chatteshwari Suvastu Tower, 69/1 Panthapath, Dhaka 1215, Dhaka, Bangladesh"}
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">
                    {footer?.contactsInfo?.phone || "+09611-500530"}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="text-center sm:text-left lg:text-right">
              <h3 className="text-base sm:text-lg font-semibold mb-6 sm:mb-8 text-gray-800">
                {footer?.companyInfo?.title || "কোম্পানির তথ্য"}
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-xs sm:text-sm text-gray-500 block mb-1">
                    {footer?.companyInfo?.tradeLicenseTitle ||
                      "Trade licence No."}
                  </span>
                  <p className="text-sm sm:text-base font-medium text-gray-700 break-all">
                    {footer?.companyInfo?.tradeLicense ||
                      "TRAD/DSCC/037234/2022"}
                  </p>
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-gray-500 block mb-1">
                    {footer?.companyInfo?.etinTitle || "E-TIN Number:"}
                  </span>
                  <p className="text-sm sm:text-base font-medium text-gray-700 break-all">
                    {footer?.companyInfo?.etinNumber || "127583866350"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods & Partners */}
          <div className="py-6 sm:py-8 lg:py-[30px]">
            <div className="flex justify-center">
              <img
                src="/pay.svg"
                alt="Payment Methods"
                className="w-full max-w-md sm:max-w-lg lg:max-w-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Below Footer Part */}
      <div className="w-full bg-gradient-to-r from-[#fff2d0] to-white lg:px-4 xl:px-0">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <p className="text-center sm:text-left text-sm sm:text-base text-gray-700">
              {footer?.copyRight?.title ||
                "© 2024 Copyrights by DeJure. All Rights Reserved"}
            </p>
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4 text-sm sm:text-base">
              <a
                href={footer?.copyRight?.title1Link || "#"}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {footer?.copyRight?.title1 || "FAQs"}
              </a>
              <span className="text-gray-400">|</span>
              <a
                href={footer?.copyRight?.title2Link || "#"}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {footer?.copyRight?.title2 || "Courses"}
              </a>
              <span className="text-gray-400">|</span>
              <a
                href={footer?.copyRight?.title3Link || "#"}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {footer?.copyRight?.title3 || "Contact"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
