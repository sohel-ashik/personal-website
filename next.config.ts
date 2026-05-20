import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow any https image URL for blog cover images.
    // Tighten this list once you pick a specific image bucket/CDN.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
