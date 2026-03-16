import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface PageHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  schema?: object;
}

const OG_LOCALES: Record<string, string> = { ca: "ca_ES", es: "es_ES", en: "en_US" };
const LANGS = ["ca", "es", "en"] as const;

export default function PageHead({ title, description, path, image, schema }: PageHeadProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const baseUrl = "https://arafinestra.com";
  const url = `${baseUrl}/${lang}${path}`;
  const ogImage = image || `${baseUrl}/og-image.png`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title} | ARA FINESTRA</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca${path}`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es${path}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${path}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/ca${path}`} />
      <meta property="og:site_name" content="ARA FINESTRA" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={OG_LOCALES[lang] || "ca_ES"} />
      {LANGS.filter(l => l !== lang).map(l => (
        <meta key={l} property="og:locale:alternate" content={OG_LOCALES[l]} />
      ))}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
