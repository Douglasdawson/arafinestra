# Plan de fixes — Bug Hunt ARA FINESTRA (41 bugs)

> **Para Claude:** Ejecuta lote a lote. Cada lote = 1 commit atómico. Tras cada lote: verificar en local ANTES de commitear. No hacer `git push` hasta que Ivan diga `/ship`. Antes de cualquier `db:push` contra Neon, pasar `/db-sync` (las migraciones aquí son aditivas/de ensanchado, no destructivas — pero se confirma).

**Objetivo:** Corregir los 41 bugs confirmados por el bug hunt adversarial, priorizando captura de leads → seguridad → estabilidad → frontend → admin → SEO.

**Arquitectura:** React 18 + Vite frontend, Express 5 + Drizzle + Neon backend, i18n CA/ES/EN. No hay runner de tests unitarios (solo Playwright e2e en `e2e/`). Verificación = ejecución real en local (`npm run dev`, puerto canónico), `curl` de smoke, y flujos de navegador. TypeScript estricto: tras cada lote, `npx tsc --noEmit` debe pasar.

**Tech stack clave:** drizzle-orm 0.36, express-session, connect-pg-simple (ya instalado, sin usar), nodemailer, pdfkit, i18next.

---

## Reglas transversales (aplican a todos los lotes)

1. **Helper `escapeHtml` compartido** — se crea en el Lote 2 y lo reusan varios fixes. No duplicar.
2. **i18n**: cualquier clave nueva se añade a los **3** locales (ca/es/en) en `client/src/i18n/index.ts`. Nunca uno solo.
3. **camelCase**: Drizzle serializa las columnas en camelCase (`nombre_ca` → `nombreCa`). Todo acceso cliente debe usar camelCase. `localize()` ya lo maneja (bug refutado) — no tocarlo.
4. **Verificación TS**: `npx tsc --noEmit` verde antes de cada commit.
5. **Migraciones**: los cambios de schema (Lotes 1, 6) son aditivos o de ensanchado (`varchar(20)→varchar(50)`, columnas nuevas nullable). Ejecutar `/db-sync` y confirmar que `db:push` NO propone ningún `DROP`.

---

## LOTE 1 — Leads (el dinero) · bugs 1, 3, 34, 38 + parte de 31

**Por qué primero:** ahora mismo cada lead de calculadora llega sin configuración ni precio (bug 1), y un `origen` largo tumba el INSERT con 500 (bug 3). Es pérdida directa de dinero.

**Ficheros:**
- Modificar: `shared/schema.ts:20-22` (ensanchar varchar)
- Modificar: `server/routes/leads.ts:131-152, 173-186`
- Modificar: `server/lib/notify.ts:32-39` (labels reales — bug 31, se completa en Lote 2 con el escaping)
- Modificar: `client/src/pages/public/Calculator.tsx:437` (bug 38)

**Paso 1.1 — Ensanchar columnas (bug 3).** En `shared/schema.ts`:
```ts
tipoCliente: varchar("tipo_cliente", { length: 50 }).default("particular"),
origen: varchar("origen", { length: 50 }).default("formulario"),
estado: varchar("estado", { length: 50 }).default("nuevo"),
```

