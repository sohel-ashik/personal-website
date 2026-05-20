import { NextResponse } from "next/server";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { siteConfig } from "@/content/seo";
import { profile } from "@/content/profile";

export const revalidate = 3600;

export async function GET() {
  let posts: { title: string; slug: string; summary: string; publishedAt?: Date; tags: string[] }[] = [];

  if (isDBConfigured) {
    try {
      await connectDB();
      posts = await Post.find({ published: true })
        .sort({ publishedAt: -1 })
        .limit(20)
        .select("title slug summary publishedAt tags")
        .lean() as typeof posts;
    } catch {
      // return empty feed
    }
  }

  const baseUrl = siteConfig.url;
  const now = new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = `${baseUrl}/blog/${p.slug}`;
      const pubDate = p.publishedAt ? new Date(p.publishedAt).toUTCString() : now;
      const categories = p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("");
      return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(p.summary)}</description>
      <pubDate>${pubDate}</pubDate>
      ${categories}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(profile.name)} — Writing</title>
    <link>${baseUrl}/blog</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
