# ARA FINESTRA CLI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a unified `arafinestra` CLI tool with 5 modules (leads, blog, zones, seo, pressupost) that communicates via REST API and uses Claude API for AI content generation.

**Architecture:** TypeScript CLI in `cli/` directory within the existing monorepo. Uses `commander` for command parsing, `chalk` for colored output, `cli-table3` for tables. Communicates with `arafinestra.com/api/*` endpoints. Separate tsconfig for CLI (Node.js target, no JSX). Auth token stored in `~/.arafinestra/config.json`.

**Tech Stack:** TypeScript, commander, chalk, cli-table3, @anthropic-ai/sdk, pdfkit, node-fetch

---

## Task 1: CLI Scaffold + Auth Module

**Files:**
- Create: `cli/src/index.ts`
- Create: `cli/src/config.ts`
- Create: `cli/src/api.ts`
- Create: `cli/src/commands/login.ts`
- Create: `cli/tsconfig.json`
- Modify: `package.json` (add cli script + dependencies)

**Step 1: Install CLI dependencies**

```bash
npm install commander chalk cli-table3 @anthropic-ai/sdk pdfkit
```

**Step 2: Create CLI tsconfig**

Create `cli/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "../dist/cli",
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Step 3: Create config module**

Create `cli/src/config.ts` — manages `~/.arafinestra/config.json`:
```typescript
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const CONFIG_DIR = join(homedir(), ".arafinestra");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface Config {
  apiUrl: string;
  sessionCookie?: string;
  anthropicApiKey?: string;
}

const DEFAULT_CONFIG: Config = {
  apiUrl: "https://arafinestra.com",
};

export function loadConfig(): Config {
  if (!existsSync(CONFIG_FILE)) return { ...DEFAULT_CONFIG };
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(readFileSync(CONFIG_FILE, "utf-8")) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: Partial<Config>): void {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  const current = loadConfig();
  writeFileSync(CONFIG_FILE, JSON.stringify({ ...current, ...config }, null, 2));
}

export function getApiUrl(): string {
  return loadConfig().apiUrl;
}

export function getSessionCookie(): string | undefined {
  return loadConfig().sessionCookie;
}

export function getAnthropicKey(): string | undefined {
  return loadConfig().anthropicApiKey;
}
```

**Step 4: Create API client module**

Create `cli/src/api.ts` — wrapper for authenticated API calls:
```typescript
import { getApiUrl, getSessionCookie } from "./config.js";
import chalk from "chalk";

export async function api(path: string, options: RequestInit = {}): Promise<any> {
  const cookie = getSessionCookie();
  if (!cookie && !path.includes("/auth/login")) {
    console.error(chalk.red("No has iniciat sessió. Executa: arafinestra login"));
    process.exit(1);
  }

  const url = `${getApiUrl()}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    console.error(chalk.red("Sessió expirada. Executa: arafinestra login"));
    process.exit(1);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export async function apiGet(path: string) {
  return api(path);
}

export async function apiPost(path: string, body: object) {
  return api(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPatch(path: string, body: object) {
  return api(path, { method: "PATCH", body: JSON.stringify(body) });
}

export async function apiDelete(path: string) {
  return api(path, { method: "DELETE" });
}
```

**Step 5: Create login command**

Create `cli/src/commands/login.ts`:
```typescript
import { createInterface } from "readline";
import { saveConfig, getApiUrl } from "../config.js";
import chalk from "chalk";

function prompt(question: string, hidden = false): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export async function loginCommand() {
  const username = await prompt("Usuari: ");
  const password = await prompt("Contrasenya: ");

  const res = await fetch(`${getApiUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    console.error(chalk.red("Login incorrecte."));
    process.exit(1);
  }

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    saveConfig({ sessionCookie: setCookie.split(";")[0] });
  }

  console.log(chalk.green("✓ Sessió iniciada correctament."));
}
```

**Step 6: Create main entry point**

Create `cli/src/index.ts`:
```typescript
#!/usr/bin/env node
import { Command } from "commander";
import { loginCommand } from "./commands/login.js";

const program = new Command();

program
  .name("arafinestra")
  .description("ARA FINESTRA — Eina de gestió del negoci")
  .version("1.0.0");

program
  .command("login")
  .description("Iniciar sessió al panell d'administració")
  .action(loginCommand);

// Modules will be registered here as they're built

program.parse();
```

**Step 7: Add CLI script to package.json**

Add to `package.json` scripts:
```json
"cli": "tsx cli/src/index.ts"
```

**Step 8: Test manually**

```bash
npm run cli -- --help
npm run cli -- login
```
Expected: Help shows available commands. Login prompts for credentials.

**Step 9: Commit**

```bash
git add cli/ package.json package-lock.json
git commit -m "feat(cli): scaffold CLI with auth module"
```

---

## Task 2: Leads Module

**Files:**
- Create: `cli/src/commands/leads.ts`
- Modify: `cli/src/index.ts` (register leads command)

**Step 1: Create leads command module**

Create `cli/src/commands/leads.ts`:
```typescript
import { Command } from "commander";
import { apiGet, apiPatch } from "../api.js";
import chalk from "chalk";
import Table from "cli-table3";

const STATUS_COLORS: Record<string, (s: string) => string> = {
  nuevo: chalk.yellow,
  contactado: chalk.blue,
  presupuestado: chalk.cyan,
  ganado: chalk.green,
  perdido: chalk.red,
};

