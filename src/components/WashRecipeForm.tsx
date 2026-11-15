"use client";
import { createWashRecipe, updateWashRecipe } from "@/actions/wash";
import { useRouter } from "next/navigation";

export function WashRecipeForm({ collections, inks, initial }: { collections: any[]; inks: any[]; initial?: any }) {
  const router = useRouter();
  const action = initial ? updateWashRecipe.bind(null, initial.id) : createWashRecipe;
  return (
    <form action={action} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted mb-1">Name</label>
          <input name="name" defaultValue={initial?.name} required className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Type</label>
          <select name="type" defaultValue={initial?.type ?? "WHITE"} className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="WHITE">Whitewash</option>
            <option value="GRAY">Graywash</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Base ink brand</label>
          <input name="baseInkBrand" defaultValue={initial?.baseInkBrand ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Base ink name</label>
          <input name="baseInkName" defaultValue={initial?.baseInkName ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Diluent brand</label>
          <input name="diluentBrand" defaultValue={initial?.diluentBrand ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Diluent ink name</label>
          <input name="diluentType" defaultValue={initial?.diluentType ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Drop ink</label>
          <input name="inkQuantity" type="number" defaultValue={initial?.inkQuantity ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Drop diluent</label>
          <input name="diluentQuantity" type="number" defaultValue={initial?.diluentQuantity ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Image URL</label>
          <input name="imageUrl" defaultValue={initial?.imageUrl ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-muted mb-1">Notes</label>
        <textarea name="notes" defaultValue={initial?.notes ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm min-h-[80px]" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-foreground text-background text-sm">Save</button>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-border text-sm">Cancel</button>
      </div>
    </form>
  );
}
