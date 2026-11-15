import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="border border-dashed border-border rounded-sm p-10 text-center">
      <div className="text-foreground font-medium">{title}</div>
      {description && <div className="text-sm text-muted mt-1">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Button({ children, variant = "primary", className, ...props }: { children: React.ReactNode; variant?: "primary" | "secondary" | "danger" | "ghost"; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-foreground text-background hover:opacity-90",
    secondary: "bg-card border border-border text-foreground hover:bg-card-hover hover:border-border-hover",
    danger: "bg-transparent border border-red-900/60 text-red-400 hover:bg-red-900/20",
    ghost: "text-muted hover:text-foreground hover:bg-card/60",
  };
  return <button className={cn(base, variants[variant], className)} {...props}>{children}</button>;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full bg-card border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover focus:bg-background transition-colors", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("w-full bg-card border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:border-border-hover focus:bg-background transition-colors", className)} {...props}>{children}</select>;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("w-full bg-card border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-border-hover focus:bg-background transition-colors min-h-[100px] resize-y", className)} {...props} />;
}

export function Badge({ children, variant = "default", className }: { children: React.ReactNode; variant?: "default" | "accent" | "danger" | "muted"; className?: string }) {
  const variants = {
    default: "bg-card border border-border text-foreground",
    accent: "bg-accent/10 border border-accent/30 text-accent",
    danger: "bg-red-900/20 border border-red-900/40 text-red-400",
    muted: "bg-card border border-border text-muted",
  };
  return <span className={cn("inline-flex items-center px-2 py-0.5 text-xs rounded-sm", variants[variant], className)}>{children}</span>;
}

export function StatCard({ label, value, hint }: { label: string; value: any; hint?: string }) {
  return (
    <div className="bg-card border border-border rounded-sm p-5 card-shadow hover:border-border-hover transition-colors">
      <div className="text-xs text-muted uppercase tracking-wider">{label}</div>
      <div className="text-2xl font-semibold mt-2 tracking-tight">{value}</div>
      {hint && <div className="text-xs text-muted mt-1">{hint}</div>}
    </div>
  );
}
