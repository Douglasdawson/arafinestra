import type { Express } from "express";

// Girona coordinates
const LAT = 41.98;
const LON = 2.82;

let cache: { data: any; ts: number } | null = null;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export function registerWeatherRoutes(app: Express) {
  app.get("/api/weather", async (_req, res) => {
    try {
      if (cache && Date.now() - cache.ts < CACHE_TTL) {
        return res.json(cache.data);
      }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe/Madrid`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Open-Meteo error");

      const raw = await resp.json();
      const current = raw.current;

      const data = {
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        location: "Girona",
        timestamp: new Date().toISOString(),
      };

      cache = { data, ts: Date.now() };
      res.json(data);
    } catch (err) {
      console.error("Weather API error:", err);
      // Return fallback data so the UI still works
      res.json({
        temperature: 12,
        humidity: 65,
        windSpeed: 10,
        weatherCode: 2,
        location: "Girona",
        timestamp: new Date().toISOString(),
        fallback: true,
      });
    }
  });
}
