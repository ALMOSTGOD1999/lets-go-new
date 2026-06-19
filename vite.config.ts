import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    include: ["lucide-react"],
  },
  ssr: {
    noExternal: ["lucide-react"],
  },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({
      // spa: { enabled: true },
      prerender: { enabled: false }, // 👈 moved inside tanstackStart's options
    }),
    nitro(),
    viteReact({
      babel: {
        presets: [reactCompilerPreset()],
      },
    }),
  ],
});
export default config;
