import { generateBlogMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    // Fetch blog data dynamically
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`,
      {
        cache: "no-store", // Ensure fresh data
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.status}`);
    }

    const blog = await response.json();

    if (!blog || !blog._id) {
      throw new Error("Blog data not found");
    }

    // Use the dynamic blog metadata
    return generateBlogMetadata(blog);
  } catch (error) {
    // Fallback to static metadata if API fails
    return {
      title: "ব্লগ - De Jure Academy",
      description:
        "De Jure Academy এর ব্লগে আইন শিক্ষা, ক্যারিয়ার গাইড এবং আইন পেশার বিভিন্ন দিক নিয়ে বিস্তারিত আলোচনা।",
      keywords:
        "ব্লগ, Blog, De Jure Academy, আইন শিক্ষা, Law Education, আইন পেশা, Legal Career",
      authors: [{ name: "De Jure Academy" }],
      creator: "De Jure Academy",
      publisher: "De Jure Academy",
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
      ),
      alternates: {
        canonical: `/blog/${id}`,
      },
      openGraph: {
        title: "ব্লগ - De Jure Academy",
        description:
          "De Jure Academy এর ব্লগে আইন শিক্ষা, ক্যারিয়ার গাইড এবং আইন পেশার বিভিন্ন দিক নিয়ে বিস্তারিত আলোচনা।",
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
        }/blog/${id}`,
        siteName: "De Jure Academy",
        images: [
          {
            url: `${
              process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
            }/api/social-image?title=${encodeURIComponent(
              "ব্লগ"
            )}&category=${encodeURIComponent(
              "Law Education"
            )}&width=1200&height=630`,
            width: 1200,
            height: 630,
            alt: "De Jure Academy ব্লগ",
            type: "image/jpeg",
          },
        ],
        locale: "bn_BD",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: "ব্লগ - De Jure Academy",
        description:
          "De Jure Academy এর ব্লগে আইন শিক্ষা, ক্যারিয়ার গাইড এবং আইন পেশার বিভিন্ন দিক নিয়ে বিস্তারিত আলোচনা।",
        images: [
          `${
            process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
          }/api/social-image?title=${encodeURIComponent(
            "ব্লগ"
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

export default function BlogLayout({ children }) {
  return children;
}