**Paso 1.2 — Persistir `presupuestoDatos` + validar (bugs 1, 3, 34).** En `server/routes/leads.ts`, reemplazar el bloque `POST /api/leads` (líneas 130-165) por:
```ts
try {
  const { nombre, email, telefono, localidad, tipoCliente, origen, notas, presupuestoDatos } = req.body;

  const sanitize = (v: unknown, max = 500): string | null => {
    if (typeof v !== "string" || !v.trim()) return null;
    return v.trim().slice(0, max);
  };

  // Allowlist de orígenes reales del frontend (mantener al añadir widgets)
  const ORIGENES = new Set(["presupuestador", "formulario", "popup", "blog_newsletter", "calculator_save", "home_inline", "visita_gratuita", "admin"]);
  const rawOrigen = sanitize(origen, 50);
  const origenValue = rawOrigen && ORIGENES.has(rawOrigen) ? rawOrigen : "formulario";

  // Acotar el jsonb de configuración
  let presupuesto: Record<string, unknown> | null = null;
  if (presupuestoDatos && typeof presupuestoDatos === "object" && !Array.isArray(presupuestoDatos)) {
    if (JSON.stringify(presupuestoDatos).length <= 10000) presupuesto = presupuestoDatos as Record<string, unknown>;
  }

  const values = {
    nombre: sanitize(nombre, 100),   // sin default todavía — validar después
    email: sanitize(email, 200),
    telefono: sanitize(telefono, 30),
    localidad: sanitize(localidad, 100),
    tipoCliente: sanitize(tipoCliente, 50) || "particular",
    origen: origenValue,
    notas: sanitize(notas, 2000),
    presupuestoDatos: presupuesto,
  };

  // Validar SOBRE valores saneados (bug 34): al menos un método de contacto real
  if (!values.nombre && !values.telefono && !values.email) {
    return res.status(400).json({ error: "Se requiere al menos nombre, teléfono o email." });
  }
  values.nombre = values.nombre || "Sin nombre";

  const [lead] = await db.insert(leads).values(values).returning();
  notifyNewLead({
    nombre: lead.nombre,
    email: lead.email,
    telefono: lead.telefono,
    localidad: lead.localidad,
    origen: lead.origen,
    mensaje: lead.notas,
    presupuestoDatos: lead.presupuestoDatos,   // ← se pasa el objeto, no un string
  }).catch(() => {});
  res.status(201).json(lead);
} catch (err) {
  console.error("Error creating lead:", err);
  res.status(500).json({ error: "Error al crear lead" });
}
```
Nota: el `if (isRateLimited)` de arriba se mantiene igual.

**Paso 1.3 — `notify.ts` acepta objeto + labels reales (bugs 1, 31).** Cambiar la firma de `notifyNewLead` para recibir `presupuestoDatos?: Record<string, unknown> | null` en vez de `configuracion?: string`, y construir el resumen HTML en servidor:
```ts
// firma: reemplazar `configuracion?: string | null;` por:
presupuestoDatos?: Record<string, unknown> | null;
```
Reemplazar el mapa `origenLabel` (líneas 32-38) por las claves reales:
```ts
const origenLabel: Record<string, string> = {
  presupuestador: "Calculadora de pressupost",
  formulario: "Formulari de contacte",
  popup: "Pop-up de sortida",
  blog_newsletter: "Newsletter del blog",
  calculator_save: "Desat de la calculadora",
  home_inline: "Formulari home",
  visita_gratuita: "Sol·licitud de visita gratuïta",
  admin: "Alta manual (admin)",
};
```
Construir `configResumen` desde `presupuestoDatos` (tipo, modelo, medidas, vidrio, cantidad, precio) y usarlo en la fila "Configuracio". El escaping HTML de todos los campos llega en el **Lote 2** (no dejar sin escapar; si se hace este lote sin el 2, aplicar ya un `escapeHtml` mínimo inline).

**Paso 1.4 — Save-progress no manda teléfono como nombre (bug 38).** En `Calculator.tsx:437`, en el body del guardado de progreso, quitar `nombre: telefono` (o poner `nombre: "Recuperación calculadora"`); el servidor pondrá "Sin nombre".

**Verificación Lote 1:**
1. `/db-sync` → confirmar que solo hay `ALTER ... TYPE varchar(50)`, ningún DROP. Aplicar.
2. `npm run dev` (skill `/dev`).
3. `curl -s -XPOST localhost:PUERTO/api/leads -H 'Content-Type: application/json' -d '{"telefono":"600","origen":"presupuestador","presupuestoDatos":{"tipo":"ventana","precioEstimado":{"low":1000,"high":1500}}}'` → 201, y en BD `presupuesto_datos` NO es NULL.
4. `curl ... -d '{"origen":"landing_promocio_primavera_2026"}'` (>20 chars) → NO 500 (crea lead con origen=formulario o 400 por falta de contacto).
5. `curl ... -d '{"nombre":"   "}'` → 400.
6. Navegador: completar la calculadora de punta a punta → el lead aparece en `/admin` con la config visible en el detalle.
7. `npx tsc --noEmit` verde.
8. Commit: `fix(leads): persist presupuestoDatos, widen varchar, validate sanitized input, real origen labels`

