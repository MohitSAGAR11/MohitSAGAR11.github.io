"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { onIntro } from "@/lib/intro";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/motion";

type Props = {
  children: ReactNode;
  as?: "div" | "dl";
  className?: string;
};

const DELAY_AFTER_HEADLINE = 0.45;

// Supporting hero copy rises in after the headline so the eye lands on the
// headline first. It stays readable and clickable before JS runs.
export function HeroDetails({ children, as: Tag = "div", className = "" }: Props) {
  const ref = useRef<HTMLDivElement & HTMLDListElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const node = ref.current;
      if (!node || prefersReducedMotion()) return;

      // fromTo, not from: CSS starts these at opacity 0, so "from" would tween to 0.
      const tween = gsap.fromTo(node.children, { opacity: 0, y: 24 }, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        delay: DELAY_AFTER_HEADLINE,
        paused: true,
      });
      return onIntro(() => tween.play());
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-hero-details className={className}>
      {children}
    </Tag>
  );
}
