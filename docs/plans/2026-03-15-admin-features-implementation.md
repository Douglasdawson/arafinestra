# Admin Panel Features Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate 5 CLI features into the admin web panel: AI blog/zone generation, enhanced dashboard, SEO audit, and PDF quote generator.

**Architecture:** New server-side route files handle AI generation (Claude API via `ANTHROPIC_API_KEY` env var), SEO auditing (HTML fetching + parsing), and PDF generation (PDFKit). Frontend modifies existing admin pages and adds 2 new pages. Reuses AI prompt logic from `cli/src/lib/ai.ts` (adapted for server).

**Tech Stack:** Express 5, @anthropic-ai/sdk, pdfkit (already installed), React 18, Tailwind CSS 4

---

## Task 1: AI Backend Routes

**Files:**
- Create: `server/routes/ai.ts`
- Modify: `server/routes.ts` (register new routes)

**What to build:**

Create `server/routes/ai.ts` with two endpoints:

### `POST /api/ai/generate-blog`
- Requires auth
- Body: `{ topic: string }`
- Uses Anthropic SDK with `process.env.ANTHROPIC_API_KEY`
- Same prompt logic as `cli/src/lib/ai.ts` `generateBlogPost()` — business context, trilingual, SEO-optimized
- Model: `claude-sonnet-4-20250514`, max_tokens: 4096
- Returns JSON: `{ slug, tituloCa, tituloEs, tituloEn, contenidoCa, ..., categoria }`
- Error handling: 500 if no API key, 500 if Claude fails

### `POST /api/ai/generate-zone`
- Requires auth
- Body: `{ municipality: string }`
- Same prompt logic as `cli/src/lib/ai.ts` `generateZonePage()`
- Also geocodes via Nominatim: `https://nominatim.openstreetmap.org/search?q=${municipality}, Girona, Spain&format=json&limit=1`
- Returns JSON: `{ slug, nombreCa, ..., metaDescriptionEn, latitud, longitud }`

Register both in `server/routes.ts`:
```typescript
import { registerAiRoutes } from "./routes/ai.js";
registerAiRoutes(app);
```

**Test:** `curl -X POST http://localhost:5000/api/ai/generate-blog -H 'Content-Type: application/json' -d '{"topic":"test"}' --cookie "session=..."` (should return 401 without auth or 500 without API key)

**Commit:**
```bash
git add server/routes/ai.ts server/routes.ts
git commit -m "feat(admin): add AI generation backend routes"
```

---

## Task 2: SEO Audit Backend Route

**Files:**
- Create: `server/routes/seo-audit.ts`
- Modify: `server/routes.ts`

**What to build:**

### `POST /api/seo/audit`
- Requires auth
- No body needed
- Static paths list (same as sitemap): "", "cortizo", "subvencions", "pressupost", etc. (21 paths)
- For each path with lang "ca": fetch `https://arafinestra.com/ca/${path}` with timeout 10s
- Check HTML for: `<title>`, `meta name="description"`, `<h1`, `rel="canonical"`, `application/ld+json`
- Return: `{ pages: [{ path, title: bool, description: bool, h1: bool, canonical: bool, schema: bool, score: number }], summary: { total, avgScore } }`

Register in routes.ts:
```typescript
import { registerSeoAuditRoutes } from "./routes/seo-audit.js";
registerSeoAuditRoutes(app);
```

**Commit:**
```bash
git add server/routes/seo-audit.ts server/routes.ts
git commit -m "feat(admin): add SEO audit backend route"
```

---

## Task 3: PDF Quote Backend Route

**Files:**
- Create: `server/routes/pressupost.ts`
- Modify: `server/routes.ts`

**What to build:**

