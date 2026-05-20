"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

// ─── Copy button for code blocks ─────────────────────────────────────────────

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-400 transition-all hover:bg-white/10 hover:text-zinc-200"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ─── Custom code renderer ─────────────────────────────────────────────────────

function CodeBlock({
  inline,
  className,
  children,
}: {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const code = String(children ?? "").replace(/\n$/, "");
  const lang = className?.replace(/^language-/, "") ?? "";

  if (inline) {
    return (
      <code className="rounded-md border border-[var(--color-border)] bg-[var(--color-accent)]/10 px-1.5 py-0.5 font-mono text-[0.875em] text-[var(--color-accent)]">
        {children}
      </code>
    );
  }

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1e1e2e]">
      {lang && (
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-4 py-2">
          <span className="font-mono text-xs text-zinc-500">{lang}</span>
        </div>
      )}
      <CopyButton code={code} />
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className={`font-mono text-sm ${className ?? ""}`}>{children}</code>
      </pre>
    </div>
  );
}

// ─── Callout renderer (GFM blockquote with [!NOTE] / [!WARNING] / [!TIP]) ─────

const calloutMap: Record<string, { label: string; color: string; bg: string; border: string }> = {
  NOTE:    { label: "Note",    color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/30" },
  TIP:     { label: "Tip",     color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/30" },
  WARNING: { label: "Warning", color: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/30" },
  IMPORTANT:{ label: "Important", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" },
  CAUTION: { label: "Caution", color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/30" },
};

function Blockquote({ children }: { children?: ReactNode }) {
  const text = extractText(children);
  const match = text.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/i);

  if (match) {
    const type = match[1].toUpperCase();
    const meta = calloutMap[type];
    if (meta) {
      return (
        <div className={`my-6 rounded-xl border ${meta.border} ${meta.bg} p-4`}>
          <p className={`mb-2 text-xs font-bold uppercase tracking-wider ${meta.color}`}>
            {meta.label}
          </p>
          <div className="text-sm text-[var(--color-muted-foreground)] [&>p]:mb-0 [&>p]:leading-relaxed">
            {children}
          </div>
        </div>
      );
    }
  }

  return (
    <blockquote className="my-6 border-l-4 border-[var(--color-accent)]/50 pl-4 italic text-[var(--color-muted-foreground)]">
      {children}
    </blockquote>
  );
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in (node as object)) {
    const el = node as React.ReactElement<{ children?: ReactNode }>;
    return extractText(el.props?.children);
  }
  return "";
}

// ─── Main component ───────────────────────────────────────────────────────────

interface MarkdownContentProps {
  source: string;
  className?: string;
}

export function MarkdownContent({ source, className }: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks + inline code
          code: CodeBlock as React.ComponentType<React.ComponentPropsWithoutRef<"code"> & { inline?: boolean }>,

          // Blockquotes / callouts
          blockquote: Blockquote as React.ComponentType<React.ComponentPropsWithoutRef<"blockquote">>,

          // Headings — with anchor IDs for TOC
          h2: ({ children, ...props }) => {
            const id = slugifyHeading(String(children));
            return <h2 id={id} className="group relative mt-10 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight" {...props}>{children}<AnchorLink id={id} /></h2>;
          },
          h3: ({ children, ...props }) => {
            const id = slugifyHeading(String(children));
            return <h3 id={id} className="group relative mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight" {...props}>{children}<AnchorLink id={id} /></h3>;
          },
          h4: ({ children, ...props }) => <h4 className="mt-6 mb-2 text-lg font-semibold" {...props}>{children}</h4>,

          // Paragraphs — use div instead of p so block-level children
          // (code blocks, callouts) don't cause invalid HTML nesting
          p: ({ children }) => (
            <div className="mb-5 leading-[1.85] text-[var(--color-muted-foreground)]">
              {children}
            </div>
          ),

          // Lists
          ul: ({ children, ...props }) => (
            <ul className="mb-5 space-y-1.5 pl-6 [&>li]:relative [&>li]:before:absolute [&>li]:before:-left-3 [&>li]:before:top-[0.6em] [&>li]:before:h-1.5 [&>li]:before:w-1.5 [&>li]:before:rounded-full [&>li]:before:bg-[var(--color-accent)]" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="mb-5 list-decimal space-y-1.5 pl-6 text-[var(--color-muted-foreground)]" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-[var(--color-muted-foreground)] leading-relaxed" {...props}>{children}</li>
          ),

          // Links
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-[var(--color-accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
              {...props}
            >
              {children}
            </a>
          ),

          // Tables
          table: ({ children, ...props }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-[var(--color-border)]">
              <table className="w-full text-sm" {...props}>{children}</table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-[var(--color-surface)] font-mono text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]" {...props}>
              {children}
            </thead>
          ),
          tr: ({ children, ...props }) => (
            <tr className="border-b border-[var(--color-border)] even:bg-[var(--color-surface-elevated)] transition-colors hover:bg-[var(--color-surface-elevated)]" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => <th className="px-4 py-3 text-left font-semibold" {...props}>{children}</th>,
          td: ({ children, ...props }) => <td className="px-4 py-3 text-[var(--color-muted-foreground)]" {...props}>{children}</td>,

          // HR
          hr: () => <hr className="my-10 border-[var(--color-border)]" />,

          // Strong / Em
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-[var(--color-foreground)]" {...props}>{children}</strong>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function AnchorLink({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      className="ml-2 opacity-0 transition-opacity group-hover:opacity-60 text-[var(--color-muted)] hover:text-[var(--color-accent)] no-underline"
      aria-hidden="true"
    >
      #
    </a>
  );
}
