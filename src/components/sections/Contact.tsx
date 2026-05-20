"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, Send, CheckCircle, XCircle, ArrowUpRight } from "lucide-react";
import { LinkedInIcon, GitHubIcon } from "@/components/ui/SocialIcons";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

const schema = z.object({
  name: z.string().min(2, "At least 2 characters").max(80),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(120).optional(),
  message: z.string().min(10, "At least 10 characters").max(2000),
  honeypot: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type SubmitStatus = "idle" | "loading" | "success" | "error";

function InputField({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-accent)]" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted)] outline-none transition-all duration-200",
    "focus:bg-[var(--color-surface)] focus:ring-1",
    hasError
      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
      : "border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-[var(--color-accent)]/20"
  );

export function Contact() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { success: boolean; error?: string };
      if (json.success) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
        setErrorMsg(json.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <Reveal className="mb-16 max-w-xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)]">Contact</p>
          <h2 id="contact-heading" className="text-3xl font-bold tracking-tight md:text-4xl mb-3">
            Let&apos;s work together
          </h2>
          <p className="text-[var(--color-muted-foreground)] leading-relaxed">
            Have a project, a question, or just want to say hi?
            I&apos;m open to interesting opportunities and conversations.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

          {/* Left — reach out cards */}
          <Reveal delay={0.1} className="lg:col-span-2 flex flex-col gap-4">

            {/* Email card */}
            <a
              href={`mailto:${profile.email}`}
              className="group flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[var(--color-accent-glow)]"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <Mail size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-0.5">Email</p>
                <p className="text-sm font-medium text-[var(--color-foreground)] truncate">{profile.email}</p>
              </div>
              <ArrowUpRight size={16} className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors mt-1 flex-shrink-0" />
            </a>

            {/* Phone/WhatsApp card */}
            <a
              href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:-translate-y-0.5 hover:shadow-md hover:shadow-[var(--color-accent-glow)]"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <Phone size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-0.5">WhatsApp</p>
                <p className="text-sm font-medium text-[var(--color-foreground)]">{profile.phone}</p>
              </div>
              <ArrowUpRight size={16} className="text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors mt-1 flex-shrink-0" />
            </a>

            {/* Socials row */}
            <div className="flex gap-3 pt-1">
              {[
                { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
                { href: profile.socials.github, label: "GitHub", Icon: GitHubIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-muted-foreground)] transition-all hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]"
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </a>
              ))}
            </div>

            {/* Availability badge */}
            <div className="mt-2 flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <p className="text-xs text-emerald-400 font-medium">Available for new opportunities</p>
            </div>
          </Reveal>

          {/* Right — form */}
          <Reveal delay={0.15} className="lg:col-span-3">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
              <h3 className="text-base font-semibold text-[var(--color-foreground)] mb-6">Send a message</h3>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-foreground)]">Message sent!</p>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1">I&apos;ll get back to you within 24 hours.</p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-xs text-[var(--color-accent)] hover:underline"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Contact form" className="flex flex-col gap-5">
                  {/* Honeypot */}
                  <input
                    {...register("honeypot")}
                    type="text"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="absolute opacity-0 pointer-events-none"
                    autoComplete="off"
                  />

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <InputField id="contact-name" label="Name" required error={errors.name?.message}>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Your name"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        {...register("name")}
                        className={inputClass(!!errors.name)}
                      />
                    </InputField>

                    <InputField id="contact-email" label="Email" required error={errors.email?.message}>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                        className={inputClass(!!errors.email)}
                      />
                    </InputField>
                  </div>

                  <InputField id="contact-subject" label="Subject">
                    <input
                      id="contact-subject"
                      type="text"
                      placeholder="What's this about?"
                      {...register("subject")}
                      className={inputClass(false)}
                    />
                  </InputField>

                  <InputField id="contact-message" label="Message" required error={errors.message?.message}>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Tell me about your project, idea, or just say hi..."
                      aria-invalid={!!errors.message}
                      {...register("message")}
                      className={cn(inputClass(!!errors.message), "resize-none")}
                    />
                  </InputField>

                  {status === "error" && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert" aria-live="polite">
                      <XCircle size={15} className="flex-shrink-0" />
                      {errorMsg || "Failed to send. Please try again."}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={status === "loading"}
                    className="w-full mt-1"
                  >
                    {status === "loading" ? (
                      "Sending…"
                    ) : (
                      <>
                        <Send size={15} />
                        Send message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
