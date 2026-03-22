"use client";

import Link from "next/link";
import type { Simulation } from "@/lib/db/schema";
import { SimCard } from "@/components/SimCard";

type GalleryClientProps = {
  sims: Simulation[];
  shareBaseUrl: string;
};

export function GalleryClient({ sims, shareBaseUrl }: GalleryClientProps) {
  if (sims.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="mb-6 text-[var(--accent)]" aria-hidden>
          <svg
            width="56"
            height="56"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 32c5-12 13-20 28-20 10 0 17 4 22 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M4 44c6-8 15-12 28-12 12 0 20 4 28 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-[var(--text-primary)]">
          No simulations yet
        </h2>
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          Build your first interactive simulation from a short description.
        </p>
        <Link
          href="/sim"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.98]"
        >
          Build your first →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Your simulations
          </h1>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs font-medium text-[var(--text-muted)]">
            {sims.length}
          </span>
        </div>
        <Link
          href="/sim"
          className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] active:scale-[0.98]"
        >
          New simulation
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sims.map((sim) => (
          <SimCard key={sim.id} sim={sim} shareBaseUrl={shareBaseUrl} />
        ))}
      </div>
    </div>
  );
}
