import { Command } from "commander";
import chalk from "chalk";
import Table from "cli-table3";
import PDFDocument from "pdfkit";
import { createInterface } from "readline";
import {
  existsSync,
  mkdirSync,
  createWriteStream,
  readdirSync,
  statSync,
} from "fs";
import { homedir } from "os";
import { join } from "path";
import { loadConfig } from "../config.js";

// ── Constants ───────────────────────────────────────────────
const OUTPUT_DIR = join(homedir(), "arafinestra-pressupostos");
const FALLBACK_PRICE = 350; // €/m²
const IVA_RATE = 0.21;

const COMPANY = {
  name: "ARA FINESTRA",
  legal: "Renova't Costa Brava SL",
  cif: "B42997049",
  address: "Calle Antilles 15, 17310 Lloret de Mar, Girona",
  email: "info@arafinestra.com",
  web: "arafinestra.com",
};

const WINDOW_TYPES: Record<string, string> = {
  c70: "Cortizo C70 Corredera",
  a84: "Cortizo A84 Abatible",
  e170: "Cortizo E170 Elevable",
};

interface ClientInfo {
  name: string;
  phone: string;
  email: string;
  city: string;
}

interface LineItem {
  type: string;
  typeLabel: string;
  widthCm: number;
  heightCm: number;
  m2: number;
  glass: string;
  pricePerM2: number;
  total: number;
}

// ── Readline helper ─────────────────────────────────────────
function ask(rl: ReturnType<typeof createInterface>, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(chalk.cyan(question), (answer) => resolve(answer.trim()));
  });
}

// ── Fetch product prices from API ───────────────────────────
async function fetchProductPrices(): Promise<Record<string, number>> {
  const prices: Record<string, number> = {};
  try {
    const config = loadConfig();
    const baseUrl = config.apiUrl.replace(/\/$/, "");
    const res = await fetch(`${baseUrl}/api/products?activo=true`);
    if (res.ok) {
      const products = (await res.json()) as Array<{
        modelo?: string;
        precioPorM2?: number;
        tipo?: string;
      }>;
      for (const p of products) {
        if (p.modelo && p.precioPorM2) {
          prices[p.modelo.toLowerCase()] = p.precioPorM2;
        }
        if (p.tipo && p.precioPorM2) {
          prices[p.tipo.toLowerCase()] = p.precioPorM2;
        }
      }
    }
  } catch {
    // Non-critical — will use fallback prices
  }
  return prices;
}

// ── Generate quote number ───────────────────────────────────
function generateQuoteNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const seq = String(
    Math.floor(Math.random() * 9000) + 1000
  );
  return `P-${year}-${seq}`;
}

