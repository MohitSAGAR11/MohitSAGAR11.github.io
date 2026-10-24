// The hero waits for the preloader to finish before playing its entrance.
// The preloader (or its absence) calls signalIntro() exactly once per page load.

const EVENT = "portfolio:intro";

// Shared with the inline boot script in layout.tsx, so it must live in a
// plain module rather than a client component file.
export const PRELOADER_SEEN_KEY = "portfolio:preloader-seen";

export function signalIntro(): void {
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event(EVENT));
}

export function onIntro(callback: () => void): () => void {
  if (document.documentElement.dataset.intro === "done") {
    callback();
    return () => {};
  }
  window.addEventListener(EVENT, callback, { once: true });
  return () => window.removeEventListener(EVENT, callback);
}
