import { useLocation } from "react-router-dom";
import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Fades the NEW page in on route change. The old fade-out+150ms-hold pattern
 * delayed every SPA navigation's first paint; swapping immediately and
 * animating in costs nothing.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevPath = useRef(location.pathname);

  useLayoutEffect(() => {
    if (location.pathname === prevPath.current) return;
    prevPath.current = location.pathname;
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 180,
      easing: "ease-out",
    });
  }, [location.pathname]);

  return <div ref={containerRef}>{children}</div>;
}
