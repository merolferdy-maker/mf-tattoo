"use client";
import { useRef, useState } from "react";

async function compress(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  const maxDim = 1600;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.75);
}

export function PhotoUploader({ initial }: { initial?: string[] }) {
  const [images, setImages] = useState<string[]>(initial ?? []);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setBusy(true);
    try {
      const next: string[] = [];
      for (const f of files) {
        if (!f.type.startsWith("image/")) continue;
        next.push(await compress(f));
      }
      setImages((prev) => [...prev, ...next]);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addUrl() {
    const u = url.trim();
    if (!u) return;
    setImages((prev) => [...prev, u]);
    setUrl("");
  }

  function move(i: number, delta: number) {
    setImages((prev) => {
      const next = [...prev];
      const j = i + delta;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function remove(i: number) {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <input type="hidden" name="imageUrls" value={JSON.stringify(images)} />
      <label className="block text-xs text-muted mb-1">Tattoo photos</label>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFiles}
          className="hidden"
          id="photo-input"
        />
        <label
          htmlFor="photo-input"
          className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border text-sm rounded-sm cursor-pointer hover:bg-card-hover"
        >
          {busy ? "Loading..." : "+ Add photos"}
        </label>

        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="or paste an image URL"
            className="flex-1 bg-background border border-border px-3 py-2 text-sm rounded-sm"
          />
          <button type="button" onClick={addUrl} className="px-3 py-2 border border-border text-sm rounded-sm hover:bg-card-hover">Add</button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {images.map((src, i) => (
            <div key={i} className="relative group bg-black border border-border rounded-sm overflow-hidden w-fit mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`photo ${i + 1}`} className="h-[20rem] w-auto object-contain" />
              <div className="absolute top-2 right-2 grid grid-cols-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => move(i, -2)} className="w-7 h-7 flex items-center justify-center rounded-sm bg-black/70 text-white text-sm" aria-label="Move up">↑</button>
                <button type="button" onClick={() => move(i, 2)} className="w-7 h-7 flex items-center justify-center rounded-sm bg-black/70 text-white text-sm" aria-label="Move down">↓</button>
                <button type="button" onClick={() => move(i, -1)} className="w-7 h-7 flex items-center justify-center rounded-sm bg-black/70 text-white text-sm" aria-label="Move left">←</button>
                <button type="button" onClick={() => move(i, 1)} className="w-7 h-7 flex items-center justify-center rounded-sm bg-black/70 text-white text-sm" aria-label="Move right">→</button>
                <button type="button" onClick={() => remove(i)} className="col-span-2 w-full h-7 flex items-center justify-center rounded-sm bg-black/70 text-white text-sm" aria-label="Remove photo">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-muted mt-2">{images.length} photo{images.length === 1 ? "" : "s"} · they are saved with this session</p>
    </div>
  );
}
