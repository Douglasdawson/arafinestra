import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { portfolio } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export function registerPortfolioRoutes(app: Express) {
  // GET /api/portfolio — list, ?published, ?localidad, ?tipoInmueble, ?destacado
  app.get("/api/portfolio", async (req, res) => {
    try {
      const { published, localidad, tipoInmueble, destacado } = req.query;
      const conditions = [];
      if (published === "true") conditions.push(eq(portfolio.published, true));
      if (localidad) conditions.push(eq(portfolio.localidad, localidad as string));
      if (tipoInmueble) conditions.push(eq(portfolio.tipoInmueble, tipoInmueble as string));
      if (destacado === "true") conditions.push(eq(portfolio.destacado, true));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const data = await db.select().from(portfolio).where(where).orderBy(desc(portfolio.createdAt));
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener portfolio" });
    }
  });

  // GET /api/portfolio/:id
  app.get("/api/portfolio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const project = await db.query.portfolio.findFirst({ where: eq(portfolio.id, id) });
      if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener proyecto" });
    }
  });

  // POST /api/portfolio
  app.post("/api/portfolio", requireAuth, async (req, res) => {
    try {
      const [project] = await db.insert(portfolio).values(req.body).returning();
      res.status(201).json(project);
    } catch (err) {
      console.error("Error creating portfolio:", err);
      res.status(500).json({ error: "Error al crear proyecto" });
    }
  });

  // PATCH /api/portfolio/:id
  app.patch("/api/portfolio/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [updated] = await db.update(portfolio).set(req.body).where(eq(portfolio.id, id)).returning();
      if (!updated) return res.status(404).json({ error: "Proyecto no encontrado" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar proyecto" });
    }
  });

  // DELETE /api/portfolio/:id
  app.delete("/api/portfolio/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [deleted] = await db.delete(portfolio).where(eq(portfolio.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "Proyecto no encontrado" });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar proyecto" });
    }
  });
}
