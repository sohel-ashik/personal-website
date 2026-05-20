import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <div className="text-center px-6">
        <p className="font-mono text-6xl font-bold text-[var(--color-accent)] mb-4">404</p>
        <h1 className="text-2xl font-semibold mb-2">Project not found</h1>
        <p className="text-[var(--color-muted-foreground)] mb-6">
          That project doesn&apos;t exist or may have been removed.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-accent)] hover:underline"
        >
          <ArrowLeft size={14} /> View all projects
        </Link>
      </div>
    </div>
  );
}
