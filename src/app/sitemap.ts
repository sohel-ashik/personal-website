import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/seo";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Post } from "@/lib/models/Post";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/resume`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  let blogRoutes: MetadataRoute.Sitemap = [];
  if (isDBConfigured) {
    try {
      await connectDB();
      const posts = await Post.find({ published: true })
        .select("slug updatedAt")
        .lean();
      blogRoutes = posts.map((p) => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: new Date(p.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    } catch {
      // DB unavailable — no blog routes in sitemap
    }
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
