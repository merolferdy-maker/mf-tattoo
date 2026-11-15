"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  return (
    <aside className={`hidden md:flex flex-col border-r border-border bg-background-secondary ${collapsed ? "w-16" : "w-56"} transition-all duration-200`}>
      <div className="px-4 py-5 border-b border-border">
        <a href="/dashboard" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-card border border-border flex items-center justify-center text-accent font-bold text-xs tracking-wider">M&F</div>
          {!collapsed && <span className="text-xs font-semibold tracking-[0.2em] text-muted">TATTOO STUDIO</span>}
        </a>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {nav.map((n) => {
          const Icon = n.icon;
          const active = pathname === n.href || pathname?.startsWith(n.href + "/");
          return (
            <a key={n.href} href={n.href} className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors border-l-2 ${active ? "text-foreground bg-card/80 border-accent" : "text-muted hover:text-foreground hover:bg-card/60 border-transparent"}`}>
              <Icon size={15} />
              {!collapsed && <span className="tracking-wide">{n.label}</span>}
            </a>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <a href="/api/auth/signout" className="flex items-center gap-3 px-2 py-2 text-sm text-muted hover:text-foreground w-full">
          <LogOut size={16} />
          {!collapsed && <span>Sign out</span>}
        </a>
      </div>
    </aside>
  );
}
