"use client";
import { createSession, updateSession } from "@/actions/sessions";
import { useRouter } from "next/navigation";
import { PhotoUploader } from "@/components/PhotoUploader";
import { parseImageUrls } from "@/lib/images";

export function SessionForm({ machines, presets, initial }: { machines: any[]; presets: any[]; initial?: any }) {
  const router = useRouter();
  const action = initial ? updateSession.bind(null, initial.id) : createSession;
  return (
    <form action={action} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field name="sessionDate" label="Date" type="date" defaultValue={initial?.sessionDate ? new Date(initial.sessionDate).toISOString().slice(0, 10) : ""} />
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
        <Field name="cartridgeInfo" label="Cartridge info" defaultValue={initial?.cartridgeInfo ?? ""} />
        <Field name="inkUsed" label="Ink used" defaultValue={initial?.inkUsed ?? ""} />
        <div>
          <label className="block text-xs text-muted mb-1">Color type</label>
          <select name="washType" defaultValue={initial?.washType ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            <option value="WHITEWASH">Whitewash</option>
            <option value="GRAYWASH">Graywash</option>
          </select>
        </div>
      </div>
      <textarea name="notes" defaultValue={initial?.notes ?? ""} placeholder="Notes" className="w-full bg-background border border-border px-3 py-2 text-sm min-h-[120px]" />
      <PhotoUploader initial={parseImageUrls(initial?.imageUrls)} />
      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 bg-foreground text-background text-sm rounded-sm hover:opacity-90">Save</button>
        <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-border text-sm rounded-sm">Cancel</button>
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
