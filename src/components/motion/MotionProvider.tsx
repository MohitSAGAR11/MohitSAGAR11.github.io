"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/motion";

const DOCK_OFFSET = -24;
const GSAP_DEFAULT_LAG = { threshold: 500, adjustedLag: 33 } as const;

// Lenis is the only smooth-scroll engine. It is driven by GSAP's ticker so
// ScrollTrigger and the smooth scroll read the same frame.
export function MotionProvider() {
  useEffect(() => {
    registerGsap();
    document.documentElement.dataset.motionReady = "true";

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    if (prefersReducedMotion()) {
      return () => window.removeEventListener("load", refresh);
    }

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9, anchors: { offset: DOCK_OFFSET } });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(GSAP_DEFAULT_LAG.threshold, GSAP_DEFAULT_LAG.adjustedLag);
      lenis.destroy();
    };
  }, []);

  return null;
}
