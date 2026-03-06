# ARA FINESTRA - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a best-in-class PVC window installation website for the Girona + Maresme region with interactive budget calculator, CRM admin panel, multilingual support, and SEO-optimized local landing pages.

**Architecture:** React 18 SPA frontend with Express 5 API backend, PostgreSQL via Drizzle ORM. Monorepo with shared types. Replit deployment with autoscale.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Express 5, Drizzle ORM, PostgreSQL, Passport.js, i18next, react-helmet-async

---

## Phase 1: Project Scaffolding

### Task 1.1: Initialize monorepo with Vite + Express

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `client/index.html`
- Create: `client/src/main.tsx`
- Create: `client/src/App.tsx`
- Create: `server/index.ts`
- Create: `server/routes.ts`
- Create: `vite.config.ts`
- Create: `.replit`
- Create: `replit.nix`

**Step 1: Initialize project**

```bash
cd /Users/macbookpro/arafinestra
npm init -y
```

**Step 2: Install core dependencies**

```bash
npm install react react-dom react-router-dom
npm install express cors express-session passport passport-local
npm install drizzle-orm @neondatabase/serverless
npm install i18next react-i18next i18next-browser-languagedetector
npm install react-helmet-async
npm install -D typescript @types/react @types/react-dom @types/express @types/cors @types/express-session @types/passport @types/passport-local
npm install -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite
npm install -D drizzle-kit esbuild tsx
npm install -D @types/node
```

**Step 3: Create project structure**

```bash
mkdir -p client/src/{components,pages,hooks,lib,i18n,assets}
mkdir -p client/src/pages/{public,admin}
mkdir -p client/src/components/{ui,layout,forms,seo}
mkdir -p server/{routes,middleware,lib}
mkdir -p shared
```

**Step 4: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["shared/*"],
      "@/*": ["client/src/*"]
    }
  },
  "include": ["client/src", "server", "shared"]
}
```

**Step 5: Write `vite.config.ts`**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: "client",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
```

**Step 6: Write minimal `server/index.ts`**

```typescript
import express from "express";
import path from "path";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

registerRoutes(app);

// Serve static files in production
const distPath = path.resolve(process.cwd(), "dist/public");
app.use(express.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.resolve(distPath, "index.html"));
});

const port = parseInt(process.env.PORT || "5000");
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
```

**Step 7: Write `server/routes.ts`**

```typescript
import type { Express } from "express";

export function registerRoutes(app: Express) {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
}
```

**Step 8: Write `client/index.html`**

```html
<!DOCTYPE html>
<html lang="ca">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ARA FINESTRA | Ventanas PVC Girona</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 9: Write `client/src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
```

**Step 10: Write `client/src/App.tsx`**

```tsx
import { Routes, Route } from "react-router-dom";

