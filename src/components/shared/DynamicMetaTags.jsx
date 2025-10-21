"use client";

import { useEffect } from "react";
import {
  generateSocialImage,
  createRichDescription,
  getCourseCategory,
} from "@/lib/generateSocialImage";

const DynamicMetaTags = ({ course }) => {
  useEffect(() => {
    if (!course) return;

    // Update page title
    document.title = `${course.title} - De Jure Academy`;

    // Create rich description like Shikho
    const description = createRichDescription(course);

    // Update or create meta tags
    const updateMetaTag = (property, content) => {
      let meta =
        document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);

      if (!meta) {
        meta = document.createElement("meta");
        if (property.startsWith("og:")) {
          meta.setAttribute("property", property);
        } else {
          meta.setAttribute("name", property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Get high-quality course image
    const courseImage = generateSocialImage(course);

    // Update Open Graph tags with rich content
    updateMetaTag("og:title", `${course.title} - De Jure Academy`);
    updateMetaTag("og:description", description);
    updateMetaTag("og:url", `${window.location.origin}/courses/${course._id}`);
    updateMetaTag("og:image", courseImage);
    updateMetaTag("og:image:width", "1200");
    updateMetaTag("og:image:height", "630");
    updateMetaTag("og:image:alt", course.title);
    updateMetaTag("og:image:type", "image/jpeg");
    updateMetaTag("og:image:secure_url", courseImage);
    updateMetaTag("og:site_name", "De Jure Academy");
    updateMetaTag("og:type", "article");
    updateMetaTag("og:locale", "bn_BD");

    // Update Twitter tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", `${course.title} - De Jure Academy`);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", courseImage);
    updateMetaTag("twitter:image:alt", course.title);
    updateMetaTag("twitter:creator", "@dejureacademy");
    updateMetaTag("twitter:site", "@dejureacademy");

    // Update general meta tags
    updateMetaTag("description", description);
    updateMetaTag(
      "keywords",
      `${
        course.title
      }, De Jure Academy, আইন শিক্ষা, Law Education, আইন কোর্স, ${
        course.category || ""
      }`
    );

    // Add additional meta tags for better SEO
    updateMetaTag("author", "De Jure Academy");
    updateMetaTag("robots", "index, follow");
    updateMetaTag("language", "bn");
    updateMetaTag("revisit-after", "7 days");
  }, [course]);

  return null; // This component doesn't render anything
};

export default DynamicMetaTags;
