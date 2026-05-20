"use client";

import { useEffect, useState } from "react";

interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

function extractToc(markdown: string): TocEntry[] {
  const lines = markdown.split("\n");
  const entries: TocEntry[] = [];
  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      const text = h2[1].replace(/\*\*/g, "").trim();
      entries.push({ id: slugify(text), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/\*\*/g, "").trim();
      entries.push({ id: slugify(text), text, level: 3 });
    }
  }
  return entries;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const toc = extractToc(content);

  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );
    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="hidden xl:block">
      <div className="sticky top-28 w-56">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          On this page
        </p>
        <ul className="space-y-1.5">
          {toc.map((entry) => (
            <li key={entry.id} style={{ paddingLeft: entry.level === 3 ? "0.75rem" : "0" }}>
              <a
                href={`#${entry.id}`}
                className={`block text-sm transition-colors hover:text-[var(--color-foreground)] leading-snug ${
                  activeId === entry.id
                    ? "text-[var(--color-accent)] font-medium"
                    : "text-[var(--color-muted-foreground)]"
                }`}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