function Home() {
  return <h1 className="text-4xl font-bold p-8">ARA FINESTRA</h1>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
```

**Step 11: Write `client/src/index.css`**

```css
@import "tailwindcss";
```

**Step 12: Write Replit config files**

`.replit`:
```
run = "npm run dev"
modules = ["nodejs-20:v8-20230920-bd784b9"]

[nix]
channel = "stable-24_05"

[deployment]
run = ["sh", "-c", "npm run build && npm run start"]

[[ports]]
localPort = 5000
externalPort = 80
```

`replit.nix`:
```nix
{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.postgresql
  ];
}
```

**Step 13: Update `package.json` scripts**

```json
{
  "scripts": {
    "dev": "tsx server/index.ts & vite --config vite.config.ts",
    "build": "vite build --config vite.config.ts && esbuild server/index.ts --bundle --platform=node --outdir=dist --packages=external",
    "start": "node dist/index.js",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Step 14: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite on port 5173, Express on port 5000, health check at `/api/health` returns `{"status":"ok"}`

**Step 15: Commit**

```bash
git add -A
git commit -m "feat: scaffold project with Vite + React + Express + Tailwind"
```

---

### Task 1.2: Database schema with Drizzle ORM

**Files:**
- Create: `shared/schema.ts`
- Create: `server/db.ts`
- Create: `drizzle.config.ts`

**Step 1: Write `shared/schema.ts`**

```typescript
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  real,
  varchar,
} from "drizzle-orm/pg-core";

// --- Leads / CRM ---
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  email: text("email"),
  telefono: text("telefono"),
  localidad: text("localidad"),
  tipoCliente: varchar("tipo_cliente", { length: 20 }).default("particular"), // particular | constructora | comunidad
  origen: varchar("origen", { length: 20 }).default("formulario"), // presupuestador | formulario | whatsapp | telefono
  estado: varchar("estado", { length: 20 }).default("nuevo"), // nuevo | contactado | presupuestado | ganado | perdido
  notas: text("notas"),
  presupuestoDatos: jsonb("presupuesto_datos"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Portfolio ---
export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  tituloCa: text("titulo_ca").notNull(),
  tituloEs: text("titulo_es").notNull(),
  tituloEn: text("titulo_en").notNull(),
  descripcionCa: text("descripcion_ca"),
  descripcionEs: text("descripcion_es"),
  descripcionEn: text("descripcion_en"),
  localidad: text("localidad"),
  tipoInmueble: text("tipo_inmueble"),
  productosUsados: text("productos_usados"),
  fotosAntes: jsonb("fotos_antes").$type<string[]>().default([]),
  fotosDespues: jsonb("fotos_despues").$type<string[]>().default([]),
  destacado: boolean("destacado").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Blog ---
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  tituloCa: text("titulo_ca").notNull(),
  tituloEs: text("titulo_es").notNull(),
  tituloEn: text("titulo_en").notNull(),
  contenidoCa: text("contenido_ca"),
  contenidoEs: text("contenido_es"),
  contenidoEn: text("contenido_en"),
  extractoCa: text("extracto_ca"),
  extractoEs: text("extracto_es"),
  extractoEn: text("extracto_en"),
  categoria: text("categoria"),
  autor: text("autor"),
  imagenPortada: text("imagen_portada"),
  metaTitleCa: text("meta_title_ca"),
  metaTitleEs: text("meta_title_es"),
  metaTitleEn: text("meta_title_en"),
  metaDescriptionCa: text("meta_description_ca"),
  metaDescriptionEs: text("meta_description_es"),
  metaDescriptionEn: text("meta_description_en"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Products (for calculator) ---
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  tipo: varchar("tipo", { length: 20 }).notNull(), // ventana | puerta | persiana | mosquitera
  gama: text("gama"),
  modelo: text("modelo"),
  descripcion: text("descripcion"),
  precioBase: real("precio_base"),
  precioPorM2: real("precio_por_m2"),
  coloresDisponibles: jsonb("colores_disponibles").$type<string[]>().default([]),
  vidriosCompatibles: jsonb("vidrios_compatibles").$type<string[]>().default([]),
  especificaciones: jsonb("especificaciones").$type<Record<string, string>>().default({}),
  activo: boolean("activo").default(true),
});

// --- Testimonials ---
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  localidad: text("localidad"),
  textoCa: text("texto_ca").notNull(),
  textoEs: text("texto_es").notNull(),
  textoEn: text("texto_en").notNull(),
  puntuacion: integer("puntuacion").default(5),
  fotoUrl: text("foto_url"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Zones (local SEO landings) ---
export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nombreCa: text("nombre_ca").notNull(),
  nombreEs: text("nombre_es").notNull(),
  nombreEn: text("nombre_en").notNull(),
  contenidoCa: text("contenido_ca"),
  contenidoEs: text("contenido_es"),
  contenidoEn: text("contenido_en"),
  metaTitleCa: text("meta_title_ca"),
  metaTitleEs: text("meta_title_es"),
  metaTitleEn: text("meta_title_en"),
  metaDescriptionCa: text("meta_description_ca"),
  metaDescriptionEs: text("meta_description_es"),
  metaDescriptionEn: text("meta_description_en"),
  latitud: real("latitud"),
  longitud: real("longitud"),
  published: boolean("published").default(false),
});

// --- Site Config ---
export const siteConfig = pgTable("site_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  valueCa: text("value_ca"),
  valueEs: text("value_es"),
  valueEn: text("value_en"),
});

// --- Admin Users ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Step 2: Write `server/db.ts`**

```typescript
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

**Step 3: Write `drizzle.config.ts`**

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

**Step 4: Generate and run migrations (on Replit with DATABASE_URL set)**

```bash
npm run db:generate
npm run db:migrate
```

**Step 5: Commit**

```bash
git add shared/schema.ts server/db.ts drizzle.config.ts
git commit -m "feat: add database schema with Drizzle ORM (7 tables)"
```

---

## Phase 2: Auth + Admin Shell

### Task 2.1: Passport authentication for admin

**Files:**
- Create: `server/middleware/auth.ts`
- Modify: `server/index.ts` (add session + passport)
- Modify: `server/routes.ts` (add auth routes)

**Step 1: Install bcrypt**

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

**Step 2: Write `server/middleware/auth.ts`**

```typescript
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    if (!user) return done(null, false);
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false);
    return done(null, user);
  })
);

passport.serializeUser((user: any, done) => done(null, user.id));
passport.deserializeUser(async (id: number, done) => {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  done(null, user || null);
});

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

export { passport };
```

**Step 3: Add session and passport to `server/index.ts`**

Add after `app.use(express.urlencoded(...))`:

```typescript
import session from "express-session";
import { passport } from "./middleware/auth";

app.use(
  session({
    secret: process.env.SESSION_SECRET || "arafinestra-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
```

**Step 4: Add auth routes to `server/routes.ts`**

```typescript
import { passport, requireAuth } from "./middleware/auth";

// Inside registerRoutes:
app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
  res.json({ user: { id: (req.user as any).id, username: (req.user as any).username } });
});

app.post("/api/auth/logout", (req, res) => {
  req.logout(() => res.json({ ok: true }));
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = req.user as any;
  res.json({ id: user.id, username: user.username });
});
```

**Step 5: Create seed script `server/seed.ts`**

```typescript
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@shared/schema";

async function seed() {
  const hash = await bcrypt.hash("admin", 10);
  await db.insert(users).values({ username: "admin", password: hash }).onConflictDoNothing();
  console.log("Seed complete: admin/admin");
  process.exit(0);
}
seed();
```

**Step 6: Commit**

```bash
git add server/middleware/auth.ts server/seed.ts
git commit -m "feat: add Passport authentication for admin panel"
```

---

### Task 2.2: Admin layout + routing shell

**Files:**
- Create: `client/src/pages/admin/AdminLayout.tsx`
- Create: `client/src/pages/admin/Dashboard.tsx`
- Create: `client/src/pages/admin/Login.tsx`
- Create: `client/src/hooks/useAuth.ts`
- Modify: `client/src/App.tsx` (add admin routes)

**Step 1: Write `client/src/hooks/useAuth.ts`**

```tsx
import { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    setUser(data.user);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return { user, loading, login, logout };
}
```

**Step 2: Write `client/src/pages/admin/Login.tsx`**

Standard login form with username/password fields, error handling, redirect on success.

**Step 3: Write `client/src/pages/admin/AdminLayout.tsx`**

Sidebar navigation with links to: Dashboard, Leads, Portfolio, Blog, Productos, Testimonios, Zonas, Contenido, Config. Top bar with logout button.

**Step 4: Write `client/src/pages/admin/Dashboard.tsx`**

Simple dashboard with lead counts (new today/week/month) fetched from API.

**Step 5: Update `App.tsx` routing**

```tsx
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";

// Public routes
<Route path="/" element={<Home />} />
<Route path="/admin/login" element={<Login />} />

// Admin routes (protected)
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Dashboard />} />
  {/* More admin routes added in later tasks */}
</Route>
```

**Step 6: Commit**

```bash
git add client/src/pages/admin/ client/src/hooks/useAuth.ts
git commit -m "feat: add admin shell with login, layout, and dashboard"
```

---

## Phase 3: Admin CRUD Modules

### Task 3.1: Leads/CRM module

**Files:**
- Create: `server/routes/leads.ts`
- Create: `client/src/pages/admin/Leads.tsx`

**Step 1: Write `server/routes/leads.ts`**

CRUD endpoints:
- `GET /api/leads` — list with filters (estado, origen, tipoCliente), pagination
- `GET /api/leads/:id` — single lead
- `POST /api/leads` — create (public, no auth — from forms/calculator)
- `PATCH /api/leads/:id` — update estado/notas (admin, auth required)
- `DELETE /api/leads/:id` — delete (admin)
- `GET /api/leads/stats` — counts by estado, by origen, by date range

**Step 2: Write `client/src/pages/admin/Leads.tsx`**

Table with columns: nombre, email, telefono, localidad, origen, estado, fecha.
Filters: dropdown estado, dropdown origen, search text.
Click row to open detail panel with notes editor and estado selector.
Status badge colors: nuevo=blue, contactado=yellow, presupuestado=orange, ganado=green, perdido=red.

**Step 3: Add route to admin layout and register API routes**

**Step 4: Commit**

```bash
git commit -m "feat: add Leads/CRM admin module with filters and stats"
```

---

### Task 3.2: Products module (calculator backend)

**Files:**
- Create: `server/routes/products.ts`
- Create: `client/src/pages/admin/Products.tsx`

**Step 1: Write `server/routes/products.ts`**

CRUD endpoints:
- `GET /api/products` — list with filter by tipo, active only for public
- `GET /api/products/:id` — single product
- `POST /api/products` — create (admin)
- `PATCH /api/products/:id` — update (admin)
- `DELETE /api/products/:id` — delete (admin)

**Step 2: Write `client/src/pages/admin/Products.tsx`**

Form with: tipo (select), gama, modelo, descripcion, precioBase, precioPorM2.
Dynamic fields for coloresDisponibles (tag input), vidriosCompatibles (tag input).
Especificaciones as key-value pairs (aislamiento termico, acustico, etc.).
Table listing all products grouped by tipo.

**Step 3: Commit**

```bash
git commit -m "feat: add Products admin module for calculator pricing"
```

---

### Task 3.3: Portfolio module

**Files:**
- Create: `server/routes/portfolio.ts`
- Create: `client/src/pages/admin/Portfolio.tsx`

**Step 1: Write `server/routes/portfolio.ts`**

CRUD endpoints + image upload handling (store as base64 or URL references).
- `GET /api/portfolio` — list (public: published only, admin: all)
- `POST /api/portfolio` — create with image URLs
- `PATCH /api/portfolio/:id` — update
- `DELETE /api/portfolio/:id` — delete

**Step 2: Write `client/src/pages/admin/Portfolio.tsx`**

Form with: titulo (3 langs), descripcion (3 langs), localidad, tipoInmueble, productosUsados.
Image upload areas for "antes" and "despues" photos.
Toggle for destacado and published.
Card grid preview of all projects.

**Step 3: Commit**

```bash
git commit -m "feat: add Portfolio admin module with before/after images"
```

---

### Task 3.4: Blog module

**Files:**
- Create: `server/routes/blog.ts`
- Create: `client/src/pages/admin/BlogEditor.tsx`
- Create: `client/src/pages/admin/BlogList.tsx`

**Step 1: Write `server/routes/blog.ts`**

CRUD endpoints:
- `GET /api/blog` — list (public: published only with pagination, admin: all)
- `GET /api/blog/:slug` — single post by slug
- `POST /api/blog` — create (admin)
- `PATCH /api/blog/:id` — update (admin)
- `DELETE /api/blog/:id` — delete (admin)

**Step 2: Write blog admin pages**

BlogList: table with titulo, categoria, published status, publishedAt date.
BlogEditor: form with slug (auto-generated from title), titulo/contenido/extracto in 3 langs (tabs), categoria dropdown, autor, imagen_portada URL, SEO fields (meta_title, meta_description per lang), publish toggle.
Use textarea for content (Markdown supported, rendered on frontend).

**Step 3: Commit**

```bash
git commit -m "feat: add Blog admin module with multilingual editor"
```

---

### Task 3.5: Testimonials, Zones, Site Config modules

**Files:**
- Create: `server/routes/testimonials.ts`
- Create: `server/routes/zones.ts`
- Create: `server/routes/config.ts`
- Create: `client/src/pages/admin/Testimonials.tsx`
- Create: `client/src/pages/admin/Zones.tsx`
- Create: `client/src/pages/admin/SiteConfig.tsx`

**Step 1: Testimonials API + admin page**

CRUD. Admin form: nombre, localidad, texto (3 langs), puntuacion (1-5 stars), foto URL, published toggle.

**Step 2: Zones API + admin page**

CRUD. Admin form: slug, nombre (3 langs), contenido (3 langs — rich text), SEO fields (3 langs), lat/lng, published toggle.

**Step 3: Site Config API + admin page**

Key-value editor. Pre-seeded keys: telefono, email, whatsapp, horario, direccion, facebook, instagram, cifras_experiencia, cifras_proyectos, cifras_zona.
Each key has value_ca, value_es, value_en fields.

**Step 4: Commit**

```bash
git commit -m "feat: add Testimonials, Zones, and SiteConfig admin modules"
```

---

## Phase 4: Multilingual Setup (i18next)

### Task 4.1: Configure i18next with CA/ES/EN

**Files:**
- Create: `client/src/i18n/index.ts`
- Create: `client/src/i18n/ca.json`
- Create: `client/src/i18n/es.json`
- Create: `client/src/i18n/en.json`
- Create: `client/src/components/layout/LanguageSwitcher.tsx`

**Step 1: Write `client/src/i18n/index.ts`**

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ca from "./ca.json";
import es from "./es.json";
import en from "./en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { ca: { translation: ca }, es: { translation: es }, en: { translation: en } },
    fallbackLng: "ca",
    interpolation: { escapeValue: false },
    detection: {
      order: ["path", "navigator"],
      lookupFromPathIndex: 0,
    },
  });

