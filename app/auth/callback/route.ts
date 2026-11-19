import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { signToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const provider = searchParams.get("provider");
  const base = (process.env.NEXT_PUBLIC_APP_URL || "").replace(/\/$/, "");

  if (!code || !provider) {
    return NextResponse.redirect(new URL("/login?error=missing_params", req.url));
  }

  if (provider !== "github") {
    return NextResponse.redirect(
      new URL("/login?error=unknown_provider", req.url)
    );
  }

  try {
    const redirectUri = `${base}/auth/callback?provider=github`;

    // 1. Exchange OAuth code for GitHub access token
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "SimAI-OAuth",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID?.trim(),
          client_secret: process.env.GITHUB_CLIENT_SECRET?.trim(),
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    const tokens = await tokenRes.json();
    if (!tokens.access_token) {
      console.error("GitHub token exchange failed:", tokens);
      const desc = tokens.error_description || tokens.error || "Token exchange failed";
      return NextResponse.redirect(
        new URL(`/login?error=auth_failed&reason=${encodeURIComponent(desc)}`, req.url)
      );
    }

    // 2. Fetch GitHub User Profile (GitHub requires User-Agent header)
    const profileRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "SimAI-OAuth",
      },
    });

    const data = await profileRes.json();
    if (!profileRes.ok || !data.id) {
      console.error("GitHub profile fetch failed:", data);
      const desc = data.message || "Failed to fetch GitHub profile";
      return NextResponse.redirect(
        new URL(`/login?error=auth_failed&reason=${encodeURIComponent(desc)}`, req.url)
      );
    }

    // 3. Fetch GitHub User Email if private
    let email: string | null = data.email;
    if (!email) {
      try {
        const emailRes = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "SimAI-OAuth",
          },
        });
        const emails = await emailRes.json();
        if (Array.isArray(emails)) {
          const primary = emails.find(
            (e: { primary?: boolean; verified?: boolean; email?: string }) =>
              e.primary && e.verified
          ) ?? emails.find(
            (e: { primary?: boolean; email?: string }) => e.primary
          ) ?? emails[0];
          email = primary?.email ?? null;
        }
      } catch (err) {
        console.warn("Failed to fetch GitHub emails list:", err);
      }
    }

    const login = data.login as string;
    const profile = {
      id: `github_${data.id}`,
      email: email ?? `${login}@users.noreply.github.com`,
      name: (data.name as string) || login || "GitHub User",
      avatar: (data.avatar_url as string) ?? null,
    };

    // 4. Upsert user in database
    const [user] = await db
      .insert(users)
      .values({
        providerId: profile.id,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
      })
      .onConflictDoUpdate({
        target: users.providerId,
        set: {
          name: profile.name,
          avatar: profile.avatar,
          lastLoginAt: new Date(),
        },
      })
      .returning({ id: users.id });

    if (!user) {
      throw new Error("User database upsert failed");
    }

    // 5. Sign JWT session token
    const token = await signToken({
      userId: user.id,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
    });

    const response = NextResponse.redirect(new URL("/sim", req.url));
    response.cookies.set("simai_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "auth_failed";
    console.error("Auth callback error:", err);
    return NextResponse.redirect(
      new URL(`/login?error=auth_failed&reason=${encodeURIComponent(errorMsg)}`, req.url)
    );
  }
}
