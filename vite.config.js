import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    publicDir: false,
    plugins: [tailwindcss()],
    resolve: { dedupe: ["react", "react-dom"] },
});
