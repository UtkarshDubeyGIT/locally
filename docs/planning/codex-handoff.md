# Codex Handoff — Build the End-to-End Locally Demo

## Mission

Build a usable, end-to-end demo application for **Locally**, an internal Local SEO operations platform for digital marketing agencies.

The application must be usable by evaluators immediately after deployment. It should feel like a real product an agency could begin using with a local business client, not like a disconnected AI demo.

The example fully implemented client is:

**Madhur Sweets** — a sweet-shop chain with 3–4 locations across Delhi/Noida.

Show several other clients in the agency dashboard, but only Madhur Sweets needs complete data and workflows.

This handoff supersedes earlier broad mockup-only plans for the working demo. Phase 3 and Phase 4 will be explained separately through presentations. The application itself should focus on a strong Phase 1 foundation plus carefully selected Phase 2 automation.

---

# 1. Product Positioning

Locally helps a Local SEO agency manage:

- client onboarding;
- business locations;
- Google Business Profile health;
- reviews and reply workflows;
- website audits;
- competitor research;
- actions arising from findings;
- monthly client updates;
- client feedback.

The Phase 1 philosophy was:

> Replace scattered spreadsheets and manual checks with one trusted workspace while keeping client-facing judgment and sensitive actions human-controlled.

The Phase 2 principle is:

> Automate collection, repetition, and preparation, but retain human control over judgment, public communication, and business-critical changes.

The working demo should preserve both principles.

---

# 2. Target Users

Implement real authentication for three personas.

## Agency Owner

Can:

- view all clients;
- add and manage agency clients;
- view all locations;
- approve sensitive review replies;
- approve monthly client updates;
- manage the agency’s SEO employee;
- view agency-wide metrics;
- see all internal notes and actions.

## SEO Employee

Can:

- access assigned clients;
- review client onboarding submissions;
- complete assisted onboarding;
- manage locations;
- run website audits;
- manage reviews;
- generate and edit AI reply drafts;
- submit replies for approval;
- create and complete actions;
- write monthly client commentary.

## Client Owner

Can access only their own business.

For the demo, the client owner belongs to Madhur Sweets.

Can:

- view a read-only dashboard;
- view approved business metrics;
- view locations;
- view completed and pending actions;
- view approved monthly client updates;
- submit report feedback.

Cannot:

- access other clients;
- see internal agency notes;
- see draft replies;
- see AI prompts;
- see internal audit information;
- approve internal agency workflows unless explicitly added later.

---

# 3. Demo Accounts

Use Supabase Auth with three seeded demo accounts:

- `owner@locally.demo`
- `specialist@locally.demo`
- `client@madhursweets.demo`

Use one shared demo password configured through an environment variable such as:

`DEMO_PASSWORD`

Display demo credentials on the login page in a collapsible panel.

After login, redirect users according to role.

Do not fake authentication with a role switcher.

---

# 4. Example Agency Data

Show these clients in the agency dashboard:

- Madhur Sweets
- Sharma Dental Clinic
- FitZone Gym
- Brew House Café
- Glow Salon
- CityCare Diagnostics

Only Madhur Sweets needs complete end-to-end data.

## Madhur Sweets locations

Use 4 locations:

- Dwarka
- Rohini
- Noida Sector 18
- Lajpat Nagar

Seed realistic data for:

- ratings;
- review counts;
- GBP health;
- website audit scores;
- actions;
- reports;
- competitors;
- reviews;
- client goals.

Noida Sector 18 should be the weakest branch so that the application has a clear narrative.

---

# 5. Main Demo Story

The application must support this end-to-end journey:

1. Client owner receives an onboarding email.
2. Client owner completes an initial business survey.
3. SEO employee logs in and reviews the submission.
4. SEO employee completes assisted onboarding and activates Madhur Sweets.
5. The employee reviews the business locations and baseline GBP health.
6. The employee runs a real PageSpeed audit for a location page.
7. The employee discovers and saves competitors through Google Places.
8. A seeded or mocked Google review appears in the review inbox.
9. The LLM analyzes the review and generates a reply draft.
10. The SEO employee edits the draft and submits it for approval.
11. The agency owner approves the reply.
12. Publishing to Google is simulated and recorded as a mock integration.
13. A review or audit finding is converted into an action.
14. The employee completes the action.
15. The system assembles a monthly client update from stored data.
16. The SEO employee writes one summary and next-steps section.
17. The agency owner selects “Approve and Send”.
18. Resend emails the client a link to the approved client update.
19. The client owner logs in, reads the update, and submits feedback.