---

## LOTE 2 — Seguridad · bugs 7, 8, 9, 23, 16, 22, 35

**Ficheros:**
- Crear: `server/lib/escape.ts` (helper compartido)
- Modificar: `server/lib/notify.ts` (7), `server/routes/leads.ts:89-96` (8), `client/src/pages/public/BlogPost.tsx:89-108, 206` (9, 23), `server/lib/seo-inject.ts:529` (23), `server/index.ts:38-51` (16), `server/db.ts` (16), rutas GET públicas (22), PATCH/POST (35)

**Paso 2.1 — Helper de escaping.** Crear `server/lib/escape.ts`:
```ts
export function escapeHtml(s: string | null | undefined): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
// JSON-LD seguro: escapa el '<' para que un `</script>` no rompa el bloque
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}
```

**Paso 2.2 — Email sin inyección HTML (bug 7).** En `notify.ts`, importar `escapeHtml` y aplicarlo a **todas** las interpolaciones del HTML: `nombre`, `email`, `localidad`, `mensaje`, resumen de config. Para `telefono` en `href="tel:..."`, sanear a dígitos: `const telHref = (lead.telefono || "").replace(/[^\d+\s()-]/g, "")` y escapar el texto visible.

**Paso 2.3 — CSV injection (bug 8).** En `leads.ts`, ampliar `esc()` (líneas 90-94):
```ts
const esc = (v: string | null | undefined) => {
  if (!v) return "";
  let s = v;
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;   // neutraliza fórmulas
  s = s.replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
};
```

**Paso 2.4 — XSS en markdown del blog + JSON-LD (bugs 9, 23).** En `BlogPost.tsx`:
- `inlineFormat` (89-108): en los replaces de links/imágenes, escapar `"` y `&` de los grupos capturados antes de meterlos en atributos, y validar el esquema de URL (solo `https?:`, `/` relativo o `#`; si no, texto plano). Recomendado además: `DOMPurify` sobre el HTML final antes del `dangerouslySetInnerHTML`.
- Línea 206 (JSON-LD): usar `safeJsonLd(...)` en vez de `JSON.stringify`.
- Aplicar `safeJsonLd` también en `seo-inject.ts:529` y revisar `BreadcrumbSchema.tsx`/`FaqSchema.tsx` (grep `JSON.stringify` + `ld+json`).

**Paso 2.5 — Sesiones en Postgres + secret obligatorio (bug 16).** En `server/index.ts`, reemplazar el `session({...})`:
```ts
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db.js";   // ← exportar `pool` desde db.ts

const PgStore = connectPgSimple(session);
if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET no está definido en producción");
}
app.use(session({
  store: new PgStore({ pool, createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET || "ara-finestra-dev-secret-change-me",
  resave: false, saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true, maxAge: 24*60*60*1000, sameSite: "lax" },
  proxy: true,
}));
```
En `server/db.ts`: `export const pool = new Pool({ connectionString: process.env.DATABASE_URL });`. **Confirmar antes con Ivan que `SESSION_SECRET` está en los secrets de Replit** (bloqueo real: si no está, el deploy prod hará throw). connect-pg-simple crea la tabla `session` (creación, no destructivo).

**Paso 2.6 — Contenido no publicado no expuesto (bug 22).** En los 4 GET públicos (`blog.ts`, `testimonials.ts`, `zones.ts`, `portfolio.ts`): para no autenticados, forzar `eq(t.published, true)` tanto en listas como en lookups por slug/id. Las páginas admin que listan borradores deben usar `credentials: "include"` en sus fetch (revisar `Dashboard.tsx:61-62`, Portfolio/Testimonials/Zones/BlogList admin).

**Paso 2.7 — Mass assignment (bug 35).** En POST/PATCH de `blog.ts`, `products.ts`, `leads.ts`: strip de campos inmutables `const { id, createdAt, ...data } = req.body;` (se completa en Lote 5, bug 14, con la misma línea — aquí solo se deja anotado si se toca antes).

