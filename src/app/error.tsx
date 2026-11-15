"use client";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="p-6 text-red-400">
      <div className="font-medium">Errore: {error.message}</div>
      <div className="text-xs text-muted mt-2">Digest: {error.digest}</div>
      <button onClick={reset} className="mt-3 px-3 py-1 border border-border text-sm">Riprova</button>
    </div>
  );
}
