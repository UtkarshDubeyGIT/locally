# Build Prompt — Locally End-to-End Demo App

You are building **Locally**, a working end-to-end Local SEO operations platform for a digital marketing agency.

This is not a UI-only mockup. Build a functional application that evaluators can log into, use, and understand without additional setup beyond seeded demo credentials.

## First instruction: read `docs/design/application-design.md`

Before writing or modifying code:

1. Locate and read `docs/design/application-design.md` completely.
2. Inspect the existing repository structure, routes, components, styles, and data flow.
3. Treat `docs/design/application-design.md` as the source of truth for:
   - visual language;
   - layout;
   - typography;
   - spacing;
   - colors;
   - component patterns;
   - responsive behavior;
   - interaction style;
   - page composition.
4. Reuse existing components and styling wherever possible.
5. Do not replace the design with a generic dashboard template.
6. Do not invent a new visual system unless `docs/design/application-design.md` explicitly leaves something undefined.
7. If there is a conflict:
   - this prompt is authoritative for product behavior, workflow, roles, data, and acceptance criteria;
   - `docs/design/application-design.md` is authoritative for visual implementation and interface design.
8. Document any unavoidable deviation from `docs/design/application-design.md` in the README.

Do not start implementation until you have summarized, internally, the existing architecture and the rules from `docs/design/application-design.md`.

---

# Product

**Locally** is an internal Local SEO operations platform used by digital marketing agencies.

It helps an agency:

- onboard local-business clients;
- manage multiple business locations;
- record Google Business Profile health;
- manage customer reviews;
- generate safe AI-assisted review replies;
- run website audits;
- research competitors;
- convert findings into actions;
- prepare monthly client updates;
- collect client feedback.

The application should feel like a usable early-stage SaaS product, not a collection of disconnected demo pages.

---

# Example agency and client

The agency dashboard should show multiple client businesses:

- Madhur Sweets
- Sharma Dental Clinic
- FitZone Gym
- Brew House Café
- Glow Salon
- CityCare Diagnostics

Only **Madhur Sweets** needs a complete working workflow.

Madhur Sweets is a sweet-shop chain with four locations:

- Dwarka
- Rohini
- Noida Sector 18
- Lajpat Nagar

Noida Sector 18 should be the weakest-performing location so the demo has a clear narrative.

Use realistic seeded data for:

- ratings;
- review counts;
- location health;
- reviews;
- actions;
- audit scores;
- competitors;
- reports;
- client goals and pain points.

---

# Core product philosophy

Phase 1 principle:

> Replace scattered spreadsheets and manual checks with one trusted workspace while keeping sensitive actions human-controlled.

Phase 2 principle:

> Automate collection, repetition, and preparation, but retain human control over judgment, public communication, and business-critical changes.

The application must visibly distinguish:

- live API data;
- manually entered data;
- mocked GBP data;
- seeded demo data.

Use subtle source labels such as:

- `Live API`
- `Manual`
- `Mock GBP`
- `Demo data`

Also show timestamps and verification metadata where relevant:

- `Updated 2 hours ago`
- `Verified by Aditi`

Do not build a separate enterprise audit-log product.

---

# Technical stack

Use the existing repository stack where possible.

Preferred stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row-Level Security
- Zod
- Resend
- Google PageSpeed Insights API
- Google Places API
- one server-side LLM provider
- Vercel deployment

Keep the architecture a modular monolith.

Do not introduce:

- microservices;
- Kafka;
- Kubernetes;
- queues unless already present and genuinely required;
- autonomous agents;
- vector databases;
- RAG;
- event sourcing.

---

# Three real user roles

Implement real Supabase authentication.

## 1. Agency owner

Seed account:

`owner@locally.demo`

Can:

- view all clients;
- view all locations;
- manage agency clients;
- see internal notes;
- approve sensitive review replies;
- approve monthly client updates;
- view agency-wide dashboard metrics;
- manage or view the SEO employee;
- perform all agency actions.

