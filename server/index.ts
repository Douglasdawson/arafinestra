import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "./middleware/auth.js";
import { registerRoutes } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware — must be before passport and routes
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ara-finestra-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
  app.use(express.static(publicDir));

  // SPA catch-all
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[prod] Server running on http://localhost:${PORT}`);
  });
}
