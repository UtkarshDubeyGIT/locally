create extension if not exists pgcrypto;
create schema if not exists private;

create type public.user_role as enum ('agency_owner', 'seo_employee', 'client_owner');
create type public.client_status as enum ('draft', 'submitted_by_client', 'under_agency_review', 'active', 'archived');
create type public.health_status as enum ('pass', 'warning', 'fail', 'needs_verification');
create type public.source_type as enum ('live_api', 'manual', 'mock_gbp', 'demo_data');
create type public.review_status as enum ('needs_reply', 'draft', 'awaiting_approval', 'approved', 'mock_published', 'escalated');
create type public.severity_level as enum ('low', 'medium', 'high');
create type public.action_priority as enum ('low', 'medium', 'high');
create type public.action_status as enum ('open', 'in_progress', 'done');
create type public.report_status as enum ('draft', 'awaiting_owner_approval', 'approved', 'sent');
create type public.delivery_status as enum ('pending', 'sent', 'failed');

create table public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  business_name text not null,
  industry text not null,
  website text,
  primary_contact_name text,
  primary_contact_email text,
  status public.client_status not null default 'draft',
  goals jsonb not null default '[]'::jsonb,
  pain_points jsonb not null default '[]'::jsonb,
  reporting_cadence text not null default 'monthly',
  preferred_communication text not null default 'email',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null,
  agency_id uuid not null references public.agencies(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.client_assignments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (client_id, user_id)
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  address text not null,
  city text not null,
  phone text,
  website_url text,
  category text not null,
  opening_hours jsonb not null default '{}'::jsonb,
  latitude numeric(9,6),
  longitude numeric(9,6),
  google_place_id text,
  status text not null default 'active',
  image_path text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, name)
);

create table public.onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.clients(id) on delete cascade,
  submitted_by uuid references public.profiles(id) on delete set null,
  status public.client_status not null default 'draft',
  current_step smallint not null default 1 check (current_step between 1 and 4),
  answers_json jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.client_policies (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.clients(id) on delete cascade,
  priority_location_ids uuid[] not null default '{}',
  target_keywords text[] not null default '{}',
  response_tone text not null default 'Warm, concise and respectful',
  prohibited_claims text[] not null default '{}',
  escalation_categories text[] not null default '{}',
  compensation_policy text,
  google_access_status text,
  initial_gbp_notes text,
  initial_audit_findings text,
  initial_recommended_actions text,
  updated_at timestamptz not null default now()
);

create table public.gbp_health_checks (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  check_name text not null,
  status public.health_status not null,
  value text,
  note text,
  source_type public.source_type not null,
  verified_by uuid references public.profiles(id) on delete set null,
  verified_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (location_id, check_name)
);

