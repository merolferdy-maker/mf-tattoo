"use client";
import { createCartridge, updateCartridge } from "@/actions/cartridges";
import { useRouter } from "next/navigation";

export function CartridgeForm({ suppliers, initial }: { suppliers: any[]; initial?: any }) {
  const router = useRouter();
  const action = initial ? updateCartridge.bind(null, initial.id) : createCartridge;
  return (
    <form action={action} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field name="brand" label="Brand" defaultValue={initial?.brand} required />
        <Field name="productName" label="Product name" defaultValue={initial?.productName} required />
        <Field name="configuration" label="Configuration (RL/RS/M1...)" defaultValue={initial?.configuration} />
        <Field name="needleCount" label="Needle count" type="number" step="1" min="0" defaultValue={initial?.needleCount} />
        <Field name="needleDiameter" label="Needle diameter" type="number" step="0.01" defaultValue={initial?.needleDiameter} />
        <Field name="taper" label="Taper" defaultValue={initial?.taper} />
        <Field name="cartridgeType" label="Cartridge type" defaultValue={initial?.cartridgeType} />
        <Field name="compatibility" label="Compatibility notes" defaultValue={initial?.compatibility} />
        <Field name="quantity" label="Quantity" type="number" step="1" min="0" defaultValue={initial?.quantity} />
        <Field name="initialQuantity" label="Initial quantity" type="number" step="1" min="0" defaultValue={initial?.initialQuantity} />
        <Field name="minStockLevel" label="Min stock level" type="number" step="1" min="0" defaultValue={initial?.minStockLevel} />
        <Field name="purchasePrice" label="Purchase price" type="number" step="0.01" defaultValue={initial?.purchasePrice} />
        <div>
          <label className="block text-xs text-muted mb-1">Supplier</label>
          <select name="supplierId" defaultValue={initial?.supplierId ?? ""} className="w-full bg-background border border-border px-3 py-2 text-sm">
            <option value="">None</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
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
