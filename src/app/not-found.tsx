import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-8xl font-bold text-[var(--color-accent)] mb-4 leading-none">
          404
        </p>
        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-[var(--color-muted-foreground)] mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist. It may have been moved,
          renamed, or simply never existed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Home size={15} />
          Go home
        </Link>
      </div>
    </div>
  );
}