export default i18n;
```

**Step 2: Write translation files**

Static UI strings: nav items, buttons, footer, form labels, CTA texts, meta defaults.
Example `ca.json`:
```json
{
  "nav": {
    "home": "Inici",
    "services": "Serveis",
    "windows": "Finestres PVC",
    "sliding_doors": "Portes corredisses",
    "shutters": "Persianes",
    "mosquito_nets": "Mosquiteres",
    "calculator": "Pressupost",
    "projects": "Projectes",
    "blog": "Blog",
    "reviews": "Opinions",
    "contact": "Contacte"
  },
  "cta": {
    "calculate": "Calcula el teu pressupost",
    "contact_us": "Contacta'ns",
    "request_quote": "Vull pressupost exacte",
    "call_us": "Truca'ns"
  },
  "hero": {
    "title": "Finestres PVC a Girona i Maresme",
    "subtitle": "Instal·lacio professional amb perfils Cortizo"
  },
  "footer": {
    "rights": "Tots els drets reservats"
  }
}
```

Similar structure for `es.json` and `en.json`.

**Step 3: Write LanguageSwitcher component**

Dropdown or flag buttons (CA/ES/EN) that change `i18n.language` and update URL prefix.

**Step 4: Add i18n import to `main.tsx`**

```tsx
import "./i18n";
```

**Step 5: Commit**

```bash
git commit -m "feat: add i18next multilingual support (CA/ES/EN)"
```

---

## Phase 5: Public Layout + Home Page

### Task 5.1: Public layout (Header + Footer + WhatsApp)

**Files:**
- Create: `client/src/components/layout/Header.tsx`
- Create: `client/src/components/layout/Footer.tsx`
- Create: `client/src/components/layout/PublicLayout.tsx`
- Create: `client/src/components/ui/WhatsAppButton.tsx`

**Step 1: Write Header**

- Logo (left)
- Nav links: Serveis (dropdown: Finestres, Portes, Persianes, Mosquiteres), Pressupost, Projectes, Blog, Contacte
- Phone number (click-to-call) + language switcher (right)
- Sticky on scroll, transparent on hero then solid on scroll
- Mobile: hamburger menu

**Step 2: Write Footer**

- 4 columns: Serveis, Zones (top cities), Empresa (about, blog, opinions), Contacte (tel, email, address, hours)
- Bottom bar: copyright + social icons (Instagram, Facebook)
- Cortizo logo badge

**Step 3: Write WhatsApp floating button**

Fixed bottom-right, green circle with WhatsApp icon, links to `wa.me/{number}?text={prefilled_message}`.
Hidden on admin pages.

**Step 4: Write PublicLayout wrapping Header + Outlet + Footer + WhatsApp**

**Step 5: Commit**

```bash
git commit -m "feat: add public layout with header, footer, and WhatsApp button"
```

---

### Task 5.2: Home page

**Files:**
- Create: `client/src/pages/public/Home.tsx`
- Create: `client/src/components/ui/ServiceCard.tsx`
- Create: `client/src/components/ui/TestimonialCarousel.tsx`
- Create: `client/src/components/ui/ProjectCard.tsx`
- Create: `client/src/components/seo/PageHead.tsx`

**Step 1: Write `PageHead.tsx` (reusable SEO component)**

```tsx
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface PageHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export default function PageHead({ title, description, path, image }: PageHeadProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const baseUrl = "https://arafinestra.com";
  const url = `${baseUrl}/${lang}${path}`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title} | ARA FINESTRA</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca${path}`} />
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es${path}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${path}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
```

