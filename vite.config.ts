import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/prod/resourceregistry": {
        target: "https://platform.altinn.no",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/prod/, ""),
      },
      "/api/tt02/resourceregistry": {
        target: "https://platform.tt02.altinn.no",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tt02/, ""),
      },
    },
  },
});
