export function parseImageUrls(value?: string | null): string[] {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === "string" && x.length > 0);
    if (typeof parsed === "string" && parsed.length > 0) return [parsed];
  } catch {
    // not JSON, fall back to comma-separated
  }
  return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
}

export function serializeImageUrls(urls: string[]): string | null {
  const clean = urls.filter(Boolean);
  if (clean.length === 0) return null;
  return JSON.stringify(clean);
}
