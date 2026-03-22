import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { simulations } from "@/lib/db/schema";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const prompt = body?.prompt as string | undefined;
  const html = body?.html as string | undefined;
  if (!prompt || !html) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const slug = nanoid(8);

  try {
    const [saved] = await db
      .insert(simulations)
      .values({ userId: user.userId, prompt, html, slug })
      .returning({ id: simulations.id, slug: simulations.slug });

    return Response.json(saved);
  } catch (e) {
    console.error("Save simulation error:", e);
    return Response.json({ error: "Could not save" }, { status: 500 });
  }
}