**Verificación Lote 2:**
1. `curl -XPOST /api/leads -d '{"telefono":"600","notas":"<a href=\"https://evil\">Confirmar pago</a>","nombre":"2<3m"}'` → inspeccionar el HTML del email (transport de test o log): texto literal, sin enlace activo, "2<3m" completo.
2. Crear lead `nombre:'=HYPERLINK("http://evil","x")'`, `GET /api/leads/export`, abrir CSV → celda de texto, no fórmula.
3. Post con `[x](javascript:alert(1))` y `![x" onerror=alert(1)](z)` → DOM sin `onerror` ni `href="javascript:`.
4. Login admin → reiniciar server → sesión sobrevive; `SELECT count(*) FROM session` crece con el login.
5. `curl /api/blog/<slug-borrador>` sin cookie → 404; listado admin sigue mostrando borradores.
6. Commit: `fix(security): escape email/CSV/markdown/JSON-LD, PG session store, hide unpublished content`

---

## LOTE 3 — Estabilidad server · bugs 4, 6, 24, 25, 32, 33, 41

**Ficheros:** `server/db.ts` (4), `server/index.ts:89` (6), `server/routes/pressupost.ts` (24), `server/routes/weather.ts` (25), 12 rutas `:id` (32), `server/routes/leads.ts:25` (33), `server/routes/config.ts` (41).

**Paso 3.1 — Pool con listener de error (bug 4).** En `db.ts`, tras crear el pool: `pool.on("error", (err) => console.error("[db] idle pool error:", err));`. Añadir en `index.ts` un `process.on("unhandledRejection", (e) => console.error("[unhandledRejection]", e));`.

**Paso 3.2 — Static no sirve `/` (bug 6).** En `index.ts:89`: `app.use(express.static(publicDir, { maxAge: "1h", index: false }));`. Con `index:false`, GET `/` cae al redirect de idioma (línea 118) y las rutas SPA al catch-all con meta + `no-cache`.

**Paso 3.3 — Helper `parseId` (bug 32).** Crear `server/lib/parseId.ts`:
```ts
export function parseId(raw: unknown): number | null {
  const n = Number.parseInt(String(raw), 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}
```
Aplicar en los 12 puntos (`products.ts:26`, `portfolio.ts:28,51,63`, `testimonials.ts:34,46`, `zones.ts:47,59`, `leads.ts:113,175,191`, `blog.ts:60,72`): `const id = parseId(req.params.id); if (id === null) return res.status(400).json({ error: "id inválido" });`.

**Paso 3.4 — Rate limiter `.unref()` (bug 33).** En `leads.ts:25-30`: `setInterval(...).unref();`.

**Paso 3.5 — Config upsert atómico (bug 41).** En `config.ts`, sustituir findFirst+insert/update por `db.insert(siteConfig).values({...}).onConflictDoUpdate({ target: siteConfig.key, set: { valueCa, valueEs, valueEn } }).returning();`.

**Paso 3.6 — Weather robusto (bug 25).** En `weather.ts`: `fetch(url, { signal: AbortSignal.timeout(5000) })`; dedup en vuelo con `let inflight: Promise<any> | null`; cachear también el fallback 5 min.

**Paso 3.7 — Generador PDF (bug 24).** Refactor en `pressupost.ts`:
1. Insertar el lead ANTES de generar el PDF (`await db.insert(leads).returning()`); si falla, 500 sin PDF.
2. Número derivado del id: `P-${year}-${String(lead.id).padStart(4,"0")}`; UPDATE de `presupuestoDatos` tras calcular.
3. Consultas: cap `items.length <= 100` (400 si no), validar `Number.isFinite(width/height) && > 0`, deduplicar tipos y hacer **una** query con `or(...types.map(t => like(...)))` + Map tipo→producto (elimina N+1).
4. Truthiness: `if (matchingProduct[0].precioBase != null)` (ídem `precioPorM2`) — un `precioBase=0` deja de ignorarse.
5. Footer: eliminar el `if (yPos > 700)` muerto (línea ~202); página extra solo si el contenido real supera ~700.

