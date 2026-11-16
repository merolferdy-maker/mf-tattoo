import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/ui/kit";
import { PortfolioForm } from "@/components/PortfolioForm";

export default async function NewPortfolioPage() {
  const userId = await requireUser();
  const machines = await prisma.machine.findMany({ where: { userId }, orderBy: { brand: "asc" } });
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto fade-up">
      <PageHeader title="Add tattoo" subtitle="Photo, color type, date, machine & notes" />
      <PortfolioForm machines={machines} />
    </div>
  );
}
