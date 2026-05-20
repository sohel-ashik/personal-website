"use client";

import { useEffect, useState } from "react";

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  speed?: number;
  pauseMs?: number;
}

export function TypewriterText({ texts, className, speed = 60, pauseMs = 2000 }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(texts[0]);
      return;
    }

    const current = texts[textIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && displayed === "") {
      setIsDeleting(false);
      setTextIndex((i) => (i + 1) % texts.length);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayed((prev) =>
            isDeleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
          );
        },
        isDeleting ? speed / 2 : speed
      );
    }

    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, textIndex, texts, speed, pauseMs, prefersReducedMotion]);

  return (
    <span className={className} aria-label={texts[textIndex]}>
      {displayed}
      <span className="ml-0.5 inline-block h-[1em] w-0.5 animate-[blink_1s_step-end_infinite] bg-[var(--color-accent)] align-middle" aria-hidden="true" />
    </span>
  );
}
