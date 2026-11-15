"use client";
import { createConsumable, updateConsumable } from "@/actions/consumables";
import { useRouter } from "next/navigation";

export function ConsumableForm({ suppliers, initial }: { suppliers: any[]; initial?: any }) {
  const router = useRouter();
  const action = initial ? updateConsumable.bind(null, initial.id) : createConsumable;
  return (
    <form action={action} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field name="name" label="Name" defaultValue={initial?.name} required />
        <Field name="brand" label="Brand" defaultValue={initial?.brand} />
        <Field name="category" label="Category" defaultValue={initial?.category} />
        <Field name="quantity" label="Quantity" type="number" step="1" min="0" defaultValue={initial?.quantity} />
        <Field name="unit" label="Unit" defaultValue={initial?.unit} />
        <Field name="minStockLevel" label="Min stock level" type="number" step="1" min="0" defaultValue={initial?.minStockLevel} />
        <Field name="price" label="Price" type="number" step="0.01" defaultValue={initial?.price} />
        <div>
          <label className="block text-xs text-muted mb-1">Supplier</label>
          <select name="supplierId" defaultValue={initial?.supplierId ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <Field name="purchaseDate" label="Purchase date" type="date" defaultValue={initial?.purchaseDate ? new Date(initial.purchaseDate).toISOString().slice(0,10) : ""} />
        <Field name="expirationDate" label="Expiration date" type="date" defaultValue={initial?.expirationDate ? new Date(initial.expirationDate).toISOString().slice(0,10) : ""} />
        <Field name="imageUrl" label="Image URL" defaultValue={initial?.imageUrl} />
      </div>
      <textarea name="notes" defaultValue={initial?.notes ?? ""} placeholder="Notes" className="w-full bg-background border border-border px-3 py-2 text-sm min-h-[80px]" />
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
