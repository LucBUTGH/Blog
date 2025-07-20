import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    open: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "blogapi-m37t.onrender.com",
      ".onrender.com",
      ".netlify.app",
      ".vercel.app",
    ],
  },
});
