import Link from "next/link";
import { LayoutDashboard, Cpu, Droplets, Package } from "lucide-react";

const primary = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/machines", label: "Machines", icon: Cpu },
  { href: "/wash-lab", label: "Wash", icon: Droplets },
  { href: "/stock", label: "Stock", icon: Package },
];

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-secondary border-t border-border flex justify-around py-2">
      {primary.map((p) => {
        const Icon = p.icon;
        return (
          <Link key={p.href} href={p.href} className="flex flex-col items-center text-[10px] text-muted">
            <Icon size={20} />
            <span>{p.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