function colorStatus(estado: string): string {
  const fn = STATUS_COLORS[estado] || chalk.white;
  return fn(estado);
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("ca-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function registerLeadsCommand(program: Command) {
  const leads = program.command("leads").description("Gestió de leads (CRM)");

  leads
    .command("list")
    .description("Llistar leads")
    .option("--estado <estado>", "Filtrar per estat (nuevo|contactado|presupuestado|ganado|perdido)")
    .option("--today", "Només leads d'avui")
    .option("--origen <origen>", "Filtrar per origen")
    .option("-n, --limit <n>", "Nombre de resultats", "20")
    .action(async (opts) => {
      const params = new URLSearchParams();
      if (opts.estado) params.set("estado", opts.estado);
      if (opts.origen) params.set("origen", opts.origen);
      params.set("limit", opts.limit);

      const { data, total } = await apiGet(`/api/leads?${params}`);

      let filtered = data;
      if (opts.today) {
        const today = new Date().toISOString().slice(0, 10);
        filtered = data.filter((l: any) => l.createdAt?.slice(0, 10) === today);
      }

      if (filtered.length === 0) {
        console.log(chalk.dim("Cap lead trobat."));
        return;
      }

      const table = new Table({
        head: ["ID", "Nom", "Telèfon", "Localitat", "Estat", "Origen", "Data"],
        style: { head: ["cyan"] },
      });

      for (const l of filtered) {
        table.push([
          l.id,
          l.nombre || "-",
          l.telefono || "-",
          l.localidad || "-",
          colorStatus(l.estado),
          l.origen || "-",
          formatDate(l.createdAt),
        ]);
      }

      console.log(table.toString());
      console.log(chalk.dim(`Total: ${total} leads`));
    });

  leads
    .command("stats")
    .description("Estadístiques de leads")
    .action(async () => {
      const stats = await apiGet("/api/leads/stats");

      console.log(chalk.bold("\n📊 Estadístiques de leads\n"));

      if (stats.byEstado) {
        const table = new Table({ head: ["Estat", "Total"], style: { head: ["cyan"] } });
        for (const row of stats.byEstado) {
          table.push([colorStatus(row.estado), row.count]);
        }
        console.log(table.toString());
      }

      if (stats.byOrigen) {
        const table = new Table({ head: ["Origen", "Total"], style: { head: ["cyan"] } });
        for (const row of stats.byOrigen) {
          table.push([row.origen, row.count]);
        }
        console.log(chalk.bold("\nPer origen:"));
        console.log(table.toString());
      }
    });

  leads
    .command("call <id>")
    .description("Marcar lead com a contactat")
    .action(async (id) => {
      await apiPatch(`/api/leads/${id}`, { estado: "contactado" });
      console.log(chalk.green(`✓ Lead #${id} marcat com a contactat.`));
    });

  leads
    .command("won <id>")
    .description("Marcar lead com a guanyat")
    .action(async (id) => {
      await apiPatch(`/api/leads/${id}`, { estado: "ganado" });
      console.log(chalk.green(`✓ Lead #${id} marcat com a guanyat!`));
    });

  leads
    .command("lost <id>")
    .description("Marcar lead com a perdut")
    .action(async (id) => {
      await apiPatch(`/api/leads/${id}`, { estado: "perdido" });
      console.log(chalk.red(`✓ Lead #${id} marcat com a perdut.`));
    });

  leads
    .command("note <id> <text>")
    .description("Afegir nota a un lead")
    .action(async (id, text) => {
      const lead = await apiGet(`/api/leads/${id}`);
      const notas = lead.notas ? `${lead.notas}\n[${new Date().toISOString().slice(0, 10)}] ${text}` : `[${new Date().toISOString().slice(0, 10)}] ${text}`;
      await apiPatch(`/api/leads/${id}`, { notas });
      console.log(chalk.green(`✓ Nota afegida al lead #${id}.`));
    });

  leads
    .command("export")
    .description("Exportar leads a CSV")
    .option("--week", "Última setmana")
    .option("--month", "Últim mes")
    .action(async (opts) => {
      let path = "/api/leads/export";
      if (opts.week) path += "?period=week";
      else if (opts.month) path += "?period=month";
      const csv = await apiGet(path);
      const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      const { writeFileSync } = await import("fs");
      writeFileSync(filename, csv);
      console.log(chalk.green(`✓ Exportat a ${filename}`));
    });
}
```

**Step 2: Register in index.ts**

Add to `cli/src/index.ts` after login command:
```typescript
import { registerLeadsCommand } from "./commands/leads.js";
registerLeadsCommand(program);
```

**Step 3: Test manually**

```bash
npm run cli -- leads --help
npm run cli -- leads list
npm run cli -- leads stats
```

**Step 4: Commit**

```bash
git add cli/src/commands/leads.ts cli/src/index.ts
git commit -m "feat(cli): add leads CRM module"
```

---

## Task 3: Blog Module (with AI Generation)

**Files:**
- Create: `cli/src/commands/blog.ts`
- Create: `cli/src/lib/ai.ts`
- Modify: `cli/src/index.ts` (register blog command)

**Step 1: Create AI generation module**

Create `cli/src/lib/ai.ts`:
```typescript
import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicKey } from "../config.js";
import chalk from "chalk";

function getClient(): Anthropic {
  const key = getAnthropicKey();
  if (!key) {
    console.error(chalk.red("API key d'Anthropic no configurada."));
    console.error(chalk.dim("Executa: arafinestra config --anthropic-key <key>"));
    process.exit(1);
  }
  return new Anthropic({ apiKey: key });
}

const BUSINESS_CONTEXT = `Ets un redactor de contingut SEO expert per a ARA FINESTRA, una empresa d'instal·lació de finestres PVC amb perfils Cortizo a la província de Girona i el Maresme (Costa Brava), Espanya.

Dades de l'empresa:
- Nom comercial: ARA FINESTRA (Renova't Costa Brava SL)
- Serveis: finestres PVC, portes corredisses, persianes, mosquiteres
- Marca: Cortizo (partner oficial)
- Zona: Girona, Maresme, Costa Brava
- Garantia: 10 anys Cortizo + 2 anys instal·lació
- Web: arafinestra.com

Directrius SEO:
- Inclou paraules clau locals (noms de municipis, "Girona", "Costa Brava")
- Inclou paraules clau de producte ("finestres PVC", "Cortizo", "aïllament tèrmic")
- Escriu de forma natural, no keyword stuffing
- Estructura amb H2 i H3 per escaneig
- Inclou CTA al final (demana pressupost gratuït)
- Longitud: 1000-1500 paraules per idioma`;

export interface BlogDraft {
  slug: string;
  tituloCa: string;
  tituloEs: string;
  tituloEn: string;
  contenidoCa: string;
  contenidoEs: string;
  contenidoEn: string;
  extractoCa: string;
  extractoEs: string;
  extractoEn: string;
  metaTitleCa: string;
  metaTitleEs: string;
  metaTitleEn: string;
  metaDescriptionCa: string;
  metaDescriptionEs: string;
  metaDescriptionEn: string;
  categoria: string;
}

