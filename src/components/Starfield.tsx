"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const STAR_DENSITY = 1 / 9000; // stars per square pixel
const MAX_DPR = 2;
const DRIFT = 0.02; // px per frame, upward
const PARALLAX = 14; // max px the nearest stars shift toward the pointer

interface Star {
  readonly x: number;
  readonly y: number;
  readonly depth: number; // 0.2 (far) .. 1 (near)
  readonly size: number;
}

function makeStars(width: number, height: number): Star[] {
  const count = Math.round(width * height * STAR_DENSITY);
  return Array.from({ length: count }, () => {
    const depth = 0.2 + Math.random() * 0.8;
    return { x: Math.random() * width, y: Math.random() * height, depth, size: 0.4 + depth * 1.1 };
  });
}

// A sparse, slow starfield behind the hero for depth. It renders only while the
// hero is on screen and the tab is visible, and not at all under reduced motion.
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || prefersReducedMotion()) return;

    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let offset = 0;
    let frame = 0;
    let isVisible = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const nextWidth = canvas.clientWidth;
      const nextHeight = canvas.clientHeight;
      if (!nextWidth || !nextHeight) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(nextWidth * dpr);
      canvas.height = Math.round(nextHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Mobile URL-bar show/hide changes only the height; keep the same stars
      // then instead of regenerating them all.
      if (nextWidth !== width || !stars.length) stars = makeStars(nextWidth, nextHeight);
      width = nextWidth;
      height = nextHeight;
    };

    const draw = () => {
      if (!height) {
        frame = requestAnimationFrame(draw);
        return;
      }
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      offset = (offset + DRIFT) % height;
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const y = (star.y - offset * star.depth + height) % height;
        ctx.globalAlpha = 0.25 + star.depth * 0.55;
        ctx.fillStyle = "#ece8df";
        ctx.fillRect(star.x + pointer.x * star.depth, y + pointer.y * star.depth, star.size, star.size);
      }
      frame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!frame && isVisible && !document.hidden) frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const handlePointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * -PARALLAX * 2;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * -PARALLAX * 2;
    };
    const handleVisibility = () => (document.hidden ? stop() : start());

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry?.isIntersecting ?? false;
      if (isVisible) start();
      else stop();
    });

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    start();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