**Step 2: Write Home page sections**

1. Hero: full-width background image/video, H1 "Finestres PVC a Girona i Maresme", subtitle, CTA button to /pressupost
2. Services: 4 cards (ventanas, puertas correderas, persianas, mosquiteras) with icon + title + short text + link
3. Stats: 3 counters animated on scroll (years, projects, coverage area km)
4. Featured projects: 3 cards from API (`/api/portfolio?destacado=true&limit=3`)
5. Testimonials: carousel from API (`/api/testimonials?published=true`)
6. Cortizo banner: logo + "Perfils Cortizo — qualitat espanyola" + link to /cortizo
7. Subvencions banner: "Subvencions Next Generation" + link to /subvencions
8. Final CTA: "Calcula el teu pressupost" button

**Step 3: Add Schema.org LocalBusiness JSON-LD in PageHead for Home**

```tsx
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "ARA FINESTRA",
  "description": "Instalacio de finestres PVC a Girona i Maresme",
  "url": "https://arafinestra.com",
  "telephone": "+34XXXXXXXXX",
  "areaServed": ["Girona", "Maresme"],
  "brand": { "@type": "Brand", "name": "Cortizo" }
})}
</script>
```

**Step 4: Commit**

```bash
git commit -m "feat: add Home page with hero, services, testimonials, and SEO"
```

