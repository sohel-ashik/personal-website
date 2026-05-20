import { GraduationCap, CalendarDays } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { education } from "@/content/profile";

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="py-24 md:py-32 bg-[var(--color-surface)]"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeader
            id="education-heading"
            label="Education"
            title="Academic background"
          />
        </Reveal>

        <RevealGroup className="mt-4 flex flex-col gap-4 max-w-2xl">
          {education.map((edu, i) => (
            <RevealItem key={i}>
              <div className="flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 transition-all hover:border-[var(--color-accent)]/30">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-accent)]">
                  <GraduationCap size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-[var(--color-foreground)]">{edu.degree}</h3>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        {edu.institute}
                        {edu.location && ` · ${edu.location}`}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[var(--color-muted)] flex items-center gap-1 whitespace-nowrap">
                      <CalendarDays size={11} />
                      {edu.duration}
                    </span>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
