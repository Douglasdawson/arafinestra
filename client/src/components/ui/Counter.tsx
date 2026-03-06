import { useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function Counter({
  target,
  duration = 2,
  suffix = "",
  prefix = "",
  className = "",
}: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
