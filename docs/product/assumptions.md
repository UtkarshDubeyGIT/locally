# Locally - Assumptions

## Scope

Locally is evaluated across five growth phases, but the submitted application is intentionally a **Phase 1 foundation with selected Phase 2 automation**. Phase 3-5 items below are future architecture assumptions, not claims about the current deployment.

This document consolidates assumptions from the engineering challenge, Phase 1/2 mockups, the Phase 3 presentation, the working application, and its build/handoff documents. The referenced Phase 4 and Phase 5 presentation HTML files were not present in the reviewed workspace; those sections therefore use the challenge's Phase 4/5 evaluation criteria and the evolution implied by the existing design.

## Product and business assumptions

1. **Primary customer:** a Local SEO agency, not an individual business managing SEO directly.
2. **Growth bands:** Phase 1 = 0-5 clients, Phase 2 = 5-15, Phase 3 = 15-50, Phase 4 = 50-100, and Phase 5 = 100+.
3. **Initial problem:** the agency's main constraint is operational consistency - scattered spreadsheets, messages, repeated checks, and unclear ownership - before it is infrastructure scale.
4. **Prioritization:** client/location records, GBP health, reviews, audits, competitors, actions, onboarding, and reporting provide more early value than citation crawling, rank-grid infrastructure, billing, or a full project-management suite.
5. **Operating principle:** automate collection, repetition, summarization, and draft preparation; retain human control over judgment, public communication, and business-critical changes.
6. **Example data:** six agency clients make the dashboard believable, but only Madhur Sweets requires a complete workflow. Its four branches are Dwarka, Rohini, Noida Sector 18, and Lajpat Nagar; Noida Sector 18 is intentionally the weakest branch.
7. **Market context:** the demo represents an India-based agency and supports English, Hindi, and natural Hinglish review replies. It is not a complete localization or internationalization implementation.
8. **Reporting:** monthly reporting is the default. Reports are operational summaries, not guarantees of ranking, revenue, footfall, or attribution.

## Current application assumptions (Phases 1-2)

### Users and access

9. There is one demo agency with three personas: `agency_owner`, `seo_employee`, and `client_owner`.
10. The owner can access all clients in the agency; an SEO employee can access only assigned clients; a client owner can access only their linked business.
11. A client owner is read-only except for onboarding input and report feedback. Internal notes, draft replies, prompts, AI metadata, draft reports, and agency-only operations are not client-visible.
12. Server-side authorization and Supabase Row-Level Security are required; hiding controls in the browser is not considered authorization.
13. Creating a client record does not automatically create an authentication account. User invitation/provisioning is a separate administrative concern.
14. One shared demo password may be used for seeded evaluator accounts. Production would require normal credential lifecycle, recovery, stronger policies, and optionally MFA.

### Data and workflow

15. Supabase PostgreSQL is the system of record. Important workflow states must persist and survive refreshes.
16. The current schema assumes one onboarding submission per client, one reply record per review, and one monthly update per client per month.
17. An unresolved source finding should create at most one active action; completed work may later produce a new action.
18. Actions stay deliberately small: source, title, location, priority, assignee, due date, client visibility, and `Open / In progress / Done`.
19. Source provenance is part of the product. Records are labeled `Live API`, `Manual`, `Mock GBP`, or `Demo data`, with timestamps and verifier metadata where available.
20. Seed data is deterministic, idempotent, and resettable so evaluators can replay the core story. Reset affects only fixed demo records.
21. External integrations can fail or be unconfigured. The app must show a clear error or manual path and must never relabel fallback/demo data as live.

### Integrations and SEO data

22. Supabase Auth/database, OpenAI, Google PageSpeed Insights, Google Places, Resend, and Vercel are the intended real integrations when valid credentials are configured.
23. Google Business Profile OAuth, review synchronization, performance metrics, and review-reply publishing are unavailable for this challenge and are mocked behind replaceable provider boundaries.
24. `Mock published` records workflow completion only; it does not mean a reply reached Google.
25. Google Places results are discovery inputs, not competitor strategy. A human selects relevant competitors and adds conclusions.
26. PageSpeed/Lighthouse supplies technical signals only. Local relevance, NAP correctness, content quality, and business accuracy still require manual review.
27. Exact local rankings remain manual or imported because results vary by proximity, device, time, and personalization. Stored observations are evidence, not universal rank positions.
28. Performance and ranking changes may be correlated with agency work, but the platform does not claim causation.
29. API calls use server-side credentials, validated payloads, limited fields, and explicit timestamps. Places search assumes a 3.5 km branch-centered bias and an India/English request context for the demo.

### AI behavior and safety

30. AI is an assistant, not an autonomous operator. It may classify a review, identify facts to verify, and prepare a reply draft; it may not publish, approve, promise compensation, admit liability, or invent an investigation.
31. AI output is probabilistic and may be wrong. Structured output validation, deterministic safety checks, editable drafts, and human approval are required controls.
32. High-severity or policy-sensitive replies require agency-owner approval. Lower-risk drafts still require a human before public use.
33. Client-specific tone, prohibited claims, escalation categories, and facts-to-verify are treated as prompt inputs and stored policy, not left solely to model judgment.
34. The current model default is `gpt-5-mini`, configurable by environment variable. No RAG, vector database, MCP workflow, or autonomous agent is needed for the demonstrated use case.
35. Review text is sent to the configured LLM provider only to perform the requested generation. Secrets remain server-side, and unnecessary internal/client data should not be added to prompts.

