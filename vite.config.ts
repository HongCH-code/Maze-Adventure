import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,json,mp3,ogg,wav}"],
      },
      manifest: {
        name: "Maze Adventure",
        short_name: "Maze",
        description: "2D maze puzzle game for children",
        theme_color: "#4a90d9",
        background_color: "#1a1a2e",
        display: "standalone",
        orientation: "any",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