All important states must persist in Supabase.

---

# 6. Final Feature Scope

## 6.1 Real authentication and role-aware access

Implement:

- Supabase Auth;
- user profiles;
- role-based redirects;
- server-side authorization checks;
- Supabase row-level security where appropriate.

Roles:

- `agency_owner`
- `seo_employee`
- `client_owner`

Do not rely only on hiding frontend elements.

---

## 6.2 Agency dashboard

Agency owner and SEO employee see:

- all visible clients;
- client status;
- average rating;
- locations;
- open actions;
- reviews requiring attention;
- latest monthly update status.

Madhur Sweets should link to a detailed workspace.

Other clients may use believable seeded summary data.

---

## 6.3 Client onboarding

Support both:

1. Client-completed survey
2. Agency-assisted onboarding review

### Client survey fields

Collect:

- business name;
- industry;
- primary contact;
- website;
- number of locations;
- location details;
- important products/services;
- target customers;
- target cities/areas;
- business goals;
- current pain points;
- known competitors;
- current marketing channels;
- preferred reporting cadence;
- preferred communication channel.

For Madhur Sweets, include sweet-shop-specific examples:

- wedding sweets;
- festive gift boxes;
- bulk/corporate orders;
- store visits;
- delivery;
- seasonal opening hours.

### Agency review fields

Add:

- priority locations;
- target keywords;
- brand response tone;
- prohibited claims;
- review escalation categories;
- refund/compensation policy notes;
- Google access status;
- website audit baseline;
- initial GBP health notes;
- initial recommended actions.

### Workflow

`draft → submitted_by_client → under_agency_review → active`

The client can save and submit the survey.

The SEO employee can review, edit agency-only fields, and activate the client.

---

## 6.4 Client and location registry

For each client store:

- business identity;
- goals;
- pain points;
- preferences;
- reporting cadence;
- status.

For each location store:

- branch name;
- address;
- phone;
- website/landing-page URL;
- category;
- opening hours;
- Google Place ID where available;
- status.

The client owner should see only their own locations.

---

## 6.5 GBP health dashboard

Use manual health checks and seeded/mock performance values.

Do not depend on restricted Google Business Profile APIs.

Display:

- business name;
- address;
- phone;
- website;
- opening hours;
- categories;
- profile completeness;
- photo freshness;
- verification status.

Statuses:

- Pass
- Warning
- Fail
- Needs verification

Performance snapshot may include seeded/mock values:

- Search impressions;
- Maps impressions;
- website clicks;
- call clicks;
- direction requests.

Clearly label the source:

- Manual
- Mock GBP
- Demo data
- Live API

---

## 6.6 Review inbox

Reviews may be seeded and treated as mocked GBP synchronization.

Display:

- reviewer;
- rating;
- review text;
- branch;
- received date;
- status;
- severity;
- category;
- source.

Statuses:

- Needs reply
- Draft
- Awaiting approval
- Approved
- Mock published
- Escalated

Support:

- internal note;
- AI analysis;
- AI draft;
- employee editing;
- submit for approval;
- owner approval;
- mock publish.

Do not allow the SEO employee to approve high-risk replies.

---

## 6.7 AI review assistant

This is the main implemented AI feature.

Input:

- business name;
- location;
- business category;
- review rating;
- review text;
- client response tone;
- escalation rules;
- prohibited claims;
- relevant internal policy.

Return structured JSON such as:

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

Requirements:

- validate model output with a schema;
- store model name and generation time;
- show warnings before approval;
- allow editing;
- never automatically publish;
- never promise refunds or compensation unless policy explicitly allows it;
- never admit legal liability;
- never claim an investigation happened unless confirmed.

