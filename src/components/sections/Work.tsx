import { profile, projects } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { SectionLabel } from "./SectionLabel";
import { WorkList } from "./WorkList";

const HEADING = [
  { text: "Selected", tone: "bright" },
  { text: "work", tone: "dim" },
] as const;

export function Work() {
  return (
    <section id="work" aria-labelledby="work-heading" className="mx-auto max-w-7xl px-5 py-32 sm:px-8 sm:py-40">
      <SectionLabel index="03">Projects</SectionLabel>
      <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SplitHeading id="work-heading" lines={HEADING} className="text-[clamp(3.5rem,11vw,9rem)]" />
        <p className="max-w-sm text-muted">
          Systems I built to understand them: an AI code reviewer, a coding agent, a distributed typeahead and a RAG
          pipeline.
        </p>
      </div>

      <Reveal>
        <WorkList projects={projects} />
      </Reveal>

      <a
        href={`${profile.github}?tab=repositories`}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-10 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.1em] text-bone"
      >
        All repositories on GitHub
        <span aria-hidden="true" className="text-amber transition-transform duration-200 ease-[var(--ease-out-strong)] group-hover:translate-x-1">
          →
        </span>
      </a>
    </section>
  );
}
