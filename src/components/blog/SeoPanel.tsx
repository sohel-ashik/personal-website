"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { TagInput } from "./TagInput";

interface SeoPanelProps {
  slug: string;
  postTitle: string;
  postSummary: string;
  seo: { title?: string; description?: string; keywords: string[]; ogImage?: string };
  onChange: (seo: { title?: string; description?: string; keywords: string[]; ogImage?: string }) => void;
}

export function SeoPanel({ slug, postTitle, postSummary, seo, onChange }: SeoPanelProps) {
  const [open, setOpen] = useState(false);

  const effectiveTitle = seo.title || postTitle || "";
  const effectiveDesc = seo.description || postSummary || "";
  const charCount = effectiveDesc.length;
  const descColor = charCount > 160 ? "text-red-400" : charCount > 120 ? "text-amber-400" : "text-emerald-400";

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-elevated)] transition-colors"
      >
        <span className="flex items-center gap-2">
          <Search size={14} className="text-[var(--color-accent)]" />
          SEO &amp; Metadata
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="border-t border-[var(--color-border)] p-4 flex flex-col gap-4">
          {/* Google preview */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-2">Google preview</p>
            <p className="text-blue-400 text-sm font-medium leading-snug truncate">{effectiveTitle || "Post title"}</p>
            <p className="text-green-600 text-xs mt-0.5">sohelashik.com/blog/{slug || "post-slug"}</p>
            <p className="text-[var(--color-muted-foreground)] text-xs mt-1 line-clamp-2">{effectiveDesc || "Post description"}</p>
          </div>

          {/* SEO title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wide">
              SEO title <span className="normal-case font-normal">(defaults to post title)</span>
            </label>
            <input
              type="text"
              value={seo.title ?? ""}
              onChange={(e) => onChange({ ...seo, title: e.target.value || undefined })}
              placeholder={postTitle || "Leave blank to use post title"}
              className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
            />
          </div>

          {/* SEO description */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wide">
                SEO description <span className="normal-case font-normal">(≤ 160 chars)</span>
              </label>
              <span className={`text-[10px] font-mono ${descColor}`}>{charCount}/160</span>
            </div>
            <textarea
              rows={2}
              value={seo.description ?? ""}
              onChange={(e) => onChange({ ...seo, description: e.target.value || undefined })}
              placeholder={postSummary || "Leave blank to use summary"}
              className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
            />
          </div>

          {/* Keywords */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wide">
              Keywords
            </label>
            <TagInput
              tags={seo.keywords}
              onChange={(kw) => onChange({ ...seo, keywords: kw })}
              placeholder="Add keyword…"
            />
          </div>

          {/* OG image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--color-muted-foreground)] uppercase tracking-wide">
              OG image URL <span className="normal-case font-normal">(defaults to auto-generated)</span>
            </label>
            <input
              type="url"
              value={seo.ogImage ?? ""}
              onChange={(e) => onChange({ ...seo, ogImage: e.target.value || undefined })}
              placeholder="https://..."
              className="w-full rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--color-accent)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
