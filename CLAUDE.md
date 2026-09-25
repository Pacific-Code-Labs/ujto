# ujto landing (fe/landing)

Public, static marketing site. No auth, no API, no admin code (the CMS is the private ujto-admin repo).

- **Content ↔ admin:** each `src/content/*.json` has a page + sidebar entry + route + versions row in
  ujto-admin (`fe/admin`). Adding a content file means adding it there too.
- **No hard-coded text:** chrome → `src/translations/{en,es}.json` (`t("…")`); copy → `src/content`
  (`useLocalized()`), icons as `iconName`, rich text via `RichText`. `pnpm check:i18n` enforces it.
- Content JSON is imported only in `src/repositories/content.repository.ts`.
- Sections: `src/lib/sections.ts` + `scripts/prerender.mjs` SECTIONS must match; each section needs
  `id="<slug>"`.
- Links to the dashboard use `appHref()` + `newTab` (open in a new tab).
- UI from `@pacific-code-labs/ujto-ds` only; colours via tokens.
- Verify: `pnpm build`, then `grep -rE "cognito|amplify|us-east-1_" dist` must find nothing.
