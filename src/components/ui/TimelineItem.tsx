import { cn } from "@/lib/cn";
import { Pill } from "./Pill";

interface TimelineItemProps {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  stack: string[];
  isLast?: boolean;
}

export function TimelineItem({ role, company, location, start, end, bullets, stack, isLast = false }: TimelineItemProps) {
  const isPresent = end === "Present";

  return (
    <div className="relative pl-10">
      {/* Vertical line — doesn't extend past last item */}
      {!isLast && (
        <div className="absolute left-[3px] top-3 bottom-0 w-px bg-[var(--color-border)]" />
      )}

      {/* Dot */}
      <div
        className={cn(
          "absolute left-0 top-2.5 h-[7px] w-[7px] rounded-full border-2",
          isPresent
            ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
            : "border-[var(--color-muted)] bg-[var(--color-background)]"
        )}
      >
        {isPresent && (
          <span className="absolute inset-[-3px] rounded-full animate-ping bg-[var(--color-accent)] opacity-25" />
        )}
      </div>

      <div className={cn("pb-10", isLast && "pb-0")}>
        {/* Header */}
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-[var(--color-foreground)] leading-tight">
              {role}
            </h3>
            <span className="font-mono text-xs text-[var(--color-muted)] whitespace-nowrap">
              {start} — {end}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-muted-foreground)]">
            <span className="font-medium text-[var(--color-accent)]">{company}</span>
            <span className="text-[var(--color-border)]">·</span>
            <span>{location}</span>
          </div>
        </div>

        {/* Bullets */}
        <ul className="space-y-2 mb-5">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-[var(--color-muted-foreground)] leading-relaxed">
              <span className="mt-[7px] h-1 w-1 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-1.5">
          {stack.map((tech) => (
            <Pill key={tech}>{tech}</Pill>
          ))}
        </div>
      </div>
    </div>
  );
}