export async function generateBlogPost(topic: string): Promise<BlogDraft> {
  const client = getClient();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: BUSINESS_CONTEXT,
    messages: [
      {
        role: "user",
        content: `Genera un article de blog complet sobre: "${topic}"

Retorna EXACTAMENT un objecte JSON amb aquesta estructura (sense cap text addicional, només el JSON):
{
  "slug": "slug-seo-friendly-en-catala",
  "tituloCa": "Títol en català",
  "tituloEs": "Título en español",
  "tituloEn": "Title in English",
  "contenidoCa": "Contingut complet en català amb markdown (H2, H3, llistes, negreta)...",
  "contenidoEs": "Contenido completo en español...",
  "contenidoEn": "Full content in English...",
  "extractoCa": "Extracte de 2 frases en català",
  "extractoEs": "Extracto de 2 frases en español",
  "extractoEn": "Excerpt of 2 sentences in English",
  "metaTitleCa": "Meta títol SEO en català (max 60 chars)",
  "metaTitleEs": "Meta título SEO en español (max 60 chars)",
  "metaTitleEn": "SEO meta title in English (max 60 chars)",
  "metaDescriptionCa": "Meta descripció SEO en català (max 155 chars)",
  "metaDescriptionEs": "Meta descripción SEO en español (max 155 chars)",
  "metaDescriptionEn": "SEO meta description in English (max 155 chars)",
  "categoria": "una de: eficiencia|subvencions|consells|cortizo|noticies"
}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No s'ha pogut parsejar la resposta de Claude");
  return JSON.parse(jsonMatch[0]);
}

export interface ZoneDraft {
  slug: string;
  nombreCa: string;
  nombreEs: string;
  nombreEn: string;
  contenidoCa: string;
  contenidoEs: string;
  contenidoEn: string;
  metaTitleCa: string;
  metaTitleEs: string;
  metaTitleEn: string;
  metaDescriptionCa: string;
  metaDescriptionEs: string;
  metaDescriptionEn: string;
}

export async function generateZonePage(municipality: string): Promise<ZoneDraft> {
  const client = getClient();

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 6000,
    system: BUSINESS_CONTEXT,
    messages: [
      {
        role: "user",
        content: `Genera una landing page SEO local per al municipi: "${municipality}" (província de Girona o Maresme).

La landing ha de:
- Mencionar el nom del municipi múltiples vegades de forma natural
- Parlar dels serveis disponibles a la zona
- Incloure beneficis d'eficiència energètica pel clima local
- CTA per demanar pressupost/visita gratuïta
- 500-800 paraules per idioma

Retorna EXACTAMENT un objecte JSON (sense cap text addicional):
{
  "slug": "nom-municipi-en-minuscules",
  "nombreCa": "Nom en català",
  "nombreEs": "Nombre en español",
  "nombreEn": "Name in English",
  "contenidoCa": "Contingut complet en català amb markdown...",
  "contenidoEs": "Contenido completo en español...",
  "contenidoEn": "Full content in English...",
  "metaTitleCa": "Finestres PVC a [Municipi] | ARA FINESTRA",
  "metaTitleEs": "Ventanas PVC en [Municipio] | ARA FINESTRA",
  "metaTitleEn": "PVC Windows in [Municipality] | ARA FINESTRA",
  "metaDescriptionCa": "Meta desc en català (max 155 chars)",
  "metaDescriptionEs": "Meta desc en español (max 155 chars)",
  "metaDescriptionEn": "Meta desc in English (max 155 chars)"
}`,
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No s'ha pogut parsejar la resposta de Claude");
  return JSON.parse(jsonMatch[0]);
}
```

**Step 2: Create blog command module**

Create `cli/src/commands/blog.ts`:
```typescript
import { Command } from "commander";
import { apiGet, apiPost, apiPatch } from "../api.js";
import { generateBlogPost } from "../lib/ai.js";
import chalk from "chalk";
import Table from "cli-table3";

export function registerBlogCommand(program: Command) {
  const blog = program.command("blog").description("Gestió del blog (amb generació IA)");

  blog
    .command("list")
    .description("Llistar articles")
    .option("--draft", "Només esborranys")
    .action(async (opts) => {
      const params = opts.draft ? "?published=false" : "";
      const { data } = await apiGet(`/api/blog${params}`);

      if (data.length === 0) {
        console.log(chalk.dim("Cap article trobat."));
        return;
      }

      const table = new Table({
        head: ["Slug", "Títol", "Categoria", "Estat", "Data"],
        style: { head: ["cyan"] },
      });

      for (const p of data) {
        table.push([
          p.slug,
          (p.tituloCa || p.tituloEs || "").slice(0, 50),
          p.categoria || "-",
          p.published ? chalk.green("publicat") : chalk.yellow("esborrany"),
          p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("ca-ES") : "-",
        ]);
      }

      console.log(table.toString());
    });

  blog
    .command("generate <topic>")
    .description("Generar article amb IA (borrador)")
    .action(async (topic) => {
      console.log(chalk.cyan("✦ Generant article amb Claude..."));
      const draft = await generateBlogPost(topic);

      await apiPost("/api/blog", {
        ...draft,
        published: false,
        autor: "ARA FINESTRA",
      });

      console.log(chalk.green(`\n✓ Borrador creat: ${draft.slug}`));
      console.log(`  Títol: ${draft.tituloCa}`);
      console.log(`  Categoria: ${draft.categoria}`);
      console.log(`  Idiomes: CA ✓  ES ✓  EN ✓`);
      console.log(chalk.dim(`\n  Revisa amb: arafinestra blog preview ${draft.slug}`));
      console.log(chalk.dim(`  Publica amb: arafinestra blog publish ${draft.slug}`));
    });

  blog
    .command("preview <slug>")
    .description("Previsualitzar article al terminal")
    .action(async (slug) => {
      const post = await apiGet(`/api/blog/${slug}`);
      console.log(chalk.bold.cyan(`\n${post.tituloCa}\n`));
      console.log(chalk.dim(`Slug: ${post.slug} | Categoria: ${post.categoria}`));
      console.log(chalk.dim(`Estat: ${post.published ? "publicat" : "esborrany"}\n`));
      console.log(post.contenidoCa);
      console.log(chalk.dim(`\n--- Meta ---`));
      console.log(chalk.dim(`Title: ${post.metaTitleCa}`));
      console.log(chalk.dim(`Desc: ${post.metaDescriptionCa}`));
    });

  blog
    .command("publish <slug>")
    .description("Publicar article")
    .action(async (slug) => {
      const post = await apiGet(`/api/blog/${slug}`);
      await apiPatch(`/api/blog/${post.id}`, { published: true, publishedAt: new Date().toISOString() });
      console.log(chalk.green(`✓ Article publicat: ${slug}`));
    });

  blog
    .command("unpublish <slug>")
    .description("Despublicar article")
    .action(async (slug) => {
      const post = await apiGet(`/api/blog/${slug}`);
      await apiPatch(`/api/blog/${post.id}`, { published: false });
      console.log(chalk.yellow(`✓ Article despublicat: ${slug}`));
    });

  blog
    .command("edit <slug>")
    .description("Obrir article en l'editor ($EDITOR)")
    .action(async (slug) => {
      const post = await apiGet(`/api/blog/${slug}`);
      const { writeFileSync, readFileSync, unlinkSync } = await import("fs");
      const { execSync } = await import("child_process");
      const tmpFile = `/tmp/arafinestra-blog-${slug}.md`;

      writeFileSync(tmpFile, `# ${post.tituloCa}\n\n${post.contenidoCa}`);

      const editor = process.env.EDITOR || "nano";
      execSync(`${editor} ${tmpFile}`, { stdio: "inherit" });

      const edited = readFileSync(tmpFile, "utf-8");
      const lines = edited.split("\n");
      const title = lines[0]?.replace(/^#\s*/, "") || post.tituloCa;
      const content = lines.slice(2).join("\n").trim();

      await apiPatch(`/api/blog/${post.id}`, { tituloCa: title, contenidoCa: content });
      unlinkSync(tmpFile);
      console.log(chalk.green(`✓ Article actualitzat: ${slug}`));
    });
}
```

**Step 3: Register in index.ts**

Add to `cli/src/index.ts`:
```typescript
import { registerBlogCommand } from "./commands/blog.js";
registerBlogCommand(program);
```

**Step 4: Test manually**

```bash
npm run cli -- blog --help
npm run cli -- blog list
```

**Step 5: Commit**

```bash
git add cli/src/commands/blog.ts cli/src/lib/ai.ts cli/src/index.ts
git commit -m "feat(cli): add blog module with AI content generation"
```

---

## Task 4: Zones Module (Full Automatic)

**Files:**
- Create: `cli/src/commands/zones.ts`
- Create: `cli/src/lib/geo.ts`
- Create: `cli/src/lib/municipalities.ts`
- Modify: `cli/src/index.ts`

**Step 1: Create geocoding helper**

Create `cli/src/lib/geo.ts`:
```typescript
export async function geocode(municipality: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const query = encodeURIComponent(`${municipality}, Girona, Spain`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
      headers: { "User-Agent": "arafinestra-cli/1.0" },
    });
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}
```

**Step 2: Create municipalities list**

Create `cli/src/lib/municipalities.ts`:
```typescript
// Major municipalities in Girona province + Maresme, ordered by approximate population
export const GIRONA_MUNICIPALITIES = [
  { name: "Girona", pop: 103000 },
  { name: "Figueres", pop: 48000 },
  { name: "Blanes", pop: 40000 },
  { name: "Lloret de Mar", pop: 38000 },
  { name: "Olot", pop: 35000 },
  { name: "Salt", pop: 32000 },
  { name: "Palafrugell", pop: 23000 },
  { name: "Sant Feliu de Guíxols", pop: 22000 },
  { name: "Roses", pop: 20000 },
  { name: "Platja d'Aro", pop: 11000 },
  { name: "Torroella de Montgrí", pop: 12000 },
  { name: "Palamós", pop: 18000 },
  { name: "Banyoles", pop: 20000 },
  { name: "La Bisbal d'Empordà", pop: 11000 },
  { name: "Ripoll", pop: 11000 },
  { name: "Calella", pop: 19000 },
  { name: "Pineda de Mar", pop: 28000 },
  { name: "Malgrat de Mar", pop: 18000 },
  { name: "Santa Susanna", pop: 3500 },
  { name: "Tossa de Mar", pop: 6000 },
  { name: "Calonge", pop: 12000 },
  { name: "Cassà de la Selva", pop: 10000 },
  { name: "Llagostera", pop: 8500 },
  { name: "Santa Coloma de Farners", pop: 13000 },
  { name: "Anglès", pop: 5800 },
  { name: "Arbúcies", pop: 6800 },
  { name: "Cadaqués", pop: 2800 },
  { name: "L'Escala", pop: 10500 },
  { name: "Empuriabrava", pop: 7500 },
  { name: "Castell-Platja d'Aro", pop: 11000 },
  { name: "Begur", pop: 4000 },
  { name: "Vidreres", pop: 8000 },
  { name: "Maçanet de la Selva", pop: 7500 },
  { name: "Sils", pop: 6500 },
  { name: "Hostalric", pop: 4200 },
  { name: "Arenys de Mar", pop: 16000 },
  { name: "Canet de Mar", pop: 15000 },
  { name: "Sant Pol de Mar", pop: 5500 },
  { name: "Caldes de Malavella", pop: 7500 },
  { name: "Pals", pop: 2700 },
];
```

**Step 3: Create zones command module**

Create `cli/src/commands/zones.ts`:
```typescript
import { Command } from "commander";
import { apiGet, apiPost, apiPatch } from "../api.js";
import { generateZonePage } from "../lib/ai.js";
import { geocode } from "../lib/geo.js";
import { GIRONA_MUNICIPALITIES } from "../lib/municipalities.js";
import chalk from "chalk";
import Table from "cli-table3";

