"use client";
import { createSupplier, updateSupplier } from "@/actions/suppliers";
import { useRouter } from "next/navigation";

export function SupplierForm({ initial }: { initial?: any }) {
  const router = useRouter();
  const action = initial ? updateSupplier.bind(null, initial.id) : createSupplier;
  return (
    <form action={action} className="space-y-3 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field name="name" label="Name" defaultValue={initial?.name} required />
        <Field name="website" label="Website" defaultValue={initial?.website} />
        <Field name="email" label="Email" defaultValue={initial?.email} />
        <Field name="phone" label="Phone" defaultValue={initial?.phone} />
        <Field name="contactPerson" label="Contact person" defaultValue={initial?.contactPerson} />
        <Field name="address" label="Address" defaultValue={initial?.address} />
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
