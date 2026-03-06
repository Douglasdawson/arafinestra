import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { blogPosts } from "@shared/schema";
import { eq, and, desc, count } from "drizzle-orm";

export function registerBlogRoutes(app: Express) {
  // GET /api/blog — list, ?published, ?categoria, pagination
  app.get("/api/blog", async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
      const offset = (page - 1) * limit;
      const { published, categoria } = req.query;

      const conditions = [];
      if (published === "true") conditions.push(eq(blogPosts.published, true));
      if (categoria) conditions.push(eq(blogPosts.categoria, categoria as string));
      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [data, totalResult] = await Promise.all([
        db.select().from(blogPosts).where(where).orderBy(desc(blogPosts.createdAt)).limit(limit).offset(offset),
        db.select({ total: count() }).from(blogPosts).where(where),
      ]);

      const total = totalResult[0]?.total ?? 0;
      res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
    } catch (err) {
      res.status(500).json({ error: "Error al obtener blog posts" });
    }
  });

  // GET /api/blog/:slug — single by slug (public)
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.slug, req.params.slug as string),
      });
      if (!post) return res.status(404).json({ error: "Post no encontrado" });
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener post" });
    }
  });

  // POST /api/blog
  app.post("/api/blog", requireAuth, async (req, res) => {
    try {
      const [post] = await db.insert(blogPosts).values(req.body).returning();
      res.status(201).json(post);
    } catch (err) {
      console.error("Error creating blog post:", err);
      res.status(500).json({ error: "Error al crear post" });
    }
  });

  // PATCH /api/blog/:id — update by id
  app.patch("/api/blog/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [updated] = await db.update(blogPosts).set(req.body).where(eq(blogPosts.id, id)).returning();
      if (!updated) return res.status(404).json({ error: "Post no encontrado" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar post" });
    }
  });

  // DELETE /api/blog/:id
  app.delete("/api/blog/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "Post no encontrado" });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar post" });
    }
  });
}
