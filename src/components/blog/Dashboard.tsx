"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, LogOut, Clock, BarChart2 } from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import type { PostData } from "@/lib/models/Post";

interface DashboardProps {
  posts: PostData[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function Dashboard({ posts: initialPosts }: DashboardProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<PostData[]>(initialPosts);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch("/api/blog/auth", { method: "DELETE" });
    router.refresh();
  };

  const handlePublishToggle = async (post: PostData) => {
    setTogglingSlug(post.slug);
    try {
      const res = await fetch(`/api/blog/posts/${post.slug}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      if (res.ok) {
        const updated = await res.json() as PostData;
        setPosts((prev) => prev.map((p) => (p.slug === post.slug ? updated : p)));
      }
    } finally {
      setTogglingSlug(null);
    }
  };

  const handleDelete = async (post: PostData) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeletingSlug(post.slug);
    try {
      const res = await fetch(`/api/blog/posts/${post.slug}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== post.slug));
      }
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] mb-1">Admin</p>
            <h1 className="text-2xl font-bold tracking-tight">Your Posts</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              <LogOut size={13} /> Log out
            </button>
            <Link
              href="/blog/write/ashik/new"
              className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <Plus size={15} /> New post
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: posts.length },
            { label: "Published", value: posts.filter((p) => p.published).length },
            { label: "Drafts", value: posts.filter((p) => !p.published).length },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
              <p className="text-2xl font-bold text-[var(--color-accent)]">{s.value}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center rounded-2xl border border-dashed border-[var(--color-border)]">
            <p className="text-[var(--color-muted-foreground)] text-sm">No posts yet.</p>
            <Link
              href="/blog/write/ashik/new"
              className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:underline"
            >
              <Plus size={14} /> Write your first post
            </Link>
          </div>
        )}

        {/* Posts list */}
        {posts.length > 0 && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
            <div className="divide-y divide-[var(--color-border)]">
              {posts.map((post) => (
                <div key={post.slug} className="flex items-start gap-4 p-5 hover:bg-[var(--color-surface-elevated)] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-medium text-[var(--color-foreground)] truncate">{post.title}</h2>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${post.published ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-1 mb-2">{post.summary}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)]">
                      <span className="flex items-center gap-1"><Clock size={10} /> {formatDate(post.updatedAt)}</span>
                      <span className="flex items-center gap-1"><BarChart2 size={10} /> {post.views} views</span>
                      {post.tags.slice(0, 2).map((t) => <Pill key={t} className="text-[9px] py-0">{t}</Pill>)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link
                      href={`/blog/write/ashik/edit/${post.slug}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent)] transition-all"
                      title="Edit"
                    >
                      <Edit2 size={13} />
                    </Link>

                    <button
                      onClick={() => handlePublishToggle(post)}
                      disabled={togglingSlug === post.slug}
                      title={post.published ? "Unpublish" : "Publish"}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent)] transition-all disabled:opacity-50"
                    >
                      {post.published ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>

                    <button
                      onClick={() => handleDelete(post)}
                      disabled={deletingSlug === post.slug}
                      title="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-red-400 hover:border-red-500/40 transition-all disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
