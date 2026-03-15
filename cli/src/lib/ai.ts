import Anthropic from "@anthropic-ai/sdk";
import { loadConfig } from "../config.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BlogDraft {
  slug: string;
  tituloCa: string;
  tituloEs: string;
  tituloEn: string;
  contenidoCa: string;
  contenidoEs: string;
  contenidoEn: string;
  extractoCa: string;
  extractoEs: string;
  extractoEn: string;
  metaTitleCa: string;
  metaTitleEs: string;
  metaTitleEn: string;
  metaDescriptionCa: string;
  metaDescriptionEs: string;
  metaDescriptionEn: string;
  categoria: string;
}

export interface ZoneDraft {
  slug: string;
  nombreCa: string;
  nombreEs: string;
  nombreEn: string;
  contenidoCa: string;
  contenidoEs: string;
  contenidoEn: string;
  metaTitleCa: string;
  metaTitleEs: string;
  metaTitleEn: string;
  metaDescriptionCa: string;
  metaDescriptionEs: string;
  metaDescriptionEn: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getClient(): Anthropic {
  const config = loadConfig();
  const key = config.anthropicApiKey || process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "Anthropic API key not configured. Set it with:\n" +
        '  npm run cli -- login   (and add anthropicApiKey to ~/.arafinestra/config.json)\n' +
        "  or set ANTHROPIC_API_KEY environment variable"
    );
  }
  return new Anthropic({ apiKey: key });
}

function extractJSON(text: string): Record<string, unknown> {
  // Try to find JSON object in the response
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No JSON object found in AI response");
  }
  return JSON.parse(match[0]);
}

// ---------------------------------------------------------------------------
// Business context shared across prompts
// ---------------------------------------------------------------------------

const BUSINESS_CONTEXT = `ARA FINESTRA is a professional PVC window and enclosure installer based in Girona province and Maresme (Costa Brava), Catalonia, Spain.

Key details:
- Specializes in Cortizo PVC profiles (premium Spanish manufacturer)
- Services: PVC windows, sliding doors, shutters, mosquito nets, enclosures
- Target audience: homeowners, construction companies, homeowner associations (comunitats de veins)
- Service area: Girona province + Maresme comarca (Blanes, Lloret de Mar, Tossa de Mar, Palafrugell, Begur, etc.)
- Competitive advantages: local installer, Cortizo certified, free home visits, financing available, energy efficiency focus
- Current subsidies available for energy-efficient window renovation in Catalonia
- Website: arafinestra.com (trilingual: Catalan, Spanish, English)

SEO guidelines:
- Primary language is Catalan, with Spanish and English translations
- Use natural keyword placement, avoid keyword stuffing
- Include local references (Girona, Costa Brava, Maresme, specific municipalities)
- Focus on user intent: informational posts should educate, not hard-sell
- Use semantic HTML-friendly content (headings, lists, bold for key terms)`;

// ---------------------------------------------------------------------------
// Blog post generation
// ---------------------------------------------------------------------------

