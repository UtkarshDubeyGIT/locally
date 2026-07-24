# Locally documentation

This directory is the central index for project-level documentation. The
working application remains in `Prototype/`, while the static reference
prototype remains in `mockups/`.

## Document index

### Product and integrations

- [Product assumptions](product/assumptions.md) defines current scope,
  phase-by-phase expectations, safety boundaries, and explicit non-goals.
- [API catalog](product/api-catalog.md) summarizes implemented, mocked, and
  candidate integrations across Phases 1–5.

### Design

- [Application design system](design/application-design.md) is the visual
  source of truth for the working Next.js application.
- [Mockup design system](design/mockup-design.md) documents the broader visual
  rules used by the static mockups.

### Planning and historical context

- [Implementation handoff](planning/codex-handoff.md) describes the intended
  end-to-end product and role model.
- [Original build prompt](planning/build-prompt.md) preserves the detailed
  build requirements and acceptance criteria.

The planning files are retained as historical implementation context. For the
current product boundary, prefer the product assumptions and the application
itself.

## Working application

### Prerequisites

- Node.js 24.x
- npm
- A Supabase project, or the Supabase CLI for local development

External services are required only for their corresponding live workflows:
OpenAI for review assistance, Google Places for competitor discovery, Google
PageSpeed Insights for audits, and Resend for email delivery.

### Installation

From the repository root:

```bash
cd Prototype
npm ci
cp .env.example .env.local
```

Populate `.env.local` with the services needed for the workflows you plan to
use. Never commit this file.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL exposed to the browser |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase key |
| `SUPABASE_SECRET_KEY` | Server-only Supabase administrative access |
| `OPENAI_API_KEY` | AI-assisted review analysis and draft generation |
| `OPENAI_MODEL` | Model used for AI-assisted workflows |
| `GOOGLE_PLACES_API_KEY` | Live competitor/place discovery |
| `GOOGLE_PAGESPEED_API_KEY` | Live PageSpeed audits |
| `RESEND_API_KEY` | Transactional email delivery |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `DEMO_CLIENT_RECIPIENT_EMAIL` | Recipient used by demo email workflows |
| `NEXT_PUBLIC_APP_URL` | Public base URL for links and callbacks |
| `DEMO_PASSWORD` | Password assigned to seeded demo accounts |

The canonical variable list is `Prototype/.env.example`.

### Local database

The Supabase schema and deterministic demo data live in
`Prototype/supabase/`. With the Supabase CLI available, start and reset the
local stack from the application directory:

```bash
cd Prototype
npx supabase start
npx supabase db reset
```

Resetting the local database reapplies migrations and seed data. Do not run the
reset command against a database containing data you need to preserve.

### Supabase Free Plan keep-alive

The root-level
[`supabase-keep-alive.yml`](../.github/workflows/supabase-keep-alive.yml)
workflow runs a harmless database query at minute 17 every six hours. The
`public.keepalive()` RPC is defined in the Supabase migrations, returns only
`true`, performs no writes, and is callable with the low-privilege publishable
key. Do not give this workflow `SUPABASE_SECRET_KEY`.

After deploying the database migrations and adding the workflow to the default
branch, configure these GitHub Actions repository secrets:

| Secret | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | The project URL used by the application |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | The browser-safe publishable key |

Use **Actions → Supabase keep-alive → Run workflow** to verify the setup
manually. A successful run must receive the exact response `true`; missing
secrets and failed or unexpected API responses fail visibly.

This is a best-effort safeguard for Free Plan projects, not an uptime
guarantee. GitHub can delay scheduled jobs and disables scheduled workflows in
public repositories after 60 days without repository activity. A paid
Supabase plan is the supported option when automatic pausing must be ruled out.

### Run and verify

From `Prototype/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript without emitting files |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright end-to-end tests |

## Static mockups

The static prototype has no backend or installation step. Open
`mockups/phase-1/index.html` in a browser and use its phase selector to switch
between the Phase 1 and Phase 2 experiences. See
the [static mockup notes](mockups/README.md) for its scope and limitations.

## Documentation conventions

- Put project-wide product, design, API, and architecture material under
  `docs/` in the appropriate category.
- Keep implementation instructions synchronized with `Prototype/package.json`
  and `Prototype/.env.example`.
- Keep documentation for self-contained prototypes under `docs/`, with links
  back to their runnable assets.
- Do not place secrets, generated reports, build output, or dependency folders
  in documentation directories.
