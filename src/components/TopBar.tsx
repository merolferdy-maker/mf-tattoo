"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, Plus } from "lucide-react";
import { useState } from "react";

export default function TopBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [q, setQ] = useState("");
  if (!session) return null;
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
      <div className="text-xs text-muted">{session.user?.email}</div>
    </header>
  );
}
