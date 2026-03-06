// Google Analytics 4 — replace GA_ID with real measurement ID
const GA_ID = "";

export function initAnalytics() {
  if (!GA_ID || typeof window === "undefined") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
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
