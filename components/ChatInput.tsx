"use client";

import { useCallback, useEffect, useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onAbort: () => void;
  disabled: boolean;
  generating: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onAbort,
  disabled,
  generating,
}: ChatInputProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    const line = 24;
    const maxH = line * 5;
    const next = Math.min(el.scrollHeight, maxH);
    el.style.height = `${Math.max(line + 12, next)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && generating) {
        e.preventDefault();
        onAbort();
      }
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!disabled && !generating && value.trim()) onSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [disabled, generating, onAbort, onSubmit, value]);

  return (
    <div className="shrink-0 border-t border-[var(--border)] bg-[var(--bg)] p-3">
      <div className="relative rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-2">
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            resize();
          }}
          placeholder="Describe a simulation…"
          disabled={disabled || generating}
          rows={1}
          className="max-h-[120px] min-h-[36px] w-full resize-none bg-transparent px-2 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-hint)] focus:outline-none disabled:opacity-60"
          onKeyDown={(e) => {
            if (e.key === "Escape" && generating) {
              e.preventDefault();
              onAbort();
            }
          }}
        />
        {value.length > 200 && (
          <span className="pointer-events-none absolute bottom-2 right-2 text-[10px] text-[var(--text-hint)]">
            {value.length}
          </span>
        )}
        <div className="mt-2 flex justify-end gap-2">
          {generating ? (
            <button
              type="button"
              onClick={onAbort}
              className="rounded-lg bg-[var(--danger)]/15 px-4 py-2 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger)]/25 active:scale-[0.98]"
            >
              Stop
            </button>
          ) : (
            <button
              type="button"
              disabled={disabled || !value.trim()}
              onClick={onSubmit}
              className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
            >
              Send
            </button>
          )}
        </div>
      </div>
      <p className="mt-1.5 text-center text-[10px] text-[var(--text-hint)]">
        ⌘/Ctrl + Enter to send · Shift + Enter for newline
      </p>
    </div>
  );
}
