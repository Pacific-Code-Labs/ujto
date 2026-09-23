#!/usr/bin/env node
// Verifies client/src/locales: every language has the same modules and keys, no empty
// values, and every literal t("...") key used in the code exists. Runs before `npm run build`.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "client", "src");
const localesDir = path.join(root, "locales");

function flatten(tree, prefix, out) {
  for (const [key, value] of Object.entries(tree)) {
    const p = `${prefix}.${key}`;
    if (typeof value === "string") out[p] = value;
    else flatten(value, p, out);
  }
  return out;
}

const languages = fs.readdirSync(localesDir).filter((d) => fs.statSync(path.join(localesDir, d)).isDirectory());
const catalogs = {};
const modules = {};
for (const lang of languages) {
  catalogs[lang] = {};
  modules[lang] = fs.readdirSync(path.join(localesDir, lang)).filter((f) => f.endsWith(".json")).sort();
  for (const file of modules[lang]) {
    const tree = JSON.parse(fs.readFileSync(path.join(localesDir, lang, file), "utf8"));
    flatten(tree, file.replace(/\.json$/, ""), catalogs[lang]);
  }
}

const errors = [];
const [base, ...others] = languages;
for (const lang of others) {
  const onlyBase = modules[base].filter((m) => !modules[lang].includes(m));
  const onlyLang = modules[lang].filter((m) => !modules[base].includes(m));
  if (onlyBase.length) errors.push(`${lang}: missing module files ${onlyBase.join(", ")}`);
  if (onlyLang.length) errors.push(`${base}: missing module files ${onlyLang.join(", ")}`);
  for (const key of Object.keys(catalogs[base])) if (!(key in catalogs[lang])) errors.push(`${lang}: missing key ${key}`);
  for (const key of Object.keys(catalogs[lang])) if (!(key in catalogs[base])) errors.push(`${base}: missing key ${key}`);
}
for (const lang of languages)
  for (const [key, value] of Object.entries(catalogs[lang])) if (!value.trim()) errors.push(`${lang}: empty value for ${key}`);

const used = new Set();
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== "locales") walk(p); continue; }
    if (!/\.(tsx?|jsx?)$/.test(entry.name)) continue;
    for (const m of fs.readFileSync(p, "utf8").matchAll(/\bt\(\s*["']([a-zA-Z0-9_.]+)["']/g)) used.add(m[1]);
  }
})(root);
for (const key of used) if (!(key in catalogs[base])) errors.push(`code uses undefined key ${key}`);

if (errors.length) {
  console.error(`i18n check failed (${errors.length}):\n  ` + errors.join("\n  "));
  process.exit(1);
}
console.log(`i18n ok: ${languages.join(", ")} · ${Object.keys(catalogs[base]).length} keys · ${modules[base].length} modules · ${used.size} keys used in code`);
