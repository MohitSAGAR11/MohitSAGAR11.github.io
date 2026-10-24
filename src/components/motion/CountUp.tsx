"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { onIntro } from "@/lib/intro";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";

type Props = {
  value: number;
  suffix?: string;
  className?: string;
};

const COUNT_DURATION = 1.6;

// The server renders the final number, so it is right without JS. With motion
// on, CSS hides it until the intro, then it counts up from zero. The inner span
// is only ever written by the tween; React renders it once.
export function CountUp({ value, suffix = "", className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    registerGsap();
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    const counter = { n: 0 };
    const tween = gsap.to(counter, {
      n: value,
      duration: COUNT_DURATION,
      ease: "expo.out",
      paused: true,
      onStart: () => {
        gsap.set(node, { opacity: 1 });
      },
      onUpdate: () => {
        node.textContent = `${Math.round(counter.n)}${suffix}`;
      },
    });
    return onIntro(() => tween.play());
  });

  return (
    <span ref={ref} data-count className={`tabular-nums ${className}`} suppressHydrationWarning>
      {`${value}${suffix}`}
    </span>
  );
}
