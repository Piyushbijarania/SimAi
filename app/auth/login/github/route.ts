import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL!;
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${base}/auth/callback?provider=github`,
    scope: "user:email",
  });
  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params}`
  );
}
