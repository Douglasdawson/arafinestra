// Serialize an object for embedding inside a <script type="application/ld+json"> block.
// Escapes '<' so a `</script>` inside string values can't break out of the tag.
// The result is still valid JSON (search engines read < transparently).
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}
