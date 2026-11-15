import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { InkForm } from "@/components/InkForm";
import { deleteInk } from "@/actions/inks";
import { notFound } from "next/navigation";

export default async function InkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const ink = await prisma.inkProduct.findFirst({ where: { id, userId } });
  if (!ink) notFound();
  const suppliers = await prisma.supplier.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-semibold flex items-center gap-2">{ink.brand} {ink.colorName}{ink.currentQuantity <= 0 && <span className="px-2 py-0.5 text-xs rounded-sm bg-red-900/20 border border-red-900/40 text-red-400">ESAURITO</span>}</h1>
      <InkForm suppliers={suppliers} initial={ink} />
      <form action={deleteInk.bind(null, ink.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm">Delete</button></form>
    </div>
  );
}
