import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { localize } from "../../lib/localize";

interface Testimonial {
  id: number;
  nombre: string;
  localidad: string | null;
  estrellas: number;
  [key: string]: unknown; // localized texto_* / textoXx fields resolved via localize()
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  lang: string;
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${stars} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= stars ? "text-star" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCarousel({ testimonials, lang }: TestimonialCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t: i18nT } = useTranslation();

  const getText = (t: Testimonial) =>
    localize(t as Record<string, unknown>, "texto", lang);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={i18nT("testimonials.title", { defaultValue: "Opiniones" })}
    >
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-slate-600 hover:text-brand transition-colors hidden md:flex"
        aria-label={i18nT("common.previous", { defaultValue: "Anterior" })}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        ref={scrollRef}
        tabIndex={0}
        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="flex-shrink-0 w-[85vw] sm:w-80 snap-start bg-white rounded-lg shadow-md p-5 sm:p-6"
          >
            <StarRating stars={t.estrellas} />
            <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-4">
              "{getText(t)}"
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-sm font-semibold text-navy-800">{t.nombre}</p>
              {t.localidad && (
                <p className="text-xs text-slate-500">{t.localidad}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-slate-600 hover:text-brand transition-colors hidden md:flex"
        aria-label={i18nT("common.next", { defaultValue: "Siguiente" })}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
