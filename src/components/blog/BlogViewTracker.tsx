"use client";

import { useEffect } from "react";

export function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/blog/posts/${slug}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {/* silent */});
  }, [slug]);

  return null;
}