## 2. SEO employee

Seed account:

`specialist@locally.demo`

Can:

- view assigned clients;
- review onboarding submissions;
- complete agency-assisted onboarding;
- manage client locations;
- run website audits;
- search and save competitors;
- manage reviews;
- generate AI reply drafts;
- edit reply drafts;
- submit replies for approval;
- create and complete actions;
- write monthly client commentary.

Cannot:

- approve high-risk replies;
- send client reports without owner approval;
- access clients not assigned to them.

## 3. Client owner

Seed account:

`client@madhursweets.demo`

Can access only Madhur Sweets.

Can:

- view a read-only client dashboard;
- view approved business metrics;
- view locations;
- view open and completed client-visible actions;
- view approved monthly updates;
- submit report feedback.

Cannot:

- access other clients;
- view internal agency notes;
- view draft replies;
- view AI metadata;
- view draft reports;
- view internal agency operations.

Use one shared demo password through:

`DEMO_PASSWORD`

Display demo credentials on the login page inside a collapsible panel.

Use real role-based redirects after login.

Do not implement a fake role switcher as the primary auth mechanism.

---

# End-to-end demo flow

The application must support this complete workflow:

1. Client owner receives an onboarding email.
2. Client owner logs in and completes an onboarding survey.
3. SEO employee logs in and reviews the submission.
4. SEO employee completes agency-only onboarding fields.
5. SEO employee activates Madhur Sweets and confirms its four locations.
6. SEO employee reviews baseline GBP-health data.
7. SEO employee runs a real PageSpeed audit for a location page.
8. SEO employee searches for and saves competitors through Google Places.
9. A seeded/mock Google review appears in the review inbox.
10. The LLM classifies the review and generates a structured reply draft.
11. SEO employee edits the draft.
12. SEO employee submits the draft for approval.
13. Agency owner approves the reply.
14. Publishing to Google is simulated and marked as `Mock published`.
15. A review or website-audit finding is converted into an action.
16. SEO employee updates the action from Open to In Progress to Done.
17. The system assembles a monthly client update from stored metrics.
18. SEO employee writes one commentary field: `Agency summary and next steps`.
19. Agency owner clicks `Approve and Send`.
20. Resend emails the client a link to the approved update.
21. Client owner logs in, views the approved update, and submits feedback.

Persist all important state in Supabase.

---

# Feature 1 — Authentication and authorization

Implement:

- Supabase Auth;
- profile table;
- role field;
- agency membership;
- optional assigned-client relation;
- server-side authorization checks;
- Supabase RLS where practical;
- role-aware navigation;
- role-aware redirects.

Do not rely only on frontend hiding.

At minimum:

- agency owner can access all agency records;
- SEO employee can access assigned clients;
- client owner can access only their own client;
- client owner cannot read internal notes, drafts, AI metadata, or other clients;
- SEO employee cannot approve high-risk replies;
- only agency owner can approve and send monthly updates.

---

# Feature 2 — Agency dashboard

Agency owner and SEO employee should see a dashboard containing:

- client cards or table;
- client status;
- number of locations;
- average rating;
- reviews requiring attention;
- open actions;
- latest monthly-update status.

Madhur Sweets must link to a detailed client workspace.

Other clients may use seeded summary data.

Include one clear “Needs attention” section.

Example:

- Critical review at Noida Sector 18
- Dwarka landing page has poor performance
- Monthly update awaiting approval
- Two actions overdue

---

# Feature 3 — Client onboarding

Support both:

1. client-completed survey;
2. agency-assisted review.

## Client survey

Collect:

- business name;
- industry;
- primary contact;
- website;
- number of locations;
- branch details;
- important products/services;
- target customers;
- target cities/areas;
- business goals;
- current pain points;
- known competitors;
- preferred reporting cadence;
- preferred communication method.

For Madhur Sweets, include examples such as:

- wedding sweets;
- festive gift boxes;
- bulk/corporate orders;
- increasing store visits;
- improving review response rate;
- fixing weak branch performance;
- seasonal opening hours.

