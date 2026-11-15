import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ConsumableForm } from "@/components/ConsumableForm";
import { deleteConsumable } from "@/actions/consumables";
import { notFound } from "next/navigation";

export default async function ConsumableDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const item = await prisma.consumable.findFirst({ where: { id, userId } });
  if (!item) notFound();
  const suppliers = await prisma.supplier.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-semibold">{item.name}</h1>
      <ConsumableForm suppliers={suppliers} initial={item} />
      <form action={deleteConsumable.bind(null, item.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm">Delete</button></form>
    </div>
  );
}
