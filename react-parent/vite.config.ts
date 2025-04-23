import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Allow embedding in iframes from any origin during development
      "Content-Security-Policy": "frame-ancestors *;",
    },
    port: 3001,
  },
});
