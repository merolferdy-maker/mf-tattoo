import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const all = cookieStore.getAll().map((c) => c.name);
  const token1 = await getToken({ cookieStore, secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me", cookieName: "next-auth.session-token" });
  const token2 = await getToken({ cookieStore, secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me", cookieName: "__Secure-next-auth.session-token" });
  return NextResponse.json({ cookies: all, token1: !!token1?.id, token2: !!token2?.id });
}
