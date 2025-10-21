/**
 * Utility functions for generating metadata for different pages
 */

export function generateCourseMetadata(course) {
  if (!course) {
    return {
      title: "Course Not Found - De Jure Academy",
      description: "The requested course could not be found.",
    };
  }

  // Clean description HTML tags for meta description
  const cleanDescription = course.description
    ? course.description.replace(/<[^>]*>/g, "").substring(0, 160)
    : "De Jure Academy এর কোর্সে অংশগ্রহণ করুন।";

  // Generate dynamic course image
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com";
  const courseTitle = encodeURIComponent(course.title || "আইন কোর্স");
  const courseCategory = encodeURIComponent(
    course.category?.title || "Law Education"
  );

  const courseImage = course.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`
    : `${baseUrl}/api/social-image?title=${courseTitle}&category=${courseCategory}&width=1200&height=630`;

  const metadata = {
    title: `${course.title} - De Jure Academy`,
    description: cleanDescription,
    keywords: `${course.title}, De Jure Academy, আইন শিক্ষা, Law Education, ${
      course.category?.title || ""
    }`,
    authors: [{ name: "De Jure Academy" }],
    creator: "De Jure Academy",
    publisher: "De Jure Academy",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
    ),
    alternates: {
      canonical: `/courses/${course._id || course.slug}`,
    },
    openGraph: {
      title: `${course.title} - De Jure Academy`,
      description: cleanDescription,
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
      }/courses/${course._id || course.slug}`,
      siteName: "De Jure Academy",
      images: [
        {
          url: courseImage,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
      locale: "bn_BD",
      type: "article",
      publishedTime: course.createdAt,
      modifiedTime: course.updatedAt,
      authors: ["De Jure Academy"],
      section: "Education",
      tags: [course.category?.title || "Law Education"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${course.title} - De Jure Academy`,
      description: cleanDescription,
      images: [courseImage],
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

  return metadata;
}

export function generateBlogMetadata(blog) {
  if (!blog) {
    return {
      title: "Blog Not Found - De Jure Academy",
      description: "The requested blog post could not be found.",
    };
  }

  const cleanDescription = blog.description
    ? blog.description.replace(/<[^>]*>/g, "").substring(0, 160)
    : "De Jure Academy এর ব্লগে অংশগ্রহণ করুন।";

  // Generate dynamic blog image
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com";
  const blogTitle = encodeURIComponent(blog.title || "ব্লগ");
  const blogCategory = encodeURIComponent(
    blog.category?.title || "Law Education"
  );

  const blogImage = blog.thumbnail
    ? `${process.env.NEXT_PUBLIC_API_URL}/${blog.thumbnail}`
    : `${baseUrl}/api/social-image?title=${blogTitle}&category=${blogCategory}&width=1200&height=630`;

  const metadata = {
    title: `${blog.title} - De Jure Academy`,
    description: cleanDescription,
    keywords: `${blog.title}, De Jure Academy, আইন শিক্ষা, Law Education, ${
      blog.category?.title || ""
    }`,
    authors: [{ name: "De Jure Academy" }],
    creator: "De Jure Academy",
    publisher: "De Jure Academy",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
    ),
    alternates: {
      canonical: `/blog/${blog._id || blog.slug}`,
    },
    openGraph: {
      title: `${blog.title} - De Jure Academy`,
      description: cleanDescription,
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
      }/blog/${blog._id || blog.slug}`,
      siteName: "De Jure Academy",
      images: [
        {
          url: blogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      locale: "bn_BD",
      type: "article",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: ["De Jure Academy"],
      section: "Education",
      tags: [blog.category?.title || "Law Education"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} - De Jure Academy`,
      description: cleanDescription,
      images: [blogImage],
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

  return metadata;
}

export function generatePageMetadata(page) {
  return {
    title: `${page.title} - De Jure Academy`,
    description:
      page.description ||
      "De Jure Academy - বাংলাদেশের সেরা আইন শিক্ষা প্ল্যাটফর্ম।",
    keywords: `${page.title}, De Jure Academy, আইন শিক্ষা, Law Education`,
    authors: [{ name: "De Jure Academy" }],
    creator: "De Jure Academy",
    publisher: "De Jure Academy",
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
    ),
    alternates: {
      canonical: `/${page.slug}`,
    },
    openGraph: {
      title: `${page.title} - De Jure Academy`,
      description:
        page.description ||
        "De Jure Academy - বাংলাদেশের সেরা আইন শিক্ষা প্ল্যাটফর্ম।",
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
      }/${page.slug}`,
      siteName: "De Jure Academy",
      images: [
        {
          url: page.featuredImage || "/assets/image/home-hero-bg.png",
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      locale: "bn_BD",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} - De Jure Academy`,
      description:
        page.description ||
        "De Jure Academy - বাংলাদেশের সেরা আইন শিক্ষা প্ল্যাটফর্ম।",
      images: [page.featuredImage || "/assets/image/home-hero-bg.png"],
      creator: "@dejureacademy",
    },
  };
}
