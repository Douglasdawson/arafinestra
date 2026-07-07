import { useEffect } from "react";

type ScrollListener = (y: number) => void;

const listeners = new Set<ScrollListener>();
let rafId: number | null = null;
let attached = false;

function onScroll() {
  if (rafId !== null) return; // coalesce to one update per frame
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const y = window.scrollY;
    listeners.forEach((l) => l(y));
  });
}

/**
 * Single passive scroll listener shared app-wide, throttled to one
 * requestAnimationFrame per frame. Each subscriber decides its own state
 * updates, so React re-renders only when a subscriber actually changes state.
 */
export function useScrollPosition(listener: ScrollListener) {
  useEffect(() => {
    listeners.add(listener);
    if (!attached) {
      window.addEventListener("scroll", onScroll, { passive: true });
      attached = true;
    }
    listener(window.scrollY);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && attached) {
        window.removeEventListener("scroll", onScroll);
        attached = false;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }, [listener]);
}
