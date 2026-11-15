import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { WashRecipeForm } from "@/components/WashRecipeForm";

export default async function NewWashRecipePage() {
  const userId = await requireUser();
  const collections = await prisma.washCollection.findMany({ where: { userId } });
  const inks = await prisma.inkProduct.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">New wash recipe</h1>
      <WashRecipeForm collections={collections} inks={inks} />
    </div>
  );
}
