"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";

const HIDE_AFTER = 480; // px scrolled before the dock may hide
const SCROLL_DELTA = 6; // ignore jitter smaller than this

type Indicator = { x: number; width: number };

// Floating section nav. The amber pill slides to the section in view (state
// indication) and the dock tucks away while reading down, returning on scroll up.
export function Dock() {
  const [active, setActive] = useState<string>(nav[0].id);
  const [isHidden, setIsHidden] = useState(false);
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());

  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => node !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < SCROLL_DELTA) return;
      setIsHidden(y > last && y > HIDE_AFTER);
      last = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let isCurrent = true;
    const measure = () => {
      const link = linkRefs.current.get(active);
      if (!isCurrent || !link) return;
      setIndicator({ x: link.offsetLeft, width: link.offsetWidth });
      // Keep the active link visible in the narrow, horizontally scrolling nav.
      // Scroll only the nav itself; scrollIntoView could move the page.
      const strip = link.parentElement;
      if (strip && strip.scrollWidth > strip.clientWidth) {
        strip.scrollTo({ left: link.offsetLeft - (strip.clientWidth - link.offsetWidth) / 2 });
      }
    };
    measure();
    // Re-measure once web fonts swap in, since label widths change.
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      isCurrent = false;
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  return (
    <header
      onFocusCapture={() => setIsHidden(false)}
      className={`fixed inset-x-0 top-4 z-40 flex justify-center px-4 transition-transform duration-500 ease-[var(--ease-out-strong)] motion-reduce:transition-none ${
        isHidden ? "-translate-y-24" : "translate-y-0"
      }`}
    >
      <nav
        aria-label="Sections"
        className="relative flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-line bg-surface/90 p-1 backdrop-blur-md [scrollbar-width:none]"
      >
        {indicator && (
          <span
            aria-hidden="true"
            className="absolute inset-y-1 left-0 rounded-full bg-amber transition-[transform,width] duration-300 ease-[var(--ease-out-strong)] motion-reduce:transition-none"
            style={{ transform: `translateX(${indicator.x}px)`, width: indicator.width }}
          />
        )}
        {nav.map((item) => {
          const isActive = item.id === active;
          // Dark text only once the amber pill exists behind it (after hydration).
          const tone = isActive ? (indicator ? "text-canvas" : "text-amber") : "text-muted hover:text-bone";
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              ref={(node) => {
                if (node) linkRefs.current.set(item.id, node);
                else linkRefs.current.delete(item.id);
              }}
              aria-current={isActive ? "true" : undefined}
              className={`relative z-10 shrink-0 rounded-full px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors duration-200 sm:px-4 sm:text-[11px] sm:tracking-[0.08em] ${tone} ${item.id === "top" ? "max-sm:hidden" : ""}`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
