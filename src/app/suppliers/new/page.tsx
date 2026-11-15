import { SupplierForm } from "@/components/SupplierForm";
export default function NewSupplierPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">New supplier</h1>
      <SupplierForm />
    </div>
  );
}