## Agency-only onboarding fields

Collect:

- priority locations;
- target keywords;
- response tone;
- prohibited claims;
- escalation categories;
- refund/compensation policy notes;
- Google access status;
- initial GBP-health notes;
- initial website-audit findings;
- initial recommended actions.

## Onboarding workflow

Use these states:

- `draft`
- `submitted_by_client`
- `under_agency_review`
- `active`

The client can save and submit.

The SEO employee can review and activate.

---

# Feature 4 — Client and location registry

For each client store:

- business identity;
- goals;
- pain points;
- response tone;
- prohibited claims;
- escalation rules;
- reporting cadence;
- onboarding status;
- active status.

For each location store:

- branch name;
- address;
- city;
- phone;
- website or landing-page URL;
- business category;
- opening hours;
- Google Place ID where available;
- current status.

Client owner must see only Madhur Sweets locations.

---

# Feature 5 — GBP health

Do not depend on restricted Google Business Profile API approval.

Use manual and seeded/mock GBP information.

Display:

- business name;
- address;
- phone;
- website;
- opening hours;
- primary category;
- additional categories;
- profile completeness;
- photo freshness;
- verification status.

Statuses:

- Pass
- Warning
- Fail
- Needs verification

Show source and freshness.

Example:

`Opening hours — Needs verification — Manual — Verified by Aditi`

Optional seeded performance snapshot:

- Search impressions
- Maps impressions
- Website clicks
- Call clicks
- Direction requests

Clearly label this data as `Mock GBP` or `Demo data`.

---

# Feature 6 — Review management

Reviews may be seeded and treated as mocked GBP synchronization.

Review fields:

- reviewer;
- rating;
- text;
- location;
- received date;
- category;
- severity;
- source;
- status.

Statuses:

- Needs reply
- Draft
- Awaiting approval
- Approved
- Mock published
- Escalated

Support:

- review inbox;
- filters;
- review detail;
- internal note;
- AI analysis;
- AI draft;
- employee editing;
- submit for approval;
- owner approval;
- mock publish.

High-risk reviews must require owner approval.

Seed at least:

- a positive review;
- a normal complaint;
- a stale-product complaint;
- a hygiene complaint;
- a staff-behavior complaint;
- a delivery complaint.

---

# Feature 7 — AI review assistant

This is the main implemented AI feature.

The LLM input should include:

- business name;
- location;
- industry/category;
- review rating;
- review text;
- preferred response tone;
- escalation categories;
- prohibited claims;
- relevant policy notes.

Require structured output validated with Zod.

Example:

```json
{
  "sentiment": "negative",
  "category": "product_quality",
  "severity": "high",
  "requiresManagerApproval": true,
  "factsToVerify": [
    "Whether the customer was offered a replacement"
  ],
  "suggestedReply": "..."
}
```

Store:

- structured analysis;
- suggested reply;
- model name;
- generation timestamp;
- facts to verify;
- manager-approval requirement.

Safety rules:

- never auto-publish;
- never promise a refund without policy permission;
- never admit liability;
- never claim an investigation occurred unless confirmed;
- never expose internal notes;
- always allow human editing;
- clearly show AI output as a draft;
- show warning badges on sensitive reviews.

Keep the LLM provider behind a small server-side adapter.

---

# Feature 8 — Real PageSpeed website audit

Use Google PageSpeed Insights API.

Allow an SEO employee to run an audit for a location URL.

Display:

- Performance
- Accessibility
- SEO
- Best Practices
- selected failed audits
- recommendations

Also include a small manual Local SEO checklist:

- correct business name;
- correct address;
- correct phone;
- branch-specific page;
- Google Map embed;
- opening hours;
- click-to-call;
- directions link;
- local testimonials;
- local keyword relevance.

Each failed item should have:

`Create action`

Handle API failures gracefully.

Show source:

`Live PageSpeed API`

---