### Cost and reliability

36. Demo usage is low enough for synchronous server actions and a modular monolith. Daily per-user limits are assumed sufficient: OpenAI 20, Places 30, PageSpeed 10, and email 10 calls.
37. A failed AI, PageSpeed, Places, or email request remains retryable. Failed email delivery does not revoke report approval; a report becomes `Sent` only after provider acceptance.
38. The current application favors one complete vertical workflow over broad but shallow feature coverage.

## Phase-by-phase evaluation assumptions

### Phase 1 - 0-5 clients

39. A small team can perform weekly rank checks, GBP verification, competitor observations, and final report commentary manually if Locally centralizes the evidence and actions.
40. Phase 1 succeeds by creating trusted records and repeatable workflows, not by maximizing automation.
41. Sensitive GBP edits, review replies, competitor interpretation, and client advice remain manual and accountable.

### Phase 2 - 5-15 clients

42. Repetition, rather than database throughput, becomes the bottleneck. Scheduled syncs, health checks, notifications, reminders, draft replies, ranking summaries, competitor refreshes, and report assembly are appropriate automation targets.
43. Automations prepare or route work; people approve public replies, client reports, sensitive GBP changes, and high-risk issues.
44. Client discovery, disputed-fact handling, crisis/legal/medical responses, strategic competitor conclusions, and exact local rank interpretation should never be fully automated.

### Phase 3 - 15-50 clients

45. Multiple employees create an accountability problem: every client, location, task, approval, and sensitive mutation needs a named owner and traceable history.
46. The modular monolith remains sufficient. Scale is added through stronger module boundaries, indexed PostgreSQL queries, snapshots, a durable job table with retries, and assignment-aware workflows - not Kafka, Kubernetes, or microservices.
47. Authorization evolves from three hard-coded personas toward memberships, roles, permissions, client/location scope, and risk thresholds.
48. Business mutation and its audit event should commit in the same database transaction. Human-facing activity feeds and compliance-oriented audit records serve different needs.
49. Role-specific dashboards are required: agency health for owners, approvals for managers, assigned work for specialists, and approved/read-only information for clients.
50. Historical rankings, annotations, and review snapshots enable trends and operational insight, but analyst commentary must avoid causal claims.

### Phase 4 - 50-100 clients

51. Concurrent users, bulk reports, notifications, health monitoring, and scheduled integrations justify asynchronous background processing with idempotency, retries, dead-letter handling, and job observability.
52. PostgreSQL remains the primary database initially, using connection pooling, indexes, query budgets, pagination, precomputed snapshots, and read replicas only when measurement justifies them.
53. APIs must be rate-limited per provider and tenant, use incremental syncs and backoff, and preserve a manual path during provider outages.
54. AI work should be queued by priority/risk, use smaller models for classification and stronger models only when justified, cache safe repeatable results, and track latency, token use, failure rate, and cost per client.
55. Operational monitoring must cover application errors, job lag/failures, provider health, database load, delivery failures, AI spend, and client-health freshness. Alerts should be actionable rather than merely numerous.

### Phase 5 - 100+ clients

56. National expansion requires true multi-tenancy: every tenant-owned record carries an agency/tenant boundary, and authorization, queries, jobs, storage, logs, and quotas preserve that isolation.
57. A shared PostgreSQL deployment with tenant keys and RLS is the starting model; large or regulated tenants may later move to isolated databases/projects without changing domain contracts.
58. Enterprise controls become necessary: SSO/MFA options, least privilege, tenant-scoped audit export, secret rotation, retention/deletion policies, encryption, backup/restore tests, incident response, and documented recovery objectives.
59. Reliability evolves through stateless application instances, independently scalable workers, tenant-aware rate limits, graceful degradation, health checks, capacity tests, and tested disaster recovery.
60. AI governance becomes tenant-aware: budgets, approved models, prompt/version auditability, redaction, retention controls, evaluation sets, and safe fallbacks.
61. Future enhancements may include citation/NAP monitoring, rank-grid providers, richer anomaly detection, custom approval policies, client APIs/webhooks, and deeper reporting - only after core accuracy, isolation, and unit economics are proven.

## Explicit non-assumptions / non-goals of the current build

- The demo does **not** assume unrestricted Google Business Profile API access.
- Seeded or mocked data is **not** evidence of a completed live integration.
- AI output is **not** accepted as fact and is **not** auto-published.
- The current build is **not** a multi-tenant enterprise platform, autonomous agent system, citation crawler, rank tracker, billing system, or full project-management product.
- Phase 3-5 architecture is an evolution plan; it is **not** implemented capacity or reliability evidence.

## Source basis

- `Engineering_Challenge_AI_Powered_Local_SEO_Management_Platform - Google Docs.pdf`
- `mockups/phase-1/index.html`, `mockups/phase-1/js/app.js`, `mockups/phase-1/js/phase2.js`, and `docs/mockups/README.md`
- `locally_phase_3_presentation.html`
- `docs/planning/codex-handoff.md`, `docs/planning/build-prompt.md`, and `docs/design/application-design.md`
- Current application code, Supabase migrations/seed data, integration adapters, domain rules, and tests
