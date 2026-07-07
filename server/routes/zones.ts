import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { parseId } from "../lib/parseId.js";
import { isValidSlug } from "../lib/slug.js";
import { zones } from "@shared/schema";
import { eq } from "drizzle-orm";

export function registerZoneRoutes(app: Express) {
  // GET /api/zones — list, ?published, ?fields=list (payload ligero para hot paths)
  app.get("/api/zones", async (req, res) => {
    try {
      const { published, fields } = req.query;
      const isAdmin = req.isAuthenticated?.() === true;
      const where = !isAdmin || published === "true" ? eq(zones.published, true) : undefined;

      if (fields === "list") {
        // Solo lo necesario para listados: evita enviar contenido_* (500-800 palabras
        // × 3 idiomas) por cada zona en páginas públicas de alto tráfico.
        const data = await db
          .select({
            id: zones.id,
            slug: zones.slug,
            nombreCa: zones.nombreCa,
            nombreEs: zones.nombreEs,
            nombreEn: zones.nombreEn,
            published: zones.published,
          })
          .from(zones)
          .where(where);
        res.setHeader("Cache-Control", "public, max-age=300");
        return res.json(data);
      }

      const data = await db.select().from(zones).where(where);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener zonas" });
    }
  });

  // GET /api/zones/:slug — single by slug (public)
  app.get("/api/zones/:slug", async (req, res) => {
    try {
      const zone = await db.query.zones.findFirst({
        where: eq(zones.slug, req.params.slug as string),
      });
      const isAdmin = req.isAuthenticated?.() === true;
      if (!zone || (!zone.published && !isAdmin)) {
        return res.status(404).json({ error: "Zona no encontrada" });
      }
      res.json(zone);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener zona" });
    }
  });

  // POST /api/zones
  app.post("/api/zones", requireAuth, async (req, res) => {
    try {
      const { id: _id, ...body } = req.body;
      if (!isValidSlug(body.slug)) {
        return res.status(400).json({ error: "Slug inválido (solo minúsculas, dígitos y guiones)" });
      }
      const [zone] = await db.insert(zones).values(body).returning();
      res.status(201).json(zone);
    } catch (err) {
      console.error("Error creating zone:", err);
      res.status(500).json({ error: "Error al crear zona" });
    }
  });

  // PATCH /api/zones/:id
  app.patch("/api/zones/:id", requireAuth, async (req, res) => {
    try {
      const id = parseId(req.params.id);
      if (id === null) return res.status(400).json({ error: "id inválido" });
      const { id: _id, ...data } = req.body;
      if (Object.keys(data).length === 0) return res.status(400).json({ error: "Nada que actualizar" });
      if (data.slug !== undefined && !isValidSlug(data.slug)) {
        return res.status(400).json({ error: "Slug inválido (solo minúsculas, dígitos y guiones)" });
      }
      const [updated] = await db.update(zones).set(data).where(eq(zones.id, id)).returning();
      if (!updated) return res.status(404).json({ error: "Zona no encontrada" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar zona" });
    }
  });

  // DELETE /api/zones/:id
  app.delete("/api/zones/:id", requireAuth, async (req, res) => {
    try {
      const id = parseId(req.params.id);
      if (id === null) return res.status(400).json({ error: "id inválido" });
      const [deleted] = await db.delete(zones).where(eq(zones.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "Zona no encontrada" });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar zona" });
    }
  });
}
