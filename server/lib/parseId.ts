// Parse a route :id param into a positive integer, or null if invalid.
// Evita que un id no numérico llegue a Postgres y provoque un 500 en vez de 404/400.
export function parseId(raw: unknown): number | null {
  const n = Number.parseInt(String(raw), 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}
