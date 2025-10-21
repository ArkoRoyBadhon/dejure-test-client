"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEnhancedPageView } from "@/lib/analytics";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page view when pathname or search params change
    const fullPath =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    const pageTitle = document.title || "DeJureAcademy";

    trackEnhancedPageView(fullPath, pageTitle);
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
