import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";

export default async function SuppliersPage() {
  const userId = await requireUser();
  const suppliers = await prisma.supplier.findMany({ where: { userId }, orderBy: { name: "asc" } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Suppliers</h1>
        <Link href="/suppliers/new" className="px-3 py-2 text-sm bg-foreground text-background">+ Add</Link>
      </div>
      {suppliers.length === 0 && <div className="text-muted text-sm border border-border p-6 text-center">No suppliers yet.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suppliers.map((s) => (
          <Link key={s.id} href={`/suppliers/${s.id}`} className="bg-card border border-border p-4 hover:border-accent">
            <div className="font-medium">{s.name}</div>
            <div className="text-xs text-muted mt-1">{s.contactPerson} · {s.email} · {s.phone}</div>
            <div className="text-xs text-muted mt-1">{s.website}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
