import { cn } from "@/lib/cn";
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function Card({ className, elevated = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] transition-all duration-300",
        elevated
          ? "bg-[var(--color-surface-elevated)] backdrop-blur-xl"
          : "bg-[var(--color-surface)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
