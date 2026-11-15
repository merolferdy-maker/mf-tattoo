"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, name }) });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Registration failed");
      return;
    }
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border p-6 space-y-4">
        <h1 className="text-lg font-semibold text-center">Create account</h1>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full bg-background border border-border px-3 py-2 text-sm" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full bg-background border border-border px-3 py-2 text-sm" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password (min 6)" required className="w-full bg-background border border-border px-3 py-2 text-sm" />
        {error && <div className="text-red-400 text-xs">{error}</div>}
        <button disabled={loading} className="w-full bg-foreground text-background py-2 text-sm font-medium disabled:opacity-50">{loading ? "..." : "Register"}</button>
        <div className="text-xs text-muted text-center">
          Have account? <a href="/login" className="text-foreground underline">Sign in</a>
        </div>
      </form>
    </div>
  );
}
