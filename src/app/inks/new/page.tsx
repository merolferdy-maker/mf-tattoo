import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { InkForm } from "@/components/InkForm";

export default async function NewInkPage() {
  const userId = await requireUser();
  const suppliers = await prisma.supplier.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">New ink</h1>
      <InkForm suppliers={suppliers} />
    </div>
  );
}
