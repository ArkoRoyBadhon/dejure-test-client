"use client";

import { useState, useMemo } from "react";
import maxisData from "@/data/maxis.json";
import { Scale, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MaxisSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);

  const data = maxisData;
  const letters = Object.keys(data)
    .filter((key) => data[key].length > 0)
    .sort();

  const filteredEntries = useMemo(() => {
    if (selectedLetter && !searchTerm) {
      return data[selectedLetter] || [];
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const allEntries = Object.values(data).flat();
      return allEntries.filter(
        (entry) =>
          entry.word.toLowerCase().includes(term) ||
          entry.meaning.toLowerCase().includes(term)
      );
    }

    return [];
  }, [searchTerm, selectedLetter, data]);

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setSearchTerm("");
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setSelectedLetter(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Scale className="h-12 w-12 text-main mr-4" />
          <h1 className="text-4xl font-bold text-darkColor">আইনি ম্যাক্সিমস</h1>
        </div>
        <p className="text-lg text-deepGray max-w-2xl mx-auto">
          ক্লাসিক্যাল ল্যাটিন আইনি নীতি ও ম্যাক্সিমস যা আধুনিক আইনশাস্ত্রের
          ভিত্তি গঠন করে।
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-deepGray h-5 w-5" />
          <Input
            type="text"
            placeholder="ল্যাটিন ম্যাক্সিমস ও তাদের অর্থ খুঁজুন..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-12 text-lg border-gray-300 focus:border-main focus:ring-main"
          />
        </div>
      </div>

      {/* Alphabetical Index */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-center text-darkColor">
          বর্ণানুক্রমিক সূচী
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {letters.map((letter) => (
            <Button
              key={letter}
              variant={selectedLetter === letter ? "default" : "outline"}
              onClick={() => handleLetterClick(letter)}
              className={`w-12 h-12 text-lg font-semibold uppercase ${
                selectedLetter === letter
                  ? "bg-main text-white hover:bg-main/90"
                  : "border-gray-300 text-darkColor hover:bg-gray-50"
              }`}
            >
              {letter}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredEntries.length > 0 ? (
          <>
            <div className="text-center text-deepGray mb-6">
              {searchTerm ? (
                <p>
                  "{searchTerm}" এর জন্য {filteredEntries.length}টি ফলাফল পাওয়া
                  গেছে
                </p>
              ) : selectedLetter ? (
                <p>
                  "{selectedLetter.toUpperCase()}" দিয়ে শুরু হওয়া{" "}
                  {filteredEntries.length}টি ম্যাক্সিম
                </p>
              ) : null}
            </div>
            {filteredEntries.map((entry, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow border border-gray-200 bg-white"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-main font-bold font-serif italic">
                    {entry.word}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-darkColor leading-relaxed">
                    {entry.meaning}
                  </p>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <Scale className="h-16 w-16 text-deepGray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-darkColor mb-2">
              {searchTerm
                ? "কোন ফলাফল পাওয়া যায়নি"
                : "একটি বর্ণ নির্বাচন করুন বা ম্যাক্সিম খুঁজুন"}
            </h3>
            <p className="text-deepGray">
              {searchTerm
                ? "আপনার অনুসন্ধান শব্দ পরিবর্তন করুন বা উপরের বর্ণ দিয়ে ব্রাউজ করুন।"
                : "অনুসন্ধান বার ব্যবহার করুন বা ল্যাটিন আইনি ম্যাক্সিম দেখতে একটি বর্ণে ক্লিক করুন।"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
