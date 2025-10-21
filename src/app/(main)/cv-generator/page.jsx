"use client";
import React from "react";
import CommonPageHero from "../_components/home/CommonPageHero";
import ContactAndResources from "../_components/ContactAndResources";
import DownloadApp from "../_components/AppDownload";

const CVGenerator = () => {
  return (
    <div>
      {/* Hero Section */}
      <CommonPageHero
        badgeText="CV জেনারেটর"
        title="CV জেনারেটর"
        description="পেশাদার CV তৈরি করুন সহজেই"
        imageSrc="uploads/custom-heroimg.png"
      />

      {/* Main Content */}
      <main className="bg-gray2 min-h-[40vh] py-8">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0">
          <div className="text-center py-12">
            <p className="text-lg text-darkColor">CV জেনারেটর</p>
          </div>
        </div>
      </main>

      {/* Footer Components */}
      <ContactAndResources />
      <DownloadApp />
    </div>
  );
};

export default CVGenerator;
