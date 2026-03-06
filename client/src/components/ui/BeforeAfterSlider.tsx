import { useRef, useState, useEffect } from "react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPos, setSplitPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [loaded, setLoaded] = useState({ before: false, after: false });

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { left, width } = containerRef.current.getBoundingClientRect();
      setSplitPos(Math.max(5, Math.min(95, ((e.clientX - left) / width) * 100)));
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!containerRef.current) return;
      const { left, width } = containerRef.current.getBoundingClientRect();
      setSplitPos(
        Math.max(5, Math.min(95, ((e.touches[0].clientX - left) / width) * 100))
      );
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-ew-resize select-none touch-none bg-slate-200"
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* After image — full background */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        onLoad={() => setLoaded((s) => ({ ...s, after: true }))}
        draggable={false}
      />

      {/* Before image — clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${splitPos}%` }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: `${containerRef.current?.offsetWidth || 0}px` }}
          onLoad={() => setLoaded((s) => ({ ...s, before: true }))}
          draggable={false}
        />
      </div>

      {/* Labels */}
      {loaded.before && loaded.after && (
        <>
          <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
            <span className="text-xs sm:text-sm font-semibold text-white">
              {beforeLabel}
            </span>
          </div>
          <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
            <span className="text-xs sm:text-sm font-semibold text-white">
              {afterLabel}
            </span>
          </div>
        </>
      )}

      {/* Divider line + handle */}
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{ left: `${splitPos}%`, transform: "translateX(-50%)" }}
      >
        <div className="w-[2px] h-full bg-white shadow-sm" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            className="text-slate-600"
            strokeWidth="2"
          >
            <path d="M6 3l-4 6 4 6M12 3l4 6-4 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
