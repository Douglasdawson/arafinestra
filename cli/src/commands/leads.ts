import { Command } from "commander";
import chalk from "chalk";
import Table from "cli-table3";
import { writeFileSync } from "fs";
import { apiGet, apiPatch } from "../api.js";

// Color map for lead estados
const estadoColor: Record<string, (s: string) => string> = {
  nuevo: chalk.yellow,
  contactado: chalk.blue,
  presupuestado: chalk.cyan,
  ganado: chalk.green,
  perdido: chalk.red,
};

function colorEstado(estado: string): string {
  const fn = estadoColor[estado] ?? chalk.white;
  return fn(estado);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ── leads list ──────────────────────────────────────────────
async function listLeads(opts: {
  estado?: string;
  origen?: string;
  today?: boolean;
  limit?: string;
}): Promise<void> {
  const params = new URLSearchParams();
  params.set("page", "1");
  params.set("limit", opts.limit ?? "20");
  if (opts.estado) params.set("estado", opts.estado);
  if (opts.origen) params.set("origen", opts.origen);

  const res = await apiGet(`/api/leads?${params.toString()}`);
  if (!res.ok) {
    console.error(chalk.red(`Error fetching leads: ${res.status}`));
    process.exit(1);
  }

  const json = (await res.json()) as {
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  };

  let leads = json.data;

  // Client-side filter for --today
  if (opts.today) {
    const todayStr = new Date().toISOString().slice(0, 10);
    leads = leads.filter(
      (l: any) => l.createdAt && l.createdAt.slice(0, 10) === todayStr
    );
  }

  if (leads.length === 0) {
    console.log(chalk.dim("\n  No leads found.\n"));
    return;
  }

  const table = new Table({
    head: ["ID", "Nom", "Telèfon", "Localitat", "Estat", "Origen", "Data"],
    style: { head: ["cyan"] },
  });

  for (const l of leads) {
    table.push([
      l.id,
      l.nombre ?? "",
      l.telefono ?? "",
      l.localidad ?? "",
      colorEstado(l.estado ?? ""),
      l.origen ?? "",
      l.createdAt ? formatDate(l.createdAt) : "",
    ]);
  }

  console.log();
  console.log(table.toString());
  console.log(
    chalk.dim(
      `  Showing ${leads.length} of ${json.total} leads (page ${json.page}/${json.totalPages})`
    )
  );
  console.log();
}

// ── leads stats ─────────────────────────────────────────────
async function showStats(): Promise<void> {
  const res = await apiGet("/api/leads/stats");
  if (!res.ok) {
    console.error(chalk.red(`Error fetching stats: ${res.status}`));
    process.exit(1);
  }

  const stats = (await res.json()) as {
    byEstado?: Record<string, number>;
    byOrigen?: Record<string, number>;
    [key: string]: any;
  };

  // Stats by estado
  const byEstado = stats.byEstado ?? stats;
  const estadoTable = new Table({
    head: ["Estat", "Count"],
    style: { head: ["cyan"] },
  });

  if (typeof byEstado === "object") {
    for (const [key, val] of Object.entries(byEstado)) {
      if (key === "byOrigen") continue;
      estadoTable.push([colorEstado(key), String(val)]);
    }
  }

  console.log(chalk.bold("\n  Leads by Estado"));
  console.log(estadoTable.toString());

  // Stats by origen
  const byOrigen = stats.byOrigen;
  if (byOrigen && typeof byOrigen === "object") {
    const origenTable = new Table({
      head: ["Origen", "Count"],
      style: { head: ["cyan"] },
    });

    for (const [key, val] of Object.entries(byOrigen)) {
      origenTable.push([key, String(val)]);
    }

    console.log(chalk.bold("\n  Leads by Origen"));
    console.log(origenTable.toString());
  }

  console.log();
}

// ── leads call <id> ─────────────────────────────────────────
async function callLead(id: string): Promise<void> {
  const res = await apiPatch(`/api/leads/${id}`, { estado: "contactado" });
  if (!res.ok) {
    console.error(chalk.red(`Error updating lead ${id}: ${res.status}`));
    process.exit(1);
  }
  console.log(
    chalk.green(`\n  Lead #${id} marked as ${chalk.bold("contactado")}\n`)
  );
}

// ── leads won <id> ──────────────────────────────────────────
async function wonLead(id: string): Promise<void> {
  const res = await apiPatch(`/api/leads/${id}`, { estado: "ganado" });
  if (!res.ok) {
    console.error(chalk.red(`Error updating lead ${id}: ${res.status}`));
    process.exit(1);
  }
  console.log(
    chalk.green(`\n  Lead #${id} marked as ${chalk.bold("ganado")}\n`)
  );
}

// ── leads lost <id> ─────────────────────────────────────────
async function lostLead(id: string): Promise<void> {
  const res = await apiPatch(`/api/leads/${id}`, { estado: "perdido" });
  if (!res.ok) {
    console.error(chalk.red(`Error updating lead ${id}: ${res.status}`));
    process.exit(1);
  }
  console.log(
    chalk.red(`\n  Lead #${id} marked as ${chalk.bold("perdido")}\n`)
  );
}

// ── leads note <id> <text> ──────────────────────────────────
async function addNote(id: string, text: string): Promise<void> {
  // Fetch current lead to get existing notas
  const getRes = await apiGet(`/api/leads/${id}`);
  if (!getRes.ok) {
    console.error(chalk.red(`Error fetching lead ${id}: ${getRes.status}`));
    process.exit(1);
  }

  const lead = (await getRes.json()) as { notas?: string; [k: string]: any };
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 16);
  const newNote = `[${timestamp}] ${text}`;
  const notas = lead.notas ? `${lead.notas}\n${newNote}` : newNote;

  const patchRes = await apiPatch(`/api/leads/${id}`, { notas });
  if (!patchRes.ok) {
    console.error(chalk.red(`Error updating lead ${id}: ${patchRes.status}`));
    process.exit(1);
  }

  console.log(chalk.green(`\n  Note added to lead #${id}: ${chalk.dim(newNote)}\n`));
}

