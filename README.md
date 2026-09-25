# ujto — landing

The public landing for **Ujtö̀** (“word; language” in Bribri) at **https://ujto.jcampos.dev**.
A static, content-driven site (landing-DXP pattern): every visible string and image comes from
`src/content/*.json` (editable in the private **ujto-admin** CMS) or `src/translations/{en,es}.json`.

The product itself lives elsewhere:
- Dashboard: [ujto-app](https://github.com/Pacific-Code-Labs/ujto-app) → https://app.ujto.jcampos.dev
  (**Sign in**, **Get started**, **Upload a file** and the link box open it in a new tab)
- Shared UI: [ujto-design-system](https://github.com/Pacific-Code-Labs/ujto-design-system)
- Desktop app: [ujto-desktop](https://github.com/Pacific-Code-Labs/ujto-desktop) (the **Download** section)
- Workspace: [ujto-root](https://github.com/Pacific-Code-Labs/ujto-root) (`fe/landing`)

## Structure

```
src/
  content/        hero, features, pricing, download, testimonials, story, navigation, footer,
                  seo, branding, themes, media  (bilingual { en, es } values)
  translations/   fixed UI chrome (button labels, aria labels)
  repositories/   content.repository.ts — the only importer of content JSON
  services/       download (OS detection), seo (head tags, brand theme)
  components/public/  one component per section; pages/Home.tsx renders them in order
scripts/          check-i18n, find-hardcoded-text, prerender (per-language × section HTML + sitemap)
```

URLs are `/<lang>` and `/<lang>/<section>` (`features`, `pricing`, `download`, `testimonials`,
`story`); a scroll-spy keeps the URL on the section in view. Old app URLs (`/en/login`,
`/en/dashboard`, …) redirect to the dashboard.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # checks + typecheck + build + prerender → dist/
```

From the workspace root, `./reboot-server.sh` starts everything with the local dashboard URL.

## Config

The site has **no runtime backend and no auth**. Its only build setting is the dashboard URL
(`VITE_APP_URL`, from SSM `/ujto/<env>/web/site/app-url`; defaults to the prod domain).

## Deploy

Push to `main` → GitHub Actions (pnpm, Node 24) → `pnpm build` → GitHub Pages (`public/CNAME`).
