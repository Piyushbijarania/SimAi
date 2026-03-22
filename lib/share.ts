import { db } from "@/lib/db";
import { simulations } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import type { Simulation } from "@/lib/db/schema";

export async function getSimulationBySlug(
  slug: string
): Promise<Simulation | null> {
  const [row] = await db
    .select()
    .from(simulations)
    .where(eq(simulations.slug, slug))
    .limit(1);
  return row ?? null;
}

/** Loads simulation and increments view count (use once per real page view). */
export async function getSharedSimulationWithViewBump(
  slug: string
): Promise<Simulation | null> {
  const [row] = await db
    .select()
    .from(simulations)
    .where(eq(simulations.slug, slug))
    .limit(1);
  if (!row) return null;

  await db
    .update(simulations)
    .set({ views: sql`coalesce(${simulations.views}, 0) + 1` })
    .where(eq(simulations.slug, slug));

  const views = (row.views ?? 0) + 1;
  return { ...row, views };
}
