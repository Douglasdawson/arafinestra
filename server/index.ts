import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import session from "express-session";
import compression from "compression";
import passport from "./middleware/auth.js";
import { registerRoutes } from "./routes.js";
import { getMetaForRoute, injectMeta } from "./lib/seo-inject.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(compression());
app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://api.whatsapp.com; frame-src https://www.google.com https://www.youtube.com;"
  );
  next();
});
app.use(express.urlencoded({ extended: true }));

// Session middleware — must be before passport and routes
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ara-finestra-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
    },
    proxy: true,
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Register API routes
registerRoutes(app);

const PORT = parseInt(process.env.PORT || "5000", 10);

if (process.env.NODE_ENV === "development") {
  // In dev mode, use Vite as middleware
  const { createServer } = await import("vite");
  const vite = await createServer({
    configFile: path.resolve(__dirname, "../vite.config.ts"),
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[dev] Server running on http://localhost:${PORT}`);
  });
} else {
  // In production, serve static files
  const publicDir = path.resolve(__dirname, "public");
  // Hashed assets (JS/CSS) get long-term cache; other files get short cache
  app.use("/assets", express.static(path.join(publicDir, "assets"), {
    maxAge: "1y",
    immutable: true,
  }));
  app.use(express.static(publicDir, {
    maxAge: "1h",
  }));

  // Read HTML template once at startup
  const htmlTemplate = fs.readFileSync(
    path.join(publicDir, "index.html"),
    "utf-8"
  );

  // Prerendered HTML directory
  const prerenderDir = path.resolve(__dirname, "prerendered");
  const hasPrerenderDir = fs.existsSync(prerenderDir);
  let prerenderManifest: Set<string> = new Set();
  if (hasPrerenderDir) {
    try {
      const manifestPath = path.join(prerenderDir, "_manifest.json");
      if (fs.existsSync(manifestPath)) {
        const routes = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        prerenderManifest = new Set(routes);
        console.log(`[seo] Prerender cache: ${prerenderManifest.size} routes`);
      }
    } catch {}
  }

  // Bot user-agent detection
  const BOT_UA = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|bytespider/i;

  // SPA catch-all with server-side meta injection + prerendering for bots
  app.get("/{*splat}", async (req, res) => {
    try {
      const ua = req.headers["user-agent"] || "";
      const isBot = BOT_UA.test(ua);

      // Serve prerendered HTML to bots if available
      if (isBot && prerenderManifest.has(req.path)) {
        const prePath = path.join(prerenderDir, `${req.path}.html`);
        if (fs.existsSync(prePath)) {
          const preHtml = fs.readFileSync(prePath, "utf-8");
          res.setHeader("X-Prerendered", "true");
          return res.send(preHtml);
        }
      }

      // Fallback: SSR meta injection for all requests
      const meta = await getMetaForRoute(req.path);
      const html = injectMeta(htmlTemplate, meta);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.send(html);
    } catch (err) {
      console.error("[seo] Error injecting meta:", err);
      res.send(htmlTemplate);
    }
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[prod] Server running on http://localhost:${PORT}`);
  });
}
