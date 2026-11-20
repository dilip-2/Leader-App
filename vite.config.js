import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // ✅ .env variables load karo
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_SERVER_PORT) || 5173,  // ✅ .env se port
      proxy: {
        "/api": {
          target: env.VITE_BASE_URL,  // ✅ .env se BASE_URL
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});