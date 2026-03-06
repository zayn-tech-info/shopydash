import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["light-hand"],
  },
  server: {
    host: true,
    allowedHosts: ["light-hand.outray.app", ".outray.app"],
  },
});
