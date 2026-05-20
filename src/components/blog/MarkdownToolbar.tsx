"use client";

import { useCallback, type RefObject } from "react";
import { Bold, Italic, Code, Link2, Heading2, Heading3, List, Quote, Minus, Image } from "lucide-react";

interface MarkdownToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onInsert: (text: string) => void;
}

type ToolbarAction = { label: string; icon: React.ReactNode; wrap?: [string, string, string]; line?: string };

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { label: "Bold",         icon: <Bold size={14} />,     wrap: ["**", "**", "bold text"] },
  { label: "Italic",       icon: <Italic size={14} />,   wrap: ["_", "_", "italic text"] },
  { label: "Inline code",  icon: <Code size={14} />,     wrap: ["`", "`", "code"] },
  { label: "Heading 2",    icon: <Heading2 size={14} />, line: "## Heading" },
  { label: "Heading 3",    icon: <Heading3 size={14} />, line: "### Heading" },
  { label: "List item",    icon: <List size={14} />,     line: "- Item" },
  { label: "Blockquote",   icon: <Quote size={14} />,    line: "> Quote" },
  { label: "Divider",      icon: <Minus size={14} />,    line: "---" },
  { label: "Link",         icon: <Link2 size={14} />,    wrap: ["[", "](url)", "link text"] },
  { label: "Image (URL)",  icon: <Image size={14} aria-hidden="true" /> },
];

export function MarkdownToolbar({ textareaRef, onInsert }: MarkdownToolbarProps) {
  const handleAction = useCallback((action: ToolbarAction) => {
    const el = textareaRef.current;

    if (action.label === "Image (URL)") {
      const url = prompt("Image URL:");
      if (url) onInsert(`![Image description](${url})`);
      return;
    }

    if (action.line !== undefined) {
      const prefix = action.line;
      if (!el) { onInsert("\n" + prefix); return; }
      const before = el.value.slice(0, el.selectionStart);
      const needsNewline = before.length > 0 && !before.endsWith("\n");
      onInsert((needsNewline ? "\n" : "") + prefix);
      return;
    }

    if (action.wrap) {
      const [before, after, placeholder] = action.wrap;
      if (!el) { onInsert(`${before}${placeholder}${after}`); return; }
      const { selectionStart: start, selectionEnd: end } = el;
      const selected = el.value.slice(start, end) || placeholder;
      onInsert(`${before}${selected}${after}`);
      if (start === end) {
        requestAnimationFrame(() => {
          el.setSelectionRange(start + before.length, start + before.length + placeholder.length);
        });
      }
    }
  }, [textareaRef, onInsert]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-xl border border-b-0 border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5">
      {TOOLBAR_ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          title={action.label}
          onClick={() => handleAction(action)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)] transition-colors"
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
}