**Verificación Lote 3:**
1. `curl -sI localhost:PUERTO/` (con `NODE_ENV=production` en un build local) → `302 Location: /ca/`.
2. `curl /api/products/abc` → 400, no 500 ni error de Postgres en logs.
3. PDF: 1 item → 1 página con términos al pie + lead en CRM; 2 seguidos → números distintos; `width:"abc"` → 400; producto `precioBase=0` → subtotal sin 200 € espurios; abortar descarga → el lead existe.
4. Weather apuntado a host caído → responde ~5 s con `fallback:true`; 2ª petición no abre otra conexión.
5. Dos PUT concurrentes a `/api/config` sobre key nueva → ambos 200, una sola fila.
6. Commit: `fix(server): pool error listener, static index:false, PDF ordering, weather timeout, parseId guards, atomic config upsert`

---

## LOTE 4 — Frontend público · bugs 10, 11, 12, 13, 18, 19, 39

**Ficheros:** `Calculator.tsx` (10, 11, 19), `Result.tsx` (10, 39), `BlogPost.tsx` (12), `Zone.tsx` (13), `SocialProofToast.tsx` (18).

**Paso 4.1 — Restaurar estado de la calculadora (bug 10).** En `Calculator.tsx`, inicializador lazy del reducer con validación de shape:
```ts
useReducer(reducer, INITIAL_STATE, (init) => {
  try {
    const raw = localStorage.getItem(CALC_STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s && typeof s.step === "number" && s.step >= 2 && s.step <= 7 && s.tipo) return { ...init, ...s };
    }
  } catch {}
  return init;
});
```
Envolver el `setItem` del efecto de persistencia en try/catch (Safari con storage bloqueado). En `Result.tsx`, tras submit OK: `localStorage.removeItem(CALC_STORAGE_KEY)`.

**Paso 4.2 — popstate sin bucle (bug 11).** Reescribir el efecto de historial (`Calculator.tsx:141-152`): efecto de montaje único (`[]`) con **un solo** `pushState` centinela; step actual desde un `stepRef`. En `handlePop`: si `stepRef.current > 1`, dispatch atrás + reponer centinela; en paso 1, no reponer (dejar salir). Probar en Chrome + Safari iOS.

**Paso 4.3 — SET_TIPO resetea modelo/extras (bug 19).** En `Calculator.tsx:60`:
```ts
case "SET_TIPO":
  if (action.tipo === state.tipo) return { ...state, step: 2 };
  return { ...state, tipo: action.tipo, modelo: "", modeloId: null, extras: [], step: 2 };
```

**Paso 4.4 — BlogPost camelCase + related (bug 12).** En `BlogPost.tsx`: todos los accesos a camelCase (`post.imagenPortada`, `post.publishedAt`, `post.createdAt`, `rp.imagenPortada`). Related posts: fetch a `/api/blog?published=true&limit=6` leyendo `data.data`. Grep `_ca|_es|_en|_at|_portada` para no dejar ninguno snake_case.

**Paso 4.5 — Zone.tsx camelCase + carrera (bug 13).** camelCase (`data.nombreCa`, `p.fotosAntes/fotosDespues`); guard `let cancelled=false` con cleanup en el efecto (cubre fetches anidados de portfolio/testimonios); resetear `setNotFound(false)` y `setZone(null)` al inicio del efecto.

**Paso 4.6 — SocialProofToast no reaparece tras cerrar (bug 18).** Estado `dismissed` (persistido en sessionStorage); `handleDismiss` → `setDismissed(true)`; el efecto de re-scheduling añade `if (dismissed) return;` y `dismissed` a deps.

**Paso 4.7 — Coste diario duplicado (bug 39).** En `Result.tsx:209-214`, dejar el importe una sola vez (quitar el span en negrita redundante; no tocar los 3 locales).

**Verificación Lote 4:**
1. Calculadora: llegar al paso 5, recargar → reabre en paso 5 con config intacta; completar + enviar → banner de recuperación no reaparece en Home.
2. Avanzar a paso 4, atrás ×3 → baja a paso 1; atrás otra vez → sale de `/pressupost`. `history.length` no crece por step (Playwright/Chrome + Safari móvil).
3. Ventana→modelo→extra; volver a paso 1, elegir persiana → paso 2 exige modelo, precio sin extra fantasma.
4. Post publicado con imagen y fecha → hero, fecha y "relacionados" renderizan; Network: related pide `published=true&limit=6`.
5. Navegar rápido Girona→Blanes con throttling → URL Blanes muestra Blanes.
6. Toast: aparece (20 s), cerrar, esperar 40 s → no reaparece.
7. `npx tsc --noEmit` verde. Commit: `fix(frontend): calculator restore/history/reset, blog+zone camelCase & race, toast dismiss, dup cost`

