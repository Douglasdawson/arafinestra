/**
 * Returns the localized field from a DB object.
 * Example: localize(post, "titulo", "ca") => post.titulo_ca
 * Falls back to Catalan (_ca) if the requested language field is empty.
 */
export function localize(
  obj: Record<string, unknown>,
  field: string,
  lang: string,
): string {
  const suffix = "_" + lang;
  const value = obj[field + suffix];
  if (typeof value === "string" && value.length > 0) return value;
  // Fallback to Catalan
  const fallback = obj[field + "_ca"];
  return typeof fallback === "string" ? fallback : "";
}
