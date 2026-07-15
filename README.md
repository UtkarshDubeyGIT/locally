# Locally

Locally is a Local SEO operations platform for digital marketing agencies. This
workspace contains the working Next.js application, an earlier browser-based
prototype, and the product and engineering documents that explain the project.

## Repository layout

| Path | Purpose |
| --- | --- |
| [`Prototype/`](Prototype/) | Working Next.js application, tests, Supabase schema, and seed data |
| [`mockups/`](mockups/) | Static Phase 1 and Phase 2 browser mockups |
| [`docs/`](docs/) | Design, product, API, and implementation-planning documentation |

## Quick start

The working application requires Node.js 24 and npm.

```bash
cd Prototype
npm ci
cp .env.example .env.local
npm run dev
```

Configure the values in `.env.local` before exercising authenticated or
integration-backed workflows. See the [documentation guide](docs/README.md)
for environment details, local Supabase setup, available commands, and the
project document index.

## Common checks

Run these commands from `Prototype/`:

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Repository hygiene

Generated and local-only files such as `node_modules/`, `.next/`, test output,
coverage, `.env.local`, logs, and `.DS_Store` are excluded by
`Prototype/.gitignore`. Keep project documentation organized under `docs/`.
