import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "flytrap",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react", // Exclude React from the bundle
      ],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
