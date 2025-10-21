import { generateCourseMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {

    // Fetch course data dynamically
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`,
      {
        cache: "no-store", // Ensure fresh data
        headers: {
          "Content-Type": "application/json",
        },
      }
    );


    if (!response.ok) {
      throw new Error(`Failed to fetch course: ${response.status}`);
    }

    const course = await response.json();


    if (!course || !course._id) {
      throw new Error("Course data not found");
    }


    // Use the dynamic course metadata
    return generateCourseMetadata(course);
  } catch (error) {


    // Fallback to static metadata if API fails
    return {
      title: "আইন কোর্স - De Jure Academy",
      description:
        "ঘরে বসেই দেশসেরা আইন বিশেষজ্ঞদের সাথে স্বল্প খরচে আইন কোর্সে অংশগ্রহণ করুন এবং আইন পেশায় সফল হন। De Jure Academy এর সাথে আপনার আইন শিক্ষার যাত্রা শুরু করুন।",
      keywords:
        "আইন কোর্স, Law Course, De Jure Academy, আইন শিক্ষা, Law Education, BJS, Bar Exam",
      authors: [{ name: "De Jure Academy" }],
      creator: "De Jure Academy",
      publisher: "De Jure Academy",
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
      ),
      alternates: {
        canonical: `/courses/${id}`,
      },
      openGraph: {
        title: "আইন কোর্স - De Jure Academy",
        description:
          "ঘরে বসেই দেশসেরা আইন বিশেষজ্ঞদের সাথে স্বল্প খরচে আইন কোর্সে অংশগ্রহণ করুন এবং আইন পেশায় সফল হন। De Jure Academy এর সাথে আপনার আইন শিক্ষার যাত্রা শুরু করুন।",
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
        }/courses/${id}`,
        siteName: "De Jure Academy",
        images: [
          {
            url: `${
              process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
            }/api/social-image?title=${encodeURIComponent(
              "আইন কোর্স"
            )}&category=${encodeURIComponent(
              "Law Education"
            )}&width=1200&height=630`,
            width: 1200,
            height: 630,
            alt: "De Jure Academy আইন কোর্স",
            type: "image/jpeg",
          },
        ],
        locale: "bn_BD",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: "আইন কোর্স - De Jure Academy",
        description:
          "ঘরে বসেই দেশসেরা আইন বিশেষজ্ঞদের সাথে স্বল্প খরচে আইন কোর্সে অংশগ্রহণ করুন এবং আইন পেশায় সফল হন।",
        images: [
          `${
            process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
          }/api/social-image?title=${encodeURIComponent(
            "আইন কোর্স"
          )}&category=${encodeURIComponent(
            "Law Education"
          )}&width=1200&height=630`,
        ],
        creator: "@dejureacademy",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  }
}

export default function CourseLayout({ children }) {
  return children;
}
