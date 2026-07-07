// Google Analytics 4 — set VITE_GA4_ID in environment variables
const GA_ID = (import.meta as any).env?.VITE_GA4_ID || "";

export function initAnalytics() {
  if (!GA_ID || typeof window === "undefined") return;
  if (localStorage.getItem("cookie_consent") !== "accepted") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  // GA4 requiere que se empuje el objeto `arguments` (no un array) y que gtag
  // quede accesible en window para que trackEvent() pueda emitir eventos.
  function gtag(..._args: any[]) {
    (window as any).dataLayer.push(arguments);
  }
  (window as any).gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
}

export function trackEvent(action: string, category: string, label?: string) {
  if (!(window as any).gtag) return;
  (window as any).gtag("event", action, {
    event_category: category,
    event_label: label,
  });
}
