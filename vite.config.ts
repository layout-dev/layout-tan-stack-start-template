import { fileURLToPath } from "node:url";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Nitro builds the server bundle and is only needed for `vite build`. Import it
// lazily inside the build branch so `vite dev` never loads it. Override the
// deploy target with NITRO_PRESET (e.g. `node-server`, `vercel`, `netlify`).
const NITRO_PRESET = process.env.NITRO_PRESET ?? "cloudflare-module";

export default defineConfig(async ({ command }) => {
  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // Use src/server.ts as the SSR entry (it wraps requests in an error boundary).
      server: { entry: "server" },
      // Fail the build if client code imports server-only modules.
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
  ];

  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    plugins.push(
      nitro({
        preset: NITRO_PRESET,
        output: { dir: "dist", serverDir: "dist/server", publicDir: "dist/client" },
        ...(NITRO_PRESET === "cloudflare-module"
          ? { cloudflare: { nodeCompat: true, deployConfig: true } }
          : {}),
      }),
    );
  }

  plugins.push(viteReact());

  return {
    plugins,
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      // Keep a single copy of React and TanStack Query across SSR + client.
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    server: { host: "::", port: 8080 },
  };
});
