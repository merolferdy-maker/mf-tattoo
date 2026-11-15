import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ConsumableForm } from "@/components/ConsumableForm";

export default async function NewConsumablePage() {
  const userId = await requireUser();
  const suppliers = await prisma.supplier.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">New consumable</h1>
      <ConsumableForm suppliers={suppliers} />
    </div>
  );
}
