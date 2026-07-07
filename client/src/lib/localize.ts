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
  // Drizzle serializes columns in camelCase (nombreCa), but accept legacy
  // snake_case (nombre_ca) too in case a raw-SQL endpoint returns it.
  const read = (l: string): string | undefined => {
    const camel = obj[field.replace(/_(\w)/g, (_, c) => c.toUpperCase()) + l.charAt(0).toUpperCase() + l.slice(1)];
    if (typeof camel === "string" && camel.length > 0) return camel;
    const snake = obj[field + "_" + l];
    if (typeof snake === "string" && snake.length > 0) return snake;
    return undefined;
  };
  return read(lang) ?? read("ca") ?? "";
}
