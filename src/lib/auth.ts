import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { redirect } from "next/navigation";

export async function requireUser() {
  const cookieStore = await cookies();
  const token = await getToken({ cookieStore, secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me" });
  if (!token?.id) redirect("/login");
  return token.id as string;
}

export async function currentUser() {
  const cookieStore = await cookies();
  const token = await getToken({ cookieStore, secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-me" });
  return token?.id as string | undefined;
}
