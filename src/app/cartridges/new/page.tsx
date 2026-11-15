import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { CartridgeForm } from "@/components/CartridgeForm";

export default async function NewCartridgePage() {
  const userId = await requireUser();
  const suppliers = await prisma.supplier.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">New cartridge</h1>
      <CartridgeForm suppliers={suppliers} />
    </div>
  );
}
