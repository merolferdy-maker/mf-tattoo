"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, Plus, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function TopBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [dark, setDark] = useState(false);
  if (!session) return null;

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved ? saved === "dark" : prefersDark;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
      <div className="flex-1 max-w-xl relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
          placeholder="Search machines, inks, recipes..."
          className="w-full bg-card border border-border rounded px-9 py-2 text-sm focus:outline-none focus:border-accent"
        />
      </div>
      <button onClick={() => router.push("/quick-add")} className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm bg-card border border-border rounded hover:bg-background-secondary">
        <Plus size={14} /> Quick add
      </button>
      <button onClick={toggleTheme} className="p-2 rounded bg-card border border-border hover:bg-background-secondary" aria-label={dark ? "Light mode" : "Dark mode"}>
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <div className="text-xs text-muted hidden lg:block">{session.user?.email}</div>
    </header>
  );
}
