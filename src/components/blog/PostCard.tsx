import Link from "next/link";

function isValidImageSrc(src?: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try { new URL(src); return true; } catch { return false; }
}
import Image from "next/image";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { Pill } from "@/components/ui/Pill";
import type { PostData } from "@/lib/models/Post";

interface PostCardProps {
  post: PostData;
}

export function PostCard({ post }: PostCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="h-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-accent-glow)]">
        {/* Cover image — only render if src is a valid absolute URL or /path */}
        {isValidImageSrc(post.coverImage) && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.coverImage!}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/60 to-transparent" />
          </div>
        )}

        <div className="p-6">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <Pill key={tag} className="text-[10px]">{tag}</Pill>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="mb-2 text-lg font-semibold leading-snug tracking-tight text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
            {post.title}
          </h2>

          {/* Summary */}
          <p className="mb-4 text-sm leading-relaxed text-[var(--color-muted-foreground)] line-clamp-2">
            {post.summary}
          </p>

          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
            <div className="flex items-center gap-3">
              {date && (
                <span className="flex items-center gap-1">
                  <CalendarDays size={11} />
                  {date}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {post.readingTimeMinutes} min read
              </span>
            </div>
            <span className="flex items-center gap-1 text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
              Read <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
