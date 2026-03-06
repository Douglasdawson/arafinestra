import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { products } from "@shared/schema";
import { eq, and, count } from "drizzle-orm";

export function registerProductRoutes(app: Express) {
  // GET /api/products — list, ?tipo, ?activo
  app.get("/api/products", async (req, res) => {
    try {
      const { tipo, activo } = req.query;
      const conditions = [];
      if (tipo) conditions.push(eq(products.tipo, tipo as string));
      if (activo === "true") conditions.push(eq(products.activo, true));
      const where = conditions.length > 0 ? and(...conditions) : undefined;
      const data = await db.select().from(products).where(where);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener productos" });
    }
  });

  // GET /api/products/:id
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const product = await db.query.products.findFirst({ where: eq(products.id, id) });
      if (!product) return res.status(404).json({ error: "Producto no encontrado" });
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: "Error al obtener producto" });
    }
  });

  // POST /api/products
  app.post("/api/products", requireAuth, async (req, res) => {
    try {
      const [product] = await db.insert(products).values(req.body).returning();
      res.status(201).json(product);
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ error: "Error al crear producto" });
    }
  });

  // PATCH /api/products/:id
  app.patch("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [updated] = await db.update(products).set(req.body).where(eq(products.id, id)).returning();
      if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar producto" });
    }
  });

  // DELETE /api/products/:id
  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();
      if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar producto" });
    }
  });
}
