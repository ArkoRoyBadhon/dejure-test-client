import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AnswerUploadComponent from "./_components/AnswerUpload";
import Image from "next/image";

export default function QuitionsetPageBackup() {
  return (
    <div className="p-4">
      <Card className="mb-6 p-0">
        <CardHeader className="bg-gray2 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/icons/DJA logo Transperant-01 2.png"
                alt="gg"
                width={63}
                height={40}
              />
            </div>
            <Button className="bg-green/20 border border-green text-darkColor rounded-[16px] px-4 py-1 text-sm font-bold">
              LIVE NOW
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Title Section */}
          <div className="text-center mb-4">
            <h2 className="text-[20px] font-bold text-darkColor leading-[150%] mb-2">
              ডি জুির একােডিম
            </h2>
            <h1 className="text-[40px] leading-[150%] font-bold mb-2">
              Bar Model Test 1
            </h1>
            <div className="flex justify-center gap-8 font-bold text-sm text-darkColor">
              <span>পূর্ণমান-১০০</span>
              <span>সময়: ২ ঘন্টা</span>
            </div>
          </div>
          <div className="">
            <p className="text-center text-[16px] text-[#74767C] font-bold">
              ('ক' অংশ থেকে ২ এবং 'খ', 'গ', 'ঘ', 'ও', 'চ' অংশের ত্যেক থেকে ১ করে
              মোট ৭ শ্নের উর দিতে হবে )
            </p>
          </div>

          {/* Instructions */}
          <div className="flex justify-center gap-4 mt-4 text-[16px] mb-4">
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">মডিউল</span>{" "}
                <span className="font-bold ml-2"> অপরাধ সংক্রন্ত আইন</span>
              </p>
            </div>
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">সাবজেক্ট</span>{" "}
                <span className="font-bold ml-2"> পেনাল কোড</span>
              </p>
            </div>
            <div className="flex">
              <p className="">
                <span className="text-[#74767C]">টাইপ</span>{" "}
                <span className="font-bold ml-2"> WRITTEN</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Questions Section */}
      <Card className=" bg-white overflow-hidden p-0 rounded-[16px]">
        <CardHeader className="text-center bg-gray2 p-4">
          <h1 className="text-[20px] font-bold text-darkColor">
            ক অংশ: যে-কোনো ৫ টির উত্তর দিন
          </h1>
        </CardHeader>

        {/* Questions Section - Single Card */}
        <CardContent className="p-6 space-y-4">
          {/* Question 1 */}
          <div className="space-y-4">
            {/* Question 1(a) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  ১.
                </span>
              </div>
              <div className="flex-1">
                <div className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                    ক)
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      আদালতি-জবানি খাত, সাজাগৃহ ও তদন্ত সংক্রান্ত প্রশাসনিক
                      বিষয়ান উচ্চতর পর্যায়ের আদর্শ লেখনা কর
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs ">
                      1X8=8
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 1(b) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8"></div>
              <div className="flex-1">
                <div className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                    খ)
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      ধন এক মামলায় বাদী আপনার মক্কেল। তিনি আপনাকে পরামর্শের
                      জন্য, প্রাক্কলনপূর্ব নালিশী সরিৎ লেখকের আদেশ হওয়া দরকার।
                      আপনার মক্কেলার তার পরামর্শের বুঝিয়ে দর্শন করেন আদালতিক
                      ঘটনে করেন যে, লেখকের আদেশের জন্য আবেদন করা যায়। নালিশী
                      সরিৎ রাখার আগেই লেখকের আদেশ প্রাপ্তি করেন যে, লেখকের
                      আদেশের জন্য আবেদন করা যায়। নালিশী সরিৎ রাখার আগেই লেখকের
                      আদেশ প্রাপ্তি করে এক দরখাস্ত দাখিলকরণ কর
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs ">
                      1X8=8
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question 2 */}
          <div className="space-y-4">
            {/* Question 2(a) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  ২.
                </span>
              </div>
              <div className="flex-1">
                <div className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                    ক)
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      <span className="italic">
                        'Court shall not pass exparte order of ad interim
                        injunction without hearing the opposite party.'
                      </span>{" "}
                      The Code of Civil Procedure, 1908 এর Order XXXIX, Rule 5A
                      এর আলোকে মন্তব্য করা কর
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs ">
                      1X8=8
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 2(b) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8"></div>
              <div className="flex-1">
                <div className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                    খ)
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      ধন এক মামলায় বাদী আপনার মক্কেল। তিনি আপনাকে পরামর্শের
                      জন্য, প্রাক্কলনপূর্ব নালিশী সরিৎ লেখকের আদেশ হওয়া দরকার।
                      আপনার মক্কেলার তার পরামর্শের বুঝিয়ে দর্শন করেন আদালতিক
                      ঘটনে করেন যে, লেখকের আদেশের জন্য আবেদন করা যায়। নালিশী
                      সরিৎ রাখার আগেই লেখকের আদেশ প্রাপ্তি করেন যে, লেখকের
                      আদেশের জন্য আবেদন করা যায়। নালিশী সরিৎ রাখার আগেই লেখকের
                      আদেশ প্রাপ্তি করে এক দরখাস্ত দাখিলকরণ কর
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs ">
                      1X8=8
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className=" bg-white overflow-hidden p-0 rounded-[16px] mt-8">
        {/* Header Section */}
        <CardHeader className="text-center bg-gray2 p-4">
          <h1 className="text-[20px] font-bold text-darkColor">
            ক অংশ: যে-কোনো ৫ টির উত্তর দিন
          </h1>
        </CardHeader>

        {/* Questions Section - Single Card */}
        <CardContent className="p-6 space-y-4">
          {/* Question 1 */}
          <div className="space-y-4">
            {/* Question 1(a) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  ১.
                </span>
              </div>
              <div className="flex-1">
                <div className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                    ক)
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      আদালতি-জবানি খাত, সাজাগৃহ ও তদন্ত সংক্রান্ত প্রশাসনিক
                      বিষয়ান উচ্চতর পর্যায়ের আদর্শ লেখনা কর
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs ">
                      1X8=8
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 1(b) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8"></div>
              <div className="flex-1">
                <div className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                    খ)
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      ধন এক মামলায় বাদী আপনার মক্কেল। তিনি আপনাকে পরামর্শের
                      জন্য, প্রাক্কলনপূর্ব নালিশী সরিৎ লেখকের আদেশ হওয়া দরকার।
                      আপনার মক্কেলার তার পরামর্শের বুঝিয়ে দর্শন করেন আদালতিক
                      ঘটনে করেন যে, লেখকের আদেশের জন্য আবেদন করা যায়। নালিশী
                      সরিৎ রাখার আগেই লেখকের আদেশ প্রাপ্তি করেন যে, লেখকের
                      আদেশের জন্য আবেদন করা যায়। নালিশী সরিৎ রাখার আগেই লেখকের
                      আদেশ প্রাপ্তি করে এক দরখাস্ত দাখিলকরণ কর
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs ">
                      1X8=8
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question 2 */}
          <div className="space-y-4">
            {/* Question 2(a) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  ২.
                </span>
              </div>
              <div className="flex-1">
                <div className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                    ক)
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      <span className="italic">
                        'Court shall not pass exparte order of ad interim
                        injunction without hearing the opposite party.'
                      </span>{" "}
                      The Code of Civil Procedure, 1908 এর Order XXXIX, Rule 5A
                      এর আলোকে মন্তব্য করা কর
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs ">
                      1X8=8
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 2(b) */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8"></div>
              <div className="flex-1">
                <div className="flex gap-3 items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                    খ)
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm leading-relaxed">
                      ধন এক মামলায় বাদী আপনার মক্কেল। তিনি আপনাকে পরামর্শের
                      জন্য, প্রাক্কলনপূর্ব নালিশী সরিৎ লেখকের আদেশ হওয়া দরকার।
                      আপনার মক্কেলার তার পরামর্শের বুঝিয়ে দর্শন করেন আদালতিক
                      ঘটনে করেন যে, লেখকের আদেশের জন্য আবেদন করা যায়। নালিশী
                      সরিৎ রাখার আগেই লেখকের আদেশ প্রাপ্তি করেন যে, লেখকের
                      আদেশের জন্য আবেদন করা যায়। নালিশী সরিৎ রাখার আগেই লেখকের
                      আদেশ প্রাপ্তি করে এক দরখাস্ত দাখিলকরণ কর
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-main/50 rounded-[16px] text-gray-700 px-2 py-1 font-bold text-xs ">
                      1X8=8
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnswerUploadComponent />
    </div>
  );
}
