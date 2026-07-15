# Locally API Overview — Phases 1–5

Last reviewed: 15 July 2026

## Purpose

High-level list of APIs represented across the Locally mockups and working demo. This is an options list only; final API choices will be made later.

**Status:** Implemented = live in the demo · Mocked = represented with seeded data · Candidate = needed for a future live workflow.

## Phase overview

| Phase | APIs and purpose | Status |
| --- | --- | --- |
| **1 — Foundation** | Supabase Auth; Supabase Data API/PostgreSQL; Next.js Server Actions. Supports login, roles, clients, locations, onboarding, reviews, tasks, reports, and feedback. | Implemented in working demo |
| **2 — Automation** | OpenAI Responses, PageSpeed Insights, Google Places Text Search, Resend, and Vercel. Adds AI reply drafts, live audits, competitor search, email, and hosting. | Implemented |
| **2 — Live GBP extension** | Google OAuth, GBP Account Management, Business Information, Reviews, Performance, Notifications, and Google Cloud Pub/Sub. Replaces mocked GBP synchronization and publishing. | Mocked / Candidate |
| **2 — Scheduling** | Vercel Cron Jobs or another scheduler for recurring syncs, audits, reminders, and reports. | Candidate |
| **3** | Architecture materials are not present in the workspace. | To be added |
| **4** | Referenced as a separate presentation, but not present in the workspace. | To be added |
| **5** | No architecture material is present in the workspace. | To be added |

## Internal application APIs

The application has no public custom REST or GraphQL API. It uses authenticated Next.js Server Actions and Supabase queries.

| Area | Main operations |
| --- | --- |
| Authentication | Login, logout, role checks |
| Clients | Create clients, locations, assignments, invitations, and demo reset |
| Onboarding | Save steps, submit survey, activate client |
| Reviews | Generate draft, edit, approve, escalate, add notes, mock-publish |
| Operations | Run audits, find competitors, create and update actions |
| Reports | Save summary, approve/send report, collect feedback |
| Data | Read dashboards, clients, reviews, audits, competitors, actions, reports, and profiles |

## External API comparison

| External API | Purpose | Cost considerations | Advantages | Disadvantages | Status |
| --- | --- | --- | --- | --- | --- |
| **Supabase Auth** | User identity, sessions, and roles | Free tier; Pro starts around **US$25/month**. MAU and advanced-security charges may apply. | Works naturally with RLS; quick setup | Vendor coupling; RLS must be configured carefully | Implemented |
| **Supabase Data API + PostgreSQL** | Stores and queries all application data | Database size, compute, backups, and egress drive cost; included within Supabase plans | Managed PostgreSQL; typed CRUD; strong access controls | Complex policies and queries require care | Implemented |
| **OpenAI Responses API** | Structured review analysis and reply drafts | `gpt-5-mini`: about **US$0.25/M input tokens** and **US$2/M output tokens** | Strong structured and multilingual output | Variable output, privacy concerns, and human review required | Implemented |
| **Google PageSpeed Insights API v5** | Website performance, accessibility, SEO, and best-practice audits | No published per-call fee; quotas and latency are the main constraints | Official Lighthouse results; easy integration | Scores vary; slower or quota-limited at scale | Implemented |
| **Google Places API — Text Search Enterprise** | Finds nearby competitors and public place facts | Current fields trigger Enterprise pricing: first **1,000 requests/month free**, then about **US$35/1,000** | Reliable place IDs, ratings, addresses, and location bias | Billing, attribution, storage rules; not a ranking API | Implemented |
| **Resend Email API** | Sends onboarding and approved-report emails | Free: **3,000 emails/month**; Pro starts around **US$20/month** | Simple API; good transactional-email workflow | Domain setup and delivery monitoring required | Implemented |
| **Vercel Functions and Hosting** | Hosts Next.js and executes server actions | Hobby is non-commercial; Pro starts around **US$20/month**, plus usage | Excellent Next.js fit; managed CDN and deployments | Usage-based costs and platform coupling | Implemented |
| **Vercel Cron Jobs** | Runs recurring audits, syncs, reminders, and report compilation | Uses Vercel function invocations and compute | Simple scheduler within existing hosting | Limited fit for long-running or complex jobs | Candidate |
| **Google OAuth 2.0** | Grants access to client-owned Business Profiles | No per-login fee; implementation, verification, and token security add cost | Standard delegated access | Consent, refresh-token, and approval complexity | Candidate |
| **GBP Account Management API** | Finds and maps agency/client GBP accounts | No published per-call fee; access approval and quotas apply | Official account discovery | Restricted access and complex permissions | Mocked / Candidate |
| **GBP Business Information API** | Reads or updates locations, hours, categories, phones, and websites | No published per-call fee; quotas and operational review apply | Automates profile synchronization | Public edits are sensitive and may be rejected | Mocked / Candidate |
| **Google My Business API v4 — Reviews** | Synchronizes reviews and publishes approved replies | No published per-call fee; access, OAuth, and quota costs apply | Completes the real review workflow | Public-response risk and moderation delays | Mocked / Candidate |
| **GBP Performance API** | Retrieves profile impressions and customer interactions | No published per-call fee; sync volume affects infrastructure cost | Official performance data | Does not provide exact local rankings | Mocked / Candidate |
| **GBP Notifications API** | Sends GBP change events to Pub/Sub | No published per-call fee; requires Pub/Sub | Faster and more efficient than polling | Asynchronous processing and retries required | Mocked / Candidate |
| **Google Cloud Pub/Sub API** | Delivers GBP notification events | First **10 GiB/month free**, then throughput, storage, and transfer charges | Durable and scalable event delivery | Adds infrastructure and duplicate-event handling | Candidate |

## Intentionally manual or mocked

- Exact local keyword rankings remain manual or evidence-based; no ranking API is selected.
- Client discovery and competitor conclusions remain human-led.
- GBP reviews, metrics, synchronization, and publishing are currently mocked.
- The original Phase 1/2 browser mockups make no real network calls.

## References

[Supabase pricing](https://supabase.com/pricing) · [OpenAI pricing](https://developers.openai.com/api/docs/models/gpt-5-mini) · [Google Maps pricing](https://developers.google.com/maps/billing-and-pricing/pricing) · [PageSpeed API](https://developers.google.com/speed/docs/insights/v5/get-started) · [Google Business Profile APIs](https://developers.google.com/my-business/content/overview) · [Resend pricing](https://resend.com/pricing) · [Vercel pricing](https://vercel.com/pricing) · [Pub/Sub pricing](https://cloud.google.com/pubsub/pricing)
