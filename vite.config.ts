import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Only import componentTagger in dev mode
let componentTagger;
if (process.env.NODE_ENV === "development") {
  // Import dynamically so production build doesn't try to resolve it
  componentTagger = require("lovable-tagger").componentTagger;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
