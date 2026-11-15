"use client";
import { createInk, updateInk } from "@/actions/inks";
import { useRouter } from "next/navigation";

export function InkForm({ suppliers, initial }: { suppliers: any[]; initial?: any }) {
  const router = useRouter();
  const action = initial ? updateInk.bind(null, initial.id) : createInk;
  return (
    <form action={action} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field name="brand" label="Brand" defaultValue={initial?.brand} required />
        <Field name="productName" label="Product name" defaultValue={initial?.productName} required />
        <Field name="colorName" label="Color name" defaultValue={initial?.colorName} required />
        <Field name="colorCode" label="Color code" defaultValue={initial?.colorCode} />
        <Field name="category" label="Category" defaultValue={initial?.category} />
        <Field name="bottleVolume" label="Bottle volume (ml)" type="number" step="1" min="0" defaultValue={initial?.bottleVolume} />
        <Field name="currentQuantity" label="Current quantity" type="number" step="1" min="0" defaultValue={initial?.currentQuantity} />
        <Field name="initialQuantity" label="Initial quantity" type="number" step="1" min="0" defaultValue={initial?.initialQuantity} />
        <Field name="minStockLevel" label="Min stock level" type="number" step="1" min="0" defaultValue={initial?.minStockLevel} />
        <Field name="purchaseDate" label="Purchase date" type="date" defaultValue={initial?.purchaseDate ? new Date(initial.purchaseDate).toISOString().slice(0,10) : ""} />
        <Field name="openingDate" label="Opening date" type="date" defaultValue={initial?.openingDate ? new Date(initial.openingDate).toISOString().slice(0,10) : ""} />
        <Field name="expirationDate" label="Expiration date" type="date" defaultValue={initial?.expirationDate ? new Date(initial.expirationDate).toISOString().slice(0,10) : ""} />
        <Field name="batchNumber" label="Batch/lot" defaultValue={initial?.batchNumber} />
        <div>
          <label className="block text-xs text-muted mb-1">Supplier</label>
          <select name="supplierId" defaultValue={initial?.supplierId ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <Field name="price" label="Price" type="number" step="0.01" defaultValue={initial?.price} />
        <Field name="imageUrl" label="Image URL" defaultValue={initial?.imageUrl} />
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

function Field({ name, label, type = "text", required, ...rest }: any) {
  return (
    <div>
      <label className="block text-xs text-muted mb-1">{label}</label>
      <input name={name} type={type} required={required} {...rest} className="w-full bg-background border border-border px-3 py-2 text-sm" />
    </div>
  );
}
