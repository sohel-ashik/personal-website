import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock, ExternalLink, Calendar, User } from "lucide-react";
import { projects, getProjectBySlug } from "@/content/projects";
import { Pill } from "@/components/ui/Pill";
import { buildMetadata } from "@/lib/metadata";
import { creativeWorkJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { siteConfig } from "@/content/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${slug}`,
    image: `${siteConfig.url}/projects/${slug}/opengraph-image`,
    keywords: project.stack,
  });
}

const categoryColors: Record<string, string> = {
  Automation: "#a78bfa",
  Web: "#34d399",
  Research: "#fb923c",
  App: "#60a5fa",
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd(project)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", href: "/" },
              { name: "Projects", href: "/projects" },
              { name: project.title, href: `/projects/${project.slug}` },
            ])
          ),
        }}
      />

      <div className="mx-auto max-w-4xl px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
          <Link href="/" className="hover:text-[var(--color-foreground)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/projects" className="hover:text-[var(--color-foreground)] transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">{project.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
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
            {project.proprietary && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] px-2.5 py-0.5 text-xs text-[var(--color-muted-foreground)]">
                <Lock size={10} /> Proprietary
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">{project.title}</h1>
          <p className="text-lg text-[var(--color-muted-foreground)] leading-relaxed mb-6">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted-foreground)]">
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-[var(--color-accent)]" />
              {project.role}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[var(--color-accent)]" />
              {project.year}
            </div>
          </div>
        </header>

        {/* Cover */}
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-xl border border-[var(--color-border)]">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr]">
          {/* Main content */}
          <article>
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <div className="space-y-4">
              {project.description.split("\n\n").map((para, i) => (
                <p key={i} className="text-[var(--color-muted-foreground)] leading-relaxed">
                  {para.trim()}
                </p>
              ))}
            </div>

            {project.highlights.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Key Highlights</h2>
                <ul className="space-y-3">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2.5 text-[var(--color-muted-foreground)]">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Stack */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-3">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <Pill key={tech}>{tech}</Pill>
                ))}
              </div>
            </div>

            {/* Links */}
            {project.links.length > 0 && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-3">
                  Links
                </h3>
                <div className="flex flex-col gap-2">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] hover:underline"
                    >
                      <ExternalLink size={13} />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {project.proprietary && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
                <div className="flex items-center gap-2 text-[var(--color-muted-foreground)] text-sm">
                  <Lock size={14} />
                  <span>This project is proprietary and not publicly accessible.</span>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex justify-between">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft size={14} /> All projects
          </Link>
        </div>
      </div>
    </div>
  );
}
