import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { zones } from "@shared/schema";
import { eq } from "drizzle-orm";

export function registerZoneRoutes(app: Express) {
  // GET /api/zones — list, ?published
  app.get("/api/zones", async (req, res) => {
    try {
      const { published } = req.query;
      const where = published === "true" ? eq(zones.published, true) : undefined;
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
      if (!zone) return res.status(404).json({ error: "Zona no encontrada" });
      res.json(zone);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener zona" });
    }
  });

  // POST /api/zones
  app.post("/api/zones", requireAuth, async (req, res) => {
    try {
      const [zone] = await db.insert(zones).values(req.body).returning();
      res.status(201).json(zone);
    } catch (err) {
      console.error("Error creating zone:", err);
      res.status(500).json({ error: "Error al crear zona" });
    }
  });

  // PATCH /api/zones/:id
  app.patch("/api/zones/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [updated] = await db.update(zones).set(req.body).where(eq(zones.id, id)).returning();
      if (!updated) return res.status(404).json({ error: "Zona no encontrada" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar zona" });
    }
  });

  // DELETE /api/zones/:id
  app.delete("/api/zones/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [deleted] = await db.delete(zones).where(eq(zones.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "Zona no encontrada" });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar zona" });
    }
  });
}
