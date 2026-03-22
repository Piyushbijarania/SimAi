import { getSharedSimulationWithViewBump } from "@/lib/share";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const sim = await getSharedSimulationWithViewBump(params.slug);
  if (!sim) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(sim);
}