# Feature 9 — Google Places competitor discovery

Use Google Places API where available.

Allow the SEO employee to:

- search local competitors;
- select a place;
- save the competitor against a location;
- add an analyst note.

Display:

- name;
- rating;
- review count;
- category;
- address;
- Google Place ID;
- optional distance.

Do not claim Places gives exact SEO rankings.

Add a manual fallback if the API fails.

Respect Google attribution requirements.

---

# Feature 10 — Streamlined Action Queue

Do not build a full project-management product.

Actions may come from:

- review;
- website audit;
- GBP-health finding;
- competitor observation;
- manual finding.

Store only:

- title;
- client;
- optional location;
- source type;
- source record ID;
- priority;
- assigned employee;
- optional due date;
- status.

Priority:

- Low
- Medium
- High

Status:

- Open
- In Progress
- Done

Support:

- create;
- assign;
- edit priority;
- change status;
- mark complete.

Skip:

- subtasks;
- dependencies;
- attachments;
- complex comments;
- advanced kanban;
- workload analytics.

---

# Feature 11 — Streamlined Monthly Client Update

Do not build a complete report builder.

Create one monthly update page that automatically assembles:

- reviews received;
- replies completed;
- average rating;
- rating change;
- website audit score;
- open actions;
- completed actions;
- short branch comparison.

The SEO employee edits one text field:

`Agency summary and next steps`

Workflow:

- `draft`
- `awaiting_owner_approval`
- `approved`
- `sent`

Agency owner has one primary action:

`Approve and Send`

On approval:

- persist approved state;
- send email through Resend;
- include a link to the client portal;
- mark the update as sent.

PDF generation is not required.

If Resend is unavailable, persist the approved/sent state and show a safe demo fallback message without crashing.

---

# Feature 12 — Client portal

Read-only portal for Madhur Sweets owner.

Show:

- overall summary;
- four branch cards;
- approved metrics;
- open/completed client-visible actions;
- approved monthly updates;
- agency summary and next steps;
- feedback form.

Do not show:

- internal notes;
- AI metadata;
- review drafts;
- draft reports;
- other clients;
- internal approvals.

Feedback options:

- Useful
- Partly useful
- Not useful

Optional categories:

- More explanation
- More competitor information
- Clearer next steps
- Different metrics
- Other

Persist feedback.

---

# Data model

Use a practical Supabase schema.

## `agencies`

- id
- name
- created_at

## `profiles`

- id
- full_name
- role
- agency_id
- client_id nullable
- active
- created_at

## `clients`

- id
- agency_id
- business_name
- industry
- website
- status
- goals
- pain_points
- response_tone
- prohibited_claims
- escalation_rules
- reporting_cadence
- created_at
- updated_at

## `client_assignments`

- id
- client_id
- user_id
- created_at

## `locations`

- id
- client_id
- name
- address
- city
- phone
- website_url
- category
- opening_hours
- google_place_id
- status
- created_at
- updated_at

## `onboarding_submissions`

- id
- client_id
- submitted_by
- status
- answers_json
- agency_notes
- submitted_at
- reviewed_at
- reviewed_by

## `gbp_health_checks`

- id
- location_id
- check_name
- status
- value
- note
- source_type
- verified_by
- verified_at
- updated_at

## `location_performance_snapshots`

- id
- location_id
- period
- search_impressions
- maps_impressions
- website_clicks
- call_clicks
- direction_requests
- source_type
- created_at

## `reviews`

- id
- location_id
- external_review_id
- reviewer_name
- rating
- review_text
- review_date
- category
- severity
- status
- source_type
- created_at
- updated_at

## `review_replies`

- id
- review_id
- draft_text
- final_text
- ai_metadata_json
- facts_to_verify_json
- status
- created_by
- approved_by
- approved_at
- mock_published_at
- created_at
- updated_at

## `review_internal_notes`

- id
- review_id
- note
- created_by
- created_at

## `website_audits`

