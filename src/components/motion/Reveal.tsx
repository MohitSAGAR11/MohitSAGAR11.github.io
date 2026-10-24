"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { DURATION, EASE, gsap, prefersReducedMotion, registerGsap, REVEAL_START, STAGGER } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
};

// Fades up every descendant marked [data-reveal-item], in DOM order, when the
// group scrolls into view. Used for lists so rows arrive in reading order.
export function Reveal({ children, className = "", as: Tag = "div" }: Props) {
  const ref = useRef<HTMLDivElement & HTMLUListElement & HTMLOListElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal-item]", ref.current);
      if (!items.length) return;

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        items,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.reveal,
          ease: EASE.reveal,
          stagger: STAGGER.row,
          scrollTrigger: { trigger: ref.current, start: REVEAL_START, once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
