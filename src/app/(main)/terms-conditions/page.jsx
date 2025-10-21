import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 md:p-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            শর্তাবলি ও নীতি
          </h1>
          <p className="text-blue-200">www.dejureacademy.com</p>
        </div>

        <div className="p-6 md:p-8">
          {/* Introduction */}
          <div className="mb-8 bg-blue-50 p-5 rounded-lg border-l-4 border-blue-600">
            <p className="text-gray-700">
              এই ওয়েবসাইটটি (www.dejureacademy.com) ডি জুরি একাডেমি কর্তৃক
              পরিচালিত ও সংরক্ষিত। ওয়েবসাইট বা আমাদের কোর্স ব্যবহার করার মাধ্যমে
              আপনি স্বয়ংক্রিয়ভাবে এই শর্তাবলি ও নীতির সাথে সম্মত হচ্ছেন। যদি
              আপনি এই শর্তাবলির সাথে একমত না হন, তবে অনুগ্রহ করে ওয়েবসাইট বা
              সেবা ব্যবহার করবেন না।
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            <TermSection
              number="১"
              title="সেবার ব্যবহার"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    ওয়েবসাইটে প্রদত্ত সকল কোর্স, কনটেন্ট, নোটস, ভিডিও ও
                    শিক্ষামূলক উপকরণ শুধুমাত্র ব্যক্তিগত ও শিক্ষামূলক উদ্দেশ্যে
                    ব্যবহারের জন্য।
                  </li>
                  <li>
                    কোনো শিক্ষার্থী তার অ্যাকাউন্ট অন্য কারো সাথে শেয়ার বা
                    বিক্রি করতে পারবেন না।
                  </li>
                  <li>
                    ওয়েবসাইটে কোনো প্রকার অনৈতিক, অবৈধ বা ক্ষতিকর কার্যকলাপ
                    কঠোরভাবে নিষিদ্ধ।
                  </li>
                </ul>
              }
            />

            <TermSection
              number="২"
              title="নিবন্ধন ও অ্যাকাউন্ট"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    কোর্সে ভর্তি হওয়ার জন্য শিক্ষার্থীকে সঠিক ও পূর্ণাঙ্গ তথ্য
                    প্রদান করতে হবে।
                  </li>
                  <li>
                    ভুল, মিথ্যা বা ভুয়া তথ্য প্রদান করলে একাডেমি শিক্ষার্থীর
                    অ্যাকাউন্ট বাতিল করার অধিকার রাখে।
                  </li>
                  <li>
                    অ্যাকাউন্টের গোপনীয়তা রক্ষা করার দায়িত্ব শিক্ষার্থীর নিজের।
                  </li>
                </ul>
              }
            />

            <TermSection
              number="৩"
              title="ফি ও পেমেন্ট"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    কোর্স ফি নির্ধারিত নিয়মে এবং নির্ধারিত সময়ে পরিশোধ করতে হবে।
                  </li>
                  <li>
                    কিস্তিতে পেমেন্ট করলে নির্দিষ্ট সময়সীমা মেনে চলতে হবে।
                  </li>
                  <li>
                    পেমেন্ট সম্পূর্ণ না হলে শিক্ষার্থী কোর্সে অংশগ্রহণের অধিকার
                    হারাবেন।
                  </li>
                  <li>
                    ফি ফেরতের ক্ষেত্রে ডি জুরি একাডেমির ফেরত নীতি (Refund
                    Policy) প্রযোজ্য হবে।
                  </li>
                </ul>
              }
            />

            <TermSection
              number="৪"
              title="কপিরাইট ও মেধাস্বত্ব"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    ওয়েবসাইটে প্রদত্ত সব ধরনের লেখা, ভিডিও, অডিও, ছবি, লোগো,
                    লেকচার এবং কোর্স ম্যাটেরিয়াল ডি জুরি একাডেমির কপিরাইট
                    সুরক্ষিত।
                  </li>
                  <li>
                    পূর্বানুমতি ছাড়া এসব কনটেন্ট কপি, ডাউনলোড, বিতরণ, প্রকাশ বা
                    বাণিজ্যিকভাবে ব্যবহার করা যাবে না।
                  </li>
                  <li>
                    মেধাস্বত্ব লঙ্ঘন করলে একাডেমি আইনগত ব্যবস্থা গ্রহণ করতে
                    পারবে।
                  </li>
                </ul>
              }
            />

            <TermSection
              number="৫"
              title="কোর্স ও কনটেন্টের পরিবর্তন"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    ডি জুরি একাডেমি যে কোনো সময় কোর্সের বিষয়বস্তু, সময়সূচি,
                    শিক্ষক বা কাঠামো পরিবর্তন করার পূর্ণ অধিকার সংরক্ষণ করে।
                  </li>
                  <li>
                    ওয়েবসাইটে প্রদত্ত তথ্য হালনাগাদ রাখার চেষ্টা করা হলেও কোনো
                    ভুল বা অসম্পূর্ণ তথ্যের জন্য একাডেমি দায়ী থাকবে না।
                  </li>
                </ul>
              }
            />

            <TermSection
              number="৬"
              title="দায়সীমা (Limitation of Liability)"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    শিক্ষার্থীর ব্যক্তিগত সমস্যা, ইন্টারনেট সংযোগ, ডিভাইস সমস্যা
                    বা বাহ্যিক কোনো কারণে ক্লাসে অংশ নিতে না পারলে ডি জুরি
                    একাডেমি দায়ী থাকবে না।
                  </li>
                  <li>
                    ওয়েবসাইট ব্যবহারের কারণে কোনো প্রযুক্তিগত সমস্যা বা ডেটা
                    ক্ষতির জন্য একাডেমি দায়বদ্ধ নয়。
                  </li>
                  <li>
                    শিক্ষার্থী তার নিজের সিদ্ধান্ত ও দায়িত্বে কোর্সে ভর্তি
                    হচ্ছেন—কোনো ধরনের গ্যারান্টি প্রদান করা হয় না যে সকল
                    শিক্ষার্থী সমানভাবে সফল হবেন।
                  </li>
                </ul>
              }
            />

            <TermSection
              number="৭"
              title="গোপনীয়তা নীতি"
              content="শিক্ষার্থীর ব্যক্তিগত তথ্য ব্যবহারের ক্ষেত্রে Privacy Policy প্রযোজ্য হবে। ওয়েবসাইট ব্যবহার মানেই আপনি আমাদের গোপনীয়তা নীতির সাথে একমত হচ্ছেন।"
            />

            <TermSection
              number="৮"
              title="আইনগত কাঠামো"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    এই ওয়েবসাইট ও শর্তাবলি বাংলাদেশের আইন অনুযায়ী পরিচালিত হবে।
                  </li>
                  <li>
                    যেকোনো বিরোধ নিষ্পত্তির এখতিয়ার ঢাকা জেলার আদালতের মধ্যে
                    সীমাবদ্ধ থাকবে।
                  </li>
                </ul>
              }
            />

            <TermSection
              number="৯"
              title="পরিবর্তন ও সংশোধন"
              content="ডি জুরি একাডেমি যে কোনো সময় পূর্ব ঘোষণা ছাড়াই এই শর্তাবলি পরিবর্তন, সংশোধন বা হালনাগাদ করার পূর্ণ অধিকার সংরক্ষণ করে। পরিবর্তিত শর্তাবলি ওয়েবসাইটে প্রকাশের সাথে সাথেই কার্যকর হবে।"
            />
          </div>

          {/* Contact Information */}
          <div className="mt-10 p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              প্রশ্ন বা জিজ্ঞাসা থাকলে?
            </h3>
            <p className="text-gray-600 mb-2">
              আমাদের শর্তাবলি সম্পর্কে আপনার কোন প্রশ্ন থাকলে, আমাদের সাথে
              যোগাযোগ করতে দ্বিধা করবেন না:
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-blue-600">
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                legal@djuriacademy.com
              </span>
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                হেল্পলাইন: +880 XXX-XXXXXX
              </span>
            </div>
          </div>

          {/* Last Updated */}
          <div className="mt-6 text-sm text-gray-500 text-center">
            সর্বশেষ হালনাগাদ: {new Date().toLocaleDateString("bn-BD")}
          </div>
        </div>
      </div>
    </div>
  );
};

// Term Section Component
const TermSection = ({ number, title, content }) => (
  <div className="flex items-start border-b border-gray-200 pb-6 last:border-b-0">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
      <span className="text-blue-700 font-bold">{number}</span>
    </div>
    <div className="flex-grow">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="text-gray-700">{content}</div>
    </div>
  </div>
);

export default TermsAndConditions;
