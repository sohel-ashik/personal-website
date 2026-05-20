import type { Metadata } from "next";
import Link from "next/link";
import { Download, ArrowLeft, MapPin, Mail, Phone } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { buildMetadata } from "@/lib/metadata";
import { profile, experience, education, skills } from "@/content/profile";

export const metadata: Metadata = buildMetadata({
  title: "Resume",
  description:
    "Resume of Sohel Siddique Ashik — Software Engineer specialising in Node.js, TypeScript, compliance automation, and AWS.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        {/* Back link + download */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            <ArrowLeft size={14} /> Back home
          </Link>
          <a
            href="/resume.pdf"
            download="Sohel_Siddique_Ashik_CV.pdf"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <Download size={15} />
            Download PDF
          </a>
        </div>

        {/* Semantic CV for SEO */}
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-12 mb-10">
          {/* Header */}
          <header className="border-b border-[var(--color-border)] pb-8 mb-8">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-1">{profile.name}</h1>
            <p className="text-lg text-[var(--color-accent)] mb-4">{profile.role}</p>

            <address className="not-italic flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--color-muted-foreground)]">
              <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-[var(--color-foreground)]">
                <Mail size={13} /> {profile.email}
              </a>
              <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 hover:text-[var(--color-foreground)]">
                <Phone size={13} /> {profile.phone}
              </a>
              <span className="flex items-center gap-1.5">
                <MapPin size={13} /> {profile.location}
              </span>
              <a href={profile.socials.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[var(--color-foreground)]">
                <GitHubIcon size={13} /> github.com/sohel-ashik
              </a>
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[var(--color-foreground)]">
                <LinkedInIcon size={13} /> linkedin.com/in/sohel-ashik
              </a>
            </address>
          </header>

          {/* Profile summary */}
          <section className="mb-8" aria-labelledby="cv-profile">
            <h2 id="cv-profile" className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">
              Profile
            </h2>
            <p className="text-[var(--color-muted-foreground)] leading-relaxed">
              Backend-focused Software Engineer with a CSE degree (DIU) and strong experience in Node.js/TypeScript,
              API development (REST/GraphQL), and AWS-managed services (AppSync, Lambda, DynamoDB, S3, Cognito).
              At Nyntax, builds compliance automation by integrating APIs and using browser automation (Puppeteer/CUA)
              to deliver accurate, scalable evidence collection and control testing. Strong problem-solver (350+
              problems solved) with solid DSA fundamentals and a focus on clean, reliable backend systems.
            </p>
          </section>

          {/* Experience */}
          <section className="mb-8" aria-labelledby="cv-experience">
            <h2 id="cv-experience" className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-5">
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((job) => (
                <div key={job.company}>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="font-semibold text-[var(--color-foreground)]">{job.role}</h3>
                      <p className="text-sm text-[var(--color-accent)]">
                        {job.company} · {job.location}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[var(--color-muted)]">
                      {job.start} — {job.end}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-1.5">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[var(--color-muted-foreground)]">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-[var(--color-muted)]">
                    {job.stack.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section className="mb-8" aria-labelledby="cv-skills">
            <h2 id="cv-skills" className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-4">
              Skills
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(skills).map(([key, items]) => (
                <div key={key}>
                  <span className="text-xs font-medium text-[var(--color-muted-foreground)] capitalize">{key}: </span>
                  <span className="text-xs text-[var(--color-foreground)]">{items.join(", ")}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section aria-labelledby="cv-education">
            <h2 id="cv-education" className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-4">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i} className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-[var(--color-foreground)] text-sm">{edu.degree}</h3>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {edu.institute} · {edu.location}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[var(--color-muted)]">{edu.duration}</span>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* PDF embed */}
        <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="bg-[var(--color-surface)] px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
            <span className="text-sm text-[var(--color-muted-foreground)]">Resume PDF</span>
            <a
              href="/resume.pdf"
              download="Sohel_Siddique_Ashik_CV.pdf"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-accent)] hover:underline"
            >
              <Download size={12} /> Download
            </a>
          </div>
          <iframe
            src="/resume.pdf"
            title="Sohel Siddique Ashik Resume"
            className="w-full"
            style={{ height: "80vh", minHeight: 600 }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}
