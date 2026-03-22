import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/dev-login") ||
    pathname.startsWith("/share") ||
    pathname.startsWith("/api/share");
  if (isPublic) return NextResponse.next();

  const token = req.cookies.get("simai_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("simai_token");
    return res;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.ico|.*\\.webp|.*\\.json).*)",
  ],
};
