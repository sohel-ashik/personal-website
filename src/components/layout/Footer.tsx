import Link from "next/link";
import { GitHubIcon, LinkedInIcon, TwitterXIcon } from "@/components/ui/SocialIcons";
import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link
              href="/"
              className="font-mono text-lg font-bold text-[var(--color-foreground)] hover:text-[var(--color-accent)] transition-colors"
            >
              {profile.shortName}
              <span className="text-[var(--color-accent)]">.</span>
            </Link>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              © 2026 Sohel Siddique Ashik. All rights reserved.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
            <Link href="/#about" className="hover:text-[var(--color-foreground)] transition-colors">About</Link>
            <Link href="/projects" className="hover:text-[var(--color-foreground)] transition-colors">Projects</Link>
            <Link href="/#contact" className="hover:text-[var(--color-foreground)] transition-colors">Contact</Link>
            <Link href="/blog" className="hover:text-[var(--color-foreground)] transition-colors">Blog</Link>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <GitHubIcon size={16} />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <LinkedInIcon size={16} />
            </a>
            <a
              href={profile.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter profile"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-all hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            >
              <TwitterXIcon size={16} />
            </a>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <p className="text-xs text-[var(--color-muted)]">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