Use an LLM provider through a server-side route or server action.

Keep provider-specific code behind a small adapter.

---

## 6.8 Real PageSpeed website audit

Use the Google PageSpeed Insights API or Lighthouse endpoint that does not require special approval.

For a submitted URL, display:

- performance;
- accessibility;
- SEO;
- best practices;
- major failed audits.

Also support a small manual Local SEO checklist:

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

Each audit issue can create an action.

Handle API failures gracefully.

---

## 6.9 Real Google Places competitor discovery

Use Google Places API where possible.

Allow the SEO employee to:

- search for local competitors;
- select a result;
- save the competitor to a client/location;
- add a manual analyst observation.

Display selected public data:

- name;
- rating;
- review count;
- category;
- address;
- distance if available;
- Google Place ID.

Do not pretend Places provides exact SEO rankings.

Respect Google attribution and data-handling requirements.

If the API is unavailable, show a manual fallback.

---

## 6.10 Streamlined Action Queue

Do not build a full project-management system.

Actions are lightweight work items created from:

- reviews;
- website audit issues;
- GBP health findings;
- competitor observations;
- manual findings.

Each action stores only:

- title;
- client;
- optional location;
- source type;
- source record ID;
- priority;
- responsible employee;
- optional due date;
- status.

Statuses:

- Open
- In Progress
- Done

Priority:

- Low
- Medium
- High

Support:

- create;
- assign;
- change status;
- mark complete.

Skip:

- subtasks;
- dependencies;
- attachments;
- complex comments;
- workload planning;
- advanced task boards.

---

## 6.11 Streamlined Monthly Client Update

Do not build a full reporting engine.

Create one monthly update page that automatically assembles stored metrics:

- reviews received;
- reviews replied to;
- average rating;
- rating change;
- website audit score;
- open actions;
- completed actions;
- short branch comparison.

The SEO employee fills one field:

**Agency summary and next steps**

Workflow:

`draft → awaiting_owner_approval → approved → sent`

Agency owner gets one primary action:

**Approve and Send**

After approval:

- mark report approved;
- send client email through Resend;
- email contains a secure or authenticated link to the client portal report;
- client can open the report after login.

PDF generation is not required.

---

## 6.12 Client portal

Read-only portal for the Madhur Sweets owner.

Show:

- overall client summary;
- branch cards;
- approved metrics;
- action progress;
- approved monthly updates;
- agency summary and next steps;
- feedback form.

Do not show:

- internal notes;
- draft reports;
- draft review replies;
- AI metadata;
- other clients;
- internal agency workflow.

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

---

## 6.13 Passive trust metadata

Do not create a separate audit/provenance module.

Show small labels beside important records:

- Live API
- Manual
- Mock GBP
- Demo data

Also show:

- Updated time
- Verified by, where applicable

Examples:

- `Mock GBP · Updated 2 hours ago`
- `Manual · Verified by Aditi`
- `Live PageSpeed API · Run just now`

This should be consistent but visually subtle.

---

# 7. External Integrations

## Implement for real

- Supabase Auth
- Supabase PostgreSQL
- LLM API
- PageSpeed Insights API
- Google Places API
- Resend
- Vercel deployment

## Mock or seed

- Google Business Profile review synchronization
- Google Maps reply publishing
- GBP performance metrics
- exact local search ranking positions
- competitor ranking history

Represent restricted APIs through adapters so a real implementation can replace the mock later.

Suggested interface:

```ts
interface BusinessProfileProvider {
  listReviews(locationId: string): Promise<Review[]>;
  publishReply(reviewId: string, text: string): Promise<void>;
  getPerformance(locationId: string): Promise<LocationPerformance>;
}
```

Implement:

- `MockBusinessProfileProvider`

Optionally leave a documented placeholder for:

- `GoogleBusinessProfileProvider`

---

# 8. Suggested Technical Stack

Preferred:

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- Supabase RLS
- Zod for validation
- Resend
- Google PageSpeed Insights API
- Google Places API
- selected LLM API
- Vercel

Use the existing project stack and design system where possible.

