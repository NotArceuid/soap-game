import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { log } from "console";

const file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const pkg = JSON.parse(json);

const hostURLJson = readFileSync(fileURLToPath(new URL("./.env/hosts.json", import.meta.url)), "utf8");
const hostURL = JSON.parse(hostURLJson);
log(hostURL)
export default defineConfig({
  plugins: [sveltekit(), tailwindcss(), nodePolyfills()],
  define: {
    PKG_VERSION: JSON.stringify(pkg.version),
    PKG_NAME: JSON.stringify(pkg.name),
  },
  server: {
    allowedHosts: [hostURL]
  }
});
