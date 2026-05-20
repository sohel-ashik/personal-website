import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, ArrowLeft, Eye } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Post, serializePost } from "@/lib/models/Post";
import { siteConfig } from "@/content/seo";
import { profile } from "@/content/profile";
import { Pill } from "@/components/ui/Pill";
import { MarkdownContent } from "@/lib/markdown";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { BlogViewTracker } from "@/components/blog/BlogViewTracker";
import type { PostData } from "@/lib/models/Post";

function isValidUrl(src: string): boolean {
  if (src.startsWith("/")) return true;
  try { new URL(src); return true; } catch { return false; }
}

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

async function getPost(slug: string): Promise<PostData | null> {
  if (!isDBConfigured) return null;
  try {
    await connectDB();
    const post = await Post.findOne({ slug, published: true });
    if (!post) return null;
    return serializePost(post);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.seo.title || post.title;
  const description = post.seo.description || post.summary;
  const ogImage = post.seo.ogImage || `${siteConfig.url}/blog/${slug}/opengraph-image`;

  return buildMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    image: ogImage,
    keywords: post.seo.keywords.length ? post.seo.keywords : post.tags,
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seo.title || post.title,
    description: post.seo.description || post.summary,
    author: { "@type": "Person", name: profile.name, url: siteConfig.url },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    keywords: post.tags.join(", "),
    image: post.seo.ogImage || post.coverImage || `${siteConfig.url}/blog/${slug}/opengraph-image`,
    url: `${siteConfig.url}/blog/${slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteConfig.url}/blog/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <BlogViewTracker slug={slug} />
      <div className="mx-auto max-w-6xl px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
          <Link href="/" className="hover:text-[var(--color-foreground)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[var(--color-foreground)] transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)] truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Layout: article + TOC sidebar */}
        <div className="flex gap-16 items-start">
          {/* Main content */}
          <article className="min-w-0 flex-1 max-w-[720px]">
            {/* Header */}
            <header className="mb-8">
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <Pill key={tag}>{tag}</Pill>
                  ))}
                </div>
              )}

              <h1 className="text-3xl font-bold tracking-tight leading-tight md:text-4xl mb-4">
                {post.title}
              </h1>
              <p className="text-lg text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                {post.summary}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
                {publishDate && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {publishDate}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {post.readingTimeMinutes} min read
                </span>
                {post.views > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} />
                    {post.views.toLocaleString()} views
                  </span>
                )}
              </div>
            </header>

        {/* Cover image */}
        {post.coverImage && isValidUrl(post.coverImage) && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl border border-[var(--color-border)]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 720px"
            />
          </div>
        )}

            {/* Divider */}
            <div className="mb-10 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

            {/* Body */}
            <MarkdownContent source={post.content} />

            {/* Footer CTA */}
            <div className="mt-16 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
              <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
                Found this useful? Have thoughts or questions?
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                Reach out →
              </Link>
            </div>

            {/* Back link */}
            <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
              >
                <ArrowLeft size={14} /> All posts
              </Link>
            </div>
          </article>

          {/* TOC */}
          <TableOfContents content={post.content} />
        </div>
      </div>
    </div>
  );
}