- id
- location_id
- page_url
- performance_score
- accessibility_score
- seo_score
- best_practices_score
- raw_result_json
- source_type
- run_by
- created_at

## `website_audit_items`

- id
- audit_id
- check_name
- category
- status
- details
- recommendation
- check_type

## `competitors`

- id
- location_id
- name
- google_place_id
- rating
- review_count
- category
- address
- source_type
- analyst_note
- created_by
- created_at

## `actions`

- id
- client_id
- location_id nullable
- source_type
- source_id nullable
- title
- priority
- status
- assigned_to
- due_date nullable
- created_by
- created_at
- completed_at

## `monthly_updates`

- id
- client_id
- month
- metrics_json
- agency_summary
- status
- created_by
- approved_by
- approved_at
- sent_at
- created_at
- updated_at

## `report_feedback`

- id
- monthly_update_id
- client_user_id
- usefulness
- categories_json
- comment
- submitted_at

Do not over-normalize.

Use enums or check constraints where appropriate.

---

# Suggested routes

Use the current project structure if it already defines routes.

Suggested structure:

## Public/auth

- `/login`
- `/onboarding`

## Agency

- `/agency`
- `/agency/clients`
- `/agency/clients/[clientId]`
- `/agency/clients/[clientId]/onboarding`
- `/agency/clients/[clientId]/locations/[locationId]`
- `/agency/reviews`
- `/agency/reviews/[reviewId]`
- `/agency/actions`
- `/agency/reports`
- `/agency/reports/[reportId]`

## Client

- `/client`
- `/client/locations`
- `/client/reports`
- `/client/reports/[reportId]`

Use role-aware navigation and layouts.

---

# External integrations

Implement for real:

- Supabase Auth
- Supabase database
- LLM API
- PageSpeed Insights API
- Google Places API
- Resend
- Vercel deployment

Mock or seed:

- Google Business Profile review synchronization
- Google Maps reply publishing
- GBP performance metrics
- exact local rank tracking
- competitor ranking history

Use adapters.

Example:

```ts
interface BusinessProfileProvider {
  listReviews(locationId: string): Promise<Review[]>;
  publishReply(reviewId: string, text: string): Promise<void>;
  getPerformance(locationId: string): Promise<LocationPerformance>;
}
```

Implement:

`MockBusinessProfileProvider`

Optionally leave a documented placeholder for:

`GoogleBusinessProfileProvider`

---

# Error handling and resilience

The demo must not fail completely if an external service is unavailable.

Implement:

- loading states;
- retry affordances;
- clear error messages;
- manual fallback for Places;
- persisted seeded reviews;
- PageSpeed error fallback;
- LLM error fallback;
- Resend error fallback;
- no personal Google-account dependency;
- no secrets exposed in the browser.

Use server-side calls for private APIs.

Validate all external payloads.

---

# Environment variables

Document:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

LLM_API_KEY=
LLM_MODEL=

GOOGLE_MAPS_API_KEY=

RESEND_API_KEY=
RESEND_FROM_EMAIL=

