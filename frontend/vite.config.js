import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js", // Make sure to point to the right PostCSS config file
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Replace with your backend URL
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix
      },
      "/user": { target: "http://localhost:5000", changeOrigin: true },
    },
  },
});
