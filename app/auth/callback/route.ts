import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { signToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const provider = searchParams.get("provider");
  const base = process.env.NEXT_PUBLIC_APP_URL!;

  if (!code || !provider) {
    return NextResponse.redirect(new URL("/login?error=missing_params", req.url));
  }

  try {
    let profile: {
      id: string;
      email: string;
      name: string;
      avatar: string | null;
    };

    if (provider === "google") {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${base}/auth/callback?provider=google`,
          grant_type: "authorization_code",
        }),
      });
      const tokens = await tokenRes.json();
      if (!tokens.access_token) {
        throw new Error("Google token exchange failed");
      }

      const profileRes = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        }
      );
      const data = await profileRes.json();
      profile = {
        id: `google_${data.id}`,
        email: data.email ?? `${data.id}@google.oauth`,
        name: data.name ?? "Google user",
        avatar: data.picture ?? null,
      };
    } else if (provider === "github") {
      const tokenRes = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: process.env.GITHUB_CLIENT_ID!,
            client_secret: process.env.GITHUB_CLIENT_SECRET!,
            code,
            redirect_uri: `${base}/auth/callback?provider=github`,
          }),
        }
      );
      const tokens = await tokenRes.json();
      if (!tokens.access_token) {
        throw new Error("GitHub token exchange failed");
      }

      const profileRes = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const data = await profileRes.json();

      let email: string | null = data.email;
      if (!email) {
        const emailRes = await fetch("https://api.github.com/user/emails", {
          headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const emails = await emailRes.json();
        const primary = Array.isArray(emails)
          ? emails.find((e: { primary?: boolean; email?: string }) => e.primary)
          : null;
        email = primary?.email ?? null;
      }

      const login = data.login as string;
      profile = {
        id: `github_${data.id}`,
        email: email ?? `${login}@users.noreply.github.com`,
        name: (data.name as string) ?? login,
        avatar: (data.avatar_url as string) ?? null,
      };
    } else {
      return NextResponse.redirect(
        new URL("/login?error=unknown_provider", req.url)
      );
    }

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
      throw new Error("User upsert failed");
    }

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
  } catch (err) {
    console.error("Auth callback error:", err);
    return NextResponse.redirect(new URL("/login?error=auth_failed", req.url));
  }
}
