# Ujtö̀ — Web App

React + TypeScript frontend for **Ujtö̀** (“word; language” in Bribri — the name story is shown on the register page), deployed as a static site to GitHub Pages.

The backend lives in separate repositories:
- API: `Pacific-Code-Labs/ujto-be` (FastAPI on AWS Lambda)
- Transcription worker: `Pacific-Code-Labs/ujto-listener-be`

## Features

- Paste a video URL and get a transcript
- Free plan: 3 transcriptions per account (paid plans coming soon)
- English and Spanish UI with light/dark mode
- Sign-up and login with Amazon Cognito

## Development

```bash
npm install
bash scripts/load-env-from-ssm.sh prod   # writes .env.local from SSM (needs AWS access)
npm run dev                              # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/public` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | TypeScript type check |

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages (custom domain from `client/public/CNAME`).

Build-time values (`VITE_*`) are read from AWS SSM Parameter Store at `/video-transcript/<env>/web/*` by `scripts/load-env-from-ssm.sh`, both locally and in the Pages workflow. The workflow assumes a read-only role through GitHub OIDC; its ARN is the only repository secret (`AWS_WEB_BUILD_ROLE_ARN`). These values ship to the browser, so they are public identifiers — never store secret keys under that path.

Without AWS access, copy `.env.example` to `.env.local` and fill it in by hand.

See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for Pages and DNS setup.
