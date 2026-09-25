#!/usr/bin/env node
// After `vite build`: write a static HTML page per language × section (title, description,
// canonical, hreflang, Open Graph, JSON-LD) so crawlers and link previews that don't run JS
// see real metadata, plus sitemap.xml. Values come from src/content/seo.json (editable in the admin).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(root, "dist");
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const seo = read("src/content/seo.json");
const hero = read("src/content/hero.json");
const LANGS = ["en", "es"];
const DEFAULT_LANG = "en";
// Keep in sync with src/lib/sections.ts ("hero" is the language root).
const SECTIONS = ["", "features", "pricing", "download", "testimonials", "story"];
const site = seo.siteUrl.replace(/\/$/, "");
const ogImage = /^https?:/.test(seo.ogImage) ? seo.ogImage : site + (seo.ogImage.startsWith("/") ? "" : "/") + seo.ogImage;
const template = fs.readFileSync(path.join(OUT, "index.html"), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const urlFor = (lang, section) => `${site}/${lang}${section ? `/${section}` : ""}`;

function page(lang, section) {
  const meta = seo.pages.home[lang];
  const url = urlFor(lang, section);
  const alternates = [
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(l, section)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${urlFor(DEFAULT_LANG, section)}" />`,
  ].join("\n    ");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", name: "Ujtö̀", url: site, inLanguage: LANGS },
      { "@type": "WebPage", name: meta.title, description: meta.description, url, inLanguage: lang },
      {
        "@type": "SoftwareApplication",
        name: "Ujtö̀",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web, macOS, Windows, Linux",
        description: hero.description[lang],
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };
  const head = `
    <title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}" />
    <link rel="canonical" href="${url}" />
    ${alternates}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Ujtö̀" />
    <meta property="og:title" content="${esc(meta.title)}" />
    <meta property="og:description" content="${esc(meta.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:locale" content="${lang === "es" ? "es_CR" : "en_US"}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${ogImage}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `;
  return template
    .replace(/<html lang="[^"]*">/, `<html lang="${lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/\s*<meta (name="description"|property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g, "")
    .replace("</head>", `${head}</head>`);
}

let count = 0;
for (const lang of LANGS)
  for (const section of SECTIONS) {
    const dir = path.join(OUT, lang, section);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), page(lang, section));
    count++;
  }

// The root page describes the default language and points crawlers at it.
fs.writeFileSync(path.join(OUT, "index.html"), page(DEFAULT_LANG, "").replace(`href="${urlFor(DEFAULT_LANG, "")}" />`, `href="${urlFor(DEFAULT_LANG, "")}" />`));

const today = new Date().toISOString().slice(0, 10);
const urls = SECTIONS.flatMap((section) =>
  LANGS.map(
    (lang) => `  <url>
    <loc>${urlFor(lang, section)}</loc>
    <lastmod>${today}</lastmod>
${LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l, section)}" />`).join("\n")}
  </url>`,
  ),
);
fs.writeFileSync(
  path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`,
);
console.log(`prerender: ${count} pages (${LANGS.join(", ")} × ${SECTIONS.length} sections) + sitemap.xml`);
