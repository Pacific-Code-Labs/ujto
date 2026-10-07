import { fileURLToPath } from "node:url";
import { renderStatic } from "./render-static.mjs";
const keys = ["home", "privacy", "cookies", "terms", "contact", "about"];
const slug = (key) => key === "home" ? "" : `/${key}`;
const sections = ["hero", "features", "pricing", "download", "testimonials", "story"];
await renderStatic({
  outDir: fileURLToPath(new URL("../dist", import.meta.url)),
  site: "https://ujto.jcampos.dev",
  pages: ["en", "es"].flatMap((lang) => keys.map((key) => ({ route: `/${lang}${slug(key)}`, lang, key }))),
  aliases: {
    "/": "/en",
    ...Object.fromEntries(["en", "es"].flatMap((lang) => sections.map((section) => [`/${lang}/${section}`, `/${lang}${section === "hero" ? "" : `#${section}`}`]))),
    ...Object.fromEntries(keys.filter((key) => key !== "home").map((key) => [`/${key}`, `/en/${key}`])),
  },
});
