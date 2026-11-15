import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { deleteSession } from "@/actions/sessions";
import { notFound } from "next/navigation";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const s = await prisma.sessionLog.findFirst({ where: { id, userId }, include: { machine: true, preset: true, recipe: true } });
  if (!s) notFound();
  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-semibold">{new Date(s.sessionDate).toLocaleDateString()}</h1>
      <div className="bg-card border border-border p-4 space-y-1 text-sm">
        <div>Machine: {s.machine?.customName || s.machine?.brand}</div>
        <div>Preset: {s.preset?.name}</div>
        <div>Cartridge: {s.cartridgeInfo}</div>
        <div>Ink: {s.inkUsed}</div>
        <div>Recipe: {s.recipe?.name}</div>
        <div>Notes: {s.notes}</div>
      </div>
      <form action={deleteSession.bind(null, s.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm">Delete</button></form>
    </div>
  );
}