export function registerZonesCommand(program: Command) {
  const zones = program.command("zones").description("Gestió de zones SEO (amb IA)");

  zones
    .command("list")
    .description("Llistar zones")
    .action(async () => {
      const data = await apiGet("/api/zones");
      if (data.length === 0) {
        console.log(chalk.dim("Cap zona trobada."));
        return;
      }
      const table = new Table({
        head: ["Slug", "Nom", "Estat", "Coords"],
        style: { head: ["cyan"] },
      });
      for (const z of data) {
        table.push([
          z.slug,
          z.nombreCa || z.nombreEs || "-",
          z.published ? chalk.green("publicada") : chalk.yellow("esborrany"),
          z.latitud ? `${z.latitud}, ${z.longitud}` : chalk.dim("sense"),
        ]);
      }
      console.log(table.toString());
    });

  zones
    .command("add <municipality>")
    .description("Generar i publicar landing page amb IA")
    .action(async (municipality) => {
      console.log(chalk.cyan(`✦ Generant landing page per a ${municipality}...`));

      const [draft, coords] = await Promise.all([
        generateZonePage(municipality),
        geocode(municipality),
      ]);

      await apiPost("/api/zones", {
        ...draft,
        latitud: coords?.lat?.toString() || null,
        longitud: coords?.lon?.toString() || null,
        published: true,
      });

      console.log(chalk.green(`\n✓ Zona publicada: ${draft.slug}`));
      console.log(`  Nom: ${draft.nombreCa}`);
      console.log(`  Coords: ${coords ? `${coords.lat}, ${coords.lon}` : chalk.yellow("no trobades")}`);
      console.log(`  Contingut: CA ✓  ES ✓  EN ✓`);
    });

  zones
    .command("batch <municipalities>")
    .description("Generar múltiples zones (separades per comes)")
    .action(async (municipalities) => {
      const names = municipalities.split(",").map((s: string) => s.trim());
      console.log(chalk.cyan(`✦ Generant ${names.length} zones...\n`));

      for (const name of names) {
        try {
          console.log(chalk.dim(`  Processant ${name}...`));
          const [draft, coords] = await Promise.all([
            generateZonePage(name),
            geocode(name),
          ]);

          await apiPost("/api/zones", {
            ...draft,
            latitud: coords?.lat?.toString() || null,
            longitud: coords?.lon?.toString() || null,
            published: true,
          });

          console.log(chalk.green(`  ✓ ${name} → ${draft.slug}`));
        } catch (err: any) {
          console.error(chalk.red(`  ✗ ${name}: ${err.message}`));
        }
      }

      console.log(chalk.green(`\n✓ Procés completat.`));
    });

  zones
    .command("missing")
    .description("Municipis sense landing page")
    .action(async () => {
      const existing = await apiGet("/api/zones");
      const existingSlugs = new Set(existing.map((z: any) => z.slug));

      const missing = GIRONA_MUNICIPALITIES.filter(
        (m) => !existingSlugs.has(m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, ""))
      );

      if (missing.length === 0) {
        console.log(chalk.green("✓ Tots els municipis tenen landing page!"));
        return;
      }

      console.log(chalk.bold(`\nMunicipis sense landing page (${missing.length}):\n`));
      const table = new Table({
        head: ["#", "Municipi", "Població aprox."],
        style: { head: ["cyan"] },
      });

      missing.sort((a, b) => b.pop - a.pop);
      missing.forEach((m, i) => {
        table.push([i + 1, m.name, `${m.pop.toLocaleString()} hab.`]);
      });

      console.log(table.toString());
      console.log(chalk.dim(`\nGenera amb: arafinestra zones add "Nom"`));
    });

  zones
    .command("audit")
    .description("Auditar SEO de totes les zones")
    .action(async () => {
      const data = await apiGet("/api/zones");
      console.log(chalk.bold(`\nAuditoria de ${data.length} zones:\n`));

      const table = new Table({
        head: ["Zona", "CA", "ES", "EN", "Meta", "Coords", "Puntuació"],
        style: { head: ["cyan"] },
      });

      for (const z of data) {
        const hasCa = (z.contenidoCa?.length || 0) > 200;
        const hasEs = (z.contenidoEs?.length || 0) > 200;
        const hasEn = (z.contenidoEn?.length || 0) > 200;
        const hasMeta = !!(z.metaTitleCa && z.metaDescriptionCa);
        const hasCoords = !!(z.latitud && z.longitud);
        const score = [hasCa, hasEs, hasEn, hasMeta, hasCoords].filter(Boolean).length;
        const scoreColor = score >= 4 ? chalk.green : score >= 3 ? chalk.yellow : chalk.red;

        table.push([
          z.nombreCa || z.slug,
          hasCa ? chalk.green("✓") : chalk.red("✗"),
          hasEs ? chalk.green("✓") : chalk.red("✗"),
          hasEn ? chalk.green("✓") : chalk.red("✗"),
          hasMeta ? chalk.green("✓") : chalk.red("✗"),
          hasCoords ? chalk.green("✓") : chalk.red("✗"),
          scoreColor(`${score}/5`),
        ]);
      }

      console.log(table.toString());
    });

  zones
    .command("publish <slug>")
    .description("Publicar zona")
    .action(async (slug) => {
      const data = await apiGet("/api/zones");
      const zone = data.find((z: any) => z.slug === slug);
      if (!zone) { console.error(chalk.red(`Zona no trobada: ${slug}`)); return; }
      await apiPatch(`/api/zones/${zone.id}`, { published: true });
      console.log(chalk.green(`✓ Zona publicada: ${slug}`));
    });

  zones
    .command("unpublish <slug>")
    .description("Despublicar zona")
    .action(async (slug) => {
      const data = await apiGet("/api/zones");
      const zone = data.find((z: any) => z.slug === slug);
      if (!zone) { console.error(chalk.red(`Zona no trobada: ${slug}`)); return; }
      await apiPatch(`/api/zones/${zone.id}`, { published: false });
      console.log(chalk.yellow(`✓ Zona despublicada: ${slug}`));
    });
}
```

**Step 4: Register in index.ts**

Add to `cli/src/index.ts`:
```typescript
import { registerZonesCommand } from "./commands/zones.js";
registerZonesCommand(program);
```

**Step 5: Test manually**

```bash
npm run cli -- zones --help
npm run cli -- zones missing
```

**Step 6: Commit**

```bash
git add cli/src/commands/zones.ts cli/src/lib/geo.ts cli/src/lib/municipalities.ts cli/src/index.ts
git commit -m "feat(cli): add zones module with AI generation and auto-publish"
```

---

## Task 5: SEO Module

**Files:**
- Create: `cli/src/commands/seo.ts`
- Modify: `cli/src/index.ts`

**Step 1: Create SEO command module**

Create `cli/src/commands/seo.ts`:
```typescript
import { Command } from "commander";
import { getApiUrl } from "../config.js";
import chalk from "chalk";
import Table from "cli-table3";

