import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef, type ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [opacity, setOpacity] = useState(1);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname === prevPath.current) {
      setDisplayChildren(children);
      return;
    }
    prevPath.current = location.pathname;

    // Check reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayChildren(children);
      return;
    }

    // Fade out
    setOpacity(0);
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setOpacity(1);
    }, 150);
    return () => clearTimeout(timer);
  }, [children, location.pathname]);

  return (
    <div
      style={{
        opacity,
        transition: "opacity 150ms ease-in-out",
      }}
    >
      {displayChildren}
    </div>
  );
}
