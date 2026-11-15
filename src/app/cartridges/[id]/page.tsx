import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { CartridgeForm } from "@/components/CartridgeForm";
import { deleteCartridge } from "@/actions/cartridges";
import { notFound } from "next/navigation";

export default async function CartridgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const cartridge = await prisma.cartridge.findFirst({ where: { id, userId } });
  if (!cartridge) notFound();
  const suppliers = await prisma.supplier.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-semibold">{cartridge.brand} {cartridge.productName}</h1>
      <CartridgeForm suppliers={suppliers} initial={cartridge} />
      <form action={deleteCartridge.bind(null, cartridge.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm">Delete</button></form>
    </div>
  );
}
