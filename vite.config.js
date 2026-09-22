import { defineConfig } from "vite";
export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three/")) return "three";
          if (
            id.includes("node_modules/gsap/") ||
            id.includes("node_modules/@gsap/")
          )
            return "motion";
          if (id.includes("node_modules/react")) return "react";
        },
      },
    },
  },
  server: { port: 5173, strictPort: true },
});
