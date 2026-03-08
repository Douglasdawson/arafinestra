# Conversion Triggers Enhancement — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the 4 weakest psychological conversion triggers (loss aversion, authority, anchoring, FOMO) plus add calculator abandonment recovery, future-self visualization, decoy nudges, and WhatsApp quote sharing.

**Architecture:** All changes are frontend components + i18n strings. One new localStorage persistence for calculator state. No backend changes needed (weather API already exists).

**Tech Stack:** React 18, TypeScript, Tailwind CSS, i18next, existing `/api/weather` endpoint.

---

## Task 1: GuaranteeBlock — Triple guarantee risk reversal

**Files:**
- Create: `client/src/components/ui/GuaranteeBlock.tsx`
- Modify: `client/src/i18n/ca.json`
- Modify: `client/src/i18n/es.json`
- Modify: `client/src/i18n/en.json`
- Modify: `client/src/pages/public/Home.tsx`
- Modify: `client/src/components/calculator/Result.tsx`
- Modify: `client/src/pages/public/FreeVisit.tsx`

**Step 1: Add i18n keys (all 3 languages)**

In `ca.json`, add after `"cta_microcopy"`:
```json
"guarantee": {
  "title": "La nostra triple garantia",
  "price_title": "Preu tancat",
  "price_desc": "El pressupost és el preu final. Sense sorpreses, sense costos ocults.",
  "clean_title": "Instal·lació impecable",
  "clean_desc": "Deixem casa teva més neta que com l'hem trobat. Si no, tornem gratis.",
  "satisfaction_title": "Satisfacció 100%",
  "satisfaction_desc": "Si no estàs content amb el resultat, ho solucionem sense cost addicional."
}
```

In `es.json`:
```json
"guarantee": {
  "title": "Nuestra triple garantía",
  "price_title": "Precio cerrado",
  "price_desc": "El presupuesto es el precio final. Sin sorpresas, sin costes ocultos.",
  "clean_title": "Instalación impecable",
  "clean_desc": "Dejamos tu casa más limpia de lo que la encontramos. Si no, volvemos gratis.",
  "satisfaction_title": "Satisfacción 100%",
  "satisfaction_desc": "Si no estás contento con el resultado, lo solucionamos sin coste adicional."
}
```

In `en.json`:
```json
"guarantee": {
  "title": "Our triple guarantee",
  "price_title": "Fixed price",
  "price_desc": "The quote is the final price. No surprises, no hidden costs.",
  "clean_title": "Spotless installation",
  "clean_desc": "We leave your home cleaner than we found it. If not, we come back for free.",
  "satisfaction_title": "100% satisfaction",
  "satisfaction_desc": "If you're not happy with the result, we fix it at no extra cost."
}
```

**Step 2: Create `GuaranteeBlock.tsx`**

```tsx
import { useTranslation } from "react-i18next";

interface Props {
  variant?: "light" | "dark";
  compact?: boolean;
}

export default function GuaranteeBlock({ variant = "light", compact = false }: Props) {
  const { t } = useTranslation();

  const items = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      title: t("guarantee.price_title"),
      desc: t("guarantee.price_desc"),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      ),
      title: t("guarantee.clean_title"),
      desc: t("guarantee.clean_desc"),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: t("guarantee.satisfaction_title"),
      desc: t("guarantee.satisfaction_desc"),
    },
  ];

  const isDark = variant === "dark";

  if (compact) {
    return (
      <div className={`flex flex-wrap justify-center gap-4 sm:gap-6 ${isDark ? "text-white/80" : "text-slate-600"}`}>
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className={isDark ? "text-brand-light" : "text-brand"}>{item.icon}</div>
            <span className="font-medium">{item.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className={`text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 ${isDark ? "text-white" : "text-navy-900"}`}>
        {t("guarantee.title")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            className={`text-center p-5 sm:p-6 rounded-2xl border ${
              isDark
                ? "bg-navy-800/50 border-navy-700/50"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
              isDark ? "bg-brand/20 text-brand-light" : "bg-brand-light text-brand"
            }`}>
              {item.icon}
            </div>
            <h4 className={`font-bold mb-1.5 ${isDark ? "text-white" : "text-navy-900"}`}>{item.title}</h4>
            <p className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Step 3: Add GuaranteeBlock to Home.tsx**

Insert between the Final CTA section and `<InlineLeadForm>` (after line 1449 in current file):

```tsx
import GuaranteeBlock from "../components/ui/GuaranteeBlock";

