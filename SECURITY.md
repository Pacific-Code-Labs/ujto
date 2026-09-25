# Security Guidelines

This repository is **public** and contains only the static landing. Never commit backend code,
secrets, infrastructure IDs or admin/CMS code here (the content admin lives in the private
ujto-admin repo and never ships with the site).

## Build-time configuration

The only `VITE_*` value is the dashboard URL (`VITE_APP_URL`, SSM `/ujto/<env>/web/site/app-url`),
read by `scripts/load-env-from-ssm.sh` in the Pages build through a read-only OIDC role
(`AWS_WEB_BUILD_ROLE_ARN`). The landing needs no Cognito IDs, API URL or payment keys: sign-in and
transcription happen in the dashboard app (ujto-app).

Everything in a `VITE_*` variable ends up in the browser bundle, so only public values belong there.

## Reporting

Report security issues privately to the repository owners rather than opening a public issue.
