import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import {
  getSimulationBySlug,
  getSharedSimulationWithViewBump,
} from "@/lib/share";
import { SimFrame } from "@/components/SimFrame";
import { Logo } from "@/components/Logo";
import { ShareActions } from "./ShareActions";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const sim = await getSimulationBySlug(params.slug);
  if (!sim) return { title: "SimAI" };
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return {
    title: `SimAI: ${sim.prompt}`,
    description: `Interactive AI simulation — ${sim.prompt}`,
    openGraph: {
      title: `SimAI: ${sim.prompt}`,
      description: "Interactive simulation built with SimAI",
      url: `${base}/share/${params.slug}`,
    },
  };
}

export default async function SharePage({
  params,
}: {
  params: { slug: string };
}) {
  const sim = await getSharedSimulationWithViewBump(params.slug);
  if (!sim) notFound();

  const user = await getCurrentUser();
  const ctaHref = user ? "/sim" : "/login";
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const shareUrl = `${base.replace(/\/$/, "")}/share/${params.slug}`;

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex h-12 items-center justify-between border-b border-[var(--border)] px-4 md:px-6">
        <Logo />
        <Link
          href={ctaHref}
          className="text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
        >
          Try SimAI →
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6">
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex h-[78vh] min-h-[320px] w-full flex-col bg-black/20">
            <SimFrame html={sim.html} isLoading={false} />
          </div>
        </div>

        <h1 className="mt-6 text-lg font-semibold text-[var(--text-primary)] md:text-xl">
          Simulation: {sim.prompt}
        </h1>

        <ShareActions shareUrl={shareUrl} prompt={sim.prompt} ctaHref={ctaHref} />

        <p className="mt-6 text-right text-xs text-[var(--text-muted)]">
          {(sim.views ?? 0).toLocaleString()} views
        </p>
      </main>
    </div>
  );
}
