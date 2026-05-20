"use client";

import { ArrowDown, FileText, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { motion } from "framer-motion";
import { TypewriterText } from "@/components/motion/TypewriterText";
import { Button } from "@/components/ui/Button";
import { profile } from "@/content/profile";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 dot-grid opacity-20"
        style={{
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Gradient glow blobs */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-[var(--color-accent)] opacity-5 blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 h-72 w-72 rounded-full bg-violet-600 opacity-5 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-24 pb-16 w-full">
        <motion.div
          className="flex flex-col gap-6 max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status badge */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-1 text-xs text-[var(--color-muted-foreground)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available for new opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.div variants={itemVariants}>
            <h1
              id="hero-heading"
              className="text-5xl font-bold tracking-tight md:text-7xl text-[var(--color-foreground)] leading-[1.1]"
            >
              {profile.name.split(" ").slice(0, 2).join(" ")}
              <br />
              <span className="text-gradient">{profile.name.split(" ").slice(2).join(" ")}</span>
            </h1>
          </motion.div>

          {/* Role typewriter */}
          <motion.div variants={itemVariants}>
            <p className="font-mono text-lg text-[var(--color-accent)] md:text-xl">
              <TypewriterText
                texts={[
                  "Software Engineer",
                  "Backend Developer",
                  "API Architect",
                  "Compliance Automation Engineer",
                ]}
                speed={55}
              />
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="text-base leading-relaxed text-[var(--color-muted-foreground)] md:text-lg max-w-2xl"
          >
            {profile.tagline}
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-2">
            <Button variant="primary" size="lg" magnetic href="/resume">
              <FileText size={16} />
              View Resume
            </Button>
            <Button variant="outline" size="lg" magnetic href="/#contact">
              <Mail size={16} />
              Get in touch
            </Button>
          </motion.div>

          {/* Social links */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 pt-2">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <GitHubIcon size={18} />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <LinkedInIcon size={18} />
            </a>
            <span className="h-px w-8 bg-[var(--color-border)]" aria-hidden="true" />
            <span className="text-xs text-[var(--color-muted)]">{profile.location}</span>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs text-[var(--color-muted)]"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          aria-hidden="true"
        >
          <span>scroll</span>
          <ArrowDown size={14} className="animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
