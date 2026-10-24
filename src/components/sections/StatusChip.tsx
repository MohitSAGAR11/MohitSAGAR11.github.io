import type { PrStatus } from "@/content/site";
import { statusLabel } from "@/lib/text";

export function StatusChip({ status }: { status: PrStatus }) {
  const tone = status === "merged" ? "border-merged/40 text-merged" : "border-amber/40 text-amber";
  return (
    <span className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${tone}`}>
      {statusLabel(status)}
    </span>
  );
}