// In JSX, before <InlineLeadForm t={t} />:
{/* Triple Guarantee */}
<section className="py-16 sm:py-20 bg-slate-50">
  <div className="px-6">
    <GuaranteeBlock />
  </div>
</section>
```

**Step 4: Add compact GuaranteeBlock to Result.tsx**

Insert after the warranty note div (after line 184) in Result.tsx:

```tsx
import GuaranteeBlock from "./../../components/ui/GuaranteeBlock";

// After warranty note, before action buttons:
<div className="mt-4">
  <GuaranteeBlock compact />
</div>
```

**Step 5: Add GuaranteeBlock to FreeVisit.tsx**

Add before the FAQ section — as a compact version inside the existing trust sidebar or as a standalone section before FAQs.

**Step 6: Commit**

```bash
git add client/src/components/ui/GuaranteeBlock.tsx client/src/i18n/*.json client/src/pages/public/Home.tsx client/src/components/calculator/Result.tsx client/src/pages/public/FreeVisit.tsx
git commit -m "feat: add triple guarantee risk reversal (GuaranteeBlock)"
```

---

## Task 2: FutureSelfSection — Emotional visualization

**Files:**
- Modify: `client/src/pages/public/Home.tsx` (add new section component)
- Modify: `client/src/i18n/ca.json`
- Modify: `client/src/i18n/es.json`
- Modify: `client/src/i18n/en.json`

**Step 1: Add i18n keys**

In `ca.json`:
```json
"future_self": {
  "title": "Imagina't...",
  "item1": "Despertar-te un diumenge sense sentir el trànsit del carrer",
  "item2": "Que la teva factura de llum baixi un 40% sense fer res",
  "item3": "Obrir la finestra amb un dit, sense fer força",
  "item4": "No tornar a pintar ni mantenir les finestres mai més"
}
```

In `es.json`:
```json
"future_self": {
  "title": "Imagínate...",
  "item1": "Despertarte un domingo sin oír el tráfico de la calle",
  "item2": "Que tu factura de luz baje un 40% sin hacer nada",
  "item3": "Abrir la ventana con un dedo, sin hacer fuerza",
  "item4": "No volver a pintar ni mantener las ventanas nunca más"
}
```

In `en.json`:
```json
"future_self": {
  "title": "Imagine...",
  "item1": "Waking up on Sunday without hearing street traffic",
  "item2": "Your electricity bill dropping 40% without lifting a finger",
  "item3": "Opening your window with one finger, no effort",
  "item4": "Never painting or maintaining your windows again"
}
```

**Step 2: Add FutureSelfSection component inside Home.tsx**

Add after `EnergySavings` and before the Services Grid section. Define as an inline function component in Home.tsx (consistent with existing patterns):

```tsx
function FutureSelfSection({ t }: { t: (k: string) => string }) {
  const items = [
    t("future_self.item1"),
    t("future_self.item2"),
    t("future_self.item3"),
    t("future_self.item4"),
  ];

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-5xl font-bold text-navy-900 tracking-tight">
            {t("future_self.title")}
          </h2>
        </ScrollReveal>
        <div className="mt-10 sm:mt-14 space-y-6 sm:space-y-8">
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.12}>
              <p className="text-xl sm:text-2xl text-slate-700 font-light leading-relaxed">
                {item}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Insert into Home JSX**

After `<EnergySavings t={t} prefix={prefix} />` and before the Services Grid section:

```tsx
<FutureSelfSection t={t} />
```

**Step 4: Commit**

```bash
git add client/src/pages/public/Home.tsx client/src/i18n/*.json
git commit -m "feat: add FutureSelf emotional visualization section on Home"
```

---

## Task 3: EnergyLossWidget — Real-time loss aversion with live temperature

**Files:**
- Create: `client/src/components/ui/EnergyLossWidget.tsx`
- Modify: `client/src/i18n/ca.json`
- Modify: `client/src/i18n/es.json`
- Modify: `client/src/i18n/en.json`
- Modify: `client/src/pages/public/Home.tsx`

**Step 1: Add i18n keys**

In `ca.json`:
```json
"energy_loss": {
  "prefix": "Ara fa",
  "at": "a Girona.",
  "losing": "Amb finestres antigues, la teva llar perd",
  "today": "avui",
  "in_heating": "en calefacció innecessària.",
  "each_day": "Cada dia que passes amb finestres antigues, pagues de més.",
  "cta": "Calcula el teu estalvi real"
}
```

In `es.json`:
```json
"energy_loss": {
  "prefix": "Ahora hace",
  "at": "en Girona.",
  "losing": "Con ventanas antiguas, tu hogar pierde",
  "today": "hoy",
  "in_heating": "en calefacción innecesaria.",
  "each_day": "Cada día que pasas con ventanas antiguas, pagas de más.",
  "cta": "Calcula tu ahorro real"
}
```

In `en.json`:
```json
"energy_loss": {
  "prefix": "Right now it's",
  "at": "in Girona.",
  "losing": "With old windows, your home is losing",
  "today": "today",
  "in_heating": "in unnecessary heating.",
  "each_day": "Every day with old windows, you're overpaying.",
  "cta": "Calculate your real savings"
}
```

**Step 2: Create `EnergyLossWidget.tsx`**

```tsx
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

export default function EnergyLossWidget() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || "ca";
  const [temp, setTemp] = useState<number | null>(null);
  const [lossToday, setLossToday] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((data) => {
        if (data?.temperature != null) setTemp(Math.round(data.temperature));
      })
      .catch(() => {});
  }, []);

  // Calculate hourly loss based on temperature difference
  // Below 18°C, old aluminum windows lose ~€0.10-0.15/hour per degree below 18
  const hourlyLoss = temp !== null && temp < 18 ? (18 - temp) * 0.012 : 0;

  // Animate the daily loss counter incrementing
  useEffect(() => {
    if (hourlyLoss <= 0) return;

    // Start with estimated loss so far today (hours elapsed × hourly rate)
    const hoursElapsed = new Date().getHours() + new Date().getMinutes() / 60;
    setLossToday(hoursElapsed * hourlyLoss);

    // Increment every 3 seconds by a small amount (hourly rate / 1200)
    const increment = hourlyLoss / 1200;
    intervalRef.current = setInterval(() => {
      setLossToday((prev) => prev + increment);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hourlyLoss]);

  // Don't render if warm weather (no loss to show)
  if (temp === null || temp >= 18) return null;

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/60 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="text-center space-y-3">
        <p className="text-slate-600">
          {t("energy_loss.prefix")}{" "}
          <span className="text-2xl font-bold text-navy-900">{temp}°C</span>{" "}
          {t("energy_loss.at")}
        </p>
        <p className="text-slate-700">
          {t("energy_loss.losing")}{" "}
          <span className="text-3xl sm:text-4xl font-bold text-red-600 tabular-nums">
            {lossToday.toFixed(2)}€
          </span>{" "}
          {t("energy_loss.today")}
        </p>
        <p className="text-sm text-slate-500">{t("energy_loss.in_heating")}</p>
        <p className="text-sm font-medium text-red-700 mt-2">{t("energy_loss.each_day")}</p>
        <Link
          to={`/${prefix}/pressupost`}
          className="inline-block mt-4 px-6 py-3 bg-brand hover:bg-brand-dark text-white font-semibold rounded-lg transition-colors shadow-md"
        >
          {t("energy_loss.cta")}
        </Link>
      </div>
    </div>
  );
}
```

**Step 3: Add to Home.tsx**

Insert after `<EnergySavings>` section and before `<FutureSelfSection>`:

```tsx
import EnergyLossWidget from "../components/ui/EnergyLossWidget";

// In JSX:
<section className="py-12 sm:py-16 bg-slate-50">
  <div className="px-6">
    <EnergyLossWidget />
  </div>
</section>
```

**Step 4: Commit**

```bash
git add client/src/components/ui/EnergyLossWidget.tsx client/src/i18n/*.json client/src/pages/public/Home.tsx
git commit -m "feat: add real-time energy loss widget with live temperature"
```

---

## Task 4: Calculator anchoring — Daily cost, ROI, financing

**Files:**
- Modify: `client/src/components/calculator/Result.tsx`
- Modify: `client/src/i18n/ca.json`
- Modify: `client/src/i18n/es.json`
- Modify: `client/src/i18n/en.json`

**Step 1: Add i18n keys**

In `ca.json`:
```json
"calculator_anchoring": {
  "daily_cost": "{{amount}}/dia durant 10 anys. Menys que un cafè.",
  "roi_title": "Retorn de la inversió",
  "roi_saving": "Estalvi energètic estimat: {{amount}}/any",
  "roi_payback": "La inversió es recupera en {{years}} anys",
  "roi_lifespan": "Les finestres duren 50+ anys",
  "financing": "O des de {{amount}}/mes amb finançament 0%",
  "financing_link": "Veure opcions de finançament"
}
```

In `es.json`:
```json
"calculator_anchoring": {
  "daily_cost": "{{amount}}/día durante 10 años. Menos que un café.",
  "roi_title": "Retorno de la inversión",
  "roi_saving": "Ahorro energético estimado: {{amount}}/año",
  "roi_payback": "La inversión se recupera en {{years}} años",
  "roi_lifespan": "Las ventanas duran 50+ años",
  "financing": "O desde {{amount}}/mes con financiación 0%",
  "financing_link": "Ver opciones de financiación"
}
```

In `en.json`:
```json
"calculator_anchoring": {
  "daily_cost": "{{amount}}/day for 10 years. Less than a coffee.",
  "roi_title": "Return on investment",
  "roi_saving": "Estimated energy savings: {{amount}}/year",
  "roi_payback": "Investment pays for itself in {{years}} years",
  "roi_lifespan": "Windows last 50+ years",
  "financing": "Or from {{amount}}/month with 0% financing",
  "financing_link": "See financing options"
}
```

**Step 2: Add anchoring section to Result.tsx**

Insert after the price display div (after line 161, the closing `</div>` of the gradient price box) and before the urgency message:

```tsx
{/* Anchoring: daily cost + ROI + financing */}
<div className="mt-6 space-y-3 text-center">
  {/* Daily cost reframe */}
  <p className="text-lg text-slate-700">
    <span className="font-bold text-navy-900">
      {(low / 3650).toFixed(2)}€
    </span>
    {" "}{t("calculator_anchoring.daily_cost", { amount: `${(low / 3650).toFixed(2)}€` })}
  </p>

  {/* ROI calculation */}
  <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-4 space-y-2">
    <p className="text-sm font-semibold text-emerald-800">{t("calculator_anchoring.roi_title")}</p>
    <p className="text-sm text-emerald-700">
      {t("calculator_anchoring.roi_saving", { amount: `${Math.round(low * 0.15)}€` })}
    </p>
    {/* ROI progress bar */}
    <div className="relative h-2 bg-emerald-200 rounded-full overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full bg-emerald-500 rounded-full transition-all duration-1000"
        style={{ width: `${Math.min(100, (1 / Math.ceil(low / (low * 0.15))) * 100)}%` }}
      />
    </div>
    <p className="text-sm font-medium text-emerald-800">
      {t("calculator_anchoring.roi_payback", { years: Math.ceil(low / (low * 0.15)) })}
      {" · "}{t("calculator_anchoring.roi_lifespan")}
    </p>
  </div>

  {/* Financing option */}
  <p className="text-base text-slate-600">
    {t("calculator_anchoring.financing", { amount: `${Math.round(low / 36)}€` })}
  </p>
