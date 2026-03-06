import type { Express } from "express";
import passport from "./middleware/auth.js";
import { requireAuth } from "./middleware/auth.js";
import { registerLeadRoutes } from "./routes/leads.js";
import { registerProductRoutes } from "./routes/products.js";
import { registerPortfolioRoutes } from "./routes/portfolio.js";
import { registerBlogRoutes } from "./routes/blog.js";
import { registerTestimonialRoutes } from "./routes/testimonials.js";
import { registerZoneRoutes } from "./routes/zones.js";
import { registerConfigRoutes } from "./routes/config.js";
import { registerSeoRoutes } from "./routes/seo.js";
import { registerWeatherRoutes } from "./routes/weather.js";

export function registerRoutes(app: Express) {
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Auth error:", err);
        return res.status(500).json({ error: "Error interno de autenticacion" });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Login fallido" });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          console.error("Login error:", loginErr);
          return res.status(500).json({ error: "Error al crear sesion" });
        }
        return res.json({ user: { id: user.id, username: user.username } });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    const user = req.user as { id: number; username: string };
    res.json({ id: user.id, username: user.username });
  });

  // Register CRUD routes
  registerLeadRoutes(app);
  registerProductRoutes(app);
  registerPortfolioRoutes(app);
  registerBlogRoutes(app);
  registerTestimonialRoutes(app);
  registerZoneRoutes(app);
  registerConfigRoutes(app);
  registerSeoRoutes(app);
  registerWeatherRoutes(app);
}
