import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  id: string;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({ label, title, description, id, className, centered = false }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      {label && (
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">
          {label}
        </p>
      )}
      <h2
        id={id}
        className="text-3xl font-bold tracking-tight md:text-4xl text-[var(--color-foreground)]"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-[var(--color-muted-foreground)] max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
