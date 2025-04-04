import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Simple working config — NO Replit plugins
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/public",
  },
});
