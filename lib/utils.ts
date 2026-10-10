export function bnNumber(value: number | string): string {
  const map: Record<string, string> = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯", ",": ",", ".": "." };
  return String(value).replace(/[0-9,.]/g, (c) => map[c] ?? c);
}

export function parseNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const normalized = String(value ?? "")
    .replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)))
    .replace(/,/g, "");
  const n = Number.parseFloat(normalized.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0980-\u09ff]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(value: number): string {
  return bnNumber(new Intl.NumberFormat("en-US").format(Math.round(value)));
}

export function changeText(change: number): string {
  if (change > 0) return `▲ ${bnNumber(change.toFixed(1))}%`;
  if (change < 0) return `▼ ${bnNumber(Math.abs(change).toFixed(1))}%`;
  return "— ০.০%";
}
