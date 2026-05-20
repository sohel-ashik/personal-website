import { StatCounter } from "@/components/ui/StatCounter";
import { profile } from "@/content/profile";

export function Stats() {
  return (
    <section aria-label="Key statistics" className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {profile.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center md:items-start md:text-left">
              <StatCounter value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
