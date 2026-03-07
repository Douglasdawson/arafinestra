import { useState, useRef, useEffect } from "react";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export default function ProgressiveImage({
  src,
  alt,
  className = "",
  loading = "lazy",
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If image is already cached by the browser
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Skeleton shimmer placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              animation: "shimmer 1.5s infinite",
            }}
          />
        </div>
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
