import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: "client",
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "framer-motion": ["framer-motion"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "i18n": ["i18next", "react-i18next", "i18next-browser-languagedetector"],
        },
      },
    },
  },
  server: {
    allowedHosts: true,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
