"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useGetAllAboutQuery } from "@/redux/features/WebManage/About.api";

// Helper to safely convert YouTube URLs to embed format
function getYouTubeEmbedUrl(url) {
  try {
    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // If it's a video ID only, create embed URL
    if (!url.includes("http")) {
      return `https://www.youtube.com/embed/${url}`;
    }

    // If it's a full YouTube URL, extract the video ID
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
    if (urlObj.hostname.includes("youtube.com")) {
      const v = urlObj.searchParams.get("v");
      return v ? `https://www.youtube.com/embed/${v}` : url;
    }
    return url; // fallback if not YouTube
  } catch {
    // If it's just a video ID or any other format, try to use it directly
    return `https://www.youtube.com/embed/${url}`;
  }
}

const ContactSupportPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: aboutData, isLoading, isError } = useGetAllAboutQuery();

  // Use actual about data or fallback to minimal data
  const about = aboutData && aboutData.length > 0 ? aboutData[0] : null;

  const aboutImages =
    about && about.images
      ? about.images.map((img) => `${process.env.NEXT_PUBLIC_API_URL}/${img}`)
      : [];

  const mentors = about && about.mentors ? about.mentors : [];
  const teamMembers = about && about.team ? about.team : [];

  const nextSlide = () => {
    if (aboutImages.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % aboutImages.length);
    }
  };

  const prevSlide = () => {
    if (aboutImages.length > 0) {
      setCurrentSlide(
        (prev) => (prev - 1 + aboutImages.length) % aboutImages.length
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB800]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Us Section */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              {about?.title || "About Us"}
            </h1>
            {about?.description && (
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {about.description}
              </p>
            )}
          </div>

          {/* Image Carousel */}
          {aboutImages.length > 0 && (
            <div className="relative mx-auto mb-8 sm:mb-12 lg:mb-16">
              <div className="flex justify-center items-center">
                {aboutImages.length > 3 && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 sm:left-4 z-10 bg-white/90 hover:bg-white shadow-lg border-gray-200"
                    onClick={prevSlide}
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                  </Button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full px-8 sm:px-16">
                  {aboutImages
                    .slice(currentSlide, currentSlide + 3)
                    .map((image, index) => (
                      <div
                        key={index}
                        className="relative h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                      >
                        <Image
                          src={image}
                          alt={`About image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                </div>

                {aboutImages.length > 3 && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 sm:right-4 z-10 bg-white/90 hover:bg-white shadow-lg border-gray-200"
                    onClick={nextSlide}
                  >
                    <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                  </Button>
                )}
              </div>

              {about?.caption && (
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 sm:mt-8 text-center">
                  {about.caption}
                </h2>
              )}
            </div>
          )}

          {/* Video Section */}
          {about?.video && (
            <div className="mb-8 sm:mb-12">
              <div className="relative max-w-4xl mx-auto">
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(about.video)}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                    title="YouTube video player"
                  ></iframe>
                </div>
              </div>
            </div>
          )}

          {/* Vision, Mission, and Core Values */}
          <div className="space-y-8 sm:space-y-12">
            {about?.visionTitle && (
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {about.visionTitle}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {about.visionDescription}
                </p>
              </div>
            )}

            {about?.missionTitle && (
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {about.missionTitle}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {about.missionDescription}
                </p>
              </div>
            )}

            {about?.coreValueTitle && (
              <div className="text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                  {about.coreValueTitle}
                </h3>
                <p className="text-base sm:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {about.coreValueDescription}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Meet the Mentors Section */}
        {mentors.length > 0 && (
          <section className="py-8 sm:py-12 lg:py-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Meet the Mentors
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {mentors.map((mentor, index) => (
                <Card
                  key={index}
                  className="p-4 sm:p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl"
                >
                  <div className="mx-auto mb-4 sm:mb-6">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden shadow-md">
                      <Image
                        src={
                          mentor.image
                            ? mentor.image.startsWith("http")
                              ? mentor.image
                              : `${process.env.NEXT_PUBLIC_API_URL}/${mentor.image}`
                            : "/assets/image/instructor.png"
                        }
                        alt={mentor.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {mentor.name}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-blue-600 mb-1">
                    {mentor.position}
                  </p>
                  {mentor.department && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      {mentor.department}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Meet the Team Section */}
        {teamMembers.length > 0 && (
          <section className="py-8 sm:py-12 lg:py-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Meet the Team
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {teamMembers.map((member, index) => (
                <Card
                  key={index}
                  className="p-4 sm:p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl"
                >
                  <div className="mx-auto mb-4 sm:mb-6">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden shadow-md">
                      <Image
                        src={
                          member.image
                            ? member.image.startsWith("http")
                              ? member.image
                              : `${process.env.NEXT_PUBLIC_API_URL}/${member.image}`
                            : "/assets/image/instructor.png"
                        }
                        alt={member.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-blue-600 mb-1">
                    {member?.position}
                  </p>
                  {member.department && (
                    <p className="text-xs sm:text-sm text-gray-600">
                      {member.department}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ContactSupportPage;
