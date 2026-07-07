import type { Express } from "express";

// Girona coordinates
const LAT = 41.98;
const LON = 2.82;

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const FALLBACK_TTL = 5 * 60 * 1000; // 5 minutes: no martillear un upstream caído

const FALLBACK = {
  temperature: 12,
  humidity: 65,
  windSpeed: 10,
  weatherCode: 2,
  location: "Girona",
  fallback: true,
};

let cache: { data: any; ts: number } | null = null;
let inflight: Promise<any> | null = null;

async function fetchWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe/Madrid`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!resp.ok) throw new Error("Open-Meteo error");
  const raw = await resp.json();
  const current = raw.current;
  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    weatherCode: current.weather_code,
    location: "Girona",
  };
}

export function registerWeatherRoutes(app: Express) {
  app.get("/api/weather", async (_req, res) => {
    // Cache válida (datos buenos 30 min, fallback 5 min)
    if (cache) {
      const ttl = cache.data.fallback ? FALLBACK_TTL : CACHE_TTL;
      if (Date.now() - cache.ts < ttl) {
        return res.json({ ...cache.data, timestamp: new Date().toISOString() });
      }
    }

    try {
      // Dedup en vuelo: si ya hay una petición al upstream, reusar su promesa
      if (!inflight) {
        inflight = fetchWeather().finally(() => {
          inflight = null;
        });
      }
      const data = await inflight;
      cache = { data, ts: Date.now() };
      res.json({ ...data, timestamp: new Date().toISOString() });
    } catch (err) {
      console.error("Weather API error:", err);
      // Cachear el fallback para no reintentar en cada request mientras el upstream esté caído
      cache = { data: FALLBACK, ts: Date.now() };
      res.json({ ...FALLBACK, timestamp: new Date().toISOString() });
    }
  });
}
