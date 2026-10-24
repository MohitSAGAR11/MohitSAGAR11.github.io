import type { PrStatus } from "@/content/site";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

// Parsed by hand so a date never shifts a day in the viewer's time zone.
export function formatDate(iso: string): string {
  const match = ISO_DATE.exec(iso);
  const month = match ? MONTHS[Number(match[2]) - 1] : undefined;
  if (!match || !month) throw new Error(`Invalid ISO date: ${iso}`);
  return `${month} ${Number(match[3])}, ${match[1]}`;
}

// Files in public/ are served from the site root, so "mohit.png" and
// "public/mohit.png" both mean "/mohit.png". Absolute URLs pass through.
export function publicUrl(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || /^[a-z]+:/i.test(trimmed) || trimmed.startsWith("/")) return trimmed;
  return `/${trimmed.replace(/^public\//, "")}`;
}

export function repoName(fullName: string): string {
  return fullName.split("/").pop() ?? fullName;
}

export function statusLabel(status: PrStatus): string {
  return status === "merged" ? "Merged" : "In review";
}
