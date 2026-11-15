import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) redirect("/login");
  return userId as string;
}

export async function currentUser() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.id as string | undefined;
}
