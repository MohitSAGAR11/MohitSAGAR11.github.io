"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import type { BugTrail } from "@/content/site";
import { gsap, prefersReducedMotion, registerGsap, REVEAL_START } from "@/lib/motion";
import { repoName } from "@/lib/text";
import { StatusChip } from "./StatusChip";

type Props = {
  trails: readonly BugTrail[];
};

// Each trail draws left to right: found → filed → fixed. The connectors
// draw between steps to show cause and effect, not as decoration.
export function BugTrails({ trails }: Props) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const rows = gsap.utils.toArray<HTMLElement>("[data-trail]", ref.current);
      if (prefersReducedMotion()) {
        gsap.set("[data-step]", { opacity: 1 });
        return;
      }

      rows.forEach((row) => {
        const steps = row.querySelectorAll("[data-step]");
        const links = row.querySelectorAll("[data-link]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: REVEAL_START, once: true } });
        steps.forEach((step, index) => {
          tl.fromTo(step, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }, index === 0 ? 0 : "-=0.15");
          const link = links[index];
          if (link) tl.fromTo(link, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, "-=0.35");
        });
      });
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="flex flex-col gap-4">
      {trails.map((trail) => (
        <li
          key={trail.issue.href}
          data-trail
          className="grid gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-6 md:grid-cols-[1.6fr_auto_1fr_auto_1fr] md:items-center md:gap-4"
        >
          <div data-step className="trail-step">
            <p className="label mb-2">Found · {repoName(trail.repo)}</p>
            <p className="text-bone">{trail.bug}</p>
          </div>
          <Connector />
          <a data-step href={trail.issue.href} target="_blank" rel="noopener noreferrer" className="trail-step group">
            <p className="label mb-2">Filed</p>
            <p className="font-mono text-bone transition-colors duration-200 group-hover:text-amber">
              Issue #{trail.issue.number} <span aria-hidden="true">↗</span>
            </p>
          </a>
          <Connector />
          <a data-step href={trail.fix.href} target="_blank" rel="noopener noreferrer" className="trail-step group">
            <p className="label mb-2">Fixed</p>
            <p className="font-mono text-bone transition-colors duration-200 group-hover:text-amber">
              PR #{trail.fix.number} <span aria-hidden="true">↗</span>
            </p>
            <StatusChip status={trail.fix.status} />
          </a>
        </li>
      ))}
    </ol>
  );
}

function Connector() {
  return (
    <span aria-hidden="true" className="hidden h-px w-12 bg-line md:block">
      <span data-link className="block h-px w-full origin-left bg-amber" />
    </span>
  );
}