### `POST /api/pressupost/generate`
- Requires auth
- Body: `{ client: { name, phone, email?, city }, items: [{ type, width, height, glass }] }`
- For each item: calculate m² = (width/100) * (height/100), lookup price from products table (fallback 350 €/m²)
- Generate PDF with PDFDocument (same format as CLI pressupost):
  - Header: ARA FINESTRA, Renova't Costa Brava SL, CIF B42997049, address
  - Quote number: P-YYYY-NNNN (use timestamp for NNNN)
  - Client info, items table, subtotal, IVA 21%, total
  - Terms: orientatiu, garantia 10+2, pagament 50/50, termini 15-30 dies
- Set response headers: `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="pressupost-P-YYYY-NNNN.pdf"`
- Pipe PDFDocument to response
- Also create a lead in the DB via direct insert (estado: "presupuestado", origen: "admin")

Register in routes.ts.

**Commit:**
```bash
git add server/routes/pressupost.ts server/routes.ts
git commit -m "feat(admin): add PDF quote generator backend route"
```

---

## Task 4: AI Generation UI in BlogEditor

**Files:**
- Modify: `client/src/pages/admin/BlogEditor.tsx`

**What to build:**

Add to the top of BlogEditor (when creating new post, i.e., no `id` param):

1. A button "Generar amb IA" (brand color, sparkle icon ✦)
2. When clicked: show a modal/dialog with:
   - Text input "Tema de l'article"
   - "Generar" button + "Cancel·lar" button
3. On submit: `POST /api/ai/generate-blog` with `{ topic }`
   - Show loading spinner during generation
4. On success: populate ALL form fields from the response:
   - slug, tituloCa/Es/En, contenidoCa/Es/En, extractoCa/Es/En, metaTitleCa/Es/En, metaDescriptionCa/Es/En, categoria
   - Close modal, show success toast
5. On error: show error toast

Keep it simple — inline modal with useState, no new components needed.

**Commit:**
```bash
git add client/src/pages/admin/BlogEditor.tsx
git commit -m "feat(admin): add AI blog generation button to BlogEditor"
```

---

## Task 5: AI Generation UI in Zones

**Files:**
- Modify: `client/src/pages/admin/Zones.tsx`

**What to build:**

Add next to the existing "Nueva zona" button:

1. Button "Afegir amb IA" (brand color, ✦ icon)
2. Modal with text input "Nom del municipi"
3. On submit: `POST /api/ai/generate-zone` with `{ municipality }`
   - Loading state during generation
4. On success: the backend returns generated content + coordinates
   - Call `POST /api/zones` to create the zone (published: true)
   - Refresh the zones list
   - Show success toast with zone name
5. On error: show error toast

**Commit:**
```bash
git add client/src/pages/admin/Zones.tsx
git commit -m "feat(admin): add AI zone generation to Zones page"
```

---

## Task 6: Enhanced Dashboard

**Files:**
- Modify: `client/src/pages/admin/Dashboard.tsx`

**What to build:**

Expand the existing Dashboard. Keep the 4 stat cards, add below them:

### Lead Stats Section
- Fetch `GET /api/leads/stats` (already exists, returns byEstado and byOrigen)
- Show two sections:

**Per estat** — colored badges with counts:
```
Nuevo: 12  Contactado: 8  Presupuestado: 5  Ganado: 3  Perdido: 2
```
Use same color scheme: nuevo=yellow, contactado=blue, presupuestado=orange, ganado=green, perdido=red

**Per origen** — simple horizontal bar or badges:
```
Formulari: 15  Calculadora: 8  WhatsApp: 4  Telèfon: 2  Referit: 1
```

### Time Stats
- From the leads data already fetched, calculate:
  - Leads today (createdAt is today)
  - Leads this week
  - Leads this month
  - Conversion rate: (ganados / total * 100)%

Display as a second row of stat cards below the first.

**Commit:**
```bash
git add client/src/pages/admin/Dashboard.tsx
git commit -m "feat(admin): enhance Dashboard with lead stats and conversion metrics"
```

---

## Task 7: SEO Audit Page

