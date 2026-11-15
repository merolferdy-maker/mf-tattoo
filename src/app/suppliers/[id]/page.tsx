import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { SupplierForm } from "@/components/SupplierForm";
import { deleteSupplier } from "@/actions/suppliers";
import { notFound } from "next/navigation";

export default async function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const supplier = await prisma.supplier.findFirst({ where: { id, userId } });
  if (!supplier) notFound();
  const movements = await prisma.stockMovement.findMany({ where: { userId, supplierId: id }, orderBy: { createdAt: "desc" }, take: 20 });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-semibold">{supplier.name}</h1>
      <SupplierForm initial={supplier} />
      <form action={deleteSupplier.bind(null, supplier.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm">Delete</button></form>
      <div className="border border-border p-3">
        <div className="text-sm font-medium mb-2">Purchase history</div>
        {movements.length === 0 && <div className="text-muted text-xs">No movements.</div>}
        {movements.map((m) => (
          <div key={m.id} className="text-xs text-muted border-b border-border py-1">
            {m.type} · {m.itemName} · {m.quantity} · {new Date(m.createdAt).toLocaleDateString()}
          </div>
        ))}
      </div>
    </div>
  );
}