---

## LOTE 5 — Admin · bugs 14, 15, 17, 26, 27, 40

**Ficheros:** `portfolio.ts`, `testimonials.ts`, `blog.ts`, `leads.ts` (14), `Dashboard.tsx` (15), `BlogEditor.tsx` + `blog.ts` (17), `Leads.tsx` + `leads.ts` (26), `seo-audit.ts` + `SeoAudit.tsx` (27), `Pressupostos.tsx` (40).

**Paso 5.1 — PATCH no revienta con createdAt (bug 14 + cierra 35).** En cada PATCH (`portfolio.ts:52`, `testimonials.ts:35`, `blog.ts:61`, `leads.ts:178`): `const { id, createdAt, ...data } = req.body;` antes del `.set(...)`; devolver 400 si `Object.keys(data).length === 0`.

**Paso 5.2 — Dashboard KPIs (bug 15).** En `Dashboard.tsx:66-104`: leer forma paginada (`payload.data ?? []`, `payload.total ?? 0`), usar `total` del servidor. Para métricas por fecha/estado: ampliar `/api/leads/stats` con conteos por rango en SQL (preferido) o `limit=100`. Añadir `credentials:"include"` a los fetch admin (ya requerido por bug 22).

**Paso 5.3 — Editar posts antiguos (bug 17).** Nuevo `GET /api/blog/id/:id` (requireAuth), **registrado antes** de `/api/blog/:slug`; el editor lo usa; toast + volver a la lista si 404. Tras el POST de creación: `setPost(created)` antes de `navigate` (evita `post.id` undefined).

**Paso 5.4 — Búsqueda CRM (bug 26).** Cliente `Leads.tsx:54-66`: debounce 300 ms (`debouncedSearch`), `AbortController` en `fetchLeads` con cleanup, `if (!res.ok) return;` antes de `setLeads`. Servidor `leads.ts:47`: `ilike` en vez de `like`.

**Paso 5.5 — Auditoría SEO (bug 27).** `seo-audit.ts`: añadir `"preus"` a STATIC_PATHS (comentar que espeja `sitemap.ts`); en `auditPage` capturar `res.status`, si `!res.ok` devolver `{ path, status, error:true, score:0 }`. Unificar el contrato con `SeoAudit.tsx` (renderizar `page.path`, `summary.avgScore`, key estable, badge "inaccesible").

**Paso 5.6 — Toast admin presupuestos (bug 40).** `Pressupostos.tsx:48`: guardar el timeout en `useRef`, `clearTimeout` al inicio de `showToast`.

**Verificación Lote 5:**
1. Editar título de un proyecto de portfolio existente → 200 y persiste; PATCH `{}` → 400.
2. Con ≥1 lead, abrir `/admin` → "Total leads" > 0 y "Leads hoy" correcto tras crear uno.
3. Con 21+ posts, editar el más antiguo → carga con contenido y guarda 200.
4. Teclear "constructora" rápido → una sola request final; buscar "garcia" con lead "García" → aparece (ilike).
5. `/admin/seo` → tabla con 22 rutas (incl. `preus`) y score global numérico.
6. Dos toasts seguidos en presupuestos → el 2º dura sus 4 s.
7. Commit: `fix(admin): PATCH immutable strip, dashboard KPIs, edit old posts, CRM search debounce+ilike, SEO audit, toast timer`

---

## LOTE 6 — SEO · bugs 5, 20, 21, 28, 29, 30, 36, 37

**Ficheros:** `analytics.ts` (5), `blog.ts` (20), `sitemap.ts` + validación slug (21), `portfolio.ts` + `schema.ts` + `ServicePage.tsx` (28), `seo-inject.ts` (29, 30), `ai.ts` (36), `zones.ts` (37).

