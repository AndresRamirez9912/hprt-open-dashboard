import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// The bridge (free-photo/server, later the Go backend) talks to the printer; the app reaches it
// through /api. BRIDGE_URL defaults to the bridge's local address.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.BRIDGE_URL || "http://127.0.0.1:8787",
          changeOrigin: true,
        },
      },
    },
  };
});
