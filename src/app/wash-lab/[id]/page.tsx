import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { WashRecipeForm } from "@/components/WashRecipeForm";
import { deleteWashRecipe, duplicateWashRecipe } from "@/actions/wash";
import ExportRecipePdf from "@/components/ExportRecipePdf";
import { notFound } from "next/navigation";

export default async function WashRecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const recipe = await prisma.washRecipe.findFirst({ where: { id, userId }, include: { collection: true } });
  if (!recipe) notFound();
  const collections = await prisma.washCollection.findMany({ where: { userId } });
  const inks = await prisma.inkProduct.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto fade-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{recipe.name}</h1>
        <div className="flex gap-2">
          <ExportRecipePdf recipe={recipe} />
        </div>
      </div>
      <WashRecipeForm collections={collections} inks={inks} initial={recipe} />
      <div className="flex gap-2 mt-4">
        <form action={duplicateWashRecipe.bind(null, recipe.id)}><button className="px-4 py-2 border border-border text-sm rounded-sm">Duplicate</button></form>
        <form action={deleteWashRecipe.bind(null, recipe.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm rounded-sm">Delete</button></form>
      </div>
    </div>
  );
}
