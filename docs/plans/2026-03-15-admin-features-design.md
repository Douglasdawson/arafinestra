# Admin Panel CLI Features Integration — Design Document

**Goal:** Bring all 5 CLI functionalities into the admin web panel so the business owner can manage everything from the browser.

**Architecture:** New server-side API routes handle AI generation (Claude API), SEO auditing, and PDF generation. Frontend adds UI to existing admin pages + 2 new pages. Anthropic API key via `ANTHROPIC_API_KEY` environment variable.

---

## Features

### 1. AI Blog Post Generation (BlogEditor)
- "Generar amb IA" button on new post page
- Modal prompts for topic
- `POST /api/ai/generate-blog` → server calls Claude API
- Returns trilingual content (CA/ES/EN): title, content, excerpt, meta title, meta description, category
- Auto-fills all form fields as draft for review before publishing

### 2. AI Zone Generation (Zones)
- "Afegir zona amb IA" button next to existing "New zone" button
- Modal prompts for municipality name
- `POST /api/ai/generate-zone` → server calls Claude API + Nominatim geocoding
- Generates trilingual content + coordinates
- Saves and auto-publishes

### 3. Enhanced Dashboard (Dashboard)
- Lead stats: by estado and by origen (tables or simple cards)
- Time-based stats: today, this week, this month
- Conversion rate: ganados / total

### 4. SEO Audit Page (new: /admin/seo)
- New navigation item in AdminLayout sidebar
- "Run audit" button → `POST /api/seo/audit`
- Server fetches all public pages, checks: title, meta description, H1, canonical, schema.org
- Returns per-page scores
- Displays results table with color-coded scores

### 5. PDF Quote Generator (new: /admin/pressupostos)
- New navigation item in AdminLayout sidebar
- Form: client data (name, phone, email, city) + window items (type, dimensions, glass)
- Add/remove window items dynamically
- `POST /api/pressupost/generate` → server generates PDF with PDFKit
- Returns PDF for download
- Auto-creates lead in CRM
- List of previously generated quotes (stored in DB or filesystem)

---

## Backend Routes

- `POST /api/ai/generate-blog` — body: { topic } → returns BlogDraft JSON
- `POST /api/ai/generate-zone` — body: { municipality } → returns ZoneDraft JSON + coordinates
- `POST /api/seo/audit` — no body → returns array of page audit results
- `POST /api/pressupost/generate` — body: { client, items } → returns PDF buffer

All require auth. AI routes require ANTHROPIC_API_KEY env var.

## Frontend Changes

- Modify: `Dashboard.tsx`, `BlogEditor.tsx`, `Zones.tsx`, `AdminLayout.tsx`
- Create: `client/src/pages/admin/SeoAudit.tsx`, `client/src/pages/admin/Pressupostos.tsx`
- New admin routes in App.tsx: `/admin/seo`, `/admin/pressupostos`
