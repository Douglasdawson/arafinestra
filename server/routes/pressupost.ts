import type { Express } from "express";
import { requireAuth } from "../middleware/auth.js";
import { db } from "../db.js";
import { products, leads } from "@shared/schema";
import PDFDocument from "pdfkit";
import { like, or, eq } from "drizzle-orm";

interface QuoteClient {
  name: string;
  phone: string;
  email?: string;
  city: string;
}

interface QuoteItem {
  type: string;
  width: number;
  height: number;
  glass: string;
}

interface QuoteBody {
  client: QuoteClient;
  items: QuoteItem[];
}

export function registerPressupostRoutes(app: Express) {
  app.post("/api/pressupost/generate", requireAuth, async (req, res) => {
    try {
      const { client, items } = req.body as QuoteBody;

      // Validation
      if (!client?.name || !client?.phone) {
        return res.status(400).json({ error: "Client name and phone are required" });
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "At least one item is required" });
      }
      if (items.length > 100) {
        return res.status(400).json({ error: "Too many items (max 100)" });
      }
      // Validar dimensiones: números finitos y positivos (evita NaN/Infinity en el precio)
      for (const item of items) {
        if (!Number.isFinite(item.width) || item.width <= 0 || !Number.isFinite(item.height) || item.height <= 0) {
          return res.status(400).json({ error: "Invalid item dimensions" });
        }
      }

      const now = new Date();
      const year = now.getFullYear();

      // Precios: una sola query para todos los tipos (evita N+1) → Map tipo→producto
      const uniqueTypes = [...new Set(items.map((i) => i.type))];
      const productRows = uniqueTypes.length
        ? await db
            .select()
            .from(products)
            .where(or(...uniqueTypes.map((t) => like(products.modelo, `%${t}%`))))
        : [];
      const productByType = new Map<string, (typeof productRows)[number]>();
      for (const t of uniqueTypes) {
        const match = productRows.find(
          (p) => p.modelo && p.modelo.toLowerCase().includes(t.toLowerCase())
        );
        if (match) productByType.set(t, match);
      }

      // Calculate pricing for each item
      const calculatedItems = items.map((item) => {
        const m2 = (item.width / 100) * (item.height / 100);
        const product = productByType.get(item.type);
        // != null: un precioBase o precioPorM2 de 0 es válido y NO debe caer al default
        const priceBase = product?.precioBase != null ? product.precioBase : 200;
        const pricePerM2 = product?.precioPorM2 != null ? product.precioPorM2 : 190;
        const itemSubtotal = Math.round((priceBase + m2 * pricePerM2) * 100) / 100;
        return {
          ...item,
          m2: Math.round(m2 * 100) / 100,
          priceBase,
          pricePerM2,
          subtotal: itemSubtotal,
        };
      });

      const subtotal = Math.round(calculatedItems.reduce((sum, i) => sum + i.subtotal, 0) * 100) / 100;
      const iva = Math.round(subtotal * 0.21 * 100) / 100;
      const total = Math.round((subtotal + iva) * 100) / 100;

      const dateStr = now.toLocaleDateString("ca-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const validityDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const validityStr = validityDate.toLocaleDateString("ca-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      // Insertar el lead ANTES de generar el PDF: si falla, 500 sin entregar PDF.
      // Así nunca se entrega un presupuesto sin registro en el CRM (y el número
      // deriva del id → único y atómico, sin colisiones por Date.now()).
      const [lead] = await db
        .insert(leads)
        .values({
          nombre: client.name,
          telefono: client.phone,
          email: client.email || null,
          localidad: client.city || null,
          origen: "admin",
          estado: "presupuestado",
        })
        .returning();
      const quoteNum = `P-${year}-${String(lead.id).padStart(4, "0")}`;

      // Guardar el detalle calculado del presupuesto en el lead ya creado
      await db
        .update(leads)
        .set({ presupuestoDatos: { quoteNum, items: calculatedItems, subtotal, iva, total } })
        .where(eq(leads.id, lead.id));

      // Create PDF
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="pressupost-${quoteNum}.pdf"`
      );

      doc.pipe(res);

      // --- Header ---
      doc.fontSize(20).font("Helvetica-Bold").text("ARA FINESTRA", 50, 50);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Renova't Costa Brava SL — CIF B42997049", 50, 75)
        .text("Calle Antilles 15, 17310 Lloret de Mar, Girona", 50, 88)
        .text("info@arafinestra.com", 50, 101);

      doc.moveTo(50, 120).lineTo(545, 120).stroke();

      // --- Quote info ---
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(`Pressupost: ${quoteNum}`, 50, 135);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Data: ${dateStr}`, 50, 152)
        .text(`Validesa: fins ${validityStr} (30 dies)`, 50, 165);

      // --- Client section ---
      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Client", 50, 195);
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`Nom: ${client.name}`, 50, 215)
        .text(`Telèfon: ${client.phone}`, 50, 228);
      if (client.email) {
        doc.text(`Email: ${client.email}`, 50, 241);
      }
      doc.text(`Localitat: ${client.city || "-"}`, 50, client.email ? 254 : 241);

      // --- Items section ---
      let yPos = (client.email ? 254 : 241) + 30;

      doc.fontSize(12).font("Helvetica-Bold").text("Detall del pressupost", 50, yPos);
      yPos += 20;

      // Table header
      doc.fontSize(9).font("Helvetica-Bold");
      doc.text("#", 50, yPos, { width: 20 });
      doc.text("Descripció", 70, yPos, { width: 170 });
      doc.text("Dimensions", 240, yPos, { width: 80 });
      doc.text("m²", 320, yPos, { width: 40 });
      doc.text("€/m²", 370, yPos, { width: 50 });
      doc.text("Subtotal", 430, yPos, { width: 80, align: "right" });
      yPos += 15;
      doc.moveTo(50, yPos).lineTo(545, yPos).stroke();
      yPos += 8;

      // Table rows
      doc.fontSize(9).font("Helvetica");
      calculatedItems.forEach((item, idx) => {
        if (yPos > 700) {
          doc.addPage();
          yPos = 50;
        }
        doc.text(String(idx + 1), 50, yPos, { width: 20 });
        doc.text(`${item.type} — Vidre: ${item.glass}`, 70, yPos, { width: 170 });
        doc.text(`${item.width}×${item.height} cm`, 240, yPos, { width: 80 });
        doc.text(String(item.m2), 320, yPos, { width: 40 });
        doc.text(`${item.pricePerM2.toFixed(2)} €`, 370, yPos, { width: 50 });
        doc.text(`${item.subtotal.toFixed(2)} €`, 430, yPos, { width: 80, align: "right" });
        yPos += 18;
      });

      // --- Totals ---
      yPos += 10;
      doc.moveTo(350, yPos).lineTo(545, yPos).stroke();
      yPos += 10;

      doc.fontSize(10).font("Helvetica");
      doc.text("Subtotal:", 350, yPos, { width: 80 });
      doc.text(`${subtotal.toFixed(2)} €`, 430, yPos, { width: 80, align: "right" });
      yPos += 18;

      doc.text("IVA 21%:", 350, yPos, { width: 80 });
      doc.text(`${iva.toFixed(2)} €`, 430, yPos, { width: 80, align: "right" });
      yPos += 18;

      doc.fontSize(13).font("Helvetica-Bold");
      doc.text("TOTAL:", 350, yPos, { width: 80 });
      doc.text(`${total.toFixed(2)} €`, 430, yPos, { width: 80, align: "right" });

      // --- Footer terms ---
      // Colocar los términos tras los totales; solo añadir página si no caben (~130px)
      yPos += 40;
      if (yPos > 690) {
        doc.addPage();
        yPos = 50;
      }
      doc.moveTo(50, yPos).lineTo(545, yPos).stroke();
      yPos += 10;

      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor("#666666")
        .text(
          "Aquest pressupost és orientatiu i pot variar segons les condicions finals de la instal·lació. " +
            "Garantia: 10 anys perfils Cortizo + 2 anys instal·lació. " +
            "Forma de pagament: 50% a la confirmació, 50% a la finalització. " +
            "Termini d'execució estimat: 15-30 dies laborables des de la confirmació.",
          50,
          yPos,
          { width: 495, lineGap: 2 }
        );

      doc.end();
    } catch (err) {
      console.error("Error generating pressupost PDF:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error al generar el pressupost" });
      }
    }
  });
}
