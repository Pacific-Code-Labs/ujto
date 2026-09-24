# Security Guidelines

This repository is **public** and contains only the frontend. Never commit backend code, secrets or infrastructure IDs here.

## Build-time configuration

The web app reads its `VITE_*` values from AWS SSM Parameter Store (`/ujto/<env>/web/*`) through `scripts/load-env-from-ssm.sh`, locally and in GitHub Actions. The Pages build assumes a read-only OIDC role (`AWS_WEB_BUILD_ROLE_ARN` secret) that can only read those parameters. Nothing is hard-coded in the source.

Everything in a `VITE_*` variable ends up in the browser bundle, so only public values belong there:

| Value | Public? |
|---|---|
| API URL, AWS region | Yes |
| Cognito user pool ID and web client ID (no client secret) | Yes |
| Stripe **publishable** key (`pk_...`, optional) | Yes |
| Stripe **secret** key (`sk_...`), database credentials, any API secret | **Never** |

## Secrets

Secrets live only on the backend (the private `ujto-be` repo's AWS Lambda), in AWS Secrets Manager, read at runtime through its IAM role. They must never appear in this repository, in a `VITE_*` variable, in GitHub Secrets for this repo, or in browser code.

## Authentication

Sign-in uses Amazon Cognito. The API trusts only the identity verified by its API Gateway Cognito authorizer; the browser never sends a user ID that the server accepts on its own.

## Reporting

Report security issues privately to the repository owners rather than opening a public issue.
