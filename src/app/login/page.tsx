"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid credentials");
    else window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-card border border-border p-6 space-y-4">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto bg-accent/10 border border-border flex items-center justify-center text-accent font-bold">M&F</div>
          <h1 className="mt-3 text-lg font-semibold">Tattoo Studio Manager</h1>
          <p className="text-xs text-muted">Sign in to your studio</p>
        </div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full bg-background border border-border px-3 py-2 text-sm" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full bg-background border border-border px-3 py-2 text-sm" />
        {error && <div className="text-red-400 text-xs">{error}</div>}
        <button disabled={loading} className="w-full bg-foreground text-background py-2 text-sm font-medium disabled:opacity-50">{loading ? "..." : "Sign in"}</button>
        <div className="text-xs text-muted text-center">
          No account? <a href="/register" className="text-foreground underline">Register</a>
        </div>
      </form>
    </div>
  );
}
