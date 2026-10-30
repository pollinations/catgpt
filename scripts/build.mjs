import { cpSync } from "node:fs";
import { build } from "vite";

await build({ base: "./", publicDir: false });
// Preserve the original repository's public image paths and shared links.
for (const folder of ["images", "public", "generated-examples"]) {
    cpSync(folder, `dist/${folder}`, { recursive: true });
}
