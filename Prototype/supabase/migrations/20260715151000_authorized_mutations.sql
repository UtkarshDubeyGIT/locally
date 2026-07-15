-- Authenticated mutations are executed only by server actions and remain RLS constrained.
grant insert, update, delete on public.clients, public.client_assignments, public.locations,
  public.onboarding_submissions, public.client_policies, public.gbp_health_checks,
  public.location_performance_snapshots, public.reviews, public.review_replies,
  public.review_internal_notes, public.website_audits, public.website_audit_items,
  public.competitors, public.actions, public.monthly_updates, public.report_feedback,
  public.email_deliveries, public.integration_usage to authenticated;
grant update on public.profiles to authenticated;

create policy profiles_owner_update on public.profiles for update to authenticated
  using (private.current_role() = 'agency_owner' and agency_id = private.current_agency_id())
  with check (private.current_role() = 'agency_owner' and agency_id = private.current_agency_id());

create policy clients_agency_insert on public.clients for insert to authenticated
  with check (private.current_role() = 'agency_owner' and agency_id = private.current_agency_id());
create policy clients_agency_update on public.clients for update to authenticated
  using (private.current_role() = 'agency_owner' and private.can_access_client(id))
  with check (private.current_role() = 'agency_owner' and agency_id = private.current_agency_id());

create policy assignments_owner_all on public.client_assignments for all to authenticated
  using (private.current_role() = 'agency_owner' and private.can_access_client(client_id))
  with check (private.current_role() = 'agency_owner' and private.can_access_client(client_id));

create policy locations_agency_all on public.locations for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and private.can_access_client(client_id))
  with check (private.current_role() in ('agency_owner','seo_employee') and private.can_access_client(client_id));

create policy onboarding_update on public.onboarding_submissions for update to authenticated
  using (private.can_access_client(client_id)) with check (private.can_access_client(client_id));
create policy onboarding_insert on public.onboarding_submissions for insert to authenticated
  with check (private.can_access_client(client_id));

create policy policies_agency_all on public.client_policies for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and private.can_access_client(client_id))
  with check (private.current_role() in ('agency_owner','seo_employee') and private.can_access_client(client_id));

create policy health_agency_all on public.gbp_health_checks for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.locations l where l.id=location_id and private.can_access_client(l.client_id)))
  with check (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.locations l where l.id=location_id and private.can_access_client(l.client_id)));
create policy performance_agency_all on public.location_performance_snapshots for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.locations l where l.id=location_id and private.can_access_client(l.client_id)))
  with check (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.locations l where l.id=location_id and private.can_access_client(l.client_id)));

create policy reviews_agency_all on public.reviews for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.locations l where l.id=location_id and private.can_access_client(l.client_id)))
  with check (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.locations l where l.id=location_id and private.can_access_client(l.client_id)));
create policy replies_agency_all on public.review_replies for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.reviews r join public.locations l on l.id=r.location_id where r.id=review_id and private.can_access_client(l.client_id)))
  with check (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.reviews r join public.locations l on l.id=r.location_id where r.id=review_id and private.can_access_client(l.client_id)));
create policy notes_agency_all on public.review_internal_notes for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.reviews r join public.locations l on l.id=r.location_id where r.id=review_id and private.can_access_client(l.client_id)))
  with check (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.reviews r join public.locations l on l.id=r.location_id where r.id=review_id and private.can_access_client(l.client_id)));

create policy audits_agency_all on public.website_audits for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.locations l where l.id=location_id and private.can_access_client(l.client_id)))
  with check (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.locations l where l.id=location_id and private.can_access_client(l.client_id)));
create policy audit_items_agency_all on public.website_audit_items for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.website_audits a join public.locations l on l.id=a.location_id where a.id=audit_id and private.can_access_client(l.client_id)))
  with check (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.website_audits a join public.locations l on l.id=a.location_id where a.id=audit_id and private.can_access_client(l.client_id)));
create policy competitors_agency_all on public.competitors for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.locations l where l.id=location_id and private.can_access_client(l.client_id)))
  with check (private.current_role() in ('agency_owner','seo_employee') and exists(select 1 from public.locations l where l.id=location_id and private.can_access_client(l.client_id)));
create policy actions_agency_all on public.actions for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and private.can_access_client(client_id))
  with check (private.current_role() in ('agency_owner','seo_employee') and private.can_access_client(client_id));
create policy reports_agency_all on public.monthly_updates for all to authenticated
  using (private.current_role() in ('agency_owner','seo_employee') and private.can_access_client(client_id))
  with check (private.current_role() in ('agency_owner','seo_employee') and private.can_access_client(client_id));
create policy feedback_client_insert on public.report_feedback for insert to authenticated
  with check (client_user_id=auth.uid() and exists(select 1 from public.monthly_updates m where m.id=monthly_update_id and m.client_id=private.current_client_id() and m.status in ('approved','sent')));
create policy feedback_client_update on public.report_feedback for update to authenticated
  using (client_user_id=auth.uid()) with check (client_user_id=auth.uid());
create policy deliveries_agency_all on public.email_deliveries for all to authenticated
  using (private.current_role()='agency_owner' and private.can_access_client(client_id))
  with check (private.current_role()='agency_owner' and private.can_access_client(client_id));
create policy usage_self_all on public.integration_usage for all to authenticated
  using (user_id=auth.uid()) with check (user_id=auth.uid());
