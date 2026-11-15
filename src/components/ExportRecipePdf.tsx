"use client";
import jsPDF from "jspdf";

export default function ExportRecipePdf({ recipe }: { recipe: any }) {
  function download() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(recipe.name, 10, 15);
    doc.setFontSize(10);
    let y = 25;
    const lines = [
      `Type: ${recipe.type}`,
      `Base ink: ${recipe.baseInkBrand || ""} ${recipe.baseInkName || ""}`,
      `Diluent: ${recipe.diluentBrand || ""} ${recipe.diluentType || ""}`,
      `Total volume: ${recipe.totalVolume ?? "-"}`,
      `Ink quantity: ${recipe.inkQuantity ?? "-"}`,
      `Diluent quantity: ${recipe.diluentQuantity ?? "-"}`,
      `Ratio: ${recipe.ratio ?? "-"}`,
      `Percentage: ${recipe.percentage ?? "-"}`,
      `Notes: ${recipe.notes ?? ""}`,
    ];
    for (const l of lines) { doc.text(l, 10, y); y += 6; }
    y += 4;
    doc.text("Shades:", 10, y); y += 6;
    for (const s of recipe.shades || []) {
      doc.text(`${s.name} #${s.number}: ink ${s.inkPercentage ?? "-"}% / diluent ${s.diluentPercentage ?? "-"}% · ${s.inkQuantity ?? "-"}ml/${s.diluentQuantity ?? "-"}ml`, 10, y);
      y += 6;
    }
    doc.save(`${recipe.name}.pdf`);
  }
  return <button onClick={download} className="px-4 py-2 border border-border text-sm">Export PDF</button>;
}
