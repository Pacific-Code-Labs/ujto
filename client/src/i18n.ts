// Translations live in locales/<language>/<module>.json (e.g. locales/es/pricing.json).
// Keys are "<module>.<path>", so t("pricing.free.title") reads locales/<lang>/pricing.json → free.title.
// Add a module by creating the same file under every language; `npm run check:i18n` verifies parity.

export const LANGUAGES = ["en", "es"] as const;
export type Language = (typeof LANGUAGES)[number];

type Tree = { [key: string]: string | Tree };

const files = import.meta.glob<Tree>("./locales/*/*.json", { eager: true, import: "default" });

function flatten(tree: Tree, prefix: string, out: Record<string, string>) {
  for (const [key, value] of Object.entries(tree)) {
    const path = `${prefix}.${key}`;
    if (typeof value === "string") out[path] = value;
    else flatten(value, path, out);
  }
}

export const translations = Object.fromEntries(LANGUAGES.map((lang) => [lang, {}])) as Record<
  Language,
  Record<string, string>
>;

for (const [path, tree] of Object.entries(files)) {
  const match = /\.\/locales\/([^/]+)\/([^/]+)\.json$/.exec(path);
  if (!match) continue;
  const [, lang, module] = match;
  if ((LANGUAGES as readonly string[]).includes(lang)) flatten(tree, module, translations[lang as Language]);
}
