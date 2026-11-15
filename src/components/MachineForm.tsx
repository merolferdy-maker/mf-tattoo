"use client";
import { useActionState } from "react";
import { createMachine, updateMachine } from "@/actions/machines";
import { useRouter } from "next/navigation";

export function MachineForm({ initial }: { initial?: any }) {
  const router = useRouter();
  const action = initial ? updateMachine.bind(null, initial.id) : createMachine;
  return (
    <form action={action} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field name="brand" label="Brand" defaultValue={initial?.brand} required />
        <Field name="model" label="Model" defaultValue={initial?.model} required />
        <Field name="customName" label="Custom name" defaultValue={initial?.customName} />
        <Field name="type" label="Machine type" defaultValue={initial?.type} />
        <Field name="driveSystem" label="Drive system" defaultValue={initial?.driveSystem} />
        <Field name="strokeMin" label="Stroke min" type="number" step="0.1" defaultValue={initial?.strokeMin} />
        <Field name="strokeMax" label="Stroke max" type="number" step="0.1" defaultValue={initial?.strokeMax} />
        <Field name="weight" label="Weight (g)" type="number" step="0.1" defaultValue={initial?.weight} />
        <Field name="batteryInfo" label="Battery info" defaultValue={initial?.batteryInfo} />
        <Field name="connectionType" label="Connection type" defaultValue={initial?.connectionType} />
        <Field name="purchaseDate" label="Purchase date" type="date" defaultValue={initial?.purchaseDate ? new Date(initial.purchaseDate).toISOString().slice(0,10) : ""} />
        <Field name="price" label="Price" type="number" step="0.01" defaultValue={initial?.price} />
        <Field name="serialNumber" label="Serial number" defaultValue={initial?.serialNumber} />
        <Field name="imageUrl" label="Image URL" defaultValue={initial?.imageUrl} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="fixedStroke" defaultChecked={initial?.fixedStroke} /> Fixed stroke
      </label>
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

function Field({ name, label, type = "text", ...rest }: any) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <input name={name} type={type} {...rest} className="w-full bg-background border border-border px-3 py-2 text-sm" />
    </div>
  );
}
