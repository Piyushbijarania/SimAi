import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";

export const metadata: Metadata = {
  title: "SimAI — Turn ideas into interactive simulations",
  description:
    "Describe any concept in plain English and explore it as a live, browser-based simulation. Save, share, and build your gallery.",
  openGraph: {
    title: "SimAI — Describe it. See it. Understand it.",
    description:
      "Interactive simulations from plain language—physics, math, algorithms, and more.",
  },
};

export default async function RootPage() {
  const user = await getCurrentUser();
  if (user) redirect("/sim");
  return <LandingPage />;
}