// ── leads export ────────────────────────────────────────────
async function exportLeads(opts: {
  week?: boolean;
  month?: boolean;
}): Promise<void> {
  const params = new URLSearchParams();
  if (opts.week) params.set("period", "week");
  if (opts.month) params.set("period", "month");

  const query = params.toString();
  const url = `/api/leads/export${query ? `?${query}` : ""}`;
  const res = await apiGet(url);

  if (!res.ok) {
    console.error(chalk.red(`Error exporting leads: ${res.status}`));
    process.exit(1);
  }

  const csv = await res.text();
  const today = new Date().toISOString().slice(0, 10);
  const filename = `leads-${today}.csv`;

  writeFileSync(filename, csv, "utf-8");
  console.log(chalk.green(`\n  Exported to ${chalk.bold(filename)}\n`));
}

// ── Register command ────────────────────────────────────────
export function registerLeadsCommand(program: Command): void {
  const leads = program
    .command("leads")
    .description("Manage leads CRM");

  leads
    .command("list")
    .description("List leads in a table")
    .option("--estado <estado>", "Filter by estado (nuevo, contactado, presupuestado, ganado, perdido)")
    .option("--origen <origen>", "Filter by origen")
    .option("--today", "Show only today's leads")
    .option("-n, --limit <n>", "Number of leads to show", "20")
    .action(listLeads);

  leads
    .command("stats")
    .description("Show lead statistics by estado and origen")
    .action(showStats);

  leads
    .command("call <id>")
    .description("Mark lead as contactado")
    .action(callLead);

  leads
    .command("won <id>")
    .description("Mark lead as ganado")
    .action(wonLead);

  leads
    .command("lost <id>")
    .description("Mark lead as perdido")
    .action(lostLead);

  leads
    .command("note <id> <text>")
    .description("Append a timestamped note to a lead")
    .action(addNote);

  leads
    .command("export")
    .description("Export leads to CSV file")
    .option("--week", "Export only this week's leads")
    .option("--month", "Export only this month's leads")
    .action(exportLeads);
}
