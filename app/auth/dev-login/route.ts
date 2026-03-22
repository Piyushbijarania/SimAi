import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { signToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEV_PROVIDER_ID = "dev_admin";

function constantTimeEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const expected = process.env.DEV_ADMIN_PASSWORD;
  if (!expected || expected.length < 8) {
    return NextResponse.redirect(
      new URL("/login?error=dev_disabled", req.url),
      303
    );
  }

  let password = "";
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => null);
    password = typeof body?.password === "string" ? body.password : "";
  } else {
    const form = await req.formData().catch(() => null);
    const v = form?.get("password");
    password = typeof v === "string" ? v : "";
  }

  if (!constantTimeEqual(password, expected)) {
    return NextResponse.redirect(
      new URL("/login?error=dev_bad_password", req.url),
      303
    );
  }

  try {
    const [user] = await db
      .insert(users)
      .values({
        providerId: DEV_PROVIDER_ID,
        email: "dev-admin@localhost",
        name: "Dev Admin",
        avatar: null,
      })
      .onConflictDoUpdate({
        target: users.providerId,
        set: {
          name: "Dev Admin",
          lastLoginAt: new Date(),
        },
      })
      .returning({ id: users.id });

    if (!user) {
      throw new Error("User upsert failed");
    }

    const token = await signToken({
      userId: user.id,
      email: "dev-admin@localhost",
      name: "Dev Admin",
      avatar: null,
    });

    // 303 so the browser follows with GET — default 307 would re-POST to /sim and break RSC
    const res = NextResponse.redirect(new URL("/sim", req.url), 303);
    res.cookies.set("simai_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch (e) {
    console.error("Dev login DB error:", e);
    return NextResponse.redirect(
      new URL("/login?error=dev_db", req.url),
      303
    );
  }
}
