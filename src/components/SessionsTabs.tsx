import Link from "next/link";

export function SessionsTabs({ active }: { active: "log" | "portfolio" }) {
  const base = "px-4 py-2 text-sm rounded-sm border transition-colors";
  return (
    <div className="flex gap-2 mb-6">
      <Link href="/sessions" className={`${base} ${active === "log" ? "bg-card border-border-hover text-foreground" : "border-border text-muted hover:text-foreground"}`}>Session Log</Link>
      <Link href="/sessions/portfolio" className={`${base} ${active === "portfolio" ? "bg-card border-border-hover text-foreground" : "border-border text-muted hover:text-foreground"}`}>Tattoo Portfolio</Link>
    </div>
  );
}
