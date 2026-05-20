import type { Metadata } from "next";
import { siteConfig } from "@/content/seo";

interface BuildMetadataInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "",
  image,
  keywords = siteConfig.keywords,
  noIndex = false,
}: BuildMetadataInput = {}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? `${siteConfig.url}/opengraph-image`;
  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title;

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
    },
    openGraph: {
      type: "website",
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large" },
        },
  };
}
