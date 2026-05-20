import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Lock, ArrowLeft } from "lucide-react";
import { projects } from "@/content/projects";
import { Pill } from "@/components/ui/Pill";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "All projects by Sohel Siddique Ashik — compliance automation, web apps, research, and more.",
  path: "/projects",
});

const categoryColors: Record<string, string> = {
  Automation: "#a78bfa",
  Web: "#34d399",
  Research: "#fb923c",
  App: "#60a5fa",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft size={14} /> Back home
          </Link>
        </div>

        <div className="mb-12">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
            All Projects
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Things I&apos;ve built
          </h1>
          <p className="mt-3 text-[var(--color-muted-foreground)] max-w-xl">
            From compliance automation platforms to NLP research — a full catalogue of my work.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <article className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] h-full transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:shadow-lg hover:shadow-[var(--color-accent-glow)] hover:-translate-y-1">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.cover}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)]/60 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: categoryColors[project.category] + "22",
                        color: categoryColors[project.category],
                        border: `1px solid ${categoryColors[project.category]}44`,
                      }}
                    >
                      {project.category}
                    </span>
                  </div>

                  {project.proprietary && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/80 px-2.5 py-0.5 text-xs text-[var(--color-muted-foreground)] backdrop-blur-sm">
                        <Lock size={10} /> Proprietary
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors text-sm leading-tight">
                      {project.title}
                    </h2>
                    <span className="text-xs text-[var(--color-muted)] font-mono flex-shrink-0">{project.year}</span>
                  </div>

                  <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {project.stack.slice(0, 3).map((tech) => (
                      <Pill key={tech} className="text-[10px]">{tech}</Pill>
                    ))}
                    {project.stack.length > 3 && (
                      <span className="text-[10px] text-[var(--color-muted)] self-center">
                        +{project.stack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
