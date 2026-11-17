import { cn } from "@/lib/utils";
export function Card({ className, children, elevated = false }: { className?: string; children: React.ReactNode; elevated?: boolean }) {
  return <div className={cn("bg-card border border-border rounded-sm", elevated ? "shadow-elevated hover:shadow-xl" : "shadow-card hover:shadow-elevated", "transition-all duration-200", className)}>{children}</div>;
}
export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-5 py-3 border-b border-border flex items-center justify-between", className)}>{children}</div>;
}
export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
