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
      `Diluent: ${recipe.diluentBrand || ""}`,
      `Drop ink: ${recipe.inkQuantity ?? "-"}`,
      `Drop diluent: ${recipe.diluentQuantity ?? "-"}`,
      `Notes: ${recipe.notes ?? ""}`,
    ];
    for (const l of lines) { doc.text(l, 10, y); y += 6; }
    doc.save(`${recipe.name}.pdf`);
  }
  return <button onClick={download} className="px-4 py-2 border border-border text-sm rounded-sm">Export PDF</button>;
}
