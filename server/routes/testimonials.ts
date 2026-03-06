import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { testimonials } from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export function registerTestimonialRoutes(app: Express) {
  // GET /api/testimonials — list, ?published
  app.get("/api/testimonials", async (req, res) => {
    try {
      const { published } = req.query;
      const where = published === "true" ? eq(testimonials.published, true) : undefined;
      const data = await db.select().from(testimonials).where(where).orderBy(desc(testimonials.createdAt));
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener testimonios" });
    }
  });

  // POST /api/testimonials
  app.post("/api/testimonials", requireAuth, async (req, res) => {
    try {
      const [testimonial] = await db.insert(testimonials).values(req.body).returning();
      res.status(201).json(testimonial);
    } catch (err) {
      console.error("Error creating testimonial:", err);
      res.status(500).json({ error: "Error al crear testimonio" });
    }
  });

  // PATCH /api/testimonials/:id
  app.patch("/api/testimonials/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [updated] = await db.update(testimonials).set(req.body).where(eq(testimonials.id, id)).returning();
      if (!updated) return res.status(404).json({ error: "Testimonio no encontrado" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar testimonio" });
    }
  });

  // DELETE /api/testimonials/:id
  app.delete("/api/testimonials/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [deleted] = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "Testimonio no encontrado" });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar testimonio" });
    }
  });
}
