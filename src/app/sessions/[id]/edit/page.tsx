import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { SessionForm } from "@/components/SessionForm";
import { notFound } from "next/navigation";

export default async function EditSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const [session, machines, presets] = await Promise.all([
    prisma.sessionLog.findFirst({ where: { id, userId } }),
    prisma.machine.findMany({ where: { userId } }),
    prisma.machinePreset.findMany({ where: { userId } }),
  ]);
  if (!session) notFound();
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit session</h1>
      <SessionForm machines={machines} presets={presets} initial={session} />
    </div>
  );
}
