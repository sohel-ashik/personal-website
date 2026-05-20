// TODO: implement MDX-powered blog (see future plan)

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PenLine } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { BlogNotifyForm } from "@/components/sections/BlogNotifyForm";

export const metadata: Metadata = buildMetadata({
  title: "Writing",
  description:
    "Articles and notes by Sohel Siddique Ashik on backend engineering, compliance automation, AWS, and DSA — coming soon.",
  path: "/blog",
});

const topics = [
  "Backend architecture & Node.js patterns",
  "Compliance automation — how I built it",
  "AWS services in production (AppSync, Lambda, DynamoDB)",
  "DSA problem-solving breakdowns",
  "TypeScript tips from real projects",
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft size={14} /> Back home
          </Link>
        </div>

        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
            <PenLine size={28} className="text-[var(--color-accent)]" />
          </div>

          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
            Writing
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl mb-4">
            Coming soon.
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] max-w-md mx-auto leading-relaxed">
            I&apos;m working on articles covering things I care about in engineering.
            Subscribe to get notified when the first post is live.
          </p>
        </div>

        {/* Topic teaser */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-10">
          <h2 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">
            Topics I&apos;ll be writing about
          </h2>
          <ul className="space-y-2.5">
            {topics.map((topic) => (
              <li key={topic} className="flex items-center gap-2.5 text-sm text-[var(--color-muted-foreground)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" aria-hidden="true" />
                {topic}
              </li>
            ))}
          </ul>
        </div>

        {/* Notify form */}
        <BlogNotifyForm />
      </div>
    </div>
  );
}