const LANGS = ["ca", "es", "en"];

// Static routes to audit (mirrors sitemap.ts STATIC_PATHS)
const STATIC_PATHS = [
  "", "cortizo", "subvencions", "pressupost", "projectes", "blog",
  "opinions", "contacte", "zones", "proces",
  "serveis/finestres-pvc", "serveis/portes-corredisses",
  "serveis/persianes", "serveis/mosquiteres",
  "qui-som", "visita-gratuita", "financament",
  "legal/privacitat", "legal/termes", "legal/cookies", "legal/avis-legal",
];

interface PageAudit {
  url: string;
  title: boolean;
  description: boolean;
  h1: boolean;
  canonical: boolean;
  ogImage: boolean;
  schema: boolean;
  issues: string[];
}

async function auditPage(url: string): Promise<PageAudit> {
  const result: PageAudit = {
    url, title: false, description: false, h1: false,
    canonical: false, ogImage: false, schema: false, issues: [],
  };

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "arafinestra-seo-audit/1.0" },
    });
    const html = await res.text();

    result.title = /<title>[^<]+<\/title>/.test(html);
    result.description = /meta\s+name="description"\s+content="[^"]+"/i.test(html);
    result.h1 = /<h1[\s>]/i.test(html);
    result.canonical = /rel="canonical"/i.test(html);
    result.ogImage = /property="og:image"/i.test(html);
    result.schema = /application\/ld\+json/i.test(html);

    if (!result.title) result.issues.push("sense title");
    if (!result.description) result.issues.push("sense meta description");
    if (!result.h1) result.issues.push("sense H1");
    if (!result.canonical) result.issues.push("sense canonical");
    if (!result.schema) result.issues.push("sense schema.org");
  } catch (err: any) {
    result.issues.push(`error: ${err.message}`);
  }

  return result;
}

