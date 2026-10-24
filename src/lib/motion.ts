import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const EASE = {
  reveal: "expo.out",
  ui: "power3.out",
} as const;

export const DURATION = {
  reveal: 0.9,
  ui: 0.45,
} as const;

export const STAGGER = {
  word: 0.05,
  row: 0.07,
} as const;

export const REVEAL_START = "top 82%";

let registered = false;

export function registerGsap(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: EASE.ui, duration: DURATION.ui });
  registered = true;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export { gsap, ScrollTrigger };
