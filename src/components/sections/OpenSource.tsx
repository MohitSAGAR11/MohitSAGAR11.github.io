import { bugTrails, contributions } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { formatDate, repoName } from "@/lib/text";
import { BugTrails } from "./BugTrails";
import { SectionLabel } from "./SectionLabel";
import { StatusChip } from "./StatusChip";

const HEADING = [
  { text: "Open", tone: "bright" },
  { text: "source", tone: "dim" },
] as const;

export function OpenSource() {
  return (
    <section id="open-source" aria-labelledby="oss-heading" className="mx-auto max-w-7xl px-5 py-32 sm:px-8 sm:py-40">
      <SectionLabel index="02">Open source</SectionLabel>
      <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SplitHeading id="oss-heading" lines={HEADING} className="text-[clamp(3.5rem,11vw,9rem)]" />
        <p className="max-w-md text-muted">
          Mostly{" "}
          <a href="https://github.com/internetarchive/openlibrary" target="_blank" rel="noopener noreferrer" className="text-bone underline decoration-dim underline-offset-4 hover:decoration-amber">
            Open Library
          </a>{" "}
          and the{" "}
          <a href="https://github.com/hyperjump-io" target="_blank" rel="noopener noreferrer" className="text-bone underline decoration-dim underline-offset-4 hover:decoration-amber">
            hyperjump
          </a>{" "}
          JSON Schema libraries. Where I can, I file the bug before I fix it, so the maintainers see the problem
          before they see my patch.
        </p>
      </div>

      <h3 className="label mb-5">Bug trails</h3>
      <BugTrails trails={bugTrails} />

      <h3 className="label mt-20 mb-5">Pull requests</h3>
      <Reveal as="ul" className="border-t border-line">
        {contributions.map((pr) => (
          <li key={pr.href} data-reveal-item className="border-b border-line">
            <a
              href={pr.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid gap-x-6 gap-y-1 py-5 transition-colors duration-200 hover:bg-surface sm:grid-cols-[7.5rem_1fr_auto] sm:items-center sm:px-3"
            >
              <span className="font-mono text-xs text-muted">{formatDate(pr.date)}</span>
              <span className="flex flex-col gap-1">
                <span className="text-bone transition-colors duration-200 group-hover:text-amber">{pr.title}</span>
                <span className="font-mono text-xs text-muted">
                  {repoName(pr.repo)} #{pr.number}
                </span>
              </span>
              <span className="flex items-center gap-4">
                <StatusChip status={pr.status} />
                <span aria-hidden="true" className="text-muted transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-amber">
                  ↗
                </span>
              </span>
            </a>
          </li>
        ))}
      </Reveal>
    </section>
  );
}