export function registerSeoCommand(program: Command) {
  const seo = program.command("seo").description("Monitorització SEO");

  seo
    .command("audit")
    .description("Auditoria SEO completa del lloc")
    .option("--lang <lang>", "Idioma a auditar", "ca")
    .action(async (opts) => {
      const baseUrl = getApiUrl();
      const lang = opts.lang;
      const urls = STATIC_PATHS.map((p) => `${baseUrl}/${lang}${p ? `/${p}` : ""}`);

      console.log(chalk.bold(`\nAuditant ${urls.length} pàgines (${lang})...\n`));

      const results: PageAudit[] = [];
      for (const url of urls) {
        process.stdout.write(chalk.dim(`  ${url.replace(baseUrl, "")}...`));
        const result = await auditPage(url);
        results.push(result);
        const checks = [result.title, result.description, result.h1, result.canonical, result.schema];
        const passed = checks.filter(Boolean).length;
        const color = passed === 5 ? chalk.green : passed >= 3 ? chalk.yellow : chalk.red;
        process.stdout.write(color(` ${passed}/5\n`));
      }

      // Summary
      const total = results.length;
      const withTitle = results.filter((r) => r.title).length;
      const withDesc = results.filter((r) => r.description).length;
      const withH1 = results.filter((r) => r.h1).length;
      const withCanonical = results.filter((r) => r.canonical).length;
      const withSchema = results.filter((r) => r.schema).length;

      console.log(chalk.bold("\n--- Resum ---\n"));
      console.log(`  Title:       ${withTitle}/${total}`);
      console.log(`  Description: ${withDesc}/${total}`);
      console.log(`  H1:          ${withH1}/${total}`);
      console.log(`  Canonical:   ${withCanonical}/${total}`);
      console.log(`  Schema.org:  ${withSchema}/${total}`);

      const avgScore = ((withTitle + withDesc + withH1 + withCanonical + withSchema) / (total * 5) * 10).toFixed(1);
      console.log(chalk.bold(`\n  Puntuació global: ${avgScore}/10\n`));

      // Issues
      const pagesWithIssues = results.filter((r) => r.issues.length > 0);
      if (pagesWithIssues.length > 0) {
        console.log(chalk.bold("Problemes detectats:\n"));
        for (const r of pagesWithIssues) {
          console.log(chalk.red(`  ${r.url.replace(baseUrl, "")}: ${r.issues.join(", ")}`));
        }
      }
    });

  seo
    .command("broken-links")
    .description("Detectar links trencats")
    .action(async () => {
      const baseUrl = getApiUrl();
      console.log(chalk.bold("\nComprovant links...\n"));

      const checked = new Set<string>();
      const broken: { page: string; link: string; status: number }[] = [];

      for (const path of STATIC_PATHS) {
        const pageUrl = `${baseUrl}/ca${path ? `/${path}` : ""}`;
        try {
          const res = await fetch(pageUrl, { headers: { "User-Agent": "arafinestra-seo-audit/1.0" } });
          const html = await res.text();
          const links = html.match(/href="(https?:\/\/[^"]+)"/g) || [];

          for (const match of links) {
            const href = match.replace(/href="/, "").replace(/"$/, "");
            if (checked.has(href)) continue;
            checked.add(href);

            try {
              const r = await fetch(href, { method: "HEAD", redirect: "follow" });
              if (r.status >= 400) {
                broken.push({ page: path || "/", link: href, status: r.status });
              }
            } catch {
              broken.push({ page: path || "/", link: href, status: 0 });
            }
          }
        } catch {
          // skip unreachable pages
        }
      }

      if (broken.length === 0) {
        console.log(chalk.green("✓ Cap link trencat trobat!"));
      } else {
        const table = new Table({
          head: ["Pàgina", "Link", "Status"],
          style: { head: ["cyan"] },
        });
        for (const b of broken) {
          table.push([b.page, b.link.slice(0, 60), chalk.red(b.status || "timeout")]);
        }
        console.log(table.toString());
      }
    });

  seo
    .command("lighthouse [url]")
    .description("Executar Lighthouse (requereix lighthouse CLI instal·lat)")
    .action(async (url) => {
      const { execSync } = await import("child_process");
      const target = url || getApiUrl();

      console.log(chalk.cyan(`✦ Executant Lighthouse per a ${target}...\n`));

      try {
        execSync(
          `npx lighthouse ${target} --output=json --output-path=/tmp/lh-report.json --chrome-flags="--headless --no-sandbox" --quiet`,
          { stdio: "inherit", timeout: 120000 }
        );

        const { readFileSync } = await import("fs");
        const report = JSON.parse(readFileSync("/tmp/lh-report.json", "utf-8"));
        const cats = report.categories;

        console.log(chalk.bold("\nResultats Lighthouse:\n"));

        for (const [key, cat] of Object.entries(cats) as any[]) {
          const score = Math.round(cat.score * 100);
          const color = score >= 90 ? chalk.green : score >= 50 ? chalk.yellow : chalk.red;
          console.log(`  ${cat.title}: ${color(`${score}/100`)}`);
        }
      } catch {
        console.error(chalk.red("Lighthouse no disponible. Instal·la: npm i -g lighthouse"));
      }
    });
}
```

**Step 2: Register in index.ts**

Add to `cli/src/index.ts`:
```typescript
import { registerSeoCommand } from "./commands/seo.js";
registerSeoCommand(program);
```

**Step 3: Test manually**

```bash
npm run cli -- seo --help
npm run cli -- seo audit
```

**Step 4: Commit**

```bash
git add cli/src/commands/seo.ts cli/src/index.ts
git commit -m "feat(cli): add SEO monitoring module"
```

---

## Task 6: Pressupost (PDF Quote) Module

**Files:**
- Create: `cli/src/commands/pressupost.ts`
- Modify: `cli/src/index.ts`

**Step 1: Create pressupost command module**

Create `cli/src/commands/pressupost.ts`:
```typescript
import { Command } from "commander";
import { apiGet, apiPost } from "../api.js";
import chalk from "chalk";
import PDFDocument from "pdfkit";
import { createInterface } from "readline";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => { rl.close(); resolve(answer.trim()); });
  });
}

