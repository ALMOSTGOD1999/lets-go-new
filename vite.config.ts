import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({ spa: { enabled: true } }),
    viteReact({
      babel: {
        presets: [reactCompilerPreset()],
      },
    }),
  ],
  server: {
    proxy: {
      "/api/v1": {
        target: "http://localhost:3333",
        changeOrigin: true,
      },
    },
  },
});

export default config;
