import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { simulations } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  if (!row) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(row);
}
