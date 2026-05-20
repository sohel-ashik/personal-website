// TODO: implement MDX-powered blog (see future plan)

import type { Metadata } from "next";
import Link from "next/link";
import { Rss, PenLine } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { connectDB, isDBConfigured } from "@/lib/db";
import { Post } from "@/lib/models/Post";
import { serializePost } from "@/lib/models/Post";
import { PostCard } from "@/components/blog/PostCard";
import type { PostData } from "@/lib/models/Post";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Writing",
  description:
    "Articles by Sohel Siddique Ashik on backend engineering, compliance automation, AWS, and problem-solving.",
  path: "/blog",
});

async function getPosts(): Promise<PostData[]> {
  if (!isDBConfigured) return [];
  try {
    await connectDB();
    const posts = await Post.find({ published: true })
      .sort({ publishedAt: -1 })
      .select("-content")
      .lean();
    return posts.map((p) => serializePost(p as Parameters<typeof serializePost>[0]));
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
              Writing
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {posts.length > 0 ? "Articles" : "Writing — coming soon."}
            </h1>
            {posts.length > 0 && (
              <p className="mt-3 text-[var(--color-muted-foreground)]">
                Thoughts on engineering, systems, and things I&apos;ve figured out along the way.
              </p>
            )}
          </div>
          <a
            href="/blog/rss.xml"
            aria-label="RSS feed"
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted-foreground)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
          >
            <Rss size={13} /> RSS
          </a>
        </div>

        {posts.length === 0 ? (
          /* Empty / coming-soon state */
          <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
              <PenLine size={28} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-lg font-semibold text-[var(--color-foreground)] mb-2">No posts yet</p>
              <p className="text-[var(--color-muted-foreground)] max-w-sm">
                I&apos;m working on articles covering backend engineering, compliance automation, AWS, and DSA.
                Check back soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
