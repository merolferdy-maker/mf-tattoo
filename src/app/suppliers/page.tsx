import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/ui/kit";

export default async function SuppliersPage() {
  const userId = await requireUser();
  const suppliers = await prisma.supplier.findMany({ where: { userId }, orderBy: { name: "asc" } });
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <PageHeader title="Suppliers" subtitle="Your supplier directory" actions={
        <Link href="/suppliers/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add</Link>
      } />
      {suppliers.length === 0 ? (
        <EmptyState title="No suppliers yet" description="Add your first supplier." action={<Link href="/suppliers/new" className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90">+ Add</Link>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {suppliers.map((s) => (
            <Link key={s.id} href={`/suppliers/${s.id}`} className="group bg-card border border-border rounded-sm p-5 card-shadow hover:border-border-hover transition-all fade-up">
              <div className="font-medium text-foreground group-hover:text-accent transition-colors">{s.name}</div>
              <div className="text-xs text-muted mt-1">{s.contactPerson}</div>
              <div className="text-xs text-muted mt-0.5">{s.email} · {s.phone}</div>
              {s.website && <div className="text-xs text-muted mt-0.5">{s.website}</div>}
              {s.notes && <div className="mt-2 text-xs text-muted line-clamp-2">{s.notes}</div>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
