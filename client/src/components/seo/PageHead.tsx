import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface PageHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  schema?: object;
}

export default function PageHead({ title, description, path, image, schema }: PageHeadProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const baseUrl = "https://arafinestra.com";
  const url = `${baseUrl}/${lang}${path}`;

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
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image || `${baseUrl}/og-image.svg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={image || `${baseUrl}/og-image.svg`} />
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
