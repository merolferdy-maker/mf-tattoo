"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Cpu, Droplets, Package, Menu } from "lucide-react";
import { useState } from "react";

const primary = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/machines", label: "Machines", icon: Cpu },
  { href: "/wash-lab", label: "Wash", icon: Droplets },
  { href: "/stock", label: "Stock", icon: Package },
];

const all = [
  { href: "/presets", label: "Presets" },
  { href: "/inks", label: "Inks" },
  { href: "/cartridges", label: "Cartridges" },
  { href: "/consumables", label: "Consumables" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/notes", label: "Notes" },
  { href: "/sessions", label: "Sessions" },
  { href: "/favorites", label: "Favorites" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-secondary border-t border-border flex justify-around py-2">
        {primary.map((p) => {
          const Icon = p.icon;
          const active = pathname?.startsWith(p.href);
          return (
            <Link key={p.href} href={p.href} className={`flex flex-col items-center text-[10px] ${active ? "text-foreground" : "text-muted"}`}>
              <Icon size={20} />
              <span>{p.label}</span>
            </Link>
          );
        })}
        <button onClick={() => setOpen(true)} className="flex flex-col items-center text-[10px] text-muted">
          <Menu size={20} />
          <span>More</span>
        </button>
      </nav>
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80" onClick={() => setOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-background-secondary border-t border-border p-4 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
            {all.map((a) => (
              <Link key={a.href} href={a.href} onClick={() => setOpen(false)} className="px-3 py-2 text-sm border border-border rounded hover:bg-card">
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
