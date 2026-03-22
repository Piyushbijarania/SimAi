import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  response.cookies.set("simai_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
