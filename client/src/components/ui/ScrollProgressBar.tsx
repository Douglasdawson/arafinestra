import { useState, useCallback, useEffect, useRef } from "react";
import { useScrollPosition } from "../../hooks/useScrollPosition";

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  // scrollHeight forces layout when read — cache it and refresh cheaply.
  const docHeightRef = useRef(0);

  useEffect(() => {
    const measure = () => {
      docHeightRef.current =
        document.documentElement.scrollHeight - window.innerHeight;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const onScroll = useCallback((y: number) => {
    const docHeight = docHeightRef.current;
    setProgress(docHeight > 0 ? (y / docHeight) * 100 : 0);
  }, []);
  useScrollPosition(onScroll);

  if (progress < 1) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
      <div
        className="h-full bg-brand transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