NEXT_PUBLIC_APP_URL=
DEMO_PASSWORD=
```

Keep private keys server-only.

---

# Seed data

Create an idempotent seed process.

Seed:

- one agency;
- three demo users;
- six clients;
- four Madhur Sweets locations;
- assignments;
- onboarding submission;
- GBP-health checks;
- mock performance snapshots;
- reviews;
- review replies in multiple statuses;
- PageSpeed demo fallback;
- competitors;
- actions;
- one draft monthly update;
- one approved monthly update;
- client feedback example.

The seed should be safe to run multiple times.

Optional:

- owner-only `Reset demo data` action.

---

# Implementation order

## Stage 1

- inspect repository;
- read `docs/design/application-design.md`;
- preserve existing Phase 1 work;
- configure Supabase;
- create schema;
- create seed process;
- implement auth and role-aware layouts.

## Stage 2

- agency dashboard;
- client directory;
- Madhur Sweets detail;
- onboarding survey;
- agency review and activation;
- locations.

## Stage 3

- review inbox;
- review detail;
- internal note;
- AI analysis;
- AI reply draft;
- employee edit;
- approval workflow;
- mock publish.

This is the highest-priority vertical slice.

## Stage 4

- PageSpeed audit;
- manual checklist;
- action creation;
- Places competitor search;
- save competitor.

## Stage 5

- streamlined action queue.

## Stage 6

- monthly update;
- employee commentary;
- owner approval;
- Resend email;
- client portal;
- feedback.

## Stage 7

- polish;
- error states;
- trust labels;
- README;
- deployment.

Do not start lower-priority polish before the main review workflow works end-to-end.

---

# Acceptance criteria

The application is complete when:

1. `docs/design/application-design.md` has been followed consistently.
2. Three real seeded accounts can log in.
3. Agency owner sees all clients.
4. SEO employee sees assigned clients.
5. Client owner sees only Madhur Sweets.
6. Client onboarding survey can be saved and submitted.
7. SEO employee can review and activate the onboarding.
8. Madhur Sweets has four locations.
9. GBP-health data is visible with honest source labels.
10. Review inbox works.
11. A review can be opened.
12. AI analysis and structured draft can be generated.
13. SEO employee can edit and submit for approval.
14. Agency owner can approve.
15. Reply can be mock-published.
16. Real PageSpeed audit can run.
17. Competitor can be found through Places and saved.
18. Review or audit issue can create an action.
19. Action can be assigned and completed.
20. Monthly update can be assembled from stored metrics.
21. SEO employee can write commentary.
22. Agency owner can approve and send.
23. Resend sends an email or uses a safe fallback.
24. Client owner can view the approved update.
25. Client owner can submit feedback.
26. Internal notes and drafts are hidden from client.
27. Live/manual/mock/demo labels appear where relevant.
28. App is deployed on Vercel.
29. README documents setup, architecture, assumptions, integrations, AI safety, demo credentials, and design deviations.

---

# Non-goals

Do not build:

- real Google Business Profile OAuth;
- live GBP sync;
- real Google Maps reply publishing;
- automatic exact local ranking tracking;
- Excel import;
- CSV migration;
- citation crawling;
- NAP crawler;
- autonomous AI agents;
- RAG;
- vector database;
- enterprise audit history;
- complex role editor;
- background queues;
- microservices;
- billing;
- Phase 3 workload management;
- Phase 4 infrastructure;
- full report builder;
- PDF editor;
- full project-management product.

---

# README requirements

Document:

- product overview;
- problem statement;
- demo scope;
- roles;
- end-to-end workflow;
- architecture;
- database design;
- setup;
- environment variables;
- seed process;
- demo credentials;
- real integrations;
- mocked integrations;
- AI prompt strategy;
- AI safety controls;
- authorization and RLS;
- assumptions;
- trade-offs;
- Vercel deployment;
- future evolution;
- any deviation from `docs/design/application-design.md`.

---

# Engineering rules

- Inspect before editing.
- Read `docs/design/application-design.md` completely.
- Reuse existing components.
- Preserve current working screens.
- Keep TypeScript strict.
- Validate server inputs.
- Keep secrets server-side.
- Enforce authorization on server operations.
- Use adapters for external APIs.
- Store structured LLM output.
- Never auto-publish AI drafts.
- Label mock data honestly.
- Prefer a complete working vertical slice over extra pages.
- Do not claim unimplemented behavior.
- Keep the app deployable to Vercel throughout development.
- Run lint, type checking, and build before finishing.

---

# Final product story

The completed application should communicate this clearly:

> A sweet-shop chain approaches a Local SEO agency. The client shares its business needs through a structured survey. The agency completes onboarding, manages four locations, audits the website, discovers competitors, handles a critical review safely using AI plus human approval, converts findings into actions, and sends a clear monthly update that the client can read and rate.

Build this exact story end-to-end before adding anything else.
