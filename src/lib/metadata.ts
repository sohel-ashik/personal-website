import type { Metadata } from "next";
import { siteConfig } from "@/content/seo";

interface BuildMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

const rss = {
  "application/rss+xml": `${siteConfig.url}/blog/rss.xml`,
};

const indexRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "",
  image,
  keywords = siteConfig.keywords,
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataInput = {}): Metadata {
  const url = path ? `${siteConfig.url}${path}` : siteConfig.url;
  const ogImage = image ?? "/opengraph-image";
  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title;

  const images = [
    {
      url: ogImage,
      width: 1200,
      height: 630,
      alt: fullTitle,
    },
  ];

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          type: "article",
          url,
          siteName: siteConfig.name,
          title: fullTitle,
          description,
          locale: "en_US",
          images,
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
          authors: [siteConfig.name],
          tags: keywords,
        }
      : {
          type: "website",
          url,
          siteName: siteConfig.name,
          title: fullTitle,
          description,
          locale: "en_US",
          images,
        };

  return {
    title: title
      ? { absolute: fullTitle }
      : { default: siteConfig.title, template: `%s — ${siteConfig.name}` },
    description,
    keywords,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      types: rss,
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : indexRobots,
  };
}