**Files:**
- Create: `client/src/pages/admin/SeoAudit.tsx`
- Modify: `client/src/pages/admin/AdminLayout.tsx` (add nav item)
- Modify: `client/src/App.tsx` (add route)

**What to build:**

### AdminLayout changes
Add to `navItems` array:
```typescript
{ to: "/admin/seo", label: "SEO" },
```

### App.tsx changes
Add lazy import and route:
```typescript
const SeoAudit = lazy(() => import("./pages/admin/SeoAudit"));
// Inside admin routes:
<Route path="seo" element={<SeoAudit />} />
```

### SeoAudit.tsx page
- Header: "Auditoria SEO"
- Button: "Executar auditoria" (brand color)
- On click: `POST /api/seo/audit` with loading state
- Display results in a table:
  - Columns: Pàgina, Title, Description, H1, Canonical, Schema, Puntuació
  - Each check: green checkmark ✓ or red cross ✗
  - Score: X/5 with color (green ≥4, yellow ≥3, red <3)
- Summary row at bottom: total pages, average score /10
- Follow existing admin design patterns: white card, rounded-lg, shadow-sm, border-gray-200

**Commit:**
```bash
git add client/src/pages/admin/SeoAudit.tsx client/src/pages/admin/AdminLayout.tsx client/src/App.tsx
git commit -m "feat(admin): add SEO audit page"
```

---

## Task 8: Pressupostos Page

**Files:**
- Create: `client/src/pages/admin/Pressupostos.tsx`
- Modify: `client/src/pages/admin/AdminLayout.tsx` (add nav item)
- Modify: `client/src/App.tsx` (add route)

**What to build:**

### AdminLayout changes
Add to `navItems` array:
```typescript
{ to: "/admin/pressupostos", label: "Pressupostos" },
```

### App.tsx changes
```typescript
const Pressupostos = lazy(() => import("./pages/admin/Pressupostos"));
<Route path="pressupostos" element={<Pressupostos />} />
```

### Pressupostos.tsx page

**Form section:**
- Client data: name (required), phone (required), email, city
- Items section with dynamic add/remove:
  - Each item: type dropdown (C-70/A-84/E-170), width (cm), height (cm), glass dropdown (doble/baix-emissiu/triple)
  - "Afegir finestra" button to add more items
  - Remove button per item
- Shows calculated subtotal, IVA, total in real-time as user types
- "Generar PDF" button

**On submit:**
- `POST /api/pressupost/generate` with `{ client, items }`
- Response is a PDF blob → trigger browser download
- Show success toast "Pressupost generat i lead creat"

**Design:** Follow existing admin patterns. Use grid layout for client fields (2 cols). Items as cards that can be added/removed. Totals section right-aligned.

**Commit:**
```bash
git add client/src/pages/admin/Pressupostos.tsx client/src/pages/admin/AdminLayout.tsx client/src/App.tsx
git commit -m "feat(admin): add PDF quote generator page"
```

---

## Summary of Tasks

| Task | What | Backend | Frontend | Depends On |
|------|------|---------|----------|------------|
| 1 | AI routes | `server/routes/ai.ts` | — | — |
| 2 | SEO audit route | `server/routes/seo-audit.ts` | — | — |
| 3 | PDF quote route | `server/routes/pressupost.ts` | — | — |
| 4 | Blog AI button | — | `BlogEditor.tsx` | Task 1 |
| 5 | Zone AI button | — | `Zones.tsx` | Task 1 |
| 6 | Enhanced Dashboard | — | `Dashboard.tsx` | — |
| 7 | SEO Audit page | — | `SeoAudit.tsx` | Task 2 |
| 8 | Pressupostos page | — | `Pressupostos.tsx` | Task 3 |

Tasks 1, 2, 3, 6 are independent and can run in parallel.
Tasks 4+5 depend on Task 1. Task 7 depends on Task 2. Task 8 depends on Task 3.
