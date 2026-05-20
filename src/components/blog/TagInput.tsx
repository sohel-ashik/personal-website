"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ tags, onChange, placeholder = "Add tag…" }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/[^a-z0-9-.]/g, "");
    if (tag && !tags.includes(tag) && tags.length < 8) {
      onChange([...tags, tag]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 focus-within:border-[var(--color-accent)] focus-within:ring-1 focus-within:ring-[var(--color-accent)] transition-all min-h-10">
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-2 py-0.5 font-mono text-xs text-[var(--color-foreground)]">
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => { if (input) addTag(input); }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-20 bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)]"
      />
    </div>
  );
}