interface QuoteItem {
  description: string;
  type: string;
  width: number;
  height: number;
  glass: string;
  pricePerM2: number;
  total: number;
}

export function registerPressupostCommand(program: Command) {
  const pressupost = program.command("pressupost").description("Generador de pressupostos PDF");

  pressupost
    .command("generate")
    .description("Generar pressupost (interactiu)")
    .action(async () => {
      // Client info
      console.log(chalk.bold("\n--- Dades del client ---\n"));
      const clientName = await ask("Nom del client: ");
      const clientPhone = await ask("Telèfon: ");
      const clientEmail = await ask("Email (opcional): ");
      const clientCity = await ask("Localitat: ");

      // Get products for pricing
      const products = await apiGet("/api/products?activo=true");

      // Items
      const items: QuoteItem[] = [];
      let addMore = true;

      while (addMore) {
        console.log(chalk.bold(`\n--- Finestra ${items.length + 1} ---\n`));

        const type = await ask("Tipus (c70/a84/e170): ");
        const width = parseInt(await ask("Amplada (cm): "));
        const height = parseInt(await ask("Alçada (cm): "));
        const glass = await ask("Vidre (doble/baix-emissiu/triple): ");

        const m2 = (width / 100) * (height / 100);
        const product = products.find((p: any) =>
          p.modelo?.toLowerCase().includes(type.toLowerCase())
        );
        const pricePerM2 = product?.precioPorM2 || 350;
        const total = Math.round(m2 * pricePerM2 * 100) / 100;

        items.push({
          description: `Finestra ${type.toUpperCase()} ${width}x${height}cm - Vidre ${glass}`,
          type, width, height, glass, pricePerM2, total,
        });

        console.log(chalk.dim(`  Preu estimat: ${total.toFixed(2)} €`));
        const more = await ask("\nAfegir altra finestra? (s/n): ");
        addMore = more.toLowerCase() === "s";
      }

      // Calculate totals
      const subtotal = items.reduce((sum, i) => sum + i.total, 0);
      const iva = Math.round(subtotal * 0.21 * 100) / 100;
      const total = subtotal + iva;

      // Generate PDF
      const outputDir = join(homedir(), "arafinestra-pressupostos");
      if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

      const quoteNum = `P-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
      const filename = `${quoteNum}.pdf`;
      const filepath = join(outputDir, filename);

      const doc = new PDFDocument({ margin: 50 });
      doc.pipe(createWriteStream(filepath));

      // Header
      doc.fontSize(20).font("Helvetica-Bold").text("ARA FINESTRA", { align: "center" });
      doc.fontSize(10).font("Helvetica").text("Renova't Costa Brava SL · CIF: B42997049", { align: "center" });
      doc.text("Calle Antilles 15, 17310 Lloret de Mar, Girona", { align: "center" });
      doc.text("info@arafinestra.com · arafinestra.com", { align: "center" });
      doc.moveDown(2);

      // Quote info
      doc.fontSize(14).font("Helvetica-Bold").text(`PRESSUPOST ${quoteNum}`);
      doc.fontSize(10).font("Helvetica").text(`Data: ${new Date().toLocaleDateString("ca-ES")}`);
      doc.text(`Validesa: 30 dies`);
      doc.moveDown();

      // Client info
      doc.font("Helvetica-Bold").text("CLIENT:");
      doc.font("Helvetica");
      doc.text(`Nom: ${clientName}`);
      doc.text(`Telèfon: ${clientPhone}`);
      if (clientEmail) doc.text(`Email: ${clientEmail}`);
      doc.text(`Localitat: ${clientCity}`);
      doc.moveDown(2);

      // Items table
      doc.font("Helvetica-Bold").text("DETALL:", { underline: true });
      doc.moveDown(0.5);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        doc.font("Helvetica-Bold").text(`${i + 1}. ${item.description}`);
        doc.font("Helvetica").text(`   ${item.width}x${item.height}cm · ${(item.width / 100 * item.height / 100).toFixed(2)} m² · ${item.pricePerM2} €/m²`);
        doc.text(`   Subtotal: ${item.total.toFixed(2)} €`);
        doc.moveDown(0.5);
      }

      doc.moveDown();
      doc.font("Helvetica").text(`Subtotal: ${subtotal.toFixed(2)} €`, { align: "right" });
      doc.text(`IVA (21%): ${iva.toFixed(2)} €`, { align: "right" });
      doc.font("Helvetica-Bold").fontSize(12).text(`TOTAL: ${total.toFixed(2)} €`, { align: "right" });

      // Terms
      doc.moveDown(2);
      doc.fontSize(8).font("Helvetica").fillColor("#666");
      doc.text("CONDICIONS:");
      doc.text("· Pressupost orientatiu. El preu final es confirmarà després de la visita tècnica.");
      doc.text("· Garantia: 10 anys Cortizo (perfils i ferratges) + 2 anys instal·lació.");
      doc.text("· Pagament: 50% a la confirmació, 50% a la finalització.");
      doc.text("· Termini d'execució: 15-30 dies laborables des de la confirmació.");

      doc.end();

      console.log(chalk.green(`\n✓ Pressupost generat: ${filepath}`));
      console.log(`  ${quoteNum}`);
      console.log(`  Subtotal: ${subtotal.toFixed(2)} €`);
      console.log(`  IVA (21%): ${iva.toFixed(2)} €`);
      console.log(chalk.bold(`  Total: ${total.toFixed(2)} €`));

      // Create lead if it doesn't exist
      try {
        await apiPost("/api/leads", {
          nombre: clientName,
          telefono: clientPhone,
          email: clientEmail || null,
          localidad: clientCity,
          origen: "cli",
          estado: "presupuestado",
          presupuestoDatos: JSON.stringify({ quoteNum, items, subtotal, iva, total }),
        });
        console.log(chalk.dim(`\n  Lead creat automàticament al CRM.`));
      } catch {
        // Lead might already exist or rate limited, non-critical
      }
    });

  pressupost
    .command("list")
    .description("Llistar pressupostos generats")
    .action(async () => {
      const { readdirSync, statSync } = await import("fs");
      const dir = join(homedir(), "arafinestra-pressupostos");
      if (!existsSync(dir)) {
        console.log(chalk.dim("Cap pressupost generat encara."));
        return;
      }
      const files = readdirSync(dir).filter((f) => f.endsWith(".pdf")).sort().reverse();
      if (files.length === 0) {
        console.log(chalk.dim("Cap pressupost generat encara."));
        return;
      }
      const table = new Table({ head: ["Fitxer", "Data", "Mida"], style: { head: ["cyan"] } });
      for (const f of files) {
        const stat = statSync(join(dir, f));
        table.push([f, stat.mtime.toLocaleDateString("ca-ES"), `${(stat.size / 1024).toFixed(0)} KB`]);
      }
      console.log(table.toString());
      console.log(chalk.dim(`\nDirectori: ${dir}`));
    });
}
```

**Step 2: Register in index.ts**

Add to `cli/src/index.ts`:
```typescript
import { registerPressupostCommand } from "./commands/pressupost.js";
registerPressupostCommand(program);
```

**Step 3: Test manually**

```bash
npm run cli -- pressupost --help
npm run cli -- pressupost list
```

**Step 4: Commit**

```bash
git add cli/src/commands/pressupost.ts cli/src/index.ts
git commit -m "feat(cli): add PDF quote generator module"
```

---

## Task 7: Config Command + Final Polish

**Files:**
- Create: `cli/src/commands/config.ts`
- Modify: `cli/src/index.ts` (final version with all commands)

**Step 1: Create config command**

Create `cli/src/commands/config.ts`:
```typescript
import { Command } from "commander";
import { loadConfig, saveConfig } from "../config.js";
import chalk from "chalk";

export function registerConfigCommand(program: Command) {
  const config = program.command("config").description("Configuració del CLI");

  config
    .command("show")
    .description("Mostrar configuració actual")
    .action(() => {
      const cfg = loadConfig();
      console.log(chalk.bold("\nConfiguració actual:\n"));
      console.log(`  API URL:        ${cfg.apiUrl}`);
      console.log(`  Sessió:         ${cfg.sessionCookie ? chalk.green("activa") : chalk.red("no iniciada")}`);
      console.log(`  Anthropic Key:  ${cfg.anthropicApiKey ? chalk.green("configurada") : chalk.red("no configurada")}`);
    });

  config
    .command("set")
    .description("Establir valors de configuració")
    .option("--api-url <url>", "URL de l'API")
    .option("--anthropic-key <key>", "API key d'Anthropic (Claude)")
    .action((opts) => {
      const updates: Record<string, string> = {};
      if (opts.apiUrl) updates.apiUrl = opts.apiUrl;
      if (opts.anthropicKey) updates.anthropicApiKey = opts.anthropicKey;

      if (Object.keys(updates).length === 0) {
        console.log(chalk.dim("Cap valor per actualitzar. Usa --api-url o --anthropic-key"));
        return;
      }

      saveConfig(updates);
      console.log(chalk.green("✓ Configuració actualitzada."));
    });
}
```

**Step 2: Final index.ts with all commands**

Update `cli/src/index.ts` to be the complete version with all imports and a help overview.

**Step 3: Test all modules**

```bash
npm run cli -- --help
npm run cli -- config show
npm run cli -- leads --help
npm run cli -- blog --help
npm run cli -- zones --help
npm run cli -- seo --help
npm run cli -- pressupost --help
```

**Step 4: Commit**

```bash
git add cli/ package.json package-lock.json
git commit -m "feat(cli): add config command and finalize all modules"
```

---

## Summary of Tasks

| Task | Module | Depends On |
|------|--------|------------|
| 1 | CLI Scaffold + Auth | — |
| 2 | Leads CRM | Task 1 |
| 3 | Blog + AI Generation | Task 1 |
| 4 | Zones + AI Auto-publish | Task 3 (shares ai.ts) |
| 5 | SEO Monitoring | Task 1 |
| 6 | Pressupost PDF | Task 1 |
| 7 | Config + Polish | Task 1 |

Tasks 2, 3, 5, 6 can be parallelized after Task 1 is complete. Task 4 depends on Task 3 (shared AI module).
