/**
 * SEO config is driven by src/data/portfolio.json
 * Edit that file to update siteUrl, twitterHandle, and seoKeywords.
 */
import data from "@/data/portfolio.json";

export const siteConfig = {
  name: data.profile.name,
  title: `${data.profile.name} — ${data.profile.role}`,
  description: data.profile.tagline,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? data.meta.siteUrl,
  ogImage: "/opengraph-image",
  twitterHandle: data.meta.twitterHandle,
  keywords: data.seoKeywords,
};
