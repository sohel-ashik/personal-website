import { cn } from "@/lib/cn";
import { type HTMLAttributes } from "react";

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  dotColor?: string;
}

export function Pill({ className, children, dotColor, ...props }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-0.5 font-mono text-xs text-[var(--color-foreground)]",
        className
      )}
      {...props}
    >
      {dotColor && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: dotColor }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