// ── Create lead in CRM ──────────────────────────────────────
async function createLeadInCRM(
  client: ClientInfo,
  quoteNumber: string,
  total: number
): Promise<void> {
  try {
    const config = loadConfig();
    const baseUrl = config.apiUrl.replace(/\/$/, "");
    await fetch(`${baseUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: client.name,
        telefono: client.phone,
        email: client.email || null,
        localidad: client.city,
        origen: "cli-pressupost",
        notas: `Pressupost ${quoteNumber} — Total: ${total.toFixed(2)} €`,
      }),
    });
  } catch {
    // Non-critical — silently ignore
  }
}

// ── PDF Generation ──────────────────────────────────────────
function generatePDF(
  quoteNumber: string,
  client: ClientInfo,
  items: LineItem[],
  subtotal: number,
  iva: number,
  total: number,
  filePath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = createWriteStream(filePath);
    doc.pipe(stream);

    const pageWidth = doc.page.width - 100; // margins

    // ── Header ──────────────────────────────────────────
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .text(COMPANY.name, 50, 50);

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#555555")
      .text(COMPANY.legal, 50, 78)
      .text(`CIF: ${COMPANY.cif}`, 50, 91)
      .text(COMPANY.address, 50, 104)
      .text(`${COMPANY.email}  |  ${COMPANY.web}`, 50, 117);

    // Quote number — right aligned
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text(`Pressupost ${quoteNumber}`, 300, 50, {
        align: "right",
        width: pageWidth - 250,
      });

    const dateStr = new Date().toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Data: ${dateStr}`, 300, 70, {
        align: "right",
        width: pageWidth - 250,
      });

    // Divider
    doc
      .moveTo(50, 140)
      .lineTo(50 + pageWidth, 140)
      .strokeColor("#2563eb")
      .lineWidth(2)
      .stroke();

    // ── Client info ─────────────────────────────────────
    let y = 155;
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("Dades del client", 50, y);
    y += 20;

    doc.fontSize(10).font("Helvetica");
    doc.text(`Nom: ${client.name}`, 50, y);
    y += 15;
    doc.text(`Telèfon: ${client.phone}`, 50, y);
    y += 15;
    if (client.email) {
      doc.text(`Email: ${client.email}`, 50, y);
      y += 15;
    }
    doc.text(`Localitat: ${client.city}`, 50, y);
    y += 30;

    // ── Items table ─────────────────────────────────────
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Desglossament", 50, y);
    y += 22;

    // Table header
    const colX = [50, 200, 290, 350, 420, 490];
    const colHeaders = ["Producte", "Dimensions", "m²", "Vidre", "€/m²", "Total"];

    doc.fontSize(9).font("Helvetica-Bold").fillColor("#ffffff");
    doc
      .rect(50, y, pageWidth, 18)
      .fill("#2563eb");

    for (let i = 0; i < colHeaders.length; i++) {
      doc.text(colHeaders[i], colX[i] + 4, y + 4, { width: 80 });
    }
    y += 18;

    // Table rows
    doc.font("Helvetica").fillColor("#000000");
    for (let idx = 0; idx < items.length; idx++) {
      const item = items[idx];
      const rowY = y + idx * 20;

      // Zebra striping
      if (idx % 2 === 1) {
        doc.rect(50, rowY, pageWidth, 20).fill("#f0f4ff");
        doc.fillColor("#000000");
      }

      doc.fontSize(9);
      doc.text(item.typeLabel, colX[0] + 4, rowY + 5, { width: 145 });
      doc.text(`${item.widthCm}×${item.heightCm} cm`, colX[1] + 4, rowY + 5, { width: 85 });
      doc.text(item.m2.toFixed(2), colX[2] + 4, rowY + 5, { width: 55 });
      doc.text(item.glass, colX[3] + 4, rowY + 5, { width: 65 });
      doc.text(`${item.pricePerM2.toFixed(0)} €`, colX[4] + 4, rowY + 5, { width: 65 });
      doc.text(`${item.total.toFixed(2)} €`, colX[5] + 4, rowY + 5, { width: 55 });
    }

    y += items.length * 20 + 15;

    // ── Totals ──────────────────────────────────────────
    doc
      .moveTo(350, y)
      .lineTo(50 + pageWidth, y)
      .strokeColor("#cccccc")
      .lineWidth(1)
      .stroke();
    y += 10;

    doc.fontSize(10).font("Helvetica");
    doc.text("Subtotal:", 370, y);
    doc.text(`${subtotal.toFixed(2)} €`, 470, y, { width: 75, align: "right" });
    y += 18;

    doc.text(`IVA (${(IVA_RATE * 100).toFixed(0)}%):`, 370, y);
    doc.text(`${iva.toFixed(2)} €`, 470, y, { width: 75, align: "right" });
    y += 18;

    doc
      .moveTo(370, y)
      .lineTo(50 + pageWidth, y)
      .strokeColor("#2563eb")
      .lineWidth(1.5)
      .stroke();
    y += 8;

    doc.fontSize(13).font("Helvetica-Bold");
    doc.text("TOTAL:", 370, y);
    doc.text(`${total.toFixed(2)} €`, 470, y, { width: 75, align: "right" });
    y += 40;

    // ── Terms ───────────────────────────────────────────
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#000000")
      .text("Condicions", 50, y);
    y += 18;

    const terms = [
      "Aquest pressupost és orientatiu i no vinculant.",
      "Garantia: 10 anys perfils + 2 anys instal·lació.",
      "Pagament: 50% a l'acceptació, 50% a la finalització.",
      "Termini d'execució estimat: 15-30 dies laborables.",
      "Validesa del pressupost: 30 dies.",
    ];

    doc.fontSize(9).font("Helvetica").fillColor("#444444");
    for (const t of terms) {
      doc.text(`•  ${t}`, 55, y, { width: pageWidth - 10 });
      y += 15;
    }

    // Finalize
    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

// ── Command: pressupost generate ────────────────────────────
async function generateQuote(): Promise<void> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log(chalk.bold("\n  ARA FINESTRA — Generador de pressupostos\n"));

    // Fetch product prices
    const prices = await fetchProductPrices();

    // ── Client info ───────────────────────────────────
    console.log(chalk.bold("  Dades del client:"));
    const name = await ask(rl, "  Nom: ");
    if (!name) {
      console.log(chalk.red("\n  El nom és obligatori.\n"));
      return;
    }
    const phone = await ask(rl, "  Telèfon: ");
    if (!phone) {
      console.log(chalk.red("\n  El telèfon és obligatori.\n"));
      return;
    }
    const email = await ask(rl, "  Email (opcional): ");
    const city = await ask(rl, "  Localitat: ");

    const client: ClientInfo = { name, phone, email, city };

    // ── Window items ──────────────────────────────────
    const items: LineItem[] = [];
    let addMore = true;

    console.log(chalk.bold("\n  Finestres / elements:"));
    console.log(chalk.dim("  Tipus disponibles: c70, a84, e170\n"));

    while (addMore) {
      const typeInput = (await ask(rl, `  Tipus (c70/a84/e170): `)).toLowerCase();
      const typeLabel = WINDOW_TYPES[typeInput];
      if (!typeLabel) {
        console.log(chalk.yellow("  Tipus no reconegut. Usa: c70, a84, e170"));
        continue;
      }

      const widthStr = await ask(rl, "  Amplada (cm): ");
      const heightStr = await ask(rl, "  Alçada (cm): ");
      const widthCm = parseInt(widthStr, 10);
      const heightCm = parseInt(heightStr, 10);

      if (isNaN(widthCm) || isNaN(heightCm) || widthCm <= 0 || heightCm <= 0) {
        console.log(chalk.yellow("  Dimensions no vàlides. Torna-ho a provar."));
        continue;
      }

      const glass = (await ask(rl, "  Tipus de vidre (doble/triple/baix-emissiu): ")) || "doble";

      const m2 = (widthCm / 100) * (heightCm / 100);

      // Lookup price: try modelo match, then type, then fallback
      const pricePerM2 =
        prices[typeInput] ??
        prices[typeLabel.toLowerCase()] ??
        FALLBACK_PRICE;

      const total = m2 * pricePerM2;

      items.push({
        type: typeInput,
        typeLabel,
        widthCm,
        heightCm,
        m2,
        glass,
        pricePerM2,
        total,
      });

      console.log(
        chalk.green(
          `  ✓ ${typeLabel} ${widthCm}×${heightCm}cm = ${m2.toFixed(2)} m² → ${total.toFixed(2)} €`
        )
      );

      const more = (await ask(rl, "\n  Afegir un altre element? (s/n): ")).toLowerCase();
      addMore = more === "s" || more === "si" || more === "sí";
      console.log();
    }

    if (items.length === 0) {
      console.log(chalk.red("\n  No s'han afegit elements. Cancel·lat.\n"));
      return;
    }

    // ── Calculate totals ──────────────────────────────
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const iva = subtotal * IVA_RATE;
    const total = subtotal + iva;

    // ── Generate PDF ──────────────────────────────────
    if (!existsSync(OUTPUT_DIR)) {
      mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const quoteNumber = generateQuoteNumber();
    const fileName = `${quoteNumber}_${client.name.replace(/\s+/g, "-")}.pdf`;
    const filePath = join(OUTPUT_DIR, fileName);

    await generatePDF(quoteNumber, client, items, subtotal, iva, total, filePath);

    // ── Summary ───────────────────────────────────────
    console.log(chalk.bold("\n  Resum del pressupost:"));
    console.log(`  Número: ${chalk.cyan(quoteNumber)}`);
    console.log(`  Client: ${client.name} — ${client.phone}`);
    console.log(`  Elements: ${items.length}`);
    console.log(`  Subtotal: ${subtotal.toFixed(2)} €`);
    console.log(`  IVA (21%): ${iva.toFixed(2)} €`);
    console.log(chalk.bold(`  TOTAL: ${total.toFixed(2)} €`));
    console.log(chalk.green(`\n  PDF generat: ${chalk.bold(filePath)}\n`));

    // ── Create lead in CRM (non-critical) ─────────────
    await createLeadInCRM(client, quoteNumber, total);
    console.log(chalk.dim("  Lead creat al CRM.\n"));
  } finally {
    rl.close();
  }
}

// ── Command: pressupost list ────────────────────────────────
async function listQuotes(): Promise<void> {
  if (!existsSync(OUTPUT_DIR)) {
    console.log(chalk.dim("\n  No s'han trobat pressupostos.\n"));
    return;
  }

  const files = readdirSync(OUTPUT_DIR)
    .filter((f) => f.endsWith(".pdf"))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.log(chalk.dim("\n  No s'han trobat pressupostos.\n"));
    return;
  }

  const table = new Table({
    head: ["Fitxer", "Data", "Mida"],
    style: { head: ["cyan"] },
  });

  for (const f of files) {
    const stat = statSync(join(OUTPUT_DIR, f));
    const date = stat.mtime.toLocaleDateString("ca-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const sizeKB = (stat.size / 1024).toFixed(1);
    table.push([f, date, `${sizeKB} KB`]);
  }

  console.log();
  console.log(table.toString());
  console.log(chalk.dim(`  ${files.length} pressupost(s) a ${OUTPUT_DIR}`));
  console.log();
}

// ── Register command ────────────────────────────────────────
export function registerPressupostCommand(program: Command): void {
  const pressupost = program
    .command("pressupost")
    .description("PDF quote generator");

  pressupost
    .command("generate")
    .description("Generate an interactive PDF quote")
    .action(generateQuote);

  pressupost
    .command("list")
    .description("List generated PDF quotes")
    .action(listQuotes);
}
