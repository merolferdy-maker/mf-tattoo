"use client";
import { useState } from "react";

export function WashCalculator() {
  const [finalVolume, setFinalVolume] = useState(10);
  const [inkPct, setInkPct] = useState(20);
  const [unit, setUnit] = useState<"ml" | "drops">("ml");
  const dropsPerMl = 20;
  const inkVol = (finalVolume * inkPct) / 100;
  const dilVol = finalVolume - inkVol;
  const inkDrops = Math.round(inkVol * dropsPerMl);
  const dilDrops = Math.round(dilVol * dropsPerMl);
  return (
    <div className="border border-border p-4 bg-card space-y-3">
      <div className="text-sm font-medium">Recipe calculator</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div>
          <label className="block text-xs text-muted mb-1">Final volume</label>
          <input type="number" value={finalVolume} onChange={(e) => setFinalVolume(Number(e.target.value))} className="w-full bg-background border border-border px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Ink %</label>
          <input type="number" value={inkPct} onChange={(e) => setInkPct(Number(e.target.value))} className="w-full bg-background border border-border px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-muted mb-1">Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value as any)} className="w-full bg-background border border-border px-2 py-1 text-sm">
            <option value="ml">ml</option>
            <option value="drops">drops</option>
          </select>
        </div>
      </div>
      <div className="text-sm">
        {unit === "ml" ? (
          <span>Ink: {inkVol.toFixed(2)} ml · Diluent: {dilVol.toFixed(2)} ml · Total: {finalVolume} ml</span>
        ) : (
          <span>Ink: {inkDrops} drops · Diluent: {dilDrops} drops · Total: {inkDrops + dilDrops} drops</span>
        )}
        <span className="text-muted ml-2">({inkPct}% / {100 - inkPct}%)</span>
      </div>
      <div className="text-xs text-muted">1 ml ≈ 20 drops</div>
    </div>
  );
}
