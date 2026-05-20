import Image from "next/image";
import { MapPin, Download } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { profile } from "@/content/profile";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* Image column */}
          <Reveal delay={0.1}>
            <div className="relative mx-auto max-w-sm lg:mx-0">
              {/* Decorative border */}
              <div className="absolute -inset-4 rounded-2xl border border-[var(--color-accent)]/20" aria-hidden="true" />
              <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] aspect-[4/5]">
                <Image
                  src="/images/avatar.jpg"
                  alt="Sohel Siddique Ashik"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay badge */}
                <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]/80 px-3 py-2 backdrop-blur-xl">
                  <p className="text-xs text-[var(--color-muted-foreground)]">Currently at</p>
                  <p className="text-sm font-semibold text-[var(--color-accent)]">Nyntax · Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Content column */}
          <div className="flex flex-col gap-6">
            <Reveal delay={0}>
              <SectionHeader
                id="about-heading"
                label="About me"
                title="Building backends that scale, automate, and endure."
              />
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                I&apos;m a backend-focused Software Engineer with a BSc in CSE from Daffodil International University.
                I currently work at <span className="text-[var(--color-foreground)] font-medium">Nyntax</span>, where I
                build compliance automation systems that serve Y Combinator-backed startups — turning weeks of manual audit
                work into hours of automated evidence collection.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                My core stack is <span className="text-[var(--color-foreground)] font-medium">Node.js · TypeScript · Express · MongoDB</span> on
                the backend, with strong experience across AWS-managed services (AppSync, Lambda, DynamoDB, S3, Cognito)
                and browser automation via Puppeteer and CUA.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                I&apos;m passionate about algorithms and problem-solving — I&apos;ve worked through 400+ competitive programming
                problems and published an NLP research paper on fake news detection. I care deeply about writing
                reliable, clean backend systems that teams can trust long-term.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
                  <MapPin size={14} className="text-[var(--color-accent)]" />
                  {profile.location}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="flex gap-3 pt-2">
                <Button variant="primary" size="md" href={profile.resumeUrl} download="Sohel_Siddique_Ashik_CV.pdf">
                  <Download size={15} />
                  Download CV
                </Button>
                <Button variant="outline" size="md" href="/#contact">
                  Contact me
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
