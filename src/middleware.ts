import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname === "/favicon.ico";
  if (isPublic) return NextResponse.next();
  const isHttps = req.nextUrl.protocol === "https:";
  const cookieName = isHttps ? "__Secure-next-auth.session-token" : "next-auth.session-token";
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me", cookieName });
  if (!token?.id) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
