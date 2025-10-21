// client/src/app/layout.js
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import Script from "next/script";
import PageViewTracker from "@/components/shared/PageViewTracker";
import TokenExpirationHandler from "@/components/shared/TokenExpirationHandler";

export const metadata = {
  title: {
    default: "De Jure Academy - বাংলাদেশের সেরা আইন শিক্ষা প্ল্যাটফর্ম",
    template: "%s | De Jure Academy",
  },
  description:
    "ঘরে বসেই দেশসেরা আইন বিশেষজ্ঞদের সাথে স্বল্প খরচে আইন কোর্সে অংশগ্রহণ করুন এবং আইন পেশায় সফল হন। De Jure Academy এর সাথে আপনার আইন শিক্ষার যাত্রা শুরু করুন।",
  keywords:
    "আইন শিক্ষা, Law Education, De Jure Academy, আইন কোর্স, BJS, Bar Exam, Judicial Service, ম্যাজিস্ট্রেট, জজ",
  authors: [{ name: "De Jure Academy" }],
  creator: "De Jure Academy",
  publisher: "De Jure Academy",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "De Jure Academy - বাংলাদেশের সেরা আইন শিক্ষা প্ল্যাটফর্ম",
    description:
      "ঘরে বসেই দেশসেরা আইন বিশেষজ্ঞদের সাথে স্বল্প খরচে আইন কোর্সে অংশগ্রহণ করুন এবং আইন পেশায় সফল হন।",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://dejureacademy.com",
    siteName: "De Jure Academy",
    images: [
      {
        // url: "/assets/image/home-hero-bg.png",
        url: "https://api.dejureacademy.com/api/v1/uploads/1755669034270-Screenshot_2025-08-20_114834.png",
        width: 1200,
        height: 630,
        alt: "De Jure Academy - বাংলাদেশের সেরা আইন শিক্ষা প্ল্যাটফর্ম",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "De Jure Academy - বাংলাদেশের সেরা আইন শিক্ষা প্ল্যাটফর্ম",
    description:
      "ঘরে বসেই দেশসেরা আইন বিশেষজ্ঞদের সাথে স্বল্প খরচে আইন কোর্সে অংশগ্রহণ করুন এবং আইন পেশায় সফল হন।",
    // images: ["/assets/image/home-hero-bg.png"],
    images: [
      "https://api.dejureacademy.com/api/v1/uploads/1755669034270-Screenshot_2025-08-20_114834.png",
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
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      {
        url: "/white-logo.ico",
        type: "image/x-icon",
      },
      {
        url: "/assets/icons/white-logo.ico",
        media: "(prefers-color-scheme: light)",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/assets/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#0047FF",
    "msapplication-TileColor": "#0047FF",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WHW53274');
            `,
          }}
        />
        <link rel="icon" href="/icon.png" />
        <link
          rel="icon"
          href="/white-logo.ico"
          media="(prefers-color-scheme: light)"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0047FF" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WHW53274"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ReduxProvider>
          <TokenExpirationHandler>
            <PageViewTracker />
            {children}
          </TokenExpirationHandler>
        </ReduxProvider>
      </body>
    </html>
  );
}
