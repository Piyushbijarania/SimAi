import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { simulations } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = await db
    .select()
    .from(simulations)
    .where(eq(simulations.userId, user.userId))
    .orderBy(desc(simulations.createdAt))
    .limit(100);

  return Response.json(results);
}
