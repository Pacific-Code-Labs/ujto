# Video Transcript — Web App

React + TypeScript frontend for the Video Transcript service, deployed as a static site to GitHub Pages.

The backend lives in separate repositories:
- API: `Pacific-Code-Labs/video-transcript-be` (FastAPI on AWS Lambda)
- Transcription worker: `Pacific-Code-Labs/video-transcript-listener-be`

## Features

- Paste a video URL and get a transcript
- Free plan: 3 transcriptions per account (paid plans coming soon)
- English and Spanish UI with light/dark mode
- Sign-up and login with Amazon Cognito

## Development

```bash
npm install
cp .env.example .env   # point VITE_API_BASE_URL at a running API
npm run dev            # http://localhost:5173
```

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build to `dist/public` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | TypeScript type check |

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages (custom domain from `client/public/CNAME`).

Build-time values come from repository secrets: `VITE_API_BASE_URL`, `VITE_AWS_COGNITO_USER_POOL_ID`, `VITE_AWS_COGNITO_CLIENT_ID`, `VITE_STRIPE_PUBLIC_KEY`. These are public identifiers, since they ship to the browser; never put secret keys in them.

See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for Pages and DNS setup.
