import { cpSync, mkdirSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");
for (const file of [
    "index.html",
    "styles.css",
    "script.js",
    "ai.js",
    "images",
    "public",
    "generated-examples",
]) {
    cpSync(file, `dist/${file}`, { recursive: true });
}
