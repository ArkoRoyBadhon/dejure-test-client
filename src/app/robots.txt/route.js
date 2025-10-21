import { NextResponse } from "next/server";

export async function GET() {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /_next/
Disallow: /static/

# Allow important pages
Allow: /courses/
Allow: /blog/
Allow: /about
Allow: /contact

# Sitemap
Sitemap: ${
    process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
  }/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
