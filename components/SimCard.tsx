"use client";

import Link from "next/link";
import { useState } from "react";
import type { Simulation } from "@/lib/db/schema";
import { inferCategory, relativeTime, truncate } from "@/lib/utils";

type SimCardProps = {
  sim: Simulation;
  shareBaseUrl: string;
};

export function SimCard({ sim, shareBaseUrl }: SimCardProps) {
  const [copied, setCopied] = useState(false);
  const category = inferCategory(sim.prompt);
  const shareUrl = `${shareBaseUrl.replace(/\/$/, "")}/share/${sim.slug}`;

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const created = sim.createdAt
    ? sim.createdAt instanceof Date
      ? sim.createdAt
      : new Date(String(sim.createdAt))
    : new Date();

  return (
    <article className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--border-strong)]">
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-[var(--text-primary)]">
          {truncate(sim.prompt, 72)}
        </p>
        <span className="shrink-0 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
          {category}
        </span>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
        <span>{relativeTime(created)}</span>
        {(sim.views ?? 0) > 0 && (
          <span>{(sim.views ?? 0).toLocaleString()} views</span>
        )}
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        <Link
          href={`/sim/${sim.id}`}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] active:scale-[0.98]"
        >
          Open
        </Link>
        <button
          type="button"
          onClick={copyShare}
          className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] active:scale-[0.98]"
        >
          {copied ? "Copied!" : "Copy share link"}
        </button>
      </div>
    </article>
  );
}
