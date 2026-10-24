"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { onIntro } from "@/lib/intro";
import { DURATION, EASE, gsap, prefersReducedMotion, registerGsap, REVEAL_START, STAGGER } from "@/lib/motion";
import { splitWords } from "@/lib/text";

export type Tone = "bright" | "dim" | "accent";

export interface HeadingLine {
  readonly text: string;
  readonly tone: Tone;
}

type Props = {
  lines: readonly HeadingLine[];
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  // "scroll" reveals when scrolled into view; "intro" waits for the preloader.
  trigger?: "scroll" | "intro";
};

const TONE_CLASS: Record<Tone, string> = {
  bright: "text-bone",
  dim: "text-dim",
  accent: "text-amber",
};

// Words slide up out of a mask in reading order. Screen readers get the
// unsplit text once; the split words are hidden from them.
export function SplitHeading({ lines, as: Tag = "h2", id, className = "", trigger = "scroll" }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);
  const label = lines.map((line) => line.text).join(" ");

  useGSAP(
    () => {
      registerGsap();
      const words = ref.current?.querySelectorAll(".word");
      if (!words?.length) return;

      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1 });
        return;
      }

      const tween = gsap.fromTo(
        words,
        { yPercent: 110, opacity: 1 },
        {
          yPercent: 0,
          duration: DURATION.reveal + 0.2,
          ease: EASE.reveal,
          stagger: STAGGER.word,
          paused: trigger === "intro",
          scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start: REVEAL_START, once: true } : undefined,
        },
      );

      if (trigger === "intro") return onIntro(() => tween.play());
      return undefined;
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-split className={`display ${className}`}>
      <span className="sr-only">{label}</span>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className={`block ${TONE_CLASS[line.tone]}`} aria-hidden="true">
          {splitWords(line.text).map((word, wordIndex) => (
            <span key={wordIndex} className="word-mask">
              <span className="word">{word}</span>
              {" "}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
