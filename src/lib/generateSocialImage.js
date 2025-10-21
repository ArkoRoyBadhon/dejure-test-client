/**
 * Generate branded social media images like Shikho
 */

export const generateSocialImage = (course) => {
  if (!course) return null;

  // Create a branded image URL with course details
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com";

  // Check if course has a valid thumbnail
  if (course.thumbnail && course.thumbnail.trim() !== "") {
    // Ensure the thumbnail URL is properly formatted
    let thumbnailUrl = course.thumbnail;

    // If thumbnail doesn't start with http, add the API URL
    if (!thumbnailUrl.startsWith("http")) {
      thumbnailUrl = `${process.env.NEXT_PUBLIC_API_URL}/${thumbnailUrl}`;
    }

    return thumbnailUrl;
  }

  // For courses without proper thumbnails, generate a dynamic branded image
  const courseTitle = encodeURIComponent(course.title || "আইন কোর্স");
  const courseCategory = encodeURIComponent(getCourseCategory(course));

  return `${baseUrl}/api/social-image?title=${courseTitle}&category=${courseCategory}&width=1200&height=630`;
};

export const createRichDescription = (course) => {
  if (!course)
    return "De Jure Academy - বাংলাদেশের সেরা আইন শিক্ষা প্ল্যাটফর্ম।";

  // Create a more engaging description like Shikho
  const cleanDesc = course.description
    ? course.description.replace(/<[^>]*>/g, "")
    : "";
  const courseCategory = getCourseCategory(course.category);

  return `ঘরে বসেই দেশসেরা আইন বিশেষজ্ঞদের সাথে স্বল্প খরচে ${
    course.title
  } কোর্সে অংশগ্রহণ করুন এবং আইন পেশায় সফল হন। ${cleanDesc.substring(
    0,
    100
  )}... De Jure Academy এর সাথে আপনার আইন শিক্ষার যাত্রা শুরু করুন।`;
};

export const getCourseCategory = (category) => {
  // Example: Map category IDs to human-readable names
  const categories = {
    "60d5ec49f8e9c20015f8e9c2": "BJS",
    "60d5ec49f8e9c20015f8e9c3": "Bar Council",
    // Add more categories as needed
  };
  return categories[category] || category || "আইন";
};
