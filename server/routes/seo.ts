import type { Express } from "express";

// Sitemap is handled by sitemap.ts — removed duplicate handler that was shadowing it
export function registerSeoRoutes(_app: Express) {
  // Intentionally empty — kept to avoid breaking routes.ts import
}
