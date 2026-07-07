// Shared escaping helpers for server-rendered HTML / JSON-LD contexts.

/** Escape a string for safe interpolation into HTML text or attribute values. */
export function escapeHtml(s: string | null | undefined): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Serialize an object for embedding inside a <script type="application/ld+json"> block.
 * Escapes '<' so a `</script>` inside string values can't break out of the tag.
 * The result is still valid JSON (Google's parsers read < transparently).
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}
