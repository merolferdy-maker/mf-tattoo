import { cookies, headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { redirect } from "next/navigation";

async function getTokenSafe() {
  const cookieStore = await cookies();
  const hdrs = await headers();
  const isHttps = hdrs.get("x-forwarded-proto") === "https" || hdrs.get("host")?.includes("vercel.app");
  const names = isHttps ? ["__Secure-next-auth.session-token", "next-auth.session-token"] : ["next-auth.session-token", "__Secure-next-auth.session-token"];
  for (const name of names) {
    const token = await getToken({ cookieStore, secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me", cookieName: name });
    if (token?.id) return token;
  }
  return null;
}

export async function requireUser() {
  const token = await getTokenSafe();
  if (!token?.id) redirect("/login");
  return token.id as string;
}

export async function currentUser() {
  const token = await getTokenSafe();
  return token?.id as string | undefined;
}
