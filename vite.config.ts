import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/act-math-review/",   // 👈 must match your repo name exactly
});
