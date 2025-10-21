/**
 * Test course thumbnail URL accessibility
 */

export const testThumbnailUrl = async (thumbnailUrl) => {
  try {
    const response = await fetch(thumbnailUrl, { method: "HEAD" });
    return {
      accessible: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      url: thumbnailUrl,
    };
  } catch (error) {
    return {
      accessible: false,
      error: error.message,
      url: thumbnailUrl,
    };
  }
};

export const generateCourseImageUrl = (course) => {
  if (!course || !course.thumbnail) return null;

  // If thumbnail already has full URL, return as is
  if (course.thumbnail.startsWith("http")) {
    return course.thumbnail;
  }

  // Add API URL prefix
  return `${process.env.NEXT_PUBLIC_API_URL}/${course.thumbnail}`;
};

export const validateCourseThumbnail = async (course) => {
  if (!course || !course.thumbnail) {
    return {
      hasThumbnail: false,
      message: "No thumbnail found",
    };
  }

  const imageUrl = generateCourseImageUrl(course);
  const testResult = await testThumbnailUrl(imageUrl);

  return {
    hasThumbnail: true,
    imageUrl,
    testResult,
    message: testResult.accessible
      ? "Thumbnail is accessible"
      : "Thumbnail is not accessible",
  };
};