Do not rebuild the UI from scratch if the Phase 1 mockup already exists.

---

# 9. Suggested Architecture

```text
Browser
  ↓
Next.js on Vercel
  ├── Server Components
  ├── Route Handlers / Server Actions
  ├── Authorization checks
  ├── LLM adapter
  ├── PageSpeed adapter
  ├── Places adapter
  ├── Mock GBP adapter
  └── Resend adapter
          ↓
      Supabase
      ├── Auth
      ├── PostgreSQL
      └── Row-Level Security
```

Keep this as a modular monolith.

No microservices, queues, Kafka, Kubernetes, or separate workers are needed for the demo.

---

# 10. Suggested Database Model

Keep the schema practical.

## Core

### `profiles`

- id
- full_name
- role
- agency_id
- client_id nullable
- active
- created_at

### `agencies`

- id
- name
- created_at

### `clients`

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

### `client_assignments`

- id
- client_id
- user_id
- created_at

### `locations`

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

## Onboarding

### `onboarding_submissions`

- id
- client_id
- submitted_by
- status
- answers_json
- agency_notes
- submitted_at
- reviewed_at
- reviewed_by

## GBP health

### `gbp_health_checks`

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

### `location_performance_snapshots`

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

## Reviews

### `reviews`

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

### `review_replies`

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

### `review_internal_notes`

- id
- review_id
- note
- created_by
- created_at

## Website audits

### `website_audits`

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

### `website_audit_items`

- id
- audit_id
- check_name
- category
- status
- details
- recommendation
- check_type

## Competitors

### `competitors`

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

## Actions

### `actions`

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

## Reports

### `monthly_updates`

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

### `report_feedback`

- id
- monthly_update_id
- client_user_id
- usefulness
- categories_json
- comment
- submitted_at

Use enums or constrained strings where useful.

Do not over-normalize the demo.

---

# 11. Authorization and RLS Rules

At minimum:

## Agency owner

- full access to all records in their agency.

## SEO employee

- read/write access only to assigned clients;
- can create and edit review drafts;
- cannot approve high-risk replies;
- can create actions;
- can prepare monthly updates;
- cannot send reports without owner approval.

## Client owner

- read access only to their own client;
- read only approved monthly updates;
- read only safe client-visible metrics/actions;
- can create report feedback;
- cannot read internal notes or drafts.

Enforce this on the server and with Supabase RLS where practical.

---

# 12. Routes / Screens

Adapt to the existing project.

Suggested routes:

## Public/auth

- `/login`
- `/onboarding/[token]` or authenticated client onboarding route

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

Use role-aware layout and navigation.

---

# 13. UI Requirements

Preserve the existing Locally design language.

The product should feel:

- calm;
- trustworthy;
- operational;
- readable;
- B2B SaaS-oriented;
- usable by non-technical agency staff.

Use:

- clear cards;
- readable tables;
- restrained status colors;
- useful empty states;
- loading states;
- validation messages;
- source labels;
- timestamps;
- confirmation dialogs for approval/send actions.

Avoid:

- flashy AI styling;
- robot imagery;
- excessive gradients;
- overly complex enterprise dashboards;
- fake charts with no product value.

---

# 14. Demo Reliability Requirements

Evaluators may use the deployed application.

Implement:

- stable seeded data;
- clear demo credentials;
- graceful external API error states;
- mocked GBP fallback;
- loading and success states;
- no dependency on the developer’s personal Google account;
- no secret exposed to the browser;
- idempotent seed script;
- documented environment variables;
- clear setup instructions;
- Vercel-compatible implementation.

Optional:

- owner-only “Reset demo data” action.

Do not make the whole demo fail if PageSpeed, Places, LLM, or Resend is temporarily unavailable.

---

# 15. Environment Variables

Document at least:

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

Keep service-role and private keys server-only.

---

# 16. Explicit Non-Goals

Do not build:

