"use client";
import { createPreset, updatePreset } from "@/actions/presets";
import { useRouter } from "next/navigation";

const categories = ["LINEWORK","BLACK_SHADING","GREY_SHADING","COLOR_PACKING","COLOR_SHADING","WHIP_SHADING","CUSTOM"];

export function PresetForm({ machines, initial }: { machines: any[]; initial?: any }) {
  const router = useRouter();
  const action = initial ? updatePreset.bind(null, initial.id) : createPreset;
  return (
    <form action={action} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-muted mb-1">Name</label>
          <input name="name" defaultValue={initial?.name} required className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Machine</label>
          <select name="machineId" defaultValue={initial?.machineId} required className="w-full bg-background border border-border px-3 py-2 text-sm">
            {machines.map((m) => <option key={m.id} value={m.id}>{m.customName || `${m.brand} ${m.model}`}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Category</label>
          <select name="category" defaultValue={initial?.category ?? "CUSTOM"} className="w-full bg-background border border-border px-3 py-2 text-sm">
            {categories.map((c) => <option key={c} value={c}>{c.replace(/_/g," ")}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Voltage</label>
          <input name="voltage" type="number" step="0.1" defaultValue={initial?.voltage ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Stroke</label>
          <input name="stroke" type="number" step="0.1" defaultValue={initial?.stroke ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Needle config</label>
          <input name="needleConfig" defaultValue={initial?.needleConfig ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Cartridge brand</label>
          <input name="cartridgeBrand" defaultValue={initial?.cartridgeBrand ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Needle diameter</label>
          <input name="needleDiameter" type="number" step="0.01" defaultValue={initial?.needleDiameter ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Taper</label>
          <input name="taper" defaultValue={initial?.taper ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Technique</label>
          <input name="technique" defaultValue={initial?.technique ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="favorite" defaultChecked={initial?.favorite} /> Favorite
      </label>
      <textarea name="notes" defaultValue={initial?.notes ?? ""} placeholder="Notes" className="w-full bg-background border border-border px-3 py-2 text-sm min-h-[80px]" />
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-foreground text-background text-sm">Save</button>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-border text-sm">Cancel</button>
      </div>
    </form>
  );
}
