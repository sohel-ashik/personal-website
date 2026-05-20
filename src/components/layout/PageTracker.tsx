"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Fire and forget — never block page load
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer,
      }),
      // Use keepalive so the request completes even if the page unloads
      keepalive: true,
    }).catch(() => {/* silent */});
  }, [pathname]);

  return null;
}
