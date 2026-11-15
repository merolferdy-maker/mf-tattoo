import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { MachineForm } from "@/components/MachineForm";
import { deleteMachine } from "@/actions/machines";
import { notFound } from "next/navigation";

export default async function MachineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const machine = await prisma.machine.findFirst({ where: { id, userId } });
  if (!machine) notFound();
  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-semibold">{machine.customName || `${machine.brand} ${machine.model}`}</h1>
      <MachineForm initial={machine} />
      <form action={deleteMachine.bind(null, machine.id)}>
        <button className="px-4 py-2 border border-red-900 text-red-400 text-sm">Delete machine</button>
      </form>
    </div>
  );
}
