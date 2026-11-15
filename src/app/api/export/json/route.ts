import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data: any = {};
  const models = ["machine","machinePreset","inkProduct","inkBatch","washCollection","washRecipe","washShade","cartridge","consumable","supplier","stockMovement","technicalNote","sessionLog"];
  for (const m of models) {
    const key = m + "s";
    data[key] = await (prisma as any)[m].findMany({ where: { userId } });
  }
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=backup.json",
    },
  });
}
