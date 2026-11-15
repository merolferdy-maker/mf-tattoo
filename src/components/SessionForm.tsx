"use client";
import { createSession } from "@/actions/sessions";
import { useRouter } from "next/navigation";

export function SessionForm({ machines, presets, recipes }: { machines: any[]; presets: any[]; recipes: any[] }) {
  const router = useRouter();
  return (
    <form action={createSession} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field name="sessionDate" label="Date" type="date" />
        <div>
          <label className="block text-xs text-muted mb-1">Machine</label>
          <select name="machineId" className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            {machines.map((m) => <option key={m.id} value={m.id}>{m.customName || `${m.brand} ${m.model}`}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Preset</label>
          <select name="presetId" className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            {presets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <Field name="cartridgeInfo" label="Cartridge info" />
        <Field name="inkUsed" label="Ink used" />
        <div>
          <label className="block text-xs text-muted mb-1">Recipe</label>
          <select name="recipeId" className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            {recipes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        <Field name="imageUrls" label="Image URLs (comma)" />
      </div>
      <textarea name="notes" placeholder="Notes" className="w-full bg-background border border-border px-3 py-2 text-sm min-h-[120px]" />
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
