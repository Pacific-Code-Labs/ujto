import { absoluteAssetUrl, activeTheme, applyBrandTheme, applyFavicon, resolveAssetUrl } from "@pacific-code-labs/ujto-ds";
import { getBranding, getSeo, getThemes } from "@/repositories/content.repository";

/** Apply the active theme and favicon from content (once, from main.tsx). */
export function initBrand() {
  applyBrandTheme(activeTheme(getThemes()));
  applyFavicon(resolveAssetUrl(getBranding().faviconUrl));
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let link = document.head.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    if (hreflang) link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
}

/** Runtime head tags for SPA navigation (the prerender writes the same tags statically). */
export function applyHeadTags(lang: "en" | "es", path: string, languages: readonly string[]) {
  const seo = getSeo();
  const meta = seo.pages.home[lang] ?? seo.pages.home.en;
  const site = seo.siteUrl.replace(/\/$/, "");
  document.title = meta.title;
  upsertMeta("name", "description", meta.description);
  upsertMeta("property", "og:title", meta.title);
  upsertMeta("property", "og:description", meta.description);
  upsertMeta("property", "og:url", site + path);
  upsertMeta("property", "og:image", absoluteAssetUrl(seo.ogImage, site));
  upsertMeta("property", "og:locale", lang === "es" ? "es_CR" : "en_US");
  upsertLink("canonical", site + path);
  const rest = path.replace(/^\/(en|es)/, "");
  for (const l of languages) upsertLink("alternate", `${site}/${l}${rest}`, l);
  upsertLink("alternate", `${site}/en${rest}`, "x-default");
}