---

## Phase 6: Service Pages + Static Landings

### Task 6.1: Service page template

**Files:**
- Create: `client/src/pages/public/ServicePage.tsx`
- Create: `client/src/components/seo/FaqSchema.tsx`

**Step 1: Write reusable `ServicePage.tsx`**

Receives service type as route param. Fetches content from site_config or hardcoded per service.
Sections: hero banner, benefits list, product gallery (from portfolio filtered), FAQ accordion, CTA.

**Step 2: Write `FaqSchema.tsx`**

Injects FAQPage schema JSON-LD for each service's FAQ section.

**Step 3: Add routes for 4 services**

```tsx
<Route path="/:lang/serveis/finestres-pvc" element={<ServicePage type="ventana" />} />
<Route path="/:lang/serveis/portes-corredisses" element={<ServicePage type="puerta" />} />
<Route path="/:lang/serveis/persianes" element={<ServicePage type="persiana" />} />
<Route path="/:lang/serveis/mosquiteres" element={<ServicePage type="mosquitera" />} />
```

**Step 4: Commit**

```bash
git commit -m "feat: add service pages with FAQ schema"
```

---

### Task 6.2: Cortizo + Subvenciones landing pages

**Files:**
- Create: `client/src/pages/public/Cortizo.tsx`
- Create: `client/src/pages/public/Subvenciones.tsx`

