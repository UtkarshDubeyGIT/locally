-- Deterministic Locally demo seed. Safe to rerun against the dedicated demo project.
do $$
declare
  agency uuid := '00000000-0000-4000-8000-000000000001';
  owner_id uuid := '10000000-0000-4000-8000-000000000001';
  specialist_id uuid := '10000000-0000-4000-8000-000000000002';
  client_user_id uuid := '10000000-0000-4000-8000-000000000003';
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values
    ('00000000-0000-0000-0000-000000000000', owner_id, 'authenticated', 'authenticated',
      'owner@locally.demo', extensions.crypt('LocallyDemo!2026', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    ('00000000-0000-0000-0000-000000000000', specialist_id, 'authenticated', 'authenticated',
      'specialist@locally.demo', extensions.crypt('LocallyDemo!2026', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    ('00000000-0000-0000-0000-000000000000', client_user_id, 'authenticated', 'authenticated',
      'client@madhursweets.demo', extensions.crypt('LocallyDemo!2026', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{}', now(), now())
  on conflict (id) do update set
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = now(), updated_at = now();

  -- GoTrue scans legacy token columns as strings even though the schema allows null.
  update auth.users set
    confirmation_token = coalesce(confirmation_token, ''),
    recovery_token = coalesce(recovery_token, ''),
    email_change_token_new = coalesce(email_change_token_new, ''),
    email_change = coalesce(email_change, ''),
    phone_change = coalesce(phone_change, ''),
    phone_change_token = coalesce(phone_change_token, ''),
    email_change_token_current = coalesce(email_change_token_current, ''),
    reauthentication_token = coalesce(reauthentication_token, '')
  where id in (owner_id, specialist_id, client_user_id);

  insert into auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
  values
    ('11000000-0000-4000-8000-000000000001', owner_id::text, owner_id,
      jsonb_build_object('sub', owner_id::text, 'email', 'owner@locally.demo', 'email_verified', true), 'email', now(), now()),
    ('11000000-0000-4000-8000-000000000002', specialist_id::text, specialist_id,
      jsonb_build_object('sub', specialist_id::text, 'email', 'specialist@locally.demo', 'email_verified', true), 'email', now(), now()),
    ('11000000-0000-4000-8000-000000000003', client_user_id::text, client_user_id,
      jsonb_build_object('sub', client_user_id::text, 'email', 'client@madhursweets.demo', 'email_verified', true), 'email', now(), now())
  on conflict (provider_id, provider) do update set identity_data = excluded.identity_data, updated_at = now();

  insert into public.agencies (id, name) values (agency, 'Northstar Local')
  on conflict (id) do update set name = excluded.name;

  delete from public.clients where is_demo = true;

  insert into public.clients
    (id, agency_id, business_name, industry, website, primary_contact_name, primary_contact_email, status, goals, pain_points, reporting_cadence, preferred_communication, is_demo)
  values
    ('20000000-0000-4000-8000-000000000001', agency, 'Madhur Sweets', 'Sweet shop & gifting', 'https://locally-demo.vercel.app/demo-sites/madhur-sweets/dwarka', 'Meera Arora', 'client@madhursweets.demo', 'submitted_by_client',
      '["Increase store visits","Improve review response rate","Grow festive and corporate orders"]',
      '["Weak Noida branch","Inconsistent opening hours","Slow location pages"]', 'monthly', 'email', true),
    ('20000000-0000-4000-8000-000000000002', agency, 'Sharma Dental Clinic', 'Dental clinic', null, 'Dr. Rhea Sharma', null, 'active', '["Increase appointment enquiries"]', '["Low Maps visibility"]', 'monthly', 'email', true),
    ('20000000-0000-4000-8000-000000000003', agency, 'FitZone Gym', 'Fitness', null, 'Kabir Malik', null, 'active', '["Increase trial visits"]', '["Review response backlog"]', 'monthly', 'whatsapp', true),
    ('20000000-0000-4000-8000-000000000004', agency, 'Brew House Café', 'Cafe', null, 'Tara Khanna', null, 'active', '["Improve discovery"]', '["Duplicate listing"]', 'monthly', 'email', true),
    ('20000000-0000-4000-8000-000000000005', agency, 'Glow Salon', 'Salon', null, 'Naina Kapoor', null, 'active', '["Increase bookings"]', '["Few recent photos"]', 'monthly', 'whatsapp', true),
    ('20000000-0000-4000-8000-000000000006', agency, 'CityCare Diagnostics', 'Diagnostics', null, 'Aman Sethi', null, 'active', '["Grow test bookings"]', '["Location data mismatch"]', 'monthly', 'email', true);

  insert into public.profiles (id, full_name, role, agency_id, client_id, active)
  values
    (owner_id, 'Aditi Mehra', 'agency_owner', agency, null, true),
    (specialist_id, 'Rohan Verma', 'seo_employee', agency, null, true),
    (client_user_id, 'Meera Arora', 'client_owner', agency, '20000000-0000-4000-8000-000000000001', true)
  on conflict (id) do update set full_name = excluded.full_name, role = excluded.role,
    agency_id = excluded.agency_id, client_id = excluded.client_id, active = true;

  insert into public.client_assignments (client_id, user_id) values
    ('20000000-0000-4000-8000-000000000001', specialist_id),
    ('20000000-0000-4000-8000-000000000002', specialist_id),
    ('20000000-0000-4000-8000-000000000004', specialist_id)
  on conflict do nothing;

  insert into public.locations
    (id, client_id, name, address, city, phone, website_url, category, opening_hours, latitude, longitude, status, image_path, is_demo)
  values
    ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'Dwarka', 'Unit 12, Market Arcade, Sector 12', 'New Delhi', '+91 11 4000 0101', '/demo-sites/madhur-sweets/dwarka', 'Sweet shop', '{"daily":"09:00–22:00"}', 28.5921, 77.0460, 'active', '/images/branch-dwarka.webp', true),
    ('30000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', 'Rohini', 'Shop 7, Community Plaza, Sector 9', 'New Delhi', '+91 11 4000 0102', '/demo-sites/madhur-sweets/rohini', 'Sweet shop', '{"daily":"09:00–22:00"}', 28.7164, 77.1171, 'active', '/images/branch-rohini.webp', true),
    ('30000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000001', 'Noida Sector 18', 'Kiosk 4, Central Market Walk, Sector 18', 'Noida', '+91 120 400 0103', '/demo-sites/madhur-sweets/noida-sector-18', 'Sweet shop', '{"weekdays":"10:00–21:00","weekends":"Needs verification"}', 28.5706, 77.3260, 'active', '/images/branch-noida.webp', true),
    ('30000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', 'Lajpat Nagar', '18A, Central Market Lane', 'New Delhi', '+91 11 4000 0104', '/demo-sites/madhur-sweets/lajpat-nagar', 'Sweet shop', '{"daily":"09:30–22:30"}', 28.5677, 77.2433, 'active', '/images/branch-lajpat.webp', true),
    ('30000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000002', 'Greater Kailash', 'Demo clinic address', 'New Delhi', null, null, 'Dental clinic', '{}', 28.5494, 77.2501, 'active', null, true),
    ('30000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000003', 'Pitampura', 'Demo gym address', 'New Delhi', null, null, 'Gym', '{}', 28.6980, 77.1384, 'active', null, true),
    ('30000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000004', 'Hauz Khas', 'Demo cafe address', 'New Delhi', null, null, 'Cafe', '{}', 28.5494, 77.2001, 'active', null, true),
    ('30000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000005', 'Rajouri Garden', 'Demo salon address', 'New Delhi', null, null, 'Salon', '{}', 28.6415, 77.1209, 'active', null, true),
    ('30000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000006', 'Preet Vihar', 'Demo diagnostics address', 'New Delhi', null, null, 'Diagnostic center', '{}', 28.6414, 77.2953, 'active', null, true);

  insert into public.onboarding_submissions (id, client_id, submitted_by, status, current_step, answers_json)
  values ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', client_user_id, 'draft', 2,
    '{"business":{"name":"Madhur Sweets","industry":"Sweet shop & gifting","contact":"Meera Arora"},"products":["Wedding sweets","Festive gift boxes","Corporate orders"],"goals":["Increase store visits","Improve reviews"],"locationsConfirmed":false}')
  on conflict (client_id) do update set status = 'draft', current_step = 2, answers_json = excluded.answers_json, submitted_at = null, reviewed_at = null;

  insert into public.client_policies
    (client_id, target_keywords, response_tone, prohibited_claims, escalation_categories, compensation_policy, google_access_status, initial_gbp_notes, initial_audit_findings, initial_recommended_actions)
  values ('20000000-0000-4000-8000-000000000001',
    array['sweet shop near me','wedding sweets Delhi','festive gift boxes Noida'],
    'Warm, concise, respectful and personal. Match English, Hindi or natural Hinglish.',
    array['guaranteed refund','legal liability','investigation completed'],
    array['hygiene','allergen','legal_threat','staff_safety'],
    'Never promise refunds or compensation in a public reply. Escalate to the branch manager.',
    'Manual verification complete for 3 of 4 branches',
    'Noida hours and photo freshness need attention.', 'Dwarka mobile page is slow.',
    'Resolve the Noida review, verify hours, and refresh branch photography.')
  on conflict (client_id) do update set response_tone = excluded.response_tone, prohibited_claims = excluded.prohibited_claims,
    escalation_categories = excluded.escalation_categories, updated_at = now();

  insert into public.gbp_health_checks (id, location_id, check_name, status, value, note, source_type, verified_by, verified_at)
  values
    ('50000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','Profile completeness','pass','96%','Core fields complete','manual',specialist_id,now() - interval '2 hours'),
    ('50000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000001','Photo freshness','warning','Last upload 41 days ago','Add summer gifting photos','manual',specialist_id,now() - interval '2 hours'),
    ('50000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000002','Profile completeness','pass','93%',null,'manual',specialist_id,now() - interval '1 day'),
    ('50000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000002','Opening hours','pass','Verified',null,'manual',specialist_id,now() - interval '1 day'),
    ('50000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000003','Profile completeness','fail','68%','Missing service details','manual',specialist_id,now() - interval '3 hours'),
    ('50000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000003','Opening hours','needs_verification','Weekend hours unclear','Verify before festive weekend','manual',specialist_id,now() - interval '3 hours'),
    ('50000000-0000-4000-8000-000000000007','30000000-0000-4000-8000-000000000003','Photo freshness','fail','Last upload 126 days ago','Plan a branch shoot','manual',specialist_id,now() - interval '3 hours'),
    ('50000000-0000-4000-8000-000000000008','30000000-0000-4000-8000-000000000004','Profile completeness','pass','91%',null,'manual',specialist_id,now() - interval '8 hours');

  insert into public.location_performance_snapshots
    (id, location_id, period, search_impressions, maps_impressions, website_clicks, call_clicks, direction_requests, average_rating, review_count, source_type)
  values
    ('51000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001',date_trunc('month', current_date)::date,12400,8900,742,196,418,4.6,824,'mock_gbp'),
    ('51000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000002',date_trunc('month', current_date)::date,9800,7300,598,143,352,4.4,612,'mock_gbp'),
    ('51000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000003',date_trunc('month', current_date)::date,6100,4200,271,69,144,3.7,286,'mock_gbp'),
    ('51000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000004',date_trunc('month', current_date)::date,10800,8100,661,177,389,4.5,703,'mock_gbp');

  insert into public.reviews
    (id, location_id, external_review_id, reviewer_name, rating, review_text, review_date, category, severity, status, source_type)
  values
    ('60000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000003','demo-review-critical','Nikhil S.',1,'The kaju katli tasted stale and the display counter did not look clean. Please take this seriously.',now() - interval '5 hours','hygiene','high','needs_reply','mock_gbp'),
    ('60000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000001','demo-review-positive','Priya K.',5,'Beautiful festive boxes and very helpful staff. Our family loved them!',now() - interval '2 days','praise','low','needs_reply','mock_gbp'),
    ('60000000-0000-4000-8000-000000000003','30000000-0000-4000-8000-000000000002','demo-review-complaint','Arjun M.',3,'Good sweets but billing took too long during the evening rush.',now() - interval '4 days','wait_time','medium','needs_reply','mock_gbp'),
    ('60000000-0000-4000-8000-000000000004','30000000-0000-4000-8000-000000000003','demo-review-staff','Sana A.',2,'Staff member was dismissive when I asked about ingredients.',now() - interval '6 days','staff_behavior','high','awaiting_approval','mock_gbp'),
    ('60000000-0000-4000-8000-000000000005','30000000-0000-4000-8000-000000000004','demo-review-delivery','Vikram R.',3,'Delivery arrived late, though the gift box was packed well.',now() - interval '8 days','delivery','medium','draft','mock_gbp'),
    ('60000000-0000-4000-8000-000000000006','30000000-0000-4000-8000-000000000001','demo-review-hinglish','Ritu G.',4,'Mithai fresh thi aur packing bhi achhi. Bas parking thodi difficult hai.',now() - interval '10 days','access','low','mock_published','mock_gbp');

  insert into public.review_replies
    (id, review_id, draft_text, final_text, analysis_json, facts_to_verify, requires_manager_approval, model_name, prompt_version, generated_at, status, created_by, approved_by, approved_at, mock_published_by, mock_published_at)
  values
    ('61000000-0000-4000-8000-000000000001','60000000-0000-4000-8000-000000000004','Thank you for sharing this. We are sorry the interaction felt dismissive. Please contact our branch manager so we can understand the details.','Thank you for sharing this. We are sorry the interaction felt dismissive. Please contact our branch manager so we can understand the details.','{"sentiment":"negative","category":"staff_behavior","severity":"high"}','["Which staff member was on shift"]',true,'gpt-5-mini','review-reply-v1',now() - interval '1 day','awaiting_approval',specialist_id,null,null,null,null),
    ('61000000-0000-4000-8000-000000000002','60000000-0000-4000-8000-000000000005','Thank you for the feedback. We are glad the gift box arrived safely and are sorry it reached you late.','Thank you for the feedback. We are glad the gift box arrived safely and are sorry it reached you late.','{"sentiment":"mixed","category":"delivery","severity":"medium"}','[]',false,'gpt-5-mini','review-reply-v1',now() - interval '2 days','draft',specialist_id,null,null,null,null),
    ('61000000-0000-4000-8000-000000000003','60000000-0000-4000-8000-000000000006','Bahut shukriya, Ritu! Humein khushi hai ki aapko mithai aur packing pasand aayi. Parking feedback humne note kar liya hai.','Bahut shukriya, Ritu! Humein khushi hai ki aapko mithai aur packing pasand aayi. Parking feedback humne note kar liya hai.','{"sentiment":"positive","category":"access","severity":"low"}','[]',false,'gpt-5-mini','review-reply-v1',now() - interval '9 days','mock_published',specialist_id,specialist_id,now() - interval '9 days',specialist_id,now() - interval '9 days');

  insert into public.website_audits
    (id, location_id, page_url, strategy, performance_score, accessibility_score, seo_score, best_practices_score, raw_result_json, source_type, run_by, created_at)
  values
    ('70000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','/demo-sites/madhur-sweets/dwarka','mobile',58,94,88,96,'{"demoFallback":true}','demo_data',specialist_id,now() - interval '7 days'),
    ('70000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000003','/demo-sites/madhur-sweets/noida-sector-18','mobile',47,91,76,92,'{"demoFallback":true}','demo_data',specialist_id,now() - interval '6 days');

  insert into public.website_audit_items (id, audit_id, check_name, category, status, details, recommendation, check_type)
  values
    ('71000000-0000-4000-8000-000000000001','70000000-0000-4000-8000-000000000002','Largest Contentful Paint','performance','fail','Hero image loads slowly','Serve a compressed, responsive image','lighthouse'),
    ('71000000-0000-4000-8000-000000000002','70000000-0000-4000-8000-000000000002','Opening hours','local_seo','fail','Weekend hours missing','Add verified seasonal hours','manual'),
    ('71000000-0000-4000-8000-000000000003','70000000-0000-4000-8000-000000000001','Click to call','local_seo','pass','Phone link is present',null,'manual');

  insert into public.competitors
    (id, location_id, name, google_place_id, rating, review_count, category, address, distance_km, google_maps_uri, source_type, analyst_note, captured_at, created_by)
  values
    ('80000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000003','Celebration Mithai House','demo-place-1',4.5,1180,'Sweet shop','Demo competitor snapshot, Sector 18',0.8,'https://maps.google.com','demo_data','Strong photo cadence and gifting category coverage.',now() - interval '3 days',specialist_id),
    ('80000000-0000-4000-8000-000000000002','30000000-0000-4000-8000-000000000001','Heritage Sweets','demo-place-2',4.4,920,'Sweet shop','Demo competitor snapshot, Dwarka',1.3,'https://maps.google.com','demo_data','Uses branch-specific landing pages effectively.',now() - interval '5 days',specialist_id);

  insert into public.actions
    (id, client_id, location_id, source_type, source_id, title, priority, status, assigned_to, due_date, client_visible, created_by, is_demo, created_at, completed_at)
  values
    ('90000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000003','review','60000000-0000-4000-8000-000000000001','Escalate Noida stale-product and hygiene complaint','high','open',specialist_id,current_date + 1,true,specialist_id,true,now() - interval '4 hours',null),
    ('90000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000003','gbp_health','50000000-0000-4000-8000-000000000006','Verify Noida weekend opening hours','high','in_progress',specialist_id,current_date + 2,true,specialist_id,true,now() - interval '2 days',null),
    ('90000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','website_audit','71000000-0000-4000-8000-000000000003','Add click-to-call tracking','medium','done',specialist_id,current_date - 2,true,specialist_id,true,now() - interval '8 days',now() - interval '3 days'),
    ('90000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000001','30000000-0000-4000-8000-000000000001','manual',null,'Plan festive gift-box photo set','medium','open',specialist_id,current_date + 6,true,specialist_id,true,now() - interval '1 day',null);

  insert into public.monthly_updates
    (id, client_id, month, metrics_json, agency_summary, status, created_by, approved_by, approved_at, sent_at, is_demo)
  values
    ('a0000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001',date_trunc('month', current_date)::date,
      '{"reviewsReceived":6,"reviewsReplied":1,"averageRating":4.3,"ratingChange":0.1,"websiteAuditScore":58,"openActions":3,"completedActions":1,"branchComparison":[{"location":"Dwarka","averageRating":4.6},{"location":"Rohini","averageRating":4.4},{"location":"Noida Sector 18","averageRating":3.7},{"location":"Lajpat Nagar","averageRating":4.5}]}',
      'Momentum is healthy across three branches. This month we will focus on Noida review recovery, verified weekend hours, and faster location pages.','draft',specialist_id,null,null,null,true),
    ('a0000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000001',(date_trunc('month', current_date) - interval '1 month')::date,
      '{"reviewsReceived":18,"reviewsReplied":16,"averageRating":4.2,"ratingChange":0.1,"websiteAuditScore":61,"openActions":4,"completedActions":5}',
      'Response coverage improved and the Dwarka branch gained the most visibility.','sent',specialist_id,owner_id,now() - interval '16 days',now() - interval '16 days',true);

  insert into public.report_feedback
    (id, monthly_update_id, client_user_id, usefulness, categories_json, comment, submitted_at)
  values ('a1000000-0000-4000-8000-000000000001','a0000000-0000-4000-8000-000000000002',client_user_id,'useful','["clearer_next_steps"]','The branch comparison was especially helpful.',now() - interval '15 days');
end $$;
