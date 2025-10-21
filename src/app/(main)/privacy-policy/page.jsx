import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            গোপনীয়তা নীতি
          </h1>
          <p className="text-gray-600">
            সর্বশেষ আপডেট: {new Date().toLocaleDateString("bn-BD")}
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-lg mb-6 leading-relaxed">
            ডি জুরি একাডেমি শিক্ষার্থীদের ব্যক্তিগত তথ্যের নিরাপত্তা নিশ্চিত
            করতে সর্বোচ্চ গুরুত্ব প্রদান করে। আমাদের ওয়েবসাইট ব্যবহারের মাধ্যমে
            আপনি এই গোপনীয়তা নীতির সাথে সম্মত হচ্ছেন।
          </p>

          <div className="space-y-8">
            <Section
              title="তথ্য সংগ্রহ ও ব্যবহার"
              content={
                <div className="space-y-4">
                  <SubSection
                    title="সংগ্রহকৃত তথ্য:"
                    content="নাম, মোবাইল নম্বর, ই-মেইল, ঠিকানা, জাতীয় পরিচয়পত্র/স্টুডেন্ট আইডি নম্বর, একাডেমিক তথ্য এবং পেমেন্ট তথ্য সংগ্রহ করা হতে পারে।"
                  />
                  <SubSection
                    title="তথ্য ব্যবহারের উদ্দেশ্য:"
                    content={
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          শিক্ষার্থীর অ্যাকাউন্ট তৈরি, কোর্স অ্যাক্সেস প্রদান,
                          কাস্টমার সার্ভিস, পেমেন্ট প্রসেসিং এবং প্রশাসনিক
                          কার্যক্রম পরিচালনা।
                        </li>
                        <li>
                          নতুন কোর্স, অফার বা প্রমোশন সম্পর্কিত তথ্য
                          শিক্ষার্থীদের অবহিত করা।
                        </li>
                        <li>
                          গবেষণা, পরিসংখ্যান এবং একাডেমির উন্নয়নের উদ্দেশ্যে
                          তথ্য ব্যবহার।
                        </li>
                      </ul>
                    }
                  />
                </div>
              }
            />

            <Section
              title="তথ্য সুরক্ষা"
              content="তথ্য নিরাপত্তার জন্য SSL এনক্রিপশন এবং উন্নত সাইবার সিকিউরিটি টুলস ব্যবহার করা হয়। শিক্ষার্থীর অনুমতি ছাড়া কোনো তথ্য প্রকাশ, বিক্রি বা হস্তান্তর করা হবে না।"
            />

            <Section
              title="তৃতীয় পক্ষের সাথে শেয়ার"
              content={
                <div className="space-y-2">
                  <p>
                    শুধুমাত্র আইনগত প্রয়োজনে বা কর্তৃপক্ষের নির্দেশে তথ্য সরবরাহ
                    করা হতে পারে।
                  </p>
                  <p>
                    আমাদের অনুমোদিত সার্ভিস প্রোভাইডাররা (যেমন: পেমেন্ট গেটওয়ে,
                    হোস্টিং সার্ভার) সীমিত পরিসরে তথ্য ব্যবহার করতে পারে।
                  </p>
                </div>
              }
            />

            <Section
              title="কুকিজ ব্যবহার"
              content="আমাদের ওয়েবসাইটে ইউজার এক্সপেরিয়েন্স উন্নত করার জন্য কুকিজ ব্যবহার করা হয়।"
            />

            <Section
              title="শিক্ষার্থীর অধিকার"
              content="শিক্ষার্থী চাইলে তার ব্যক্তিগত তথ্য সংশোধন, আপডেট বা মুছে ফেলার অনুরোধ করতে পারবেন।"
            />

            <Section
              title="একাডেমির অধিকার"
              content="ডি জুরি একাডেমি যে কোনো সময় গোপনীয়তা নীতি পরিবর্তন বা সংশোধন করার অধিকার সংরক্ষণ করে।"
            />
          </div>

          <div className="mt-10 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">যোগাযোগ</h3>
            <p className="text-blue-700">
              গোপনীয়তা নীতি সংক্রান্ত কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ
              করুন:
              <a
                href="mailto:privacy@djuryacademy.com"
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                privacy@djuryacademy.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Section Component
const Section = ({ title, content }) => (
  <div className="border-b border-gray-200 pb-6 last:border-b-0">
    <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-start">
      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2 mt-1">
        ✓
      </span>
      {title}
    </h2>
    <div className="ml-8">{content}</div>
  </div>
);

// Reusable SubSection Component
const SubSection = ({ title, content }) => (
  <div>
    <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
    <div className="text-gray-700">{content}</div>
  </div>
);

export default PrivacyPolicy;
