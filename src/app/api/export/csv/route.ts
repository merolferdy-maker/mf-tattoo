import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const entity = url.searchParams.get("entity") || "inks";
  let rows: any[] = [];
  let filename = entity + ".csv";
  if (entity === "inks") rows = await prisma.inkProduct.findMany({ where: { userId } });
  else if (entity === "machines") rows = await prisma.machine.findMany({ where: { userId } });
  else if (entity === "cartridges") rows = await prisma.cartridge.findMany({ where: { userId } });
  else if (entity === "consumables") rows = await prisma.consumable.findMany({ where: { userId } });
  else if (entity === "movements") rows = await prisma.stockMovement.findMany({ where: { userId } });
  const csv = Papa.unparse(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${filename}`,
    },
  });
}
