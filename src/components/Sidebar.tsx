"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Cpu, Settings2, Droplets, Beaker, Package, Syringe, Boxes, Truck, NotebookPen, CalendarClock, BarChart3, Star, Search, ShieldCheck, LogOut } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/machines", label: "Machines", icon: Cpu },
  { href: "/presets", label: "Presets", icon: Settings2 },
  { href: "/wash-lab", label: "Wash Lab", icon: Droplets },
  { href: "/inks", label: "Inks", icon: Beaker },
  { href: "/cartridges", label: "Cartridges", icon: Syringe },
  { href: "/consumables", label: "Consumables", icon: Boxes },
  { href: "/suppliers", label: "Suppliers", icon: Truck },
  { href: "/notes", label: "Notes", icon: NotebookPen },
  { href: "/sessions", label: "Sessions", icon: CalendarClock },
  { href: "/stock", label: "Stock", icon: Package },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: ShieldCheck },
];

export default function Sidebar({ collapsed }: { collapsed?: boolean }) {
  return (
    <aside className={`hidden md:flex flex-col border-r border-border bg-background-secondary ${collapsed ? "w-16" : "w-60"} transition-all duration-200`}>
      <div className="px-4 py-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent/10 border border-border flex items-center justify-center text-accent font-bold text-sm">M&F</div>
          {!collapsed && <span className="text-sm font-semibold tracking-wide">TATTOO STUDIO</span>}
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {nav.map((n) => {
          const Icon = n.icon;
          return (
            <Link key={n.href} href={n.href} className="flex items-center gap-3 px-4 py-2 text-sm text-muted hover:text-foreground hover:bg-card transition-colors">
              <Icon size={16} />
              {!collapsed && <span>{n.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="flex items-center gap-3 px-2 py-2 text-sm text-muted hover:text-foreground w-full">
          <LogOut size={16} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
