"use client";

import Link from "next/link";

type ShareActionsProps = {
  shareUrl: string;
  prompt: string;
  ctaHref: string;
};

export function ShareActions({ shareUrl, prompt, ctaHref }: ShareActionsProps) {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      /* ignore */
    }
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Check out this simulation: ${prompt.slice(0, 80)}`
  )}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <button
        type="button"
        onClick={copyLink}
        className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] active:scale-[0.98]"
      >
        Copy link
      </button>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] active:scale-[0.98]"
      >
        Share on X
      </a>
      <Link
        href={ctaHref}
        className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.98]"
      >
        Create your own →
      </Link>
    </div>
  );
}
