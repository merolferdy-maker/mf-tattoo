import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/ui/kit";
import { PortfolioForm } from "@/components/PortfolioForm";
import { notFound } from "next/navigation";

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const [entry, machines] = await Promise.all([
    prisma.portfolioEntry.findFirst({ where: { id, userId } }),
    prisma.machine.findMany({ where: { userId }, orderBy: { brand: "asc" } }),
  ]);
  if (!entry) notFound();
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto fade-up">
      <PageHeader title="Edit tattoo" subtitle="Update photo, color type, date, machine & notes" />
      <PortfolioForm machines={machines} initial={entry} />
    </div>
  );
}
