import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";

export default function NotFound() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || "ca";

  return (
    <>
    <PageHead
      title="404"
      description={t("errors.not_found", "Pagina no trobada")}
      path="/404"
    />
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 animate-fadeIn">
      <h1 className="text-[8rem] sm:text-[10rem] font-extrabold leading-none text-navy-900">
        404
      </h1>
      <p className="mt-4 text-2xl font-semibold text-navy-900">
        {t("errors.not_found", "Pagina no trobada")}
      </p>
      <p className="mt-2 text-lg text-gray-500">
        {t("errors.not_found_desc", "La pagina que busques no existeix.")}
      </p>
      <Link
        to={`/${prefix}`}
        className="mt-8 inline-block rounded-lg bg-orange-500 px-6 py-3 text-white font-semibold hover:bg-orange-600 transition-colors"
      >
        {t("errors.go_home", "Tornar a l'inici")}
      </Link>
    </div>
    </>
  );
}
