"use client";
import React, { useState } from "react";
import CommonPageHero from "../_components/home/CommonPageHero";
import ContactAndResources from "../_components/ContactAndResources";
import DownloadApp from "../_components/AppDownload";
import { FileText, Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CaseStudies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);

  // Sample case studies data - you can replace this with real data from your API
  const caseStudiesData = [
    {
      id: 1,
      title: "বাংলাদেশের সংবিধান সংশোধনী মামলা",
      category: "constitutional",
      description:
        "সংবিধানের ৭০ অনুচ্ছেদ সংশোধন সংক্রান্ত গুরুত্বপূর্ণ মামলার বিশ্লেষণ",
      content:
        "এই মামলায় বাংলাদেশের সংবিধানের ৭০ অনুচ্ছেদ সংশোধনের বৈধতা নিয়ে প্রশ্ন উঠেছিল। আদালতের রায়ে সংবিধানের মৌলিক কাঠামো রক্ষার গুরুত্ব তুলে ধরা হয়েছে।",
      date: "২০২৪",
      tags: ["সংবিধান", "মৌলিক অধিকার", "সাংবিধানিক আইন"],
    },
    {
      id: 2,
      title: "শ্রম আইন ও কর্মচারী অধিকার",
      category: "labor",
      description: "শ্রমিকদের মজুরি ও কর্মক্ষেত্রের নিরাপত্তা সংক্রান্ত মামলা",
      content:
        "এই মামলায় একজন শ্রমিকের মজুরি বকেয়া ও কর্মক্ষেত্রে নিরাপত্তার অধিকার নিয়ে আলোচনা করা হয়েছে। আদালত শ্রমিকদের অধিকার রক্ষার জন্য গুরুত্বপূর্ণ নির্দেশনা দিয়েছে।",
      date: "২০২৪",
      tags: ["শ্রম আইন", "কর্মচারী অধিকার", "মজুরি"],
    },
    {
      id: 3,
      title: "ভোক্তা অধিকার সংরক্ষণ",
      category: "consumer",
      description:
        "ভোক্তা অধিকার সংরক্ষণ আইন প্রয়োগের একটি গুরুত্বপূর্ণ মামলা",
      content:
        "একজন ভোক্তার পণ্যের ত্রুটির কারণে ক্ষতির ক্ষতিপূরণের মামলা। আদালত ভোক্তা অধিকার সংরক্ষণ আইনের প্রয়োগে গুরুত্বপূর্ণ সিদ্ধান্ত দিয়েছে।",
      date: "২০২৩",
      tags: ["ভোক্তা অধিকার", "ক্ষতিপূরণ", "পণ্যের ত্রুটি"],
    },
    {
      id: 4,
      title: "নারী ও শিশু নির্যাতন দমন আইন",
      category: "criminal",
      description: "নারী ও শিশু নির্যাতন দমন আইনের প্রয়োগ সংক্রান্ত মামলা",
      content:
        "নারী ও শিশু নির্যাতনের একটি গুরুত্বপূর্ণ মামলার বিশ্লেষণ। আদালতের রায়ে নারী ও শিশুদের সুরক্ষার গুরুত্ব তুলে ধরা হয়েছে।",
      date: "২০২৩",
      tags: ["নারী অধিকার", "শিশু সুরক্ষা", "নির্যাতন দমন"],
    },
  ];

  const categories = [
    { value: "all", label: "সব ক্যাটাগরি" },
    { value: "constitutional", label: "সাংবিধানিক আইন" },
    { value: "labor", label: "শ্রম আইন" },
    { value: "consumer", label: "ভোক্তা অধিকার" },
    { value: "criminal", label: "ফৌজদারি আইন" },
  ];

  const filteredCaseStudies = caseStudiesData.filter((study) => {
    const matchesSearch =
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || study.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Hero Section */}
      <CommonPageHero
        badgeText="কেস স্টাডি"
        title="আইনি কেস স্টাডি"
        description="বাস্তব জীবনের আইনি সমস্যা ও সমাধান সম্পর্কে বিস্তারিত আলোচনা এবং বিশ্লেষণ"
        imageSrc="uploads/custom-heroimg.png"
      />

      {/* Search and Filter Section */}
      <div className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deepGray h-5 w-5" />
              <Input
                type="text"
                placeholder="কেস স্টাডি খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-main focus:ring-main"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-deepGray" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:border-main focus:ring-main bg-white"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="bg-gray2 min-h-[40vh] py-8">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-deepGray">
              {filteredCaseStudies.length}টি কেস স্টাডি পাওয়া গেছে
            </p>
          </div>

          {/* Case Studies Grid */}

          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-deepGray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-darkColor mb-2">
              কোন কেস স্টাডি পাওয়া যায়নি
            </h3>
            <p className="text-deepGray">
              অনুসন্ধান শব্দ পরিবর্তন করুন বা ভিন্ন ক্যাটাগরি নির্বাচন করুন।
            </p>
          </div>
        </div>
      </main>

      {/* Footer Components */}
      <ContactAndResources />
      <DownloadApp />

      {/* Case Study Detail Modal */}
      {selectedCaseStudy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm bg-opacity-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCaseStudy(null);
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-darkColor">
                {selectedCaseStudy.title}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCaseStudy(null)}
                className="text-deepGray hover:text-darkColor"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-main text-white text-sm rounded-full">
                    {
                      categories.find(
                        (cat) => cat.value === selectedCaseStudy.category
                      )?.label
                    }
                  </span>
                  <span className="text-deepGray text-sm">
                    {selectedCaseStudy.date}
                  </span>
                </div>

                <p className="text-lg text-darkColor mb-6 leading-relaxed">
                  {selectedCaseStudy.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-darkColor mb-3">
                  বিস্তারিত বিশ্লেষণ
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-darkColor leading-relaxed">
                    {selectedCaseStudy.content}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-darkColor mb-3">
                  সম্পর্কিত ট্যাগ
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCaseStudy.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-deepGray text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setSelectedCaseStudy(null)}
                  className="bg-main hover:bg-main/90 text-white"
                >
                  বন্ধ করুন
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudies;