</div>
```

Note: `low * 0.15` estimates annual energy savings at 15% of window cost. `low / 36` gives a 36-month financing estimate.

**Step 3: Commit**

```bash
git add client/src/components/calculator/Result.tsx client/src/i18n/*.json
git commit -m "feat: add daily cost, ROI, and financing anchoring to calculator result"
```

---

## Task 5: Calculator abandonment recovery (Zeigarnik effect)

**Files:**
- Create: `client/src/components/ui/CalculatorRecoveryBanner.tsx`
- Modify: `client/src/pages/public/Calculator.tsx`
- Modify: `client/src/pages/public/Home.tsx`
- Modify: `client/src/i18n/ca.json`
- Modify: `client/src/i18n/es.json`
- Modify: `client/src/i18n/en.json`

**Step 1: Add i18n keys**

In `ca.json`:
```json
"calculator_recovery": {
  "title": "Tens un pressupost a mig fer",
  "resume": "Continuar",
  "dismiss": "Començar de nou"
}
```

In `es.json`:
```json
"calculator_recovery": {
  "title": "Tienes un presupuesto a medio hacer",
  "resume": "Continuar",
  "dismiss": "Empezar de nuevo"
}
```

In `en.json`:
```json
"calculator_recovery": {
  "title": "You have an unfinished quote",
  "resume": "Continue",
  "dismiss": "Start over"
}
```

**Step 2: Add localStorage persistence to Calculator.tsx**

In the Calculator component, after the `useReducer` call, add:

```tsx
const STORAGE_KEY = "arafinestra_calculator_state";

// Save state to localStorage on every change (except step 0 / result)
useEffect(() => {
  if (state.step >= 1 && state.step <= 7) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}, [state]);

// Clear saved state when result is shown (lead captured or reset)
// Add to the existing onReset handler:
const handleReset = () => {
  localStorage.removeItem(STORAGE_KEY);
  dispatch({ type: "RESET" });
};
```

Also clear localStorage when the form is submitted successfully in Result.tsx (pass a callback or clear directly).

**Step 3: Create `CalculatorRecoveryBanner.tsx`**

```tsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "react-router-dom";

const STORAGE_KEY = "arafinestra_calculator_state";

export default function CalculatorRecoveryBanner() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang?: string }>();
  const prefix = lang || "ca";
  const location = useLocation();
  const [savedState, setSavedState] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.step >= 2 && parsed?.tipo) {
          setSavedState(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Don't show on calculator page itself, admin, or if dismissed
  if (!savedState || dismissed) return null;
  if (location.pathname.includes("/pressupost") || location.pathname.includes("/admin")) return null;

  const summary = [
    savedState.tipo,
    savedState.ancho && savedState.alto ? `${savedState.ancho}x${savedState.alto}cm` : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-[46] max-w-sm animate-slideInToast">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4 space-y-3">
        <p className="text-sm font-semibold text-navy-900">{t("calculator_recovery.title")}</p>
        {summary && <p className="text-xs text-slate-500">{summary}</p>}
        <div className="flex gap-2">
          <Link
            to={`/${prefix}/pressupost`}
            className="flex-1 text-center px-3 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition-colors"
          >
            {t("calculator_recovery.resume")}
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setDismissed(true);
            }}
            className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700"
          >
            {t("calculator_recovery.dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 4: Add to Home.tsx (and optionally PublicLayout)**

Import and render `<CalculatorRecoveryBanner />` inside Home.tsx at the bottom of JSX (after `<InlineLeadForm>`). Alternatively, add it to PublicLayout so it shows on all public pages.

**Step 5: Commit**

```bash
git add client/src/components/ui/CalculatorRecoveryBanner.tsx client/src/pages/public/Calculator.tsx client/src/pages/public/Home.tsx client/src/i18n/*.json
git commit -m "feat: add calculator abandonment recovery with localStorage persistence"
```

---

## Task 6: Decoy effect + "Més popular" badge in StepGlass

**Files:**
- Modify: `client/src/components/calculator/StepGlass.tsx`
- Modify: `client/src/i18n/ca.json`
- Modify: `client/src/i18n/es.json`
- Modify: `client/src/i18n/en.json`

**Step 1: Add i18n keys**

In `ca.json`:
```json
"calculator_badge_popular": "Més popular",
"calculator_badge_best_value": "Millor relació qualitat-preu"
```

In `es.json`:
```json
"calculator_badge_popular": "Más popular",
"calculator_badge_best_value": "Mejor relación calidad-precio"
```

In `en.json`:
```json
"calculator_badge_popular": "Most popular",
"calculator_badge_best_value": "Best value for money"
```

**Step 2: Modify StepGlass.tsx**

Update the `GLASS_TYPES` array to include a `recommended` flag:

```tsx
const GLASS_TYPES = [
  { id: "doble", stars: 3, recommended: false },
  { id: "baix_emissiu", stars: 4, recommended: true },
  { id: "triple", stars: 5, recommended: false },
];
```

Add the "Més popular" badge to the recommended option. Inside the button, before the glass icon div, add:

```tsx
{g.recommended && (
  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-brand text-white text-xs font-bold rounded-full whitespace-nowrap shadow-sm">
    {t("calculator_badge_popular")}
  </div>
)}
```

Also add a subtle ring/scale to make the recommended option stand out even when not selected:

```tsx
className={`relative p-4 sm:p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
  isSelected
    ? "border-brand bg-brand-light shadow-md"
    : g.recommended
    ? "border-brand/40 bg-brand-light/30 hover:border-brand/60 ring-1 ring-brand/20"
    : "border-gray-200 bg-white hover:border-gray-300"
}`}
```

**Step 3: Commit**

```bash
git add client/src/components/calculator/StepGlass.tsx client/src/i18n/*.json
git commit -m "feat: add decoy effect and 'Most popular' badge to glass step"
```

---

## Task 7: Authority — Specific stats + Cortizo Official badge in TrustBar

**Files:**
- Modify: `client/src/components/ui/TrustBar.tsx`
- Modify: `client/src/i18n/ca.json`
- Modify: `client/src/i18n/es.json`
- Modify: `client/src/i18n/en.json`

**Step 1: Update i18n trust_bar keys**

In `ca.json`, replace `trust_bar`:
```json
"trust_bar": {
  "cortizo": "Cortizo Oficial",
  "warranty": "10 anys garantia",
  "projects": "427 instal·lacions",
  "response": "Resposta 24h"
}
```

In `es.json`:
```json
"trust_bar": {
  "cortizo": "Cortizo Oficial",
  "warranty": "10 años garantía",
  "projects": "427 instalaciones",
  "response": "Respuesta 24h"
}
```

In `en.json`:
```json
"trust_bar": {
  "cortizo": "Cortizo Official",
  "warranty": "10-year warranty",
  "projects": "427 installations",
  "response": "24h response"
}
```

**Step 2: Update TrustBar Cortizo badge styling**

Replace the first badge's star icon with a seal-style design:

```tsx
{
  icon: (
    <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center ${
      variant === "dark" ? "border-brand-light" : "border-brand"
    }`}>
      <svg className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </div>
  ),
  label: t("trust_bar.cortizo"),
},
```

**Step 3: Commit**

```bash
git add client/src/components/ui/TrustBar.tsx client/src/i18n/*.json
git commit -m "feat: update TrustBar with specific stats and Cortizo Official badge"
```

---

## Task 8: FOMO — Geographic social proof + seasonal urgency

**Files:**
- Modify: `client/src/components/ui/SocialProofToast.tsx`
- Modify: `client/src/i18n/ca.json`
- Modify: `client/src/i18n/es.json`
- Modify: `client/src/i18n/en.json`

**Step 1: Add i18n keys for new actions**

In `ca.json`, update `social_proof_toast`:
```json
"social_proof_toast": {
  "names": ["Maria G.", "Joan M.", "Montse R.", "Pere S.", "Nuria L.", "Jordi V.", "Anna C.", "Carles P.", "Marta F.", "Albert B."],
  "cities": ["Blanes", "Lloret de Mar", "Tossa de Mar", "Girona", "Sant Feliu", "Pineda de Mar", "Calella", "Palafrugell", "Mataro", "Arenys de Mar"],
  "action_quote": "ha sol·licitat pressupost per a 4 finestres",
  "action_visit": "ha reservat visita gratuïta a domicili",
  "action_install": "ha completat la instal·lació de 6 finestres",
  "action_zone": "2 instal·lacions programades a {{city}} aquesta setmana",
  "time_ago": "fa {{minutes}} min"
}
```

In `es.json`:
```json
"social_proof_toast": {
  "names": ["Maria G.", "Joan M.", "Montse R.", "Pere S.", "Nuria L.", "Jordi V.", "Anna C.", "Carles P.", "Marta F.", "Albert B."],
  "cities": ["Blanes", "Lloret de Mar", "Tossa de Mar", "Girona", "Sant Feliu", "Pineda de Mar", "Calella", "Palafrugell", "Mataro", "Arenys de Mar"],
  "action_quote": "ha solicitado presupuesto para 4 ventanas",
  "action_visit": "ha reservado visita gratuita a domicilio",
  "action_install": "ha completado la instalación de 6 ventanas",
  "action_zone": "2 instalaciones programadas en {{city}} esta semana",
  "time_ago": "hace {{minutes}} min"
}
```

In `en.json`:
```json
"social_proof_toast": {
  "names": ["Maria G.", "Joan M.", "Montse R.", "Pere S.", "Nuria L.", "Jordi V.", "Anna C.", "Carles P.", "Marta F.", "Albert B."],
  "cities": ["Blanes", "Lloret de Mar", "Tossa de Mar", "Girona", "Sant Feliu", "Pineda de Mar", "Calella", "Palafrugell", "Mataro", "Arenys de Mar"],
  "action_quote": "requested a quote for 4 windows",
  "action_visit": "booked a free home visit",
  "action_install": "completed installation of 6 windows",
  "action_zone": "2 installations scheduled in {{city}} this week",
  "time_ago": "{{minutes}} min ago"
}
```

**Step 2: Modify SocialProofToast.tsx**

Update the message generation to randomly include the new action types. Add a 3rd action type (`action_install`) and a 4th geographic type (`action_zone`):

In the `generateMessage` function, change the action selection logic:

```tsx
const generateMessage = useCallback(() => {
  const names = t("social_proof_toast.names", { returnObjects: true }) as string[];
  const cities = t("social_proof_toast.cities", { returnObjects: true }) as string[];
  const name = names[Math.floor(Math.random() * names.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const minutes = Math.floor(Math.random() * 45) + 3;

  // 30% quote, 30% visit, 15% install, 25% zone
  const rand = Math.random();
  let action: string;
  if (rand < 0.3) {
    action = `${name} (${city}) ${t("social_proof_toast.action_quote")}`;
  } else if (rand < 0.6) {
    action = `${name} (${city}) ${t("social_proof_toast.action_visit")}`;
  } else if (rand < 0.75) {
    action = `${name} (${city}) ${t("social_proof_toast.action_install")}`;
  } else {
    // Geographic FOMO — no name, just zone activity
    action = t("social_proof_toast.action_zone", { city });
  }

  return { text: action, time: t("social_proof_toast.time_ago", { minutes }) };
}, [t]);
```

For zone-type messages, don't show the time_ago (it's a weekly stat, not a "minutes ago" thing). Adjust the render:

```tsx
// In the JSX where message is displayed:
<p className="text-sm text-slate-700 leading-snug">{message.text}</p>
{message.time && (
  <p className="text-xs text-slate-400 mt-0.5">{message.time}</p>
)}
```

**Step 3: Commit**

```bash
git add client/src/components/ui/SocialProofToast.tsx client/src/i18n/*.json
git commit -m "feat: add geographic FOMO and installation completions to social proof"
```

---

## Task 9: WhatsApp quote sharing from calculator result

**Files:**
- Modify: `client/src/components/calculator/Result.tsx`
- Modify: `client/src/i18n/ca.json`
- Modify: `client/src/i18n/es.json`
- Modify: `client/src/i18n/en.json`

**Step 1: Add i18n keys**

In `ca.json`:
```json
"calculator_share": {
  "button": "Compartir pressupost",
  "whatsapp_text": "Mira el pressupost que m'han fet per a finestres PVC Cortizo:\n\n{{summary}}\n\nPreu estimat: {{price}}\n\nMés info: https://arafinestra.com/ca/pressupost"
}
```

In `es.json`:
```json
"calculator_share": {
  "button": "Compartir presupuesto",
  "whatsapp_text": "Mira el presupuesto que me han hecho para ventanas PVC Cortizo:\n\n{{summary}}\n\nPrecio estimado: {{price}}\n\nMás info: https://arafinestra.com/es/pressupost"
}
```

In `en.json`:
```json
"calculator_share": {
  "button": "Share quote",
  "whatsapp_text": "Check out this quote for Cortizo PVC windows:\n\n{{summary}}\n\nEstimated price: {{price}}\n\nMore info: https://arafinestra.com/en/pressupost"
}
```

**Step 2: Update Result.tsx — Replace generic WhatsApp share with "Compartir pressupost"**

The existing `whatsappShareUrl` already generates a `wa.me` URL without a phone number (it opens WhatsApp to pick a contact). Update the share text to use the new `calculator_share.whatsapp_text` key and the button label to `calculator_share.button`.

Replace the existing WhatsApp share button text:
```tsx
// Change the share URL
const shareText = t("calculator_share.whatsapp_text", {
  summary: configSummary,
  price: priceRange,
});
const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
```

Update the button label:
```tsx
{t("calculator_share.button")}
```

Add a small copy below the button explaining the use case:
```tsx
<p className="text-xs text-slate-400 mt-1">{/* No extra text needed — icon + label is clear */}</p>
```

**Step 3: Commit**

```bash
git add client/src/components/calculator/Result.tsx client/src/i18n/*.json
git commit -m "feat: improve WhatsApp quote sharing for co-decision maker conversion"
```

---

## Summary of Tasks

| # | Task | Trigger | Commit message |
|---|------|---------|---------------|
| 1 | GuaranteeBlock | Risk reversal | `feat: add triple guarantee risk reversal` |
| 2 | FutureSelfSection | Emotional visualization | `feat: add FutureSelf emotional visualization` |
| 3 | EnergyLossWidget | Loss aversion (live temp) | `feat: add real-time energy loss widget` |
| 4 | Calculator anchoring | Daily cost + ROI + financing | `feat: add anchoring to calculator result` |
| 5 | Calculator recovery | Zeigarnik effect | `feat: add calculator abandonment recovery` |
| 6 | Decoy + badge | Default effect | `feat: add decoy effect to glass step` |
| 7 | TrustBar authority | Specific stats | `feat: update TrustBar with specific stats` |
| 8 | FOMO geographic | Social proof + zone activity | `feat: add geographic FOMO to social proof` |
| 9 | WhatsApp share | Co-decision maker | `feat: improve WhatsApp quote sharing` |

**Total: 9 tasks, 9 commits**
