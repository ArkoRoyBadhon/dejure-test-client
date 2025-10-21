import { NextResponse } from "next/server";

export async function GET() {
  const manifest = {
    name: "De Jure Academy",
    short_name: "De Jure",
    description: "বাংলাদেশের সেরা আইন শিক্ষা প্ল্যাটফর্ম",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0047FF",
    orientation: "portrait",
    scope: "/",
    lang: "bn",
    icons: [
      {
        src: "/assets/icon/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/assets/icon/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/assets/icon/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/assets/icon/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/assets/icon/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/assets/icon/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/assets/icon/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/assets/icon/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any",
      },
    ],
    categories: ["education", "law", "learning"],
    screenshots: [
      {
        src: "/assets/screenshot/desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/assets/screenshot/mobile.png",
        sizes: "390x844",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
