import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { leads } from "@shared/schema";
import { eq, and, or, like, desc, sql, count } from "drizzle-orm";

export function registerLeadRoutes(app: Express) {
  // GET /api/leads — list with filters + pagination
  app.get("/api/leads", requireAuth, async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const offset = (page - 1) * limit;
      const { estado, origen, tipoCliente, search } = req.query;

      const conditions = [];
      if (estado && estado !== "todos") conditions.push(eq(leads.estado, estado as string));
      if (origen) conditions.push(eq(leads.origen, origen as string));
      if (tipoCliente) conditions.push(eq(leads.tipoCliente, tipoCliente as string));
      if (search) {
        const s = `%${search}%`;
        conditions.push(or(like(leads.nombre, s), like(leads.email, s)));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [data, totalResult] = await Promise.all([
        db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(limit).offset(offset),
        db.select({ total: count() }).from(leads).where(where),
      ]);

      const total = totalResult[0]?.total ?? 0;
      res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
      console.error("Error fetching leads:", err);
      res.status(500).json({ error: "Error al obtener leads" });
    }
  });

  // GET /api/leads/stats
  app.get("/api/leads/stats", requireAuth, async (_req, res) => {
    try {
      const byEstado = await db
        .select({ estado: leads.estado, count: count() })
        .from(leads)
        .groupBy(leads.estado);
      const byOrigen = await db
        .select({ origen: leads.origen, count: count() })
        .from(leads)
        .groupBy(leads.origen);
      res.json({ byEstado, byOrigen });
    } catch (err) {
      console.error("Error fetching lead stats:", err);
      res.status(500).json({ error: "Error al obtener estadisticas" });
    }
  });

  // GET /api/leads/:id
  app.get("/api/leads/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const lead = await db.query.leads.findFirst({ where: eq(leads.id, id) });
      if (!lead) return res.status(404).json({ error: "Lead no encontrado" });
      res.json(lead);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener lead" });
    }
  });

  // POST /api/leads — PUBLIC (form submission)
  app.post("/api/leads", async (req, res) => {
    try {
      const [lead] = await db.insert(leads).values(req.body).returning();
      res.status(201).json(lead);
    } catch (err) {
      console.error("Error creating lead:", err);
      res.status(500).json({ error: "Error al crear lead" });
    }
  });

  // PATCH /api/leads/:id
  app.patch("/api/leads/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [updated] = await db
        .update(leads)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(leads.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: "Lead no encontrado" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar lead" });
    }
  });

  // DELETE /api/leads/:id
  app.delete("/api/leads/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [deleted] = await db.delete(leads).where(eq(leads.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "Lead no encontrado" });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar lead" });
    }
  });
}