export async function generateBlogPost(topic: string): Promise<BlogDraft> {
  const client = getClient();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `You are a content writer for ARA FINESTRA. ${BUSINESS_CONTEXT}

You write blog posts in three languages: Catalan (primary), Spanish, and English.
Blog posts should be 800-1200 words per language, informative, SEO-optimized, and naturally reference the business without being overly promotional.

Available categories: eficiencia, subvencions, consells, cortizo, noticies

Always respond with a single JSON object (no markdown code fences) containing all required fields.`,
    messages: [
      {
        role: "user",
        content: `Write a complete blog post about: "${topic}"

Return a JSON object with these exact fields:
- slug: URL-friendly slug in Catalan (lowercase, hyphens, no accents)
- tituloCa, tituloEs, tituloEn: post title in each language
- contenidoCa, contenidoEs, contenidoEn: full HTML content in each language (use <h2>, <h3>, <p>, <ul>, <li>, <strong> tags)
- extractoCa, extractoEs, extractoEn: 1-2 sentence excerpt/summary in each language (plain text)
- metaTitleCa, metaTitleEs, metaTitleEn: SEO meta title (max 60 chars) in each language
- metaDescriptionCa, metaDescriptionEs, metaDescriptionEn: SEO meta description (max 155 chars) in each language
- categoria: one of eficiencia, subvencions, consells, cortizo, noticies

Return ONLY the JSON object, no other text.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const data = extractJSON(text);

  return {
    slug: String(data.slug ?? ""),
    tituloCa: String(data.tituloCa ?? ""),
    tituloEs: String(data.tituloEs ?? ""),
    tituloEn: String(data.tituloEn ?? ""),
    contenidoCa: String(data.contenidoCa ?? ""),
    contenidoEs: String(data.contenidoEs ?? ""),
    contenidoEn: String(data.contenidoEn ?? ""),
    extractoCa: String(data.extractoCa ?? ""),
    extractoEs: String(data.extractoEs ?? ""),
    extractoEn: String(data.extractoEn ?? ""),
    metaTitleCa: String(data.metaTitleCa ?? ""),
    metaTitleEs: String(data.metaTitleEs ?? ""),
    metaTitleEn: String(data.metaTitleEn ?? ""),
    metaDescriptionCa: String(data.metaDescriptionCa ?? ""),
    metaDescriptionEs: String(data.metaDescriptionEs ?? ""),
    metaDescriptionEn: String(data.metaDescriptionEn ?? ""),
    categoria: String(data.categoria ?? "consells"),
  };
}

// ---------------------------------------------------------------------------
// Zone page generation
// ---------------------------------------------------------------------------

export async function generateZonePage(
  municipality: string
): Promise<ZoneDraft> {
  const client = getClient();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: `You are a content writer for ARA FINESTRA. ${BUSINESS_CONTEXT}

You write local SEO landing pages for specific municipalities in the service area.
Pages should be 500-800 words per language, focused on local relevance, and naturally incorporate the municipality name for SEO.

Always respond with a single JSON object (no markdown code fences) containing all required fields.`,
    messages: [
      {
        role: "user",
        content: `Write a local SEO landing page for the municipality of "${municipality}".

The page should highlight ARA FINESTRA's services in this specific area, mention local landmarks or characteristics if relevant, and include a call to action for a free home visit.

Return a JSON object with these exact fields:
- slug: URL-friendly slug (lowercase, hyphens, no accents, e.g. "blanes" or "lloret-de-mar")
- nombreCa, nombreEs, nombreEn: municipality name in each language (usually the same)
- contenidoCa, contenidoEs, contenidoEn: full HTML content in each language (use <h2>, <h3>, <p>, <ul>, <li>, <strong> tags), 500-800 words each
- metaTitleCa, metaTitleEs, metaTitleEn: SEO meta title (max 60 chars) in each language
- metaDescriptionCa, metaDescriptionEs, metaDescriptionEn: SEO meta description (max 155 chars) in each language

Return ONLY the JSON object, no other text.`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";
  const data = extractJSON(text);

  return {
    slug: String(data.slug ?? ""),
    nombreCa: String(data.nombreCa ?? municipality),
    nombreEs: String(data.nombreEs ?? municipality),
    nombreEn: String(data.nombreEn ?? municipality),
    contenidoCa: String(data.contenidoCa ?? ""),
    contenidoEs: String(data.contenidoEs ?? ""),
    contenidoEn: String(data.contenidoEn ?? ""),
    metaTitleCa: String(data.metaTitleCa ?? ""),
    metaTitleEs: String(data.metaTitleEs ?? ""),
    metaTitleEn: String(data.metaTitleEn ?? ""),
    metaDescriptionCa: String(data.metaDescriptionCa ?? ""),
    metaDescriptionEs: String(data.metaDescriptionEs ?? ""),
    metaDescriptionEn: String(data.metaDescriptionEn ?? ""),
  };
}
