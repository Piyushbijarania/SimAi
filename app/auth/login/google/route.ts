import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_APP_URL!;
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${base}/auth/callback?provider=google`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
  });
  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  );
}
