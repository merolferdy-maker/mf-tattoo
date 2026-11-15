import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { WashRecipeForm } from "@/components/WashRecipeForm";
import { deleteWashRecipe, duplicateWashRecipe, addShade, deleteShade } from "@/actions/wash";
import ExportRecipePdf from "@/components/ExportRecipePdf";
import { notFound } from "next/navigation";

export default async function WashRecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();
  const recipe = await prisma.washRecipe.findFirst({ where: { id, userId }, include: { shades: { orderBy: { sortOrder: "asc" } }, collection: true } });
  if (!recipe) notFound();
  const collections = await prisma.washCollection.findMany({ where: { userId } });
  const inks = await prisma.inkProduct.findMany({ where: { userId } });
  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-xl font-semibold">{recipe.name}</h1>
      <WashRecipeForm collections={collections} inks={inks} initial={recipe} />
      <div className="flex gap-2">
        <form action={duplicateWashRecipe.bind(null, recipe.id)}><button className="px-4 py-2 border border-border text-sm">Duplicate</button></form>
        <form action={deleteWashRecipe.bind(null, recipe.id)}><button className="px-4 py-2 border border-red-900 text-red-400 text-sm">Delete</button></form>
        <ExportRecipePdf recipe={recipe} />
      </div>

      <div className="border border-border p-4 space-y-3">
        <div className="text-sm font-medium">Shades (lightest → darkest)</div>
        {recipe.shades.length === 0 && <div className="text-muted text-xs">No shades.</div>}
        <div className="space-y-2">
          {recipe.shades.map((s) => (
            <div key={s.id} className="flex items-center gap-3 border border-border p-2">
              <div className="w-8 h-8 border border-border" style={{ backgroundColor: s.colorPreview || "#888" }} />
              <div className="flex-1">
                <div className="text-sm">{s.name} <span className="text-muted text-xs">#{s.number}</span></div>
                <div className="text-xs text-muted">Ink {s.inkPercentage ?? "-"}% · Diluent {s.diluentPercentage ?? "-"}% · {s.inkQuantity ?? "-"}ml / {s.diluentQuantity ?? "-"}ml</div>
                {s.notes && <div className="text-xs text-muted">{s.notes}</div>}
              </div>
              <form action={deleteShade.bind(null, s.id)}><button className="text-xs text-red-400">✕</button></form>
            </div>
          ))}
        </div>
        <form action={addShade} className="grid grid-cols-2 md:grid-cols-4 gap-2 items-end">
          <input type="hidden" name="recipeId" value={recipe.id} />
          <div>
            <label className="block text-xs text-muted mb-1">Name</label>
            <input name="name" placeholder="Shade" className="w-full bg-background border border-border px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Number</label>
            <input name="number" type="number" className="w-full bg-background border border-border px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Color (hex)</label>
            <input name="colorPreview" placeholder="#cccccc" className="w-full bg-background border border-border px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Ink %</label>
            <input name="inkPercentage" type="number" step="0.1" className="w-full bg-background border border-border px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Diluent %</label>
            <input name="diluentPercentage" type="number" step="0.1" className="w-full bg-background border border-border px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Ink qty</label>
            <input name="inkQuantity" type="number" step="0.1" className="w-full bg-background border border-border px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Diluent qty</label>
            <input name="diluentQuantity" type="number" step="0.1" className="w-full bg-background border border-border px-2 py-1 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Total vol</label>
            <input name="totalVolume" type="number" step="0.1" className="w-full bg-background border border-border px-2 py-1 text-sm" />
          </div>
          <div className="col-span-2 md:col-span-4">
            <button type="submit" className="px-4 py-2 bg-foreground text-background text-sm">Add shade</button>
          </div>
        </form>
      </div>
    </div>
  );
}
