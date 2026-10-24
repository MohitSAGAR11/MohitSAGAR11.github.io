# Design direction

## Thesis
"I find the bug, file it, fix it." The site is organised around that loop. The hero states it,
the open-source section proves it with real issue → PR trails, and the projects show the same
first-principles habit applied to my own code.

Audience: recruiters for backend/AI internships, and open-source maintainers (GSoC).

## References (traits taken, nothing copied)
- tajmirul.site: dark canvas, condensed uppercase display type, a single accent, numbered project
  list with a hover preview, sparse starfield, scroll-led reveals.
- sawad.framer.website: floating icon dock, two-tone headings (bright line + dim line), stat row.

## System
- Canvas `#0f0e0c` (warm black), surface `#1a1916`, line `#2a2824`
- Text `#ece8df` (bone), muted `#8f897e`, dim heading line `#3b3833`
- Accent `#ffb000` (terminal amber), only for the primary action, live state and the "fix" step.
  Merged = `#7ee787`, in review = amber, filed = muted.
- Display: Archivo, weight 900, `font-stretch: 62%` (condensed). Body: Geist. Labels/meta: JetBrains Mono.
- Radius 14px for cards, 999px for pills. No glass and no gradients.

## Motion (GSAP + ScrollTrigger, Lenis as the only smooth-scroll engine)
- Eases: `expo.out` for reveals, `power3.out` for UI, CSS `cubic-bezier(0.23,1,0.32,1)` for hover.
- Reveals 0.9s, word stagger 0.05s, row stagger 0.07s, trigger at `top 82%`, play once.
- `prefers-reduced-motion`: no Lenis, no preloader, no canvas, final states rendered immediately.
- Each animation needs a reason: the preloader marks the entrance (once per session), heading reveals set reading
  order, the scrubbed about text sets reading pace, the dock indicator shows where you are, the project preview
  shows what a row contains.
