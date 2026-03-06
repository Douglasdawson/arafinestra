import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";
import { localize } from "../../lib/localize";

interface TestimonialItem {
  id: number;
  nombre: string;
  localidad: string | null;
  puntuacion: number;
  texto_ca: string | null;
  texto_es: string | null;
  texto_en: string | null;
  foto_url: string | null;
}

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i <= stars ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = lang || i18n.language || "ca";

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/testimonials?published=true")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch(() => {
        setTestimonials([]);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <PageHead
        title={t("testimonials.title")}
        description={t("testimonials.title") + " - ARA FINESTRA"}
        path="/opinions"
      />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-navy-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{t("testimonials.title")}</h1>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20 text-slate-500">...</div>
          ) : testimonials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t_item) => {
                const text = localize(t_item as unknown as Record<string, unknown>, "texto", currentLang);
                return (
                  <div key={t_item.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-4 mb-4">
                      {t_item.foto_url ? (
                        <img
                          src={t_item.foto_url}
                          alt={t_item.nombre}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-lg">
                          {t_item.nombre.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{t_item.nombre}</p>
                        {t_item.localidad && (
                          <p className="text-xs text-slate-500">{t_item.localidad}</p>
                        )}
                      </div>
                    </div>
                    <StarRating stars={t_item.puntuacion} />
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">"{text}"</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-slate-500">{t("testimonials.no_testimonials")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
