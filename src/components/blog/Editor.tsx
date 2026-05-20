"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, EyeOff, Loader2, ArrowLeft, Trash2, Globe } from "lucide-react";
import { MarkdownContent } from "@/lib/markdown";
import { MarkdownToolbar } from "./MarkdownToolbar";
import { TagInput } from "./TagInput";
import { SeoPanel } from "./SeoPanel";
import { slugify } from "@/lib/slugify";
import type { PostData } from "@/lib/models/Post";

interface EditorProps {
  mode: "create" | "edit";
  initialData?: PostData;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_KEY = "blog_editor_draft";

export function Editor({ mode, initialData }: EditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugManual, setSlugManual] = useState(mode === "edit");
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [seo, setSeo] = useState<{ title?: string; description?: string; keywords: string[]; ogImage?: string }>(
    initialData?.seo ?? { keywords: [] }
  );
  const [preview, setPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [saveMsg, setSaveMsg] = useState("");
  const [isPublished, setIsPublished] = useState(initialData?.published ?? false);

  // Auto-generate slug from title in create mode
  useEffect(() => {
    if (!slugManual && mode === "create") {
      setSlug(slugify(title));
    }
  }, [title, slugManual, mode]);

  // Autosave to localStorage every 30s
  useEffect(() => {
    if (mode !== "create") return;
    const key = `${AUTOSAVE_KEY}_${slug || "new"}`;
    const interval = setInterval(() => {
      localStorage.setItem(key, JSON.stringify({ title, slug, summary, content, tags, coverImage, seo }));
    }, 30_000);
    return () => clearInterval(interval);
  }, [title, slug, summary, content, tags, coverImage, seo, mode]);

  // Restore autosave on mount (create mode only)
  useEffect(() => {
    if (mode !== "create" || title || content) return;
    const saved = localStorage.getItem(`${AUTOSAVE_KEY}_new`);
    if (saved) {
      try {
        const data = JSON.parse(saved) as typeof initialData;
        if (data) {
          setTitle(data.title ?? "");
          setSlug(data.slug ?? "");
          setSummary(data.summary ?? "");
          setContent(data.content ?? "");
          setTags(data.tags ?? []);
          setCoverImage(data.coverImage ?? "");
          setSeo(data.seo ?? { keywords: [] });
          setSaveMsg("Draft restored from autosave");
          setTimeout(() => setSaveMsg(""), 3000);
        }
      } catch {
        // ignore
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Insert text at cursor in textarea
  const handleInsert = useCallback((text: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((c) => c + text);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newContent = el.value.slice(0, start) + text + el.value.slice(end);
    setContent(newContent);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  }, []);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingMins = Math.max(1, Math.round(wordCount / 200));

  const save = async (publish?: boolean) => {
    if (!title.trim() || !summary.trim() || !content.trim()) {
      setSaveStatus("error");
      setSaveMsg("Title, summary, and content are required.");
      return;
    }
    setSaveStatus("saving");

    const body = { title, slug, summary, content, tags, coverImage: coverImage || undefined, seo, publish };

    try {
      let res: Response;
      if (mode === "create") {
        res = await fetch("/api/blog/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/blog/posts/${initialData!.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        const data = await res.json() as PostData;
        setSaveStatus("saved");
        setSaveMsg("Saved");
        setIsPublished(data.published);
        if (mode === "create") {
          localStorage.removeItem(`${AUTOSAVE_KEY}_new`);
          router.replace(`/blog/write/ashik/edit/${data.slug}`);
        }
      } else {
        const err = await res.json() as { error?: string };
        setSaveStatus("error");
        setSaveMsg(err.error ?? "Save failed.");
      }
    } catch {
      setSaveStatus("error");
      setSaveMsg("Network error.");
    }

    setTimeout(() => { setSaveStatus("idle"); setSaveMsg(""); }, 3000);
  };

  const handlePublishToggle = async () => {
    if (mode === "create") { await save(true); return; }
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/blog/posts/${initialData!.slug}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !isPublished }),
      });
      if (res.ok) {
        const data = await res.json() as PostData;
        setIsPublished(data.published);
        setSaveStatus("saved");
        setSaveMsg(data.published ? "Published" : "Unpublished");
      }
    } catch {
      setSaveStatus("error");
      setSaveMsg("Failed.");
    }
    setTimeout(() => { setSaveStatus("idle"); setSaveMsg(""); }, 3000);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`/api/blog/posts/${initialData!.slug}`, { method: "DELETE" });
    router.push("/blog/write/ashik");
  };

