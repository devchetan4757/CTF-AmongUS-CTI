import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxies /api/* to the FastAPI backend during development so the
// frontend can call relative paths without hardcoding a host/port.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:8000",
      "/site": "http://127.0.0.1:8000",
      "/security": "http://127.0.0.1:8000",
    },
  },
});