**Paso 6.1 — GA4 vivo (bug 5).** En `analytics.ts:13-18`:
```ts
(window as any).dataLayer = (window as any).dataLayer || [];
function gtag(){ (window as any).dataLayer.push(arguments); }   // arguments, NO array
(window as any).gtag = gtag;                                    // ← faltaba
gtag("js", new Date());
gtag("config", GA_ID);
```

**Paso 6.2 — publishedAt (bug 20).** `blog.ts` POST: si `published===true` y sin `publishedAt`, `publishedAt: new Date()`. PATCH: en transición `false→true` con `publishedAt` null, setear `new Date()`. Backfill one-shot: `UPDATE blog_posts SET published_at = created_at WHERE published = true AND published_at IS NULL`.

**Paso 6.3 — sitemap.xml (bug 21).** Envolver todos los `href` de alternates con `escapeXml(...)` (helper existente, línea 36). Validar slug en servidor al crear/editar blog y zonas: `/^[a-z0-9-]+$/` → 400. `BUILD_DATE`: para zonas añadir columna `updatedAt timestamp defaultNow()` (aditiva) y usarla; para estáticas, quitar `<lastmod>` (preferible a mentir).

**Paso 6.4 — Portfolio por tipo (bug 28).** Añadir columna `tipoServicio varchar(20)` a `portfolio` (aditiva, nullable) + campo en el admin de Portfolio + filtro `eq` en `portfolio.ts:11`. Fallback en `ServicePage.tsx`: si el filtro devuelve 0, mostrar destacados generales.

**Paso 6.5 — injectMeta replace seguro (bug 29).** En `seo-inject.ts:467-469, 534`, usar función de reemplazo (`() => ...`) para que `$$`/`$&`/`$'` no corrompan el HTML.

**Paso 6.6 — dateModified coherente (bug 30).** `seo-inject.ts:367`: `updatedAt: post.publishedAt || post.createdAt` (igual que `modifiedTime` de la línea 357).

**Paso 6.7 — Geocoding Maresme (bug 36).** `ai.ts:173`: Nominatim con `{municipio}, Catalonia, Spain` + `countrycodes=es&limit=1`, sin hardcodear "Girona".

**Paso 6.8 — /api/zones ligero (bug 37).** Parámetro `?fields=list` que selecciona solo `slug, nombreCa/Es/En, published` + `Cache-Control: public, max-age=300`. Consumidores `ServicePage.tsx:211`, `ZonesList.tsx:27`.

**Verificación Lote 6:**
1. Local con `VITE_GA4_ID` dummy: aceptar cookies, enviar contacto → `browser_evaluate`: `window.gtag` existe y `dataLayer` tiene la entrada `event`.
2. Crear borrador, publicarlo → `published_at` no nulo; JSON-LD con `datePublished`.
3. Crear zona con slug `a&b` → 400; `curl /sitemap.xml | xmllint --noout -` pasa.
4. Clasificar 2 proyectos como `persiana` → la página de persianes muestra solo esos.
5. Meta description con `Ofertes $$ Setmana Santa` → HTML servido con `$$` literal.
6. Rich Results Test de un post publicado-tras-creado → sin warning de fechas.
7. `/api/zones?fields=list` < 5 KB. Commit: `fix(seo): activate GA4, publishedAt, sitemap escaping+slug validation, portfolio by type, JSON-LD dates, geocoding, zones payload`

---

## Cierre

- Tras cada lote: `npx tsc --noEmit` + verificación del lote + commit atómico. **No push** hasta `/ship`.
- Migraciones de schema (Lotes 1, 6): siempre `/db-sync` antes de `db:push` contra Neon prod.
- **Bloqueo real a confirmar con Ivan antes del Lote 2:** que `SESSION_SECRET` esté en los secrets de Replit (si no, el throw en prod tumba el deploy).
- Bugs refutados (NO tocar): `localize.ts:12` (funciona), `BlogEditor.tsx:6` (usa `defaultValue`) — aunque el mismatch de vocabulario de categorías (editor guarda "Ventanas", i18n espera minúsculas catalanas) es un bug de contenido real de baja prioridad, opcional para un lote futuro.
