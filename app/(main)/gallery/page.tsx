import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { simulations } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { GalleryClient } from "@/components/GalleryClient";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sims = await db
    .select()
    .from(simulations)
    .where(eq(simulations.userId, user.userId))
    .orderBy(desc(simulations.createdAt))
    .limit(100);

  const shareBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

  return <GalleryClient sims={sims} shareBaseUrl={shareBaseUrl} />;
}
