import { SectionHeader } from "@/components/ui/SectionHeader";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { experience } from "@/content/profile";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_2fr]">
          <Reveal delay={0}>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeader
                id="experience-heading"
                label="Experience"
                title="Where I've worked"
                description="Professional roles and the impact I drove."
              />
            </div>
          </Reveal>

          <RevealGroup className="flex flex-col">
            {experience.map((job, i) => (
              <RevealItem key={job.company}>
                <TimelineItem
                  role={job.role}
                  company={job.company}
                  location={job.location}
                  start={job.start}
                  end={job.end}
                  bullets={job.bullets}
                  stack={job.stack}
                  isLast={i === experience.length - 1}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
