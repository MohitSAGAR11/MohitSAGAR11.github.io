"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";
import { splitWords } from "@/lib/text";

type Props = {
  text: string;
  className?: string;
};

const DIM_OPACITY = 0.16;

// Words brighten as the paragraph scrolls through the viewport, which paces
// the read. Tied to scroll position, so scrolling back dims them again.
export function ScrubText({ text, className = "" }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (prefersReducedMotion()) return;
      const words = ref.current?.querySelectorAll("[data-scrub-word]");
      if (!words?.length) return;

      gsap.fromTo(
        words,
        { opacity: DIM_OPACITY },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 45%", scrub: 1 },
        },
      );
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {splitWords(text).map((word, index) => (
        <span key={index} data-scrub-word aria-hidden="true">
          {word}{" "}
        </span>
      ))}
    </p>
  );
}
