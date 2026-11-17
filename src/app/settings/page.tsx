"use client";
import { useState } from "react";
import { PhotoUploader } from "@/components/PhotoUploader";
import { uploadBackground } from "@/actions/settings";

export default function SettingsPage() {
  const [msg, setMsg] = useState("");
  async function importFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const json = JSON.parse(text);
    const res = await fetch("/api/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(json) });
    const d = await res.json();
    setMsg(`Imported ${d.imported} records`);
  }
  async function handleBgUpload(formData: FormData) {
    try {
      await uploadBackground(formData);
      setMsg("Background updated — refresh to see it");
    } catch (e) {
      setMsg("Upload failed: " + (e instanceof Error ? e.message : String(e)));
    }
  }
  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-xl font-semibold">Settings & backup</h1>

      <div className="border border-border p-4 space-y-2">
        <div className="text-sm font-medium">Custom background</div>
        <p className="text-xs text-muted">Upload an image to replace the animated gradient background.</p>
        <form action={handleBgUpload} className="mt-2">
          <PhotoUploader />
          <button type="submit" className="mt-2 px-4 py-2 bg-foreground text-background text-sm rounded-sm hover:opacity-90">Save background</button>
        </form>
        {msg && <div className="text-xs text-muted mt-2">{msg}</div>}
      </div>

      <div className="border border-border p-4 space-y-2">
        <div className="text-sm font-medium">Backup (JSON)</div>
        <a href="/api/export/json" className="inline-block px-4 py-2 bg-foreground text-background text-sm">Download full backup</a>
      </div>

      <div className="border border-border p-4 space-y-2">
        <div className="text-sm font-medium">CSV exports</div>
        <div className="flex flex-wrap gap-2">
          {["inks","machines","cartridges","consumables","movements"].map((e) => (
            <a key={e} href={`/api/export/csv?entity=${e}`} className="px-3 py-2 border border-border text-sm">{e}</a>
          ))}
        </div>
      </div>

      <div className="border border-border p-4 space-y-2">
        <div className="text-sm font-medium">Restore from backup</div>
        <input type="file" accept="application/json" onChange={importFile} className="text-sm" />
      </div>

      <div className="border border-border p-4 space-y-2">
        <div className="text-sm font-medium">PDF export</div>
        <div className="text-xs text-muted">Recipe PDF export available on each recipe page.</div>
      </div>
    </div>
  );
}
