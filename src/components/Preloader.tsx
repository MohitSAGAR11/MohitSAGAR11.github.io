"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { PRELOADER_SEEN_KEY, signalIntro } from "@/lib/intro";
import { gsap, registerGsap } from "@/lib/motion";

// A real trail from bugTrails in content/site.ts.
const LINES = [
  { prefix: "$", text: "trace hyperjump-io/json-schema", tone: "text-bone" },
  { prefix: "found", text: "an invalid schema passes on the 2nd run", tone: "text-muted" },
  { prefix: "filed", text: "issue #133", tone: "text-muted" },
  { prefix: "fixed", text: "PR #134 merged", tone: "text-merged" },
] as const;

// Plays once per session, as an entrance. The inline script in layout.tsx adds
// `preload` to <html> only on a first visit with motion allowed; otherwise
// this renders hidden and hands straight over to the hero.
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      registerGsap();
      const root = document.documentElement;
      if (!root.classList.contains("preload") || !contextSafe) {
        signalIntro();
        return;
      }

      const finish = () => {
        root.classList.remove("preload");
        try {
          sessionStorage.setItem(PRELOADER_SEEN_KEY, "1");
        } catch {
          // Storage can be blocked; the preloader just plays again next time.
        }
        signalIntro();
      };

      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo("[data-line]", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.22, ease: "power3.out" })
        .to({}, { duration: 0.35 })
        .to(ref.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" });

      const skip = contextSafe(() => tl.progress(1));
      window.addEventListener("keydown", skip, { once: true });
      window.addEventListener("pointerdown", skip, { once: true });
      return () => {
        window.removeEventListener("keydown", skip);
        window.removeEventListener("pointerdown", skip);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="preloader fixed inset-0 z-[60] hidden items-center justify-center bg-canvas px-6"
    >
      <pre className="max-w-full font-mono text-xs leading-7 whitespace-pre-wrap sm:text-base">
        {LINES.map((line) => (
          <div key={line.prefix} data-line className={line.tone}>
            <span className={`inline-block w-14 ${line.prefix === "$" ? "text-amber" : "text-dim"}`}>{line.prefix}</span>
            {line.text}
          </div>
        ))}
      </pre>
    </div>
  );
}
