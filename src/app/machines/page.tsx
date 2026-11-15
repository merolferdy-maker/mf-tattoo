import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function MachinesPage() {
  const userId = await requireUser();
  const machines = await prisma.machine.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Machines</h1>
        <Link href="/machines/new" className="px-3 py-2 text-sm bg-foreground text-background">+ Add machine</Link>
      </div>
      {machines.length === 0 && <div className="text-muted text-sm border border-border p-6 text-center">No machines yet. Add your first machine.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {machines.map((m) => (
          <Link key={m.id} href={`/machines/${m.id}`} className="bg-card border border-border p-4 hover:border-accent transition">
            <div className="font-medium">{m.customName || `${m.brand} ${m.model}`}</div>
            <div className="text-xs text-muted mt-1">{m.brand} {m.model}</div>
            {m.type && <div className="text-xs text-muted">{m.type}</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
