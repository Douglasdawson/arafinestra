import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { leads } from "@shared/schema";
import { eq, and, or, like, desc, sql, count } from "drizzle-orm";
import { notifyNewLead } from "../lib/notify.js";

// Simple in-memory rate limiter for POST /api/leads
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Cleanup expired entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS);

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

  // GET /api/leads/export — CSV download
  app.get("/api/leads/export", requireAuth, async (_req, res) => {
    try {
      const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));

      const header = "ID,Nombre,Email,Teléfono,Localidad,Tipo,Origen,Estado,Notas,Fecha";
      const rows = allLeads.map((l) => {
        const esc = (v: string | null | undefined) => {
          if (!v) return "";
          const s = v.replace(/"/g, '""');
          return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s;
        };
        const fecha = l.createdAt ? new Date(l.createdAt).toISOString().slice(0, 10) : "";
        return [l.id, esc(l.nombre), esc(l.email), esc(l.telefono), esc(l.localidad), esc(l.tipoCliente), esc(l.origen), esc(l.estado), esc(l.notas), fecha].join(",");
      });

      const csv = [header, ...rows].join("\n");
      const today = new Date().toISOString().slice(0, 10);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="leads-${today}.csv"`);
      res.send(csv);
    } catch (err) {
      console.error("Error exporting leads:", err);
      res.status(500).json({ error: "Error al exportar leads" });
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

  // POST /api/leads — PUBLIC (form submission) with rate limiting
  app.post("/api/leads", async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (isRateLimited(ip)) {
      return res.status(429).json({
        error: "Demasiadas solicitudes. Por favor, inténtalo de nuevo en unos minutos.",
      });
    }
    try {
      const [lead] = await db.insert(leads).values(req.body).returning();
      // Fire-and-forget email notification
      notifyNewLead({
        nombre: lead.nombre,
        email: lead.email,
        telefono: lead.telefono,
        localidad: lead.localidad,
        origen: lead.origen,
        mensaje: lead.notas,
        configuracion: req.body.configuracion,
      }).catch(() => {});
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
