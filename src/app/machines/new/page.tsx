import { MachineForm } from "@/components/MachineForm";
export default function NewMachinePage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-semibold mb-4">New machine</h1>
      <MachineForm />
    </div>
  );
}
