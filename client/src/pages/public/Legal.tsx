import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import PageHead from "../../components/seo/PageHead";

const LEGAL_TYPES = ["privacitat", "termes", "cookies", "avis-legal"] as const;
type LegalType = (typeof LEGAL_TYPES)[number];

const titleKeys: Record<LegalType, string> = {
  privacitat: "legal.privacy_title",
  termes: "legal.terms_title",
  cookies: "legal.cookies_title",
  "avis-legal": "legal.aviso_legal_title",
};

const contentKeys: Record<LegalType, string> = {
  privacitat: "legal.privacy_content",
  termes: "legal.terms_content",
  cookies: "legal.cookies_content",
  "avis-legal": "legal.aviso_legal_content",
};

export default function Legal() {
  const { t } = useTranslation();
  const { type } = useParams<{ type: string }>();

  const legalType = LEGAL_TYPES.includes(type as LegalType)
    ? (type as LegalType)
    : "privacitat";

  const title = t(titleKeys[legalType]);
  const content = t(contentKeys[legalType]);

  return (
    <>
      <PageHead title={title} description={title} path={`/legal/${legalType}`} />

      {/* Hero */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[30%] right-[20%] w-[120px] h-[120px] rounded-full bg-brand/8 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate max-w-none whitespace-pre-line break-words text-gray-700 leading-relaxed">
            {content}
          </div>
        </div>
      </section>
    </>
  );
}
