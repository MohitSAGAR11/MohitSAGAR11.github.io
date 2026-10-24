"use client";

import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import type { Project } from "@/content/site";
import { gsap, hasFinePointer, prefersReducedMotion, registerGsap } from "@/lib/motion";

type Props = {
  projects: readonly Project[];
};

const FOLLOW = { duration: 0.55, ease: "power3.out" } as const;
const PREVIEW_OFFSET = 28; // px between the cursor and the preview's corner
const PREVIEW_ROW = "9.5rem"; // height of one project's preview inside the card

// Numbered project rows. On a mouse, a terminal preview follows the cursor
// and slides to the hovered project, showing what the row is about before you
// open it. Touch devices get the same content inline under each title.
export function WorkList({ projects }: Props) {
  const listRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useGSAP(
    (_context, contextSafe) => {
      registerGsap();
      const list = listRef.current;
      const preview = previewRef.current;
      if (!list || !preview || !contextSafe) return;
      gsap.set(preview, { autoAlpha: 0, scale: 0.92 });

      let current: number | null = null;
      const show = (index: number) => {
        if (index === current) return;
        current = index;
        setActiveIndex(index);
        gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      };

      const handleMove = contextSafe((event: PointerEvent) => {
        if (event.pointerType !== "mouse" || !hasFinePointer()) return;
        const row = (event.target as Element).closest<HTMLElement>("[data-index]");
        if (row) show(Number(row.dataset.index));
        // Sit above-right of the cursor, over the dimmed row before, so the
        // hovered row's own text stays readable.
        const target = { x: event.clientX + PREVIEW_OFFSET, y: event.clientY - preview.offsetHeight - PREVIEW_OFFSET };
        if (prefersReducedMotion()) gsap.set(preview, target);
        else gsap.to(preview, { ...target, ...FOLLOW, overwrite: "auto" });
      });

      const handleLeave = contextSafe(() => {
        current = null;
        setActiveIndex(null);
        gsap.to(preview, { autoAlpha: 0, scale: 0.92, duration: 0.25, ease: "power3.out", overwrite: "auto" });
      });

      list.addEventListener("pointermove", handleMove);
      list.addEventListener("pointerleave", handleLeave);
      return () => {
        list.removeEventListener("pointermove", handleMove);
        list.removeEventListener("pointerleave", handleLeave);
      };
    },
    { scope: listRef },
  );

  return (
    <div className="relative">
      <ol ref={listRef} className="border-t border-line">
        {projects.map((project, index) => {
          const isDimmed = activeIndex !== null && activeIndex !== index;
          return (
            <li key={project.slug} data-reveal-item data-index={index} className="border-b border-line">
              <article
                className={`grid gap-4 py-8 transition-opacity duration-300 sm:grid-cols-[4rem_1fr] lg:grid-cols-[4rem_1fr_18rem] lg:items-start lg:gap-8 ${
                  isDimmed ? "opacity-35" : "opacity-100"
                }`}
              >
                <span className="font-mono text-sm text-amber">_{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <h3 className="display text-[clamp(2.4rem,6vw,4.5rem)] text-bone">{project.title}</h3>
                  <p className="mt-3 max-w-2xl text-muted">{project.summary}</p>
                  {/* Shown inline below lg; kept for screen readers at lg+, where the
                      cursor preview (aria-hidden) shows it visually instead. */}
                  <PreviewLines lines={project.preview} className="mt-5 rounded-lg border border-line bg-surface p-4 lg:sr-only" />
                </div>
                <div className="flex flex-col gap-5 lg:items-end">
                  <ul className="flex flex-wrap gap-2 lg:justify-end">
                    {project.tags.map((tag) => (
                      <li key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-5 font-mono text-xs uppercase tracking-[0.1em]">
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-bone underline decoration-dim underline-offset-[6px] hover:decoration-amber">
                      Code <span aria-hidden="true">↗</span>
                      <span className="sr-only"> for {project.title}</span>
                    </a>
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-amber underline decoration-amber/40 underline-offset-[6px] hover:decoration-amber">
                        Live <span aria-hidden="true">↗</span>
                        <span className="sr-only"> demo of {project.title}</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <div
        ref={previewRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed top-0 left-0 z-30 hidden w-[20rem] overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-[0_24px_60px_-20px_rgb(0_0_0/0.8)] lg:block"
      >
        <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
          <span className="size-2 rounded-full bg-dim" />
          <span className="size-2 rounded-full bg-dim" />
          <span className="size-2 rounded-full bg-amber" />
        </div>
        <div className="overflow-hidden" style={{ height: PREVIEW_ROW }}>
          <div
            className="transition-transform duration-500 ease-[var(--ease-out-strong)]"
            style={{ transform: `translateY(calc(${activeIndex ?? 0} * -${PREVIEW_ROW}))` }}
          >
            {projects.map((project) => (
              <PreviewLines key={project.slug} lines={project.preview} className="p-4" style={{ height: PREVIEW_ROW }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type PreviewLinesProps = {
  lines: readonly string[];
  className?: string;
  style?: React.CSSProperties;
};

function PreviewLines({ lines, className = "", style }: PreviewLinesProps) {
  return (
    <pre className={`font-mono text-[12px] leading-6 whitespace-pre-wrap ${className}`} style={style}>
      {lines.map((line, index) => {
        const isLast = index === lines.length - 1;
        const tone = index === 0 ? "text-amber" : isLast ? "text-merged" : "text-muted";
        return (
          <div key={line} className={tone}>
            {line}
          </div>
        );
      })}
    </pre>
  );
}
