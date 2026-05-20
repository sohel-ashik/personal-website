"use client";

import { useState } from "react";
import { Bell, CheckCircle } from "lucide-react";

export function BlogNotifyForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Blog subscriber",
          email,
          subject: "Blog notify",
          message: `${email} subscribed for blog notifications.`,
        }),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (json.success) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMsg(json.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-400">
        <CheckCircle size={18} />
        <span className="text-sm">You&apos;re subscribed! I&apos;ll notify you when the first post is live.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Blog notification signup" className="flex flex-col gap-3">
      <label htmlFor="blog-email" className="text-sm font-medium text-[var(--color-foreground)]">
        Notify me when the first post is live
      </label>
      <div className="flex gap-2">
        <input
          id="blog-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          required
          className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm placeholder:text-[var(--color-muted)] outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
        />
        <button
          type="submit"
          disabled={status === "loading" || !email}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Bell size={14} />
          {status === "loading" ? "..." : "Notify me"}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="text-xs text-red-400">{errorMsg}</p>
      )}
    </form>
  );
}
