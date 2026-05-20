"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface StatCounterProps {
  value: string;
  label: string;
  className?: string;
}

export function StatCounter({ value, label, className }: StatCounterProps) {
  const [displayed, setDisplayed] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const numericMatch = value.match(/^(\d+)(\+?)(.*)$/);
    if (!numericMatch) return;

    const target = parseInt(numericMatch[1], 10);
    const suffix = numericMatch[2] + numericMatch[3];

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const start = Date.now();
          const startVal = 0;

          const step = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startVal + eased * (target - startVal));
            setDisplayed(current + suffix);
            if (progress < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)}>
      <span className="font-mono text-3xl font-bold text-[var(--color-accent)] md:text-4xl">
        {displayed}
      </span>
      <span className="text-sm text-[var(--color-muted-foreground)]">{label}</span>
    </div>
  );
}