**Step 1: Cortizo page** — brand story, product ranges, specs table, certifications, CTA
**Step 2: Subvenciones page** — explanation, requirements, "we handle paperwork", CTA
**Step 3: Commit**

```bash
git commit -m "feat: add Cortizo and Subvenciones SEO landing pages"
```

---

## Phase 7: Presupuestador (Calculator Wizard)

### Task 7.1: Multi-step calculator component

**Files:**
- Create: `client/src/pages/public/Calculator.tsx`
- Create: `client/src/components/calculator/StepProductType.tsx`
- Create: `client/src/components/calculator/StepModel.tsx`
- Create: `client/src/components/calculator/StepDimensions.tsx`
- Create: `client/src/components/calculator/StepColor.tsx`
- Create: `client/src/components/calculator/StepGlass.tsx`
- Create: `client/src/components/calculator/StepExtras.tsx`
- Create: `client/src/components/calculator/StepQuantity.tsx`
- Create: `client/src/components/calculator/Result.tsx`
- Create: `client/src/components/calculator/ProgressBar.tsx`

**Step 1: Write Calculator state management**

```tsx
interface CalculatorState {
  step: number;
  tipo: string;        // ventana | puerta | persiana | mosquitera
  modelo: string;      // gama Cortizo
  hojas: number;
  ancho: number;       // cm
  alto: number;        // cm
  color: string;
  vidrio: string;
  extras: string[];
  cantidad: number;
}
```

