import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Ashik",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#a78bfa",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
    ],
  };
}
