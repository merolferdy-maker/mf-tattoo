"use client";
import { createNote, updateNote } from "@/actions/notes";
import { useRouter } from "next/navigation";

export function NoteForm({ machines, presets, cartridges, recipes, initial }: { machines: any[]; presets: any[]; cartridges: any[]; recipes: any[]; initial?: any }) {
  const router = useRouter();
  const action = initial ? updateNote.bind(null, initial.id) : createNote;
  return (
    <form action={action} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field name="title" label="Title" defaultValue={initial?.title} required />
        <Field name="category" label="Category" defaultValue={initial?.category} />
        <Field name="tags" label="Tags (comma)" defaultValue={initial?.tags} />
        <Field name="imageUrl" label="Image URL" defaultValue={initial?.imageUrl} />
        <div>
          <label className="block text-xs text-muted mb-1">Machine</label>
          <select name="machineId" defaultValue={initial?.machineId ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            {machines.map((m) => <option key={m.id} value={m.id}>{m.customName || `${m.brand} ${m.model}`}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Preset</label>
          <select name="presetId" defaultValue={initial?.presetId ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            {presets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Cartridge</label>
          <select name="cartridgeId" defaultValue={initial?.cartridgeId ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            {cartridges.map((c) => <option key={c.id} value={c.id}>{c.brand} {c.productName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Recipe</label>
          <select name="recipeId" defaultValue={initial?.recipeId ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            {recipes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="favorite" defaultChecked={initial?.favorite} /> Favorite
      </label>
      <textarea name="description" defaultValue={initial?.description ?? ""} placeholder="Description" className="w-full bg-background border border-border px-3 py-2 text-sm min-h-[120px]" />
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-foreground text-background text-sm">Save</button>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-border text-sm">Cancel</button>
      </div>
    </form>
  );
}

function Field({ name, label, type = "text", required, ...rest }: any) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <input name={name} type={type} required={required} {...rest} className="w-full bg-background border border-border px-3 py-2 text-sm" />
    </div>
  );
}
