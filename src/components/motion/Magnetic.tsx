"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { gsap, hasFinePointer, prefersReducedMotion, registerGsap } from "@/lib/motion";

type Props = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

const FOLLOW = { duration: 0.5, ease: "power3.out" } as const;

// Pulls its child a little toward the pointer: feedback that the target is
// live before the click. Mouse only; touch and reduced motion get a still button.
export function Magnetic({ children, strength = 0.3, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      registerGsap();
      const node = ref.current;
      if (!node || !contextSafe || prefersReducedMotion() || !hasFinePointer()) return;

      const xTo = gsap.quickTo(node, "x", FOLLOW);
      const yTo = gsap.quickTo(node, "y", FOLLOW);

      const handleMove = contextSafe((event: PointerEvent) => {
        const rect = node.getBoundingClientRect();
        xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
      });
      // Settle back through the same quickTo tweens so two tweens never fight over x/y.
      const handleLeave = contextSafe(() => {
        xTo(0);
        yTo(0);
      });

      node.addEventListener("pointermove", handleMove);
      node.addEventListener("pointerleave", handleLeave);
      return () => {
        node.removeEventListener("pointermove", handleMove);
        node.removeEventListener("pointerleave", handleLeave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