  const inputClass = "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] placeholder:text-[var(--color-muted)]";

  return (
    <div className="min-h-screen pt-20 pb-16 px-6">
      <div className="mx-auto max-w-6xl">

        {/* Top bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/blog/write/ashik")} className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
              <ArrowLeft size={14} /> Dashboard
            </button>
            <span className="text-[var(--color-border)]">/</span>
            <span className="text-sm text-[var(--color-foreground)]">{mode === "create" ? "New post" : "Edit post"}</span>
          </div>

          <div className="flex items-center gap-2">
            {saveMsg && (
              <span className={`text-xs ${saveStatus === "error" ? "text-red-400" : "text-emerald-400"}`}>
                {saveMsg}
              </span>
            )}

            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
            >
              {preview ? <><EyeOff size={13} /> Edit</> : <><Eye size={13} /> Preview</>}
            </button>

            <button
              type="button"
              onClick={() => save()}
              disabled={saveStatus === "saving"}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] disabled:opacity-50 transition-colors"
            >
              {saveStatus === "saving" ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              Save draft
            </button>

            <button
              type="button"
              onClick={handlePublishToggle}
              disabled={saveStatus === "saving"}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-opacity disabled:opacity-50 ${isPublished ? "border border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" : "bg-[var(--color-accent)] text-white hover:opacity-90"}`}
            >
              <Globe size={13} />
              {isPublished ? "Unpublish" : "Publish"}
            </button>

            {mode === "edit" && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title…"
          className="mb-4 w-full border-none bg-transparent text-3xl font-bold tracking-tight placeholder:text-[var(--color-muted)] outline-none"
        />

        {/* Meta strip */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlugManual(true); setSlug(slugify(e.target.value)); }}
              placeholder="url-slug"
              className={inputClass + " font-mono text-xs"}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">Cover image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">Tags</label>
          <TagInput tags={tags} onChange={setTags} />
        </div>

        <div className="mb-4 flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">Summary <span className="normal-case font-normal">(shown on cards and as meta description fallback)</span></label>
          <textarea
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="One sentence describing this post…"
            className={inputClass + " resize-none"}
          />
        </div>

        {/* SEO panel */}
        <div className="mb-6">
          <SeoPanel slug={slug} postTitle={title} postSummary={summary} seo={seo} onChange={setSeo} />
        </div>

        {/* Editor / Preview */}
        {preview ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 min-h-[600px]">
            {content ? (
              <MarkdownContent source={content} />
            ) : (
              <p className="text-[var(--color-muted)] text-sm italic">Nothing to preview yet — start writing!</p>
            )}
          </div>
        ) : (
          <div>
            <MarkdownToolbar textareaRef={textareaRef} onInsert={handleInsert} />
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Start writing in markdown…\n\n# Heading 1\n\n## Heading 2\n\nYour content here.`}
              className="w-full resize-none rounded-b-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 font-mono text-sm leading-relaxed outline-none transition-colors focus:border-[var(--color-accent)] min-h-[600px] placeholder:text-[var(--color-muted)]"
              spellCheck={false}
            />
          </div>
        )}

        {/* Footer stats */}
        <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-muted)]">
          <span>{wordCount} words</span>
          <span>~{readingMins} min read</span>
          <span className={isPublished ? "text-emerald-400" : "text-zinc-500"}>
            {isPublished ? "● Published" : "○ Draft"}
          </span>
        </div>
      </div>
    </div>
  );
}