Use `useReducer` for state. Each step component receives state + dispatch.

**Step 2: Write step components**

Each step: visual card selection (not dropdowns — cards with images for better UX).
- StepProductType: 4 large cards with icons
- StepModel: cards fetched from `/api/products?tipo={selected}` showing gama names
- StepDimensions: number inputs for ancho/alto + hojas selector (1-4)
- StepColor: color swatches fetched from product's coloresDisponibles
- StepGlass: cards for vidrio types from product's vidriosCompatibles
- StepExtras: checkboxes (persiana integrada, mosquitera, etc.)
- StepQuantity: number input with +/- buttons

**Step 3: Write ProgressBar**

7 steps with labels, current step highlighted, clickable to go back.

**Step 4: Write Result component**

Calculate price: `(precioBase + precioPorM2 * (ancho/100 * alto/100)) * cantidad + extras`
Display: estimated price range (+-15%), product summary, CTA "Vull pressupost exacte".
CTA opens lead capture form (nombre, email, telefono, localidad) that POSTs to `/api/leads` with `origen: "presupuestador"` and `presupuesto_datos: calculatorState`.

**Step 5: Commit**

```bash
git commit -m "feat: add interactive budget calculator with 7-step wizard"
```

---

## Phase 8: Portfolio + Blog (Public)

### Task 8.1: Portfolio gallery page

**Files:**
- Create: `client/src/pages/public/Projects.tsx`
- Create: `client/src/components/ui/ProjectGallery.tsx`
- Create: `client/src/components/ui/Lightbox.tsx`
- Create: `client/src/components/ui/FilterBar.tsx`

**Step 1: Write Projects page**

Fetch from `/api/portfolio?published=true`.
FilterBar: buttons for tipo (all, ventana, puerta, persiana, mosquitera) + localidad dropdown.
Grid of ProjectCards showing main "despues" photo, titulo, localidad.
Click opens detail view with before/after slider, description, products used.
Lightbox for full-screen image viewing.

**Step 2: Commit**

```bash
git commit -m "feat: add portfolio gallery with filters and lightbox"
```

---

### Task 8.2: Blog public pages

**Files:**
- Create: `client/src/pages/public/BlogList.tsx`
- Create: `client/src/pages/public/BlogPost.tsx`

**Step 1: Write BlogList page**

Fetch from `/api/blog?published=true`.
Grid of article cards: imagen_portada, titulo, extracto, categoria badge, fecha, reading time.
Filter by categoria.
Pagination.

**Step 2: Write BlogPost page**

Fetch by slug from `/api/blog/:slug`.
Render Markdown content (use `react-markdown`).
Schema Article JSON-LD.
Sidebar: CTA presupuesto + related posts.
Author + date + reading time header.

```bash
npm install react-markdown
```

**Step 3: Commit**

```bash
git commit -m "feat: add blog listing and post pages with Markdown rendering"
```

---

## Phase 9: Local SEO Zones + Contact

### Task 9.1: Zone landing pages

**Files:**
- Create: `client/src/pages/public/Zone.tsx`

**Step 1: Write Zone page**

Fetch from `/api/zones/:slug`.
H1: "Instalacio de finestres PVC a {nombre}" (localized).
Unique content per zone.
Portfolio items filtered by localidad.
Map embed (Google Maps iframe with lat/lng).
Schema LocalBusiness with areaServed.
CTA presupuesto.

**Step 2: Add route**

```tsx
<Route path="/:lang/zones/:slug" element={<Zone />} />
```

**Step 3: Commit**