create table public.location_performance_snapshots (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  period date not null,
  search_impressions integer not null default 0,
  maps_impressions integer not null default 0,
  website_clicks integer not null default 0,
  call_clicks integer not null default 0,
  direction_requests integer not null default 0,
  average_rating numeric(3,2),
  review_count integer not null default 0,
  source_type public.source_type not null,
  created_at timestamptz not null default now(),
  unique (location_id, period)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  external_review_id text unique,
  reviewer_name text not null,
  rating smallint not null check (rating between 1 and 5),
  review_text text not null,
  review_date timestamptz not null,
  category text,
  severity public.severity_level not null default 'low',
  status public.review_status not null default 'needs_reply',
  source_type public.source_type not null default 'mock_gbp',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null unique references public.reviews(id) on delete cascade,
  draft_text text,
  final_text text,
  analysis_json jsonb,
  facts_to_verify jsonb not null default '[]'::jsonb,
  safety_warnings jsonb not null default '[]'::jsonb,
  warnings_acknowledged_at timestamptz,
  warnings_acknowledged_by uuid references public.profiles(id) on delete set null,
  requires_manager_approval boolean not null default false,
  model_name text,
  prompt_version text,
  generated_at timestamptz,
  status public.review_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  mock_published_by uuid references public.profiles(id) on delete set null,
  mock_published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.review_internal_notes (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  note text not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.website_audits (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  page_url text not null,
  strategy text not null check (strategy in ('mobile', 'desktop')),
  performance_score integer check (performance_score between 0 and 100),
  accessibility_score integer check (accessibility_score between 0 and 100),
  seo_score integer check (seo_score between 0 and 100),
  best_practices_score integer check (best_practices_score between 0 and 100),
  raw_result_json jsonb,
  source_type public.source_type not null,
  run_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.website_audit_items (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references public.website_audits(id) on delete cascade,
  check_name text not null,
  category text not null,
  status public.health_status not null,
  details text,
  recommendation text,
  check_type text not null check (check_type in ('lighthouse', 'manual'))
);

create table public.competitors (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  name text not null,
  google_place_id text,
  rating numeric(3,2),
  review_count integer,
  category text,
  address text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  distance_km numeric(8,2),
  google_maps_uri text,
  source_type public.source_type not null,
  analyst_note text,
  captured_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (location_id, google_place_id)
);

create table public.actions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  source_type text not null,
  source_id uuid,
  title text not null,
  priority public.action_priority not null default 'medium',
  status public.action_status not null default 'open',
  assigned_to uuid references public.profiles(id) on delete set null,
  due_date date,
  client_visible boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create unique index actions_source_unique on public.actions(source_type, source_id)
where source_id is not null and status <> 'done';

create table public.monthly_updates (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  month date not null,
  metrics_json jsonb not null default '{}'::jsonb,
  agency_summary text,
  status public.report_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  sent_at timestamptz,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, month)
);

create table public.report_feedback (
  id uuid primary key default gen_random_uuid(),
  monthly_update_id uuid not null references public.monthly_updates(id) on delete cascade,
  client_user_id uuid not null references public.profiles(id) on delete cascade,
  usefulness text not null check (usefulness in ('useful', 'partly_useful', 'not_useful')),
  categories_json jsonb not null default '[]'::jsonb,
  comment text,
  submitted_at timestamptz not null default now(),
  unique (monthly_update_id, client_user_id)
);

create table public.email_deliveries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  monthly_update_id uuid references public.monthly_updates(id) on delete cascade,
  kind text not null check (kind in ('onboarding', 'monthly_update')),
  recipient text not null,
  provider_message_id text,
  status public.delivery_status not null default 'pending',
  error_message text,
  attempted_by uuid references public.profiles(id) on delete set null,
  attempted_at timestamptz not null default now()
);

create table public.integration_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  integration text not null check (integration in ('openai', 'places', 'pagespeed', 'email')),
  usage_date date not null default (now() at time zone 'utc')::date,
  count integer not null default 0 check (count >= 0),
  unique (user_id, integration, usage_date)
);

create or replace function private.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clients_updated_at before update on public.clients
for each row execute function private.set_updated_at();
create trigger locations_updated_at before update on public.locations
for each row execute function private.set_updated_at();
create trigger onboarding_updated_at before update on public.onboarding_submissions
for each row execute function private.set_updated_at();
create trigger policies_updated_at before update on public.client_policies
for each row execute function private.set_updated_at();
create trigger reviews_updated_at before update on public.reviews
for each row execute function private.set_updated_at();
create trigger replies_updated_at before update on public.review_replies
for each row execute function private.set_updated_at();
create trigger reports_updated_at before update on public.monthly_updates
for each row execute function private.set_updated_at();

create or replace function private.current_role()
returns public.user_role language sql stable security definer set search_path = '' as $$
  select role from public.profiles where id = (select auth.uid()) and active = true;
$$;
create or replace function private.current_agency_id()
returns uuid language sql stable security definer set search_path = '' as $$
  select agency_id from public.profiles where id = (select auth.uid()) and active = true;
$$;
create or replace function private.current_client_id()
returns uuid language sql stable security definer set search_path = '' as $$
  select client_id from public.profiles where id = (select auth.uid()) and active = true;
