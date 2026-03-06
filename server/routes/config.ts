import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { siteConfig } from "@shared/schema";
import { eq } from "drizzle-orm";

export function registerConfigRoutes(app: Express) {
  // GET /api/config — list all config (public)
  app.get("/api/config", async (_req, res) => {
    try {
      const data = await db.select().from(siteConfig);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener configuracion" });
    }
  });

  // PUT /api/config/:key — upsert config value
  app.put("/api/config/:key", requireAuth, async (req, res) => {
    try {
      const key = req.params.key as string;
      const { valueCa, valueEs, valueEn } = req.body;

      // Check if key exists
      const existing = await db.query.siteConfig.findFirst({
        where: eq(siteConfig.key, key),
      });

      let result;
      if (existing) {
        [result] = await db
          .update(siteConfig)
          .set({ valueCa, valueEs, valueEn })
          .where(eq(siteConfig.key, key))
          .returning();
      } else {
        [result] = await db
          .insert(siteConfig)
          .values({ key, valueCa, valueEs, valueEn })
          .returning();
      }

      res.json(result);
    } catch (err) {
      console.error("Error upserting config:", err);
      res.status(500).json({ error: "Error al guardar configuracion" });
    }
  });
}