- real Google Business Profile OAuth;
- live GBP review synchronization;
- real Google Maps reply publishing;
- automated exact local ranking tracking;
- Excel import;
- CSV migration;
- citation crawling;
- NAP crawler;
- autonomous agents;
- vector database;
- RAG unless clearly necessary;
- complex permissions editor;
- enterprise audit log;
- background queues;
- microservices;
- billing;
- advanced Phase 3 team operations;
- Phase 4 scaling infrastructure;
- PDF report editor;
- full project-management features.

Phase 3 and Phase 4 architectural evolution will be presented separately.

---

# 17. Implementation Priority

Build in this order:

## Stage 1 — Foundation

- inspect existing repo;
- preserve Phase 1 UI;
- configure Supabase;
- create schema and seed data;
- implement three-role authentication;
- create role-aware layouts.

## Stage 2 — Client foundation

- agency dashboard;
- clients and locations;
- Madhur Sweets detailed data;
- client onboarding survey;
- agency review and activation.

## Stage 3 — Review workflow

- review inbox;
- review detail;
- internal note;
- LLM analysis;
- reply draft;
- employee edit;
- submit for approval;
- owner approval;
- mock publish.

This is the highest priority end-to-end slice.

## Stage 4 — Audit and competitors

- PageSpeed integration;
- manual checklist;
- create action from issue;
- Places competitor search;
- save competitor and analyst note.

## Stage 5 — Action queue

- create;
- assign;
- priority;
- status;
- mark complete.

## Stage 6 — Monthly update and client portal

- compile metrics;
- employee summary;
- owner approval;
- Resend email;
- client report view;
- client feedback.

## Stage 7 — Polish

- error handling;
- loading states;
- trust labels;
- responsive behavior;
- seed/reset;
- README;
- deployment.

---

# 18. Acceptance Criteria

The task is complete when:

1. Three real seeded accounts can log in.
2. Agency owner sees all clients.
3. SEO employee sees assigned clients.
4. Client owner sees only Madhur Sweets.
5. Client onboarding survey can be submitted and reviewed.
6. Madhur Sweets has four locations.
7. GBP health values are visible and honestly labeled.
8. A review can be opened.
9. AI analysis and a structured reply draft can be generated.
10. SEO employee can edit and submit the reply.
11. Agency owner can approve it.
12. The reply can be mock-published.
13. A real PageSpeed audit can run.
14. A competitor can be found through Places and saved.
15. An audit/review finding can create an action.
16. An action can be assigned and completed.
17. A monthly client update can be generated from stored metrics.
18. SEO employee can add a summary.
19. Agency owner can approve and send it.
20. Resend sends the client email or clearly shows a safe demo fallback.
21. Client owner can view the approved update.
22. Client owner can submit feedback.
23. Internal notes and drafts are hidden from the client.
24. Live/manual/mock/demo source labels appear where relevant.
25. The app is deployed on Vercel.
26. README explains setup, assumptions, architecture, mocked integrations, AI safety, and demo credentials.

---

# 19. README Requirements

Add:

- product overview;
- business problem;
- chosen demo scope;
- user roles;
- end-to-end workflow;
- architecture;
- database design;
- external integrations;
- mocked services;
- AI prompt and safety strategy;
- authorization approach;
- assumptions;
- trade-offs;
- local setup;
- seed instructions;
- environment variables;
- demo credentials;
- Vercel deployment notes;
- future evolution toward Phases 3 and 4.

---

# 20. Engineering Rules

- Inspect before changing.
- Reuse existing components.
- Avoid unnecessary dependencies.
- Keep TypeScript strict.
- Validate all external inputs.
- Keep secrets server-side.
- Check authorization in server operations.
- Use clear service adapters for external APIs.
- Store structured LLM output.
- Never auto-publish AI-generated replies.
- Keep mocked integrations visibly labeled.
- Prefer a complete vertical workflow over many half-built modules.
- Do not claim functionality that is not implemented.

---

# Final Product Story

The deployed demo should tell one coherent story:

> A sweet-shop chain approaches a Local SEO agency. The client shares business needs through a structured survey. The agency completes onboarding, reviews each location, audits the website, discovers competitors, handles a critical review safely with AI assistance and human approval, turns findings into actions, and sends a clear monthly update that the client can review and rate.

Build this story end-to-end before adding anything else.
