// Un slug válido solo contiene minúsculas, dígitos y guiones. Así se evita que
// caracteres como & o espacios lleguen al sitemap.xml (donde romperían el XML)
// o a las URLs. seo-inject.ts ya solo casa este patrón.
export function isValidSlug(slug: unknown): slug is string {
  return typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