$$;
create or replace function private.can_access_client(target_client_id uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select case
    when p.role = 'agency_owner' then exists (
      select 1 from public.clients c where c.id = target_client_id and c.agency_id = p.agency_id
    )
    when p.role = 'seo_employee' then exists (
      select 1 from public.client_assignments ca where ca.client_id = target_client_id and ca.user_id = p.id
    )
    when p.role = 'client_owner' then p.client_id = target_client_id
    else false
  end
  from public.profiles p where p.id = (select auth.uid()) and p.active = true;
$$;

revoke all on function private.current_role() from public;
revoke all on function private.current_agency_id() from public;
revoke all on function private.current_client_id() from public;
revoke all on function private.can_access_client(uuid) from public;
grant execute on function private.current_role() to authenticated;
grant execute on function private.current_agency_id() to authenticated;
grant execute on function private.current_client_id() to authenticated;
grant execute on function private.can_access_client(uuid) to authenticated;

alter table public.agencies enable row level security;
alter table public.clients enable row level security;
alter table public.profiles enable row level security;
alter table public.client_assignments enable row level security;
alter table public.locations enable row level security;
alter table public.onboarding_submissions enable row level security;
alter table public.client_policies enable row level security;
alter table public.gbp_health_checks enable row level security;
alter table public.location_performance_snapshots enable row level security;
alter table public.reviews enable row level security;
alter table public.review_replies enable row level security;
alter table public.review_internal_notes enable row level security;
alter table public.website_audits enable row level security;
alter table public.website_audit_items enable row level security;
alter table public.competitors enable row level security;
alter table public.actions enable row level security;
alter table public.monthly_updates enable row level security;
alter table public.report_feedback enable row level security;
alter table public.email_deliveries enable row level security;
alter table public.integration_usage enable row level security;

create policy agencies_select on public.agencies for select to authenticated
using (id = (select private.current_agency_id()));
create policy profiles_select on public.profiles for select to authenticated
using (id = (select auth.uid()) or (agency_id = (select private.current_agency_id()) and (select private.current_role()) = 'agency_owner'));
create policy clients_select on public.clients for select to authenticated
using ((select private.can_access_client(id)));
create policy assignments_select on public.client_assignments for select to authenticated
using (user_id = (select auth.uid()) or (select private.current_role()) = 'agency_owner');
create policy locations_select on public.locations for select to authenticated
using ((select private.can_access_client(client_id)));
create policy onboarding_select on public.onboarding_submissions for select to authenticated
using ((select private.can_access_client(client_id)));
create policy policies_agency_select on public.client_policies for select to authenticated
using ((select private.current_role()) in ('agency_owner', 'seo_employee') and (select private.can_access_client(client_id)));
create policy health_select on public.gbp_health_checks for select to authenticated
using (exists (select 1 from public.locations l where l.id = location_id and (select private.can_access_client(l.client_id))));
create policy performance_select on public.location_performance_snapshots for select to authenticated
using (exists (select 1 from public.locations l where l.id = location_id and (select private.can_access_client(l.client_id))));
create policy reviews_agency_select on public.reviews for select to authenticated
using ((select private.current_role()) in ('agency_owner', 'seo_employee') and exists (
  select 1 from public.locations l where l.id = location_id and (select private.can_access_client(l.client_id))
));
create policy replies_agency_select on public.review_replies for select to authenticated
using ((select private.current_role()) in ('agency_owner', 'seo_employee') and exists (
  select 1 from public.reviews r join public.locations l on l.id = r.location_id
  where r.id = review_id and (select private.can_access_client(l.client_id))
));
create policy notes_agency_select on public.review_internal_notes for select to authenticated
using ((select private.current_role()) in ('agency_owner', 'seo_employee') and exists (
  select 1 from public.reviews r join public.locations l on l.id = r.location_id
  where r.id = review_id and (select private.can_access_client(l.client_id))
));
create policy audits_agency_select on public.website_audits for select to authenticated
using ((select private.current_role()) in ('agency_owner', 'seo_employee') and exists (
  select 1 from public.locations l where l.id = location_id and (select private.can_access_client(l.client_id))
));
create policy audit_items_agency_select on public.website_audit_items for select to authenticated
using ((select private.current_role()) in ('agency_owner', 'seo_employee') and exists (
  select 1 from public.website_audits a join public.locations l on l.id = a.location_id
  where a.id = audit_id and (select private.can_access_client(l.client_id))
));
create policy competitors_agency_select on public.competitors for select to authenticated
using ((select private.current_role()) in ('agency_owner', 'seo_employee') and exists (
  select 1 from public.locations l where l.id = location_id and (select private.can_access_client(l.client_id))
));
create policy actions_select on public.actions for select to authenticated
using ((select private.can_access_client(client_id)) and ((select private.current_role()) <> 'client_owner' or client_visible = true));
create policy reports_select on public.monthly_updates for select to authenticated
using ((select private.can_access_client(client_id)) and ((select private.current_role()) <> 'client_owner' or status in ('approved', 'sent')));
create policy feedback_select on public.report_feedback for select to authenticated
using (client_user_id = (select auth.uid()) or (select private.current_role()) in ('agency_owner', 'seo_employee'));
create policy deliveries_agency_select on public.email_deliveries for select to authenticated
using ((select private.current_role()) in ('agency_owner', 'seo_employee') and (select private.can_access_client(client_id)));
create policy usage_self_select on public.integration_usage for select to authenticated
using (user_id = (select auth.uid()));

revoke all on all tables in schema public from anon, authenticated;
grant select on all tables in schema public to authenticated;
grant usage on schema public to authenticated;
grant usage on all sequences in schema public to authenticated;

create index clients_agency_idx on public.clients(agency_id);
create index profiles_agency_idx on public.profiles(agency_id);
create index assignments_user_idx on public.client_assignments(user_id);
create index locations_client_idx on public.locations(client_id);
create index reviews_location_status_idx on public.reviews(location_id, status);
create index actions_client_status_idx on public.actions(client_id, status);
create index reports_client_month_idx on public.monthly_updates(client_id, month desc);
