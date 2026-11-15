import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { redirect } from "next/navigation";

async function getSessionToken() {
  const cookieStore = await cookies();
  const secret = process.env.NEXTAUTH_SECRET || "dev-secret-change-me";
  const names = ["__Secure-next-auth.session-token", "next-auth.session-token"];
  for (const name of names) {
    const raw = cookieStore.get(name)?.value;
    if (!raw) continue;
    try {
      const token = await decode({ token: raw, secret });
      if (token?.id) return token;
    } catch (e) {
      // ignore
    }
  }
  return null;
}

export async function requireUser() {
  const token = await getSessionToken();
  if (!token?.id) redirect("/login");
  return token.id as string;
}

export async function currentUser() {
  const token = await getSessionToken();
  return token?.id as string | undefined;
}
