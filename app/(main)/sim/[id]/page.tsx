import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { simulations } from "@/lib/db/schema";
import { SimWorkspace } from "../SimWorkspace";

export const dynamic = "force-dynamic";

function SimFallback() {
  return (
    <div className="flex h-[calc(100vh-52px)] items-center justify-center text-sm text-[var(--text-muted)]">
      Loading…
    </div>
  );
}

export default async function SimByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [row] = await db
    .select()
    .from(simulations)
    .where(
      and(
        eq(simulations.id, params.id),
        eq(simulations.userId, user.userId)
      )
    )
    .limit(1);

  if (!row) notFound();

  return (
    <Suspense fallback={<SimFallback />}>
      <SimWorkspace initialPrompt={row.prompt} initialHtml={row.html} />
    </Suspense>
  );
}
