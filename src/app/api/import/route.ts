import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const mapping: Record<string, string> = {
    machines: "machine",
    machinePresets: "machinePreset",
    inkProducts: "inkProduct",
    washCollections: "washCollection",
    washRecipes: "washRecipe",
    cartridges: "cartridge",
    consumables: "consumable",
    suppliers: "supplier",
    technicalNotes: "technicalNote",
    sessionLogs: "sessionLog",
  };
  let count = 0;
  for (const [key, model] of Object.entries(mapping)) {
    const arr = body[key];
    if (!Array.isArray(arr)) continue;
    for (const item of arr) {
      const { id, userId: _u, createdAt, updatedAt, ...rest } = item;
      try {
        await (prisma as any)[model].create({ data: { ...rest, userId } });
        count++;
      } catch (e) {
        // skip
      }
    }
  }
  return NextResponse.json({ imported: count });
}
