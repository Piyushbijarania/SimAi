"use client";

import { useEffect, useState } from "react";

type ShareModalProps = {
  open: boolean;
  slug: string;
  prompt: string;
  onClose: () => void;
  onCopied?: () => void;
};

export function ShareModal({
  open,
  slug,
  prompt,
  onClose,
  onCopied,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL ?? "");
  const shareUrl = `${base.replace(/\/$/, "")}/share/${slug}`;
  const embedCode = `<iframe src="${shareUrl}" width="800" height="600" frameborder="0"></iframe>`;

  useEffect(() => {
    if (!open) {
      setCopied(false);
      setEmbedOpen(false);
      setEmbedCopied(false);
    }
  }, [open]);

  if (!open) return null;

  async function copy(text: string, kind: "link" | "embed") {
    try {
      await navigator.clipboard.writeText(text);
      if (kind === "link") {
        setCopied(true);
        onCopied?.();
        setTimeout(() => setCopied(false), 2000);
      } else {
        setEmbedCopied(true);
        setTimeout(() => setEmbedCopied(false), 2000);
      }
    } catch {
      /* ignore */
    }
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out this simulation: ${prompt.slice(0, 80)}`
  )}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div
      className="absolute inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--surface)] p-6 shadow-none">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
          <h2
            id="share-modal-title"
            className="text-lg font-semibold text-[var(--text-primary)]"
          >
            Saved!
          </h2>
        </div>

        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
          Share link
        </label>
        <div className="mb-3 flex gap-2">
          <input
            readOnly
            value={shareUrl}
            className="min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs text-[var(--text-primary)]"
          />
          <button
            type="button"
            onClick={() => copy(shareUrl, "link")}
            className="shrink-0 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.98]"
          >
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-[var(--text-hint)]">or</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex h-10 w-full items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] active:scale-[0.98]"
        >
          Share on X
        </a>

        <button
          type="button"
          onClick={() => setEmbedOpen((v) => !v)}
          className="mb-2 flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-left text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
        >
          <span>&lt; &gt; Embed on your site</span>
          <span className="text-[var(--text-muted)]">{embedOpen ? "−" : "+"}</span>
        </button>

        {embedOpen && (
          <div className="mb-2">
            <textarea
              readOnly
              value={embedCode}
              rows={3}
              className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 font-mono text-[11px] text-[var(--text-muted)]"
            />
            <button
              type="button"
              onClick={() => copy(embedCode, "embed")}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
            >
              {embedCopied ? "Copied!" : "Copy embed code"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
