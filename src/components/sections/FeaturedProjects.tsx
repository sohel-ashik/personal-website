import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Lock } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getFeaturedProjects } from "@/content/projects";

const categoryColors: Record<string, string> = {
  Automation: "#a78bfa",
  Web: "#34d399",
  Research: "#fb923c",
  App: "#60a5fa",
};

export function FeaturedProjects() {
  const featured = getFeaturedProjects();

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-24 md:py-32 bg-[var(--color-surface)]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-12">
          <Reveal>
            <SectionHeader
              id="projects-heading"
              label="Projects"
              title="Selected work"
              description="A few things I&apos;ve built — from compliance automation to open-source apps."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/projects"
              className="hidden md:flex items-center gap-1.5 text-sm text-[var(--color-accent)] hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>

        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {featured.map((project) => (
            <RevealItem key={project.slug}>
              <Link href={`/projects/${project.slug}`} className="group block">
                <article className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:shadow-lg hover:shadow-[var(--color-accent-glow)] hover:-translate-y-1">
                  {/* Cover image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.cover}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)]/60 to-transparent" />

                    {/* Category pill */}
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

                    {/* Proprietary badge */}
                    {project.proprietary && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/80 px-2.5 py-0.5 text-xs text-[var(--color-muted-foreground)] backdrop-blur-sm">
                          <Lock size={10} />
                          Proprietary
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-xs text-[var(--color-muted)] font-mono flex-shrink-0">{project.year}</span>
                    </div>

                    <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.slice(0, 4).map((tech) => (
                        <Pill key={tech}>{tech}</Pill>
                      ))}
                      {project.stack.length > 4 && (
                        <span className="text-xs text-[var(--color-muted)] self-center">
                          +{project.stack.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2} className="mt-10 flex justify-center md:hidden">
          <Link
            href="/projects"
            className="flex items-center gap-1.5 text-sm text-[var(--color-accent)] hover:underline"
          >
            View all projects <ArrowRight size={14} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
