import React from "react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">ফেরত নীতি</h1>
          <p className="text-blue-100">
            ডি জুরি একাডেমি তার শিক্ষার্থীদের মানসম্মত শিক্ষা ও সেবা প্রদানে
            অঙ্গীকারবদ্ধ
          </p>
        </div>

        <div className="p-6 md:p-8">
          {/* Introduction */}
          <div className="mb-8 bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-700">
              তবে শিক্ষার্থীরা কোর্সে ভর্তি হওয়ার পর কোনো কারণে অর্থ ফেরত চাইলে
              এই নীতিমালা প্রযোজ্য হবে। আমাদের ফেরত নীতি একাডেমির স্বার্থ
              সুরক্ষিত রাখার পাশাপাশি শিক্ষার্থীর ন্যায্য অধিকার নিশ্চিত করার
              জন্য প্রণীত।
            </p>
          </div>

          {/* Policy Points */}
          <div className="space-y-6">
            <PolicyPoint
              number="1"
              title="আবেদনকাল"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    কোর্সে ভর্তি হওয়ার তারিখ থেকে সর্বোচ্চ ৩ (তিন) কার্যদিবসের
                    মধ্যে অর্থ ফেরতের আবেদন গ্রহণযোগ্য হবে।
                  </li>
                  <li>
                    এই সময়সীমার পর কোনো ধরনের ফেরত আবেদন গ্রহণ করা হবে না।
                  </li>
                </ul>
              }
            />

            <PolicyPoint
              number="2"
              title="কোর্স ব্যবহার সীমা"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    যদি শিক্ষার্থী ১৫% বা তার বেশি কনটেন্ট/ক্লাস/লেকচার ব্যবহার
                    করে থাকেন, তাহলে অর্থ ফেরত দাবি বাতিল বলে গণ্য হবে।
                  </li>
                  <li>
                    লাইভ ক্লাসে অংশগ্রহণ অথবা রেকর্ডেড কনটেন্ট দেখলে সেটি
                    ব্যবহার হিসেবে গণ্য হবে।
                  </li>
                </ul>
              }
            />

            <PolicyPoint
              number="3"
              title="আবেদন পদ্ধতি"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    অর্থ ফেরতের আবেদন শুধুমাত্র অফিসিয়াল ফর্ম পূরণের মাধ্যমে
                    করতে হবে।
                  </li>
                  <li>
                    ইমেইল বা হেল্পডেস্কে জমা না দিলে আবেদন বাতিল বলে গণ্য হবে।
                  </li>
                </ul>
              }
            />

            <PolicyPoint
              number="4"
              title="সার্ভিস চার্জ ও কর্তন"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    অর্থ ফেরতের ক্ষেত্রে কোর্স ফি-এর সর্বনিম্ন ২৫% সার্ভিস চার্জ
                    কর্তন করা হবে।
                  </li>
                  <li>
                    যদি শিক্ষার্থী কিস্তিতে/ইন্সটলমেন্ট পেমেন্ট করে থাকেন, তবে
                    ইতিমধ্যে প্রদত্ত কিস্তির অর্থ ফেরতযোগ্য হবে না।
                  </li>
                </ul>
              }
            />

            <PolicyPoint
              number="5"
              title="পেমেন্ট পদ্ধতি"
              content={
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>
                    ফেরত অর্থ শুধুমাত্র অফিসিয়াল ব্যাংক ট্রান্সফার বা পেমেন্ট
                    গেটওয়ের মাধ্যমে প্রদান করা হবে।
                  </li>
                  <li>নগদ অর্থ ফেরত প্রদান করা হবে না।</li>
                </ul>
              }
            />

            <PolicyPoint
              number="6"
              title="অপ্রত্যাশিত পরিস্থিতি"
              content="প্রযুক্তিগত সমস্যা, শিক্ষার্থীর ব্যক্তিগত কারণে কোর্স করতে না পারা, ডিভাইস বা ইন্টারনেট সমস্যার কারণে অর্থ ফেরত গ্রহণযোগ্য হবে না।"
            />

            <PolicyPoint
              number="7"
              title="একাডেমির অধিকার"
              content="ডি জুরি একাডেমি যে কোনো সময় ফেরত নীতি পরিবর্তন, সংশোধন বা বাতিল করার পূর্ণ অধিকার সংরক্ষণ করে।"
            />
          </div>

          {/* Contact Information */}
          <div className="mt-10 p-5 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              ফেরত সংক্রান্ত সহায়তা
            </h3>
            <p className="text-gray-600 mb-2">
              ফেরত নীতির বিষয়ে আরও জানতে বা সহায়তার জন্য যোগাযোগ করুন:
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
                refund@djuriacademy.com
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

// Policy Point Component
const PolicyPoint = ({ number, title, content }) => (
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

export default RefundPolicy;
