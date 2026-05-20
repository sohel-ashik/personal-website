import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { skills } from "@/content/profile";

const skillGroups = [
  {
    label: "Languages",
    items: skills.languages,
    dotColor: "#a78bfa",
  },
  {
    label: "Backend",
    items: skills.backend,
    dotColor: "#34d399",
  },
  {
    label: "Frontend",
    items: skills.frontend,
    dotColor: "#60a5fa",
  },
  {
    label: "Databases",
    items: skills.databases,
    dotColor: "#fb923c",
  },
  {
    label: "Cloud & AWS",
    items: skills.cloud,
    dotColor: "#f59e0b",
  },
  {
    label: "Tools & Productivity",
    items: skills.tools,
    dotColor: "#6ee7b7",
  },
  {
    label: "Fundamentals",
    items: skills.fundamentals,
    dotColor: "#c084fc",
  },
];

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeader
            id="skills-heading"
            label="Skills"
            title="What I work with"
            description="A toolkit built through production systems, research, and continuous learning."
          />
        </Reveal>

        {/* Consolidated skill table layout */}
        <RevealGroup className="mt-10 flex flex-col divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          {skillGroups.map((group) => (
            <RevealItem key={group.label}>
              <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:gap-6 transition-colors hover:bg-[var(--color-surface-elevated)]">
                {/* Label column */}
                <div className="flex items-center gap-2 sm:w-44 flex-shrink-0 pt-0.5">
                  <span
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: group.dotColor }}
                    aria-hidden="true"
                  />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    {group.label}
                  </h3>
                </div>
                {/* Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Pill key={item} dotColor={group.dotColor}>
                      {item}
                    </Pill>
                  ))}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