```bash
git commit -m "feat: add local SEO zone landing pages"
```

---

### Task 9.2: Contact page + Testimonials page

**Files:**
- Create: `client/src/pages/public/Contact.tsx`
- Create: `client/src/pages/public/Testimonials.tsx`

**Step 1: Contact page**

Form: nombre, email, telefono, mensaje, tipo_cliente selector.
POSTs to `/api/leads` with `origen: "formulario"`.
Map embed.
Contact info: tel (click-to-call), email, address, hours.
WhatsApp direct link.

**Step 2: Testimonials page**

Grid of testimonial cards with nombre, localidad, texto, puntuacion (stars), foto.
Schema: aggregateRating.

**Step 3: Commit**

```bash
git commit -m "feat: add Contact form and Testimonials page"
```

---

## Phase 10: SEO Technical

### Task 10.1: Sitemap + robots.txt + Schema

**Files:**
- Create: `server/routes/seo.ts`

**Step 1: Dynamic sitemap.xml endpoint**

`GET /sitemap.xml` — generates XML sitemap with:
- All static pages (home, services, cortizo, subvenciones, contact, opinions) x 3 langs
- All published blog posts x 3 langs
- All published zones x 3 langs
- All published portfolio items
- Priority and changefreq per type

**Step 2: robots.txt endpoint**

```
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://arafinestra.com/sitemap.xml
```

**Step 3: Commit**

```bash
git commit -m "feat: add dynamic sitemap.xml and robots.txt"
```

---

## Phase 11: Final Polish

### Task 11.1: Exit-intent popup on service pages

**Files:**
- Create: `client/src/components/ui/ExitPopup.tsx`

Detects mouse leaving viewport (desktop) or back button (mobile).
Shows: "Vols un pressupost gratuIt?" + mini form (nombre, telefono) + CTA.
Cookie to not show again for 7 days.

**Step 1: Write component and integrate in service pages only**

**Step 2: Commit**

```bash
git commit -m "feat: add exit-intent popup on service pages"
```

---

### Task 11.2: Performance optimization

**Step 1: Lazy load routes**

```tsx
const Home = lazy(() => import("./pages/public/Home"));
const Calculator = lazy(() => import("./pages/public/Calculator"));
// etc.
```

**Step 2: Image optimization**

- All images served as WebP
- Lazy loading with `loading="lazy"`
- Responsive srcset for different screen sizes

**Step 3: Bundle analysis and code splitting**

```bash
npm install -D rollup-plugin-visualizer
```

**Step 4: Commit**

```bash
git commit -m "perf: add lazy loading, WebP images, and code splitting"
```

---

### Task 11.3: Seed initial data

**Files:**
- Modify: `server/seed.ts`

Add seed data:
- 10-15 zones (Blanes, Lloret, Tossa, Girona, Figueres, Mataro, Calella, Palafrugell, Olot, Salt, Roses, Cadaques, Pineda, Tordera, Arenys)
- Sample products (4 types x 2-3 gamas Cortizo with realistic prices)
- Site config defaults (placeholder phone, email, etc.)
- 1 sample blog post
- 1 sample testimonial

**Step 1: Write comprehensive seed data**
**Step 2: Run seed on Replit**
**Step 3: Commit**

```bash
git commit -m "feat: add seed data for zones, products, and site config"
```

---

## Summary of Phases

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1.1-1.2 | Scaffolding + DB schema |
| 2 | 2.1-2.2 | Auth + admin shell |
| 3 | 3.1-3.5 | Admin CRUD modules (leads, products, portfolio, blog, testimonials, zones, config) |
| 4 | 4.1 | Multilingual i18next (CA/ES/EN) |
| 5 | 5.1-5.2 | Public layout + Home page |
| 6 | 6.1-6.2 | Service pages + Cortizo/Subvenciones landings |
| 7 | 7.1 | Presupuestador wizard (7 steps) |
| 8 | 8.1-8.2 | Portfolio gallery + Blog public |
| 9 | 9.1-9.2 | Zone landings + Contact + Testimonials |
| 10 | 10.1 | Sitemap + robots.txt |
| 11 | 11.1-11.3 | Exit popup + performance + seed data |

**Total: 17 tasks across 11 phases**
