import { cn } from "@/lib/utils";
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("bg-card border border-border", className)}>{children}</div>;
}
export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-4 py-3 border-b border-border flex items-center justify-between", className)}>{children}</div>;
}
export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
