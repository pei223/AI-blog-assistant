import { defineConfig } from "vite";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";
// https://vitejs.dev/config/
export default defineConfig({
  root: "electron",
  // build: {
  //   minify: false,
  //   emptyOutDir: false,
  //   target: "node",
  //   lib: {
  //     entry: "main.cts",
  //     formats: ["es", "cjs", "cts"],
  //     fileName: (format) => (format === "cjs" ? "[name].cjs" : "[name].js"),
  //   },
  // },
  plugins: [viteCommonjs()],
});
