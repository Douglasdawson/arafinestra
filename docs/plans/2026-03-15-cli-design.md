# ARA FINESTRA CLI — Design Document

**Goal:** Unified CLI tool for managing the ARA FINESTRA business — leads, content, SEO, and quotes — from terminal (desktop + mobile).

**Architecture:** TypeScript CLI in the monorepo (`cli/` directory) that communicates with the existing REST API at arafinestra.com. Uses Claude API for AI content generation. Single admin user, token-based auth stored locally.

**Tech Stack:** TypeScript, commander, chalk, cli-table3, pdfkit, @anthropic-ai/sdk

---

## Modules

### 1. `arafinestra leads` — CRM Management
- `list` — List leads with filters (--estado, --today, --origen)
- `stats` — Summary by estado and origen
- `call <id>` / `won <id>` / `lost <id>` — Update lead status
- `note <id> "text"` — Add note to lead
- `export --week|--month` — CSV export
- Output: colored table (green=ganado, red=perdido, yellow=nuevo)

### 2. `arafinestra blog` — Blog with AI Generation
- `list` / `list --draft` — List posts
- `generate "topic"` — Generate draft via Claude API (CA/ES/EN, SEO-optimized)
- `preview <slug>` — Show draft in terminal
- `edit <slug>` — Open in $EDITOR
- `publish <slug>` / `unpublish <slug>` — Toggle publication
- AI prompt includes: business context, services, zone, Cortizo brand, SEO keywords
- Generated as draft (published=false), user reviews before publishing

### 3. `arafinestra zones` — Local SEO (Full Automatic)
- `list` — List zones
- `add "Municipality"` — Generate + auto-publish landing page via Claude API
- `add --batch "City1,City2,City3"` — Bulk generation
- `missing` — Show municipalities without landing pages, prioritized by population
- `audit` — SEO check per zone (content length, meta tags, coordinates, 3 languages)
- `publish <slug>` / `unpublish <slug>` — Toggle
- Auto-geocoding via API for lat/long coordinates
- Auto-publishes (unlike blog) — zones follow predictable template

### 4. `arafinestra seo` — SEO Monitoring
- `audit` — Full site audit (meta tags, H1, canonical, hreflang, schema per page)
- `broken-links` — Crawl all public pages, check internal + external link status
- `meta-check` — Verify meta tags across all pages
- `schema-check` — Validate schema.org JSON-LD
- `lighthouse [url]` — Core Web Vitals via Lighthouse CLI

### 5. `arafinestra pressupost` — PDF Quote Generator
- `generate` — Interactive or with flags (--client, --windows, --type)
- `list` — List generated quotes
- `send <id>` — Email PDF to client via backend Nodemailer
- Uses product pricing from DB, generates professional PDF (logo, CIF, desglose, IVA, garantía)
- Auto-creates lead in CRM if client doesn't exist

---

## Auth Flow
1. `arafinestra login` prompts for username/password
2. Calls `POST /api/auth/login`, stores session cookie in `~/.arafinestra/config.json`
3. All subsequent requests include the cookie
4. Token refreshed automatically on expiry

## AI Content Generation
- Provider: Claude API (Anthropic SDK)
- System prompt: business context, services, target zone (Girona + Maresme), Cortizo brand, SEO best practices
- Blog: generates title, content (1000-1500 words), excerpt, meta title/description, category — in CA/ES/EN
- Zones: generates zone description, local keywords, meta tags — in CA/ES/EN, auto-publishes

## Installation
```bash
# From monorepo
npm run cli -- leads list

# Global alias
alias arafinestra="node /path/to/cli/dist/index.js"
```
