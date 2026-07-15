(function () {
  'use strict';

  const STORAGE_KEY = 'locally-phase-1-demo-v1';
  const Core = window.LocallyCore;
  const seed = window.LocallySeed;
  const main = document.getElementById('main-content');

  const clone = (value) => JSON.parse(JSON.stringify(value));
  const initialState = () => Object.assign(Core.createInitialState(), clone(seed));

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved && saved.client && saved.locations ? saved : initialState();
    } catch {
      return initialState();
    }
  }

  let state = loadState();
  state.ui = Object.assign({ notificationFilter: 'All', approvalFilter: 'All', selectedApproval: 'reply', p2ReviewStage: 'AI draft ready' }, state.ui || {});

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateShell();
  }

  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const locationName = (id) => state.locations.find((location) => location.id === id)?.name || 'All locations';
  const selectedLocation = (fallback = 'noida-sector-18') => state.locations.find((location) => location.id === (state.locationFilter === 'all' ? fallback : state.locationFilter)) || state.locations[0];
  const currentPeriod = () => Core.getPeriodSnapshot(state, state.period);

  function toneForStatus(status) {
    if (['Pass', 'Good', 'Improving', 'Verified', 'Live', 'Fresh', 'Replied', 'Completed', 'Healthy', 'Active', 'Connected', 'Approved', 'Published', 'Data verified'].includes(status)) return 'success';
    if (['Critical', 'Fail', 'Failed', 'Urgent'].includes(status)) return 'danger';
    if (['Verify', 'Warning', 'Needs verification', 'Review', 'Stale', 'Needs reply', 'Waiting for client', 'Retrying', 'Ready for review', 'Awaiting approval', 'High'].includes(status)) return 'warning';
    return '';
  }

  function status(label, tone = toneForStatus(label)) {
    return `<span class="status ${tone}">${esc(Core.formatStatusLabel(label))}</span>`;
  }

  function metricCue(symbol, tone = '') {
    return `<span class="metric-cue ${tone}" aria-hidden="true">${symbol}</span>`;
  }

  function provenance({ source = 'Entered manually', checked = '15 Jul 2026', verifier = 'Aditi' } = {}) {
    return `<div class="evidence-rail"><span>Source: ${esc(source)}</span><span>Last checked ${esc(checked)}</span><span>Verified by ${esc(verifier)}</span></div>`;
  }

  function pageHeader(kicker, title, subtitle, actions = '') {
    return `<header class="page-header">
      <div class="page-title-wrap">
        <div class="page-kicker">${esc(kicker)} <span class="slash">/</span> ${esc(currentPeriod().label)}</div>
        <h1>${title}</h1>
        <p class="page-subtitle">${subtitle}</p>
      </div>
      ${actions ? `<div class="page-actions">${actions}</div>` : ''}
    </header>`;
  }

  function trustStrip(message = 'Operational data combines manual checks and source imports.') {
    return `<div class="trust-strip"><strong>${esc(message)}</strong><span>Verified by Aditi</span><span>Last reviewed 15 Jul 2026</span><span class="spacer">No automated decisions</span></div>`;
  }

  function updateShell() {
    document.getElementById('location-selector').value = state.locationFilter;
    document.getElementById('period-selector').value = state.period;
    const awaiting = Core.filterByLocation(state.reviews, state.locationFilter).filter((review) => review.status === 'Needs reply' || review.status === 'Draft').length;
    const openActions = Core.filterByLocation(state.actions, state.locationFilter).filter((action) => !['Completed', 'Dismissed'].includes(action.status)).length;
    document.querySelector('[data-count="reviews"]').textContent = awaiting;
    document.querySelector('[data-count="actions"]').textContent = openActions;
    document.querySelectorAll('[data-route]').forEach((item) => item.classList.toggle('active', item.dataset.route === currentRoute()));
    const phaseTwo = currentRoute().startsWith('p2-');
    document.body.classList.toggle('phase-two', phaseTwo);
    document.querySelectorAll('[data-phase]').forEach((item) => item.classList.toggle('active', item.dataset.phase === (phaseTwo ? 'two' : 'one')));
    document.querySelector('.workspace-label > span:last-child').textContent = phaseTwo ? '7 active clients · Assisted automation' : '3 of 5 client slots';
    document.querySelector('.sidebar-footer .sync-note').innerHTML = phaseTwo
      ? '<span class="status-dot danger"></span><div><strong>1 automation needs attention</strong><span>Manual fallback remains available</span></div>'
      : '<span class="status-dot warning"></span><div><strong>2 sources need attention</strong><span>Manual tracking remains active</span></div>';
    document.querySelector('[data-last-update]').textContent = phaseTwo ? '8 minutes ago' : '2 hours ago';
  }

  function currentRoute() {
    const route = location.hash.replace('#', '').split('/')[0];
    const routes = ['overview', 'locations', 'reviews', 'visibility', 'website-audit', 'competitors', 'actions', 'reports', 'onboarding', 'p2-overview', 'p2-integrations', 'p2-automations', 'p2-notifications', 'p2-reviews', 'p2-approvals', 'p2-visibility', 'p2-competitors', 'p2-weekly', 'p2-policies'];
    return routes.includes(route) ? route : 'overview';
  }

  function showToast(message) {
    const region = document.querySelector('.toast-region');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    region.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3200);
  }

  function renderOverview() {
    const snapshot = currentPeriod();
    const cues = Core.metricVisuals();
    const scopedLocations = state.locationFilter === 'all' ? state.locations : state.locations.filter((item) => item.id === state.locationFilter);
    const scopedAttention = Core.filterByLocation(state.attention, state.locationFilter);
    const overall = state.locationFilter === 'all' ? 'Needs attention' : scopedLocations[0].status;
    const completed = state.weeklyChecklist.filter((item) => item.done).length;

    return `${pageHeader(
      'Client overview',
      `Madhur Sweets ${status(overall, overall === 'Critical' ? 'danger' : 'warning')}`,
      state.locationFilter === 'all' ? 'A verified operational view across three branches. Start with what needs a human decision.' : `Current operational health for ${esc(locationName(state.locationFilter))}.`,
      `<button class="button secondary" data-route-link="reports">Preview report</button><button class="button primary" data-route-link="actions">Review open actions</button>`
    )}
    <section class="metrics-strip" aria-label="Key metrics">
      <div class="metric"><span class="metric-label">Locations managed</span><div class="metric-value">${metricCue(cues.locations, 'location')}${scopedLocations.length}<span class="metric-note">active</span></div></div>
      <div class="metric"><span class="metric-label">Average Google rating</span><div class="metric-value">${metricCue(cues.rating, 'rating')}${state.locationFilter === 'all' ? snapshot.rating : scopedLocations[0].rating}<span class="metric-note">/ 5</span></div></div>
      <div class="metric warning"><span class="metric-label">Open actions</span><div class="metric-value">${metricCue(cues.actions, 'warning')}${Core.filterByLocation(state.actions, state.locationFilter).filter((item) => !['Completed', 'Dismissed'].includes(item.status)).length}</div></div>
      <div class="metric danger"><span class="metric-label">Reviews awaiting reply</span><div class="metric-value">${metricCue(cues.reviews, 'danger')}${Core.filterByLocation(state.reviews, state.locationFilter).filter((item) => item.status === 'Needs reply' || item.status === 'Draft').length}</div></div>
      <div class="metric"><span class="metric-label">Monthly report</span><div class="metric-value">${metricCue(cues.report, 'report')}${esc(snapshot.reportDue)}<span class="metric-note">${esc(snapshot.reportStatus)}</span></div></div>
    </section>
    ${trustStrip('Sources are visible on every operational record.')}
    <div class="dashboard-grid">
      <div>
        <section class="section">
          <div class="section-heading"><div><h2>Needs attention</h2><p>Ordered by consequence, not by recency alone.</p></div><span class="status danger">${scopedAttention.length} findings</span></div>
          <div class="attention-list">
            ${scopedAttention.map((item) => `<button class="attention-row" data-open-attention="${item.id}"><span class="signal ${item.tone}"></span><div><h3>${esc(item.title)}</h3><p>${esc(item.detail)}</p></div><time>${esc(item.age)}</time></button>`).join('') || `<div class="empty-state"><strong>No urgent findings</strong><span>This location has no current attention items.</span></div>`}
          </div>
        </section>
        <section class="section">
          <div class="section-heading"><div><h2>Location comparison</h2><p>Profile health and performance stay separate, but meet here for triage.</p></div></div>
          <div class="data-table-wrap"><table class="data-table"><thead><tr><th>Location</th><th class="numeric">Rating</th><th class="numeric">Awaiting reply</th><th>Visibility</th><th class="numeric">Website</th><th>Status</th></tr></thead><tbody>
            ${scopedLocations.map((location) => `<tr class="clickable" data-open-location="${location.id}"><td class="primary-cell">${esc(location.name)}<small>${esc(location.address)}</small></td><td class="numeric">${location.rating}</td><td class="numeric">${location.awaiting}</td><td>${status(location.visibility)}</td><td class="numeric">${location.websiteScore}</td><td>${status(location.status, location.statusTone)}</td></tr>`).join('')}
          </tbody></table></div>
        </section>
      </div>
      <aside>
        <section class="soft-panel">
          <div class="section-heading"><div><h2>Weekly agency check</h2><p>${completed} of ${state.weeklyChecklist.length} complete</p></div><span class="status manual">Manual</span></div>
          <div class="progress-line"><span style="width:${completed / state.weeklyChecklist.length * 100}%"></span></div>
          <div class="checklist">
            ${state.weeklyChecklist.map((item) => `<label class="check-row"><input type="checkbox" data-weekly-check="${item.id}" ${item.done ? 'checked' : ''}><span class="check-box">${icon('check')}</span><span><strong>${esc(item.label)}</strong><small>${esc(item.evidence)}</small></span><span class="owner">${esc(item.owner)}</span></label>`).join('')}
          </div>
        </section>
        <section class="section soft-panel">
          <span class="eyebrow">Next client moment</span>
          <h2 style="margin-top:8px">July report due in 5 days</h2>
          <p class="page-subtitle">Two analyst sections still need a final review before sharing.</p>
          <button class="button secondary" style="margin-top:18px;width:100%" data-route-link="reports">Continue report</button>
        </section>
      </aside>
    </div>`;
  }

  function renderLocations() {
    const location = selectedLocation();
    const tab = state.ui.locationTab;
    const perf = location.performance[state.period];
    const changeBase = location.performance['2026-06'];

    let content = '';
    if (tab === 'profile') {
      content = `<div class="profile-grid">${location.profile.map((item) => `<article class="profile-item"><div class="profile-item-header"><h3>${esc(item.label)}</h3>${status(item.status, item.tone)}</div><div class="value">${esc(item.value)}</div>${provenance({ source: item.source, checked: item.checked, verifier: item.verifier })}</article>`).join('')}</div>
        <section class="section completeness"><div class="score-ring" style="--score:${location.completeness}"><div><strong>${location.completeness}%</strong><span>complete</span></div></div><div><span class="eyebrow">Profile completeness</span><h2>Human-verified health, not a vanity score</h2><p class="page-subtitle">Completeness reflects whether required information is present. Correctness still depends on the source and latest manual verification shown above.</p></div></section>`;
    } else if (tab === 'performance') {
      const metrics = [['Google Search impressions', 'search'], ['Google Maps impressions', 'maps'], ['Website clicks', 'website'], ['Direction requests', 'directions'], ['Call clicks', 'calls']];
      content = `<div class="manual-banner">${icon('visibility')}<div><h3>Business performance</h3><p>These outcomes are imported separately from profile-correctness checks. Last import: 15 July 2026, 09:10.</p></div></div><div class="performance-grid">${metrics.map(([label, key]) => { const delta = Math.round((perf[key] - changeBase[key]) / changeBase[key] * 100); return `<div class="performance-card"><span>${label}</span><strong>${perf[key].toLocaleString('en-IN')}</strong><small>${delta >= 0 ? '+' : ''}${delta}% vs June</small></div>`; }).join('')}</div>${trustStrip('Source: Google Business Profile performance export.')}`;
    } else {
      content = `<div class="soft-panel"><span class="eyebrow">Internal branch note</span><h2 style="margin-top:8px">${esc(location.manager)} · Branch manager</h2><textarea aria-label="Internal location notes">${esc(location.id === 'noida-sector-18' ? 'Quality complaint raised on 15 July. Awaiting batch confirmation before client response. Photography is also overdue.' : location.id === 'rohini' ? 'Festive closing time needs confirmation from Neha before the next GBP update.' : 'Wedding-order counter is performing well. Ask the branch for fresh hamper photography this week.')}</textarea><div class="editor-footer"><small>Internal only · Saved locally</small><button class="button secondary small" data-action="save-note">Save note</button></div></div>`;
    }

    return `${pageHeader('Location operations', `Madhur Sweets — ${esc(location.name)}`, 'Profile correctness is verified record by record. Performance data is shown separately.', `<button class="button secondary" data-route-link="actions">View location actions</button>`)}
      <section class="location-hero"><div class="location-monogram">${esc(location.short)}</div><div><h2>${esc(location.name)}</h2><p>${esc(location.address)} · ${esc(location.phone)}</p></div><div class="location-meta"><strong>${location.rating}</strong><span>Google rating · ${location.awaiting} replies pending</span></div></section>
      <div class="tabs" role="tablist"><button class="tab ${tab === 'profile' ? 'active' : ''}" data-location-tab="profile">Profile Health</button><button class="tab ${tab === 'performance' ? 'active' : ''}" data-location-tab="performance">Performance</button><button class="tab ${tab === 'notes' ? 'active' : ''}" data-location-tab="notes">Internal Notes</button></div>
      ${content}`;
  }

  function renderReviews() {
    if (state.ui.selectedReview) return renderReviewDetail(state.reviews.find((item) => item.id === state.ui.selectedReview));
    const filters = ['All', 'Needs reply', 'Critical', 'Draft', 'Replied'];
    let reviews = Core.filterByLocation(state.reviews, state.locationFilter);
    const filter = state.ui.reviewFilter;
    if (filter === 'Critical') reviews = reviews.filter((review) => review.severity === 'Critical');
    else if (filter !== 'All') reviews = reviews.filter((review) => review.status === filter);

    return `${pageHeader('Review inbox', 'Every response stays human', 'Triage feedback, confirm facts with the branch, and publish only after approval.', `<button class="button secondary" data-action="mock-import">Record manual review</button>`)}
      <div class="manual-banner">${icon('alert')}<div><h3>Human approval is required</h3><p>Locally can hold drafts and evidence. It does not auto-publish review replies in Phase 1.</p></div></div>
      <div class="filter-bar">${filters.map((item) => `<button class="filter-chip ${filter === item ? 'active' : ''}" data-review-filter="${item}">${item}</button>`).join('')}<span class="filter-summary">${reviews.length} reviews shown</span></div>
      <div class="review-list">${reviews.map((review) => `<button class="review-row" data-open-review="${review.id}"><div><div class="stars" aria-label="${review.stars} out of 5 stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</div><div class="reviewer">${esc(review.reviewer)}</div><div class="review-date">${esc(review.date)}</div></div><div><div class="review-text">“${esc(review.text)}”</div><div class="review-tags">${status(review.category, 'manual')} ${status(review.severity, review.severity === 'Critical' ? 'danger' : review.severity === 'High' ? 'warning' : '')}</div></div><div class="review-location"><span>${esc(locationName(review.locationId))}</span>${status(review.status)}<span class="source-note">Source: ${esc(review.source)}</span></div>${icon('chevron')}</button>`).join('') || `<div class="empty-state"><strong>No reviews in this view</strong><span>Choose another filter or location.</span></div>`}</div>`;
  }

  function renderReviewDetail(review) {
    if (!review) { state.ui.selectedReview = null; return renderReviews(); }
    const canPublish = Core.canPublishReview(review.approval);
    return `<button class="detail-back" data-action="back-reviews">${icon('chevron')} Back to review inbox</button>
      ${pageHeader('Review detail', `${esc(review.reviewer)} <span class="status ${review.severity === 'Critical' ? 'danger' : 'warning'}">${esc(review.severity)}</span>`, `${esc(locationName(review.locationId))} · ${esc(review.date)} · Source: ${esc(review.source)}`)}
      <div class="review-detail-grid"><div>
        <section class="review-quote"><div class="stars">${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</div><blockquote>“${esc(review.text)}”</blockquote></section>
        <section class="detail-section"><label class="field-label" for="branch-note">Internal branch note</label><textarea id="branch-note" data-review-note="${review.id}">${esc(review.internalNote || 'Add a branch note before requesting approval.')}</textarea><div class="editor-footer"><small>Internal only · Entered manually</small><button class="button secondary small" data-action="save-note">Save note</button></div></section>
        <section class="detail-section"><label class="field-label" for="reply-editor">Manual reply editor</label><textarea id="reply-editor" data-review-draft="${review.id}" placeholder="Write a careful, factual response…">${esc(review.draft)}</textarea><div class="editor-footer"><small>Draft saved in this workspace · No AI publishing</small><button class="button secondary small" data-action="save-draft" data-review-id="${review.id}">Save draft</button></div></section>
      </div><aside class="approval-panel">
        <span class="eyebrow">Approval control</span><h2 style="margin-top:8px">Ready to publish?</h2>
        <div class="approval-state ${canPublish ? 'ready' : ''}">${canPublish ? 'All human checks are complete.' : 'Complete every check before publishing.'}</div>
        <div class="checklist">
          ${[['facts', 'Confirmed facts with branch'], ['policy', 'Checked compensation or replacement policy'], ['manager', 'Manager approval received']].map(([key, label]) => `<label class="check-row"><input type="checkbox" data-approval="${key}" data-review-id="${review.id}" ${review.approval[key] ? 'checked' : ''}><span class="check-box">${icon('check')}</span><span><strong>${label}</strong><small>${review.approval[key] ? 'Confirmed by Aditi' : 'Required'}</small></span></label>`).join('')}
        </div>
        <div class="approval-actions"><button class="button secondary" data-action="request-approval" data-review-id="${review.id}">Request approval</button><button class="button primary" data-action="publish-review" data-review-id="${review.id}" ${canPublish && review.draft.trim() ? '' : 'disabled'}>Publish reply</button></div>
        <div style="margin-top:16px">${provenance({ source: review.source, checked: review.checked, verifier: 'Aditi' })}</div>
      </aside></div>`;
  }

  function renderVisibility() {
    let rows = state.visibility.filter((item) => item.period === state.period);
    rows = Core.filterByLocation(rows, state.locationFilter);
    const improved = rows.filter((item) => item.current < item.previous).length;
    const declined = rows.filter((item) => item.current > item.previous).length;
    return `${pageHeader('Weekly visibility', 'Rankings are evidence, not absolutes', 'Every rank is manually checked from a recorded area and device. Results vary with proximity and personalisation.', `<button class="button primary" data-action="mock-import">Record ranking</button>`)}
      <div class="manual-banner">${icon('pin')}<div><h3>Location-dependent manual checks</h3><p>These are observed positions, not live Google data. Each record includes who checked it, when, and the supporting screenshot.</p></div></div>
      <section class="metrics-strip" aria-label="Ranking summary"><div class="metric"><span class="metric-label">Keywords checked</span><div class="metric-value">${rows.length}</div></div><div class="metric"><span class="metric-label">Improved</span><div class="metric-value" style="color:var(--success)">${improved}</div></div><div class="metric"><span class="metric-label">Declined</span><div class="metric-value" style="color:var(--danger)">${declined}</div></div><div class="metric"><span class="metric-label">Stable</span><div class="metric-value">${rows.length - improved - declined}</div></div><div class="metric"><span class="metric-label">Last manual check</span><div class="metric-value">15 Jul<span class="metric-note">Aditi</span></div></div></section>
      <section class="section"><div class="section-heading"><div><h2>Search position log</h2><p>${esc(currentPeriod().label)} · ${state.locationFilter === 'all' ? 'All locations' : esc(locationName(state.locationFilter))}</p></div><span class="status manual">Entered manually</span></div>
      <div class="data-table-wrap"><table class="data-table"><thead><tr><th>Keyword</th><th>Search type</th><th>Search area</th><th>Device</th><th class="numeric">Previous</th><th class="numeric">Current</th><th class="numeric">Change</th><th>Checked by</th><th>Evidence</th></tr></thead><tbody>${rows.map((row) => { const change = row.previous - row.current; const tone = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'; return `<tr><td class="primary-cell">${esc(row.keyword)}<small>${esc(locationName(row.locationId))}</small></td><td>${esc(row.type)}</td><td>${esc(row.area)}</td><td>${esc(row.device)}</td><td class="numeric">${row.previous}</td><td class="numeric"><strong>${row.current}</strong></td><td class="numeric"><span class="delta ${tone}">${change > 0 ? '↑ ' + change : change < 0 ? '↓ ' + Math.abs(change) : '—'}</span></td><td>${esc(row.checkedBy)}<small>${esc(row.date)}</small></td><td><button class="evidence-link" data-action="show-evidence">${esc(row.evidence)}</button></td></tr>`; }).join('')}</tbody></table></div></section>`;
  }

  function renderCompetitors() {
    let competitors = Core.filterByLocation(state.competitors, state.locationFilter);
    const groups = state.locationFilter === 'all' ? state.locations : state.locations.filter((item) => item.id === state.locationFilter);
    return `${pageHeader('Competitor watchlist', 'Observe selectively. Act deliberately.', 'Three manually selected competitors per location, with analyst observations that lead to clear actions.', `<button class="button secondary" data-action="mock-import">Update observations</button>`)}
      ${trustStrip('Competitor details are manually observed and may become outdated.')}
      ${groups.map((location) => `<section class="section"><div class="section-heading"><div><h2>${esc(location.name)}</h2><p>Three selected local competitors · Last checked ${esc(competitors.find((item) => item.locationId === location.id)?.checked || 'Not checked')}</p></div><span class="status manual">Manual watchlist</span></div><div class="competitor-grid">${competitors.filter((item) => item.locationId === location.id).map((item) => `<article class="competitor-card"><div class="competitor-head"><div><h3>${esc(item.name)}</h3><small>${esc(item.category)} · ${esc(item.distance)}</small></div><div class="rating-block"><strong>${item.rating}</strong><span> ★ · ${item.reviews.toLocaleString('en-IN')}</span></div></div><div class="competitor-stats"><div><strong>${esc(item.checked)}</strong><span>Last checked</span></div><div><strong>Aditi</strong><span>Observed by</span></div></div><div class="observation-columns"><div><strong>Strengths</strong><ul>${item.strengths.map((value) => `<li>${esc(value)}</li>`).join('')}</ul></div><div><strong>Weaknesses</strong><ul>${item.weaknesses.map((value) => `<li>${esc(value)}</li>`).join('')}</ul></div></div><div class="recommended-action"><strong>Recommended action</strong>${esc(item.action)}</div></article>`).join('')}</div></section>`).join('')}`;
  }

  function renderAudit() {
    const location = selectedLocation('dwarka');
    const scoreSets = {
      dwarka: [62, 88, 91, 79, 68, 54],
      rohini: [74, 91, 93, 86, 82, 71],
      'noida-sector-18': [68, 86, 89, 81, 68, 63],
    };
    const manualOverrides = {
      rohini: { hours: 'Warning', directions: 'Pass', 'map-embed': 'Pass' },
      'noida-sector-18': { 'branch-content': 'Fail', 'map-embed': 'Pass', hours: 'Warning', 'local-keywords': 'Warning', 'trust-signals': 'Fail' },
    };
    const noteOverrides = {
      rohini: {
        'branch-content': 'Rohini copy is unique but needs a stronger catering section.',
        'map-embed': 'Branch map opens correctly to Sector 9.',
        hours: 'Festive closing time is still pending branch confirmation.',
        directions: 'Directions button is visible on the first mobile screen.',
        'local-keywords': 'Rohini and Sector 9 appear naturally in the page copy.',
      },
      'noida-sector-18': {
        'branch-content': 'Only 58 words are unique to the Sector 18 branch.',
        'map-embed': 'Branch map opens correctly to Sector 18.',
        hours: 'Website hours have not been reconfirmed with the branch.',
        'local-keywords': 'Noida appears in the title but not in the main heading.',
        'trust-signals': 'The replacement policy and branch-specific testimonials are missing.',
      },
    };
    const auto = state.audit.automated.map((item, index) => {
      const score = scoreSets[location.id][index];
      const derived = score >= 80 ? ['Pass', 'success'] : score >= 65 ? ['Warning', 'warning'] : ['Fail', 'danger'];
      return { ...item, id: `${location.id}-${item.id}`, score, status: derived[0], tone: derived[1], locationId: location.id };
    });
    const manual = state.audit.manual.map((item) => {
      const override = manualOverrides[location.id]?.[item.id];
      const itemStatus = override || item.status;
      return { ...item, id: `${location.id}-${item.id}`, locationId: location.id, status: itemStatus, tone: toneForStatus(itemStatus), note: noteOverrides[location.id]?.[item.id] || item.note };
    });
    const findings = state.ui.auditView === 'automated' ? auto : manual;
    return `${pageHeader('Website audit', `${esc(location.name)} landing page`, 'Automated signals are paired with a manual Local SEO checklist. Findings become owned actions, not passive scores.', `<button class="button secondary" data-action="mock-import">Run mocked check</button>`)}
      <div class="audit-summary">${auto.map((item) => `<div class="audit-score"><span class="label">${esc(item.label)}</span><div class="score">${item.score}</div>${status(item.status, item.tone)}</div>`).join('')}</div>
      <div class="tabs"><button class="tab ${state.ui.auditView === 'manual' ? 'active' : ''}" data-audit-view="manual">Manual Local SEO check</button><button class="tab ${state.ui.auditView === 'automated' ? 'active' : ''}" data-audit-view="automated">Automated signals</button></div>
      <div class="audit-list">${findings.map((item) => { const actionExists = state.actions.some((action) => action.sourceRef === item.id); return `<div class="audit-row"><div><h3>${esc(item.label)}</h3><span class="source-note">${item.verifier ? `Verified by ${esc(item.verifier)}` : esc(item.source)}</span></div><div>${status(item.status, item.tone)}</div><p>${esc(item.note || `Score ${item.score} · Checked ${item.checked}`)}</p><div class="audit-actions">${item.status !== 'Pass' ? `<button class="button secondary small" data-create-action="${item.id}" data-audit-kind="${state.ui.auditView}" data-finding-status="${item.status}" ${actionExists ? 'disabled' : ''}>${actionExists ? 'Action created' : 'Create action'}</button><button class="button ghost small" data-action="mark-irrelevant">Not relevant</button>` : '<span class="status manual">No action needed</span>'}</div></div>`; }).join('')}</div>`;
  }

  function renderActions() {
    let actions = Core.filterByLocation(state.actions, state.locationFilter);
    if (state.ui.actionStatus !== 'All') actions = actions.filter((item) => item.status === state.ui.actionStatus);
    const counts = ['Open', 'In progress', 'Waiting for client', 'Completed'].map((label) => [label, Core.filterByLocation(state.actions, state.locationFilter).filter((item) => item.status === label).length]);
    return `${pageHeader('Actions', 'A short, accountable work queue', 'Every action points back to the finding, person, and deadline that created it.', `<button class="button primary" data-action="mock-import">Add action</button>`)}
      <div class="action-board">${counts.map(([label, count]) => `<div class="action-summary"><span>${esc(label)}</span><strong>${count}</strong></div>`).join('')}</div>
      <section class="section"><div class="filter-bar">${['All', 'Open', 'In progress', 'Waiting for client', 'Completed', 'Dismissed'].map((item) => `<button class="filter-chip ${state.ui.actionStatus === item ? 'active' : ''}" data-action-filter="${item}">${item}</button>`).join('')}<span class="filter-summary">${actions.length} actions</span></div>
      <div class="data-table-wrap"><table class="data-table"><thead><tr><th>Action</th><th>Location</th><th>Source</th><th>Priority</th><th>Owner</th><th>Due</th><th>Status</th></tr></thead><tbody>${actions.map((action) => `<tr><td class="primary-cell">${esc(action.title)}<small>${esc(action.client || 'Madhur Sweets')}</small></td><td>${esc(locationName(action.locationId))}</td><td><span class="status manual">${esc(action.source)}</span></td><td><span class="priority ${esc(action.priority)}">${esc(action.priority)}</span></td><td>${esc(action.owner)}</td><td>${esc(action.due || 'Set date')}</td><td><select class="action-status-select" data-action-status="${action.id}">${['Open', 'In progress', 'Waiting for client', 'Completed', 'Dismissed'].map((item) => `<option ${action.status === item ? 'selected' : ''}>${item}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div></section>`;
  }

  function renderReports() {
    const snapshot = currentPeriod();
    const report = state.report[state.period];
    const scopedActions = Core.filterByLocation(state.actions, state.locationFilter);
    const completed = scopedActions.filter((item) => item.status === 'Completed' && (!item.completedPeriod || item.completedPeriod === state.period)).length || snapshot.completedActions;
    return `${pageHeader('Monthly report preview', `${esc(currentPeriod().label)} client report`, 'System-assembled evidence and analyst judgment are visibly separated.', `<button class="button secondary" data-action="mock-share">Share preview</button><button class="button primary" data-action="print-report">Print / Save PDF</button>`)}
      <article class="report-sheet"><header class="report-cover"><div><a class="brand"><span class="brand-mark"><span></span><span></span><span></span></span><span>locally</span></a><h1>Madhur Sweets<br>Local presence report</h1><p>Prepared by Northstar Local · Verified by Aditi Deshmukh</p></div><div class="report-period"><span class="eyebrow">Reporting period</span><strong>${esc(snapshot.label)}</strong><span class="status manual" style="margin-top:10px;color:#bbb;border-color:#444">Draft preview</span></div></header>
      <div class="report-body"><span class="eyebrow">System-assembled summary</span><div class="report-stat-grid"><div class="report-stat"><span>Reviews recorded</span><strong>${snapshot.reviewCount}</strong></div><div class="report-stat"><span>Response rate</span><strong>${snapshot.responseRate}%</strong></div><div class="report-stat"><span>Average rating</span><strong>${snapshot.rating} <small style="color:var(--success);font-size:10px">${snapshot.ratingDelta >= 0 ? '+' : ''}${snapshot.ratingDelta}</small></strong></div><div class="report-stat"><span>Completed actions</span><strong>${completed}</strong></div></div>
      <span class="eyebrow">Analyst interpretation · editable</span><div class="narrative-grid">${[['changed','What changed'], ['reasons','Likely reasons'], ['completed','Work completed'], ['concerns','Unresolved concerns']].map(([key, label]) => `<div class="narrative-block"><h3>${label}</h3><textarea data-report-field="${key}">${esc(report[key])}</textarea></div>`).join('')}</div>
      <section class="section"><span class="eyebrow">Next month’s priorities</span><ol class="priority-list">${report.priorities.map((item) => `<li>${esc(item)}</li>`).join('')}</ol></section>
      <div class="data-limitations"><strong>Data limitations.</strong> ${esc(report.limitations)}</div></div></article>
      <section class="feedback-panel"><span class="eyebrow">Structured client feedback</span><h3>Was this report useful?</h3><div class="feedback-options">${['Yes', 'Partly', 'No'].map((item) => `<button class="filter-chip ${state.ui.reportFeedback === item ? 'active' : ''}" data-report-feedback="${item}">${item}</button>`).join('')}</div><h3 style="margin-top:18px">What should we improve?</h3><div class="feedback-options">${['More explanation', 'More competitor data', 'Clearer next steps', 'Different metrics', 'Other feedback'].map((item) => `<button class="filter-chip" data-action="feedback-detail">${item}</button>`).join('')}</div></section>`;
  }

  function onboardingContent(step) {
    const fields = state.onboarding.fields;
    if (step === 1) return { title: 'Tell us about the client', subtitle: 'Start with the information your team already trusts.', body: `<div class="form-grid"><div class="field"><label>Business name</label><input type="text" data-onboarding-field="businessName" value="${esc(fields.businessName)}" placeholder="e.g. Madhur Sweets"></div><div class="field"><label>Industry</label><input type="text" data-onboarding-field="industry" value="${esc(fields.industry)}"></div><div class="field"><label>Contact person</label><input type="text" data-onboarding-field="contact" value="${esc(fields.contact)}" placeholder="Name and role"></div><div class="field"><label>Website</label><input type="url" data-onboarding-field="website" value="${esc(fields.website)}" placeholder="https://"></div></div>` };
    if (step === 2) return { title: 'Add business locations', subtitle: 'One client can have multiple branches, each with its own evidence and health.', body: `<div class="form-grid"><div class="field full"><label>Locations <small>One per line</small></label><textarea data-onboarding-field="locations">${esc(fields.locations)}</textarea></div><div class="field full"><label>Priority locations</label><input type="text" data-onboarding-field="priorityLocations" value="${esc(fields.priorityLocations)}" placeholder="e.g. Noida Sector 18"></div></div>` };
    if (step === 3) return { title: 'Capture goals and pain points', subtitle: 'These guide analyst attention; they do not trigger automated decisions.', body: `<div class="field" style="margin-top:24px"><label>What is the client concerned about?</label><textarea data-onboarding-field="concerns" placeholder="Current problems, context, or expectations…">${esc(fields.concerns)}</textarea></div><div class="choice-grid">${[['maps','Improve Google Maps visibility'],['visits','Increase store visits'],['reviews','Improve review response rate'],['festive','Promote festive and wedding orders']].map(([id, label]) => `<label class="choice-card ${fields.goals.includes(id) ? 'selected' : ''}"><input type="checkbox" data-onboarding-goal="${id}" ${fields.goals.includes(id) ? 'checked' : ''}><strong>${label}</strong><span>Track this as a stated client goal</span></label>`).join('')}</div>` };
    if (step === 4) return { title: 'Choose how to begin', subtitle: 'Connections are optional. The team can start manually and add access later.', body: `<div class="choice-grid">${[['gbp','Connect Google Business Profile','Mock connection — no OAuth'],['spreadsheet','Import historical spreadsheet','Keep earlier work and context'],['manual','Add data manually','Recommended for a quick start'],['skip','Skip connection for now','Use the workspace immediately']].map(([id, label, note]) => `<label class="choice-card ${fields.connection === id ? 'selected' : ''}"><input type="radio" name="connection" data-onboarding-connection="${id}" ${fields.connection === id ? 'checked' : ''}><strong>${label}</strong><span>${note}</span></label>`).join('')}</div><div class="manual-banner" style="margin-top:20px">${icon('check')}<div><h3>No integration is required</h3><p>Missing connections will be labelled clearly throughout the workspace.</p></div></div>` };
    return { title: 'Review the baseline', subtitle: 'A quick health check creates the first set of verified records and actions.', body: `<div class="profile-grid" style="margin-top:24px"><article class="profile-item"><div class="profile-item-header"><h3>Business details</h3>${status('Ready','success')}</div><div class="value">${esc(fields.businessName || 'Madhur Sweets')}</div><div class="source-note">Entered manually</div></article><article class="profile-item"><div class="profile-item-header"><h3>Locations</h3>${status('3 found','success')}</div><div class="value">Dwarka, Rohini, Noida Sector 18</div><div class="source-note">Pending individual verification</div></article><article class="profile-item"><div class="profile-item-header"><h3>Data access</h3>${status(fields.connection === 'gbp' ? 'Mock connected' : 'Manual start','warning')}</div><div class="value">${fields.connection === 'manual' ? 'Manual entry selected' : 'Connection can be added later'}</div><div class="source-note">No live API access</div></article><article class="profile-item"><div class="profile-item-header"><h3>Baseline status</h3>${status('Needs review','warning')}</div><div class="value">4 items need human verification</div><div class="source-note">Created from onboarding</div></article></div>` };
  }

  function renderOnboarding() {
    const step = state.onboarding.step;
    const names = ['Client details', 'Business locations', 'Goals and pain points', 'Data sources and access', 'Baseline health check'];
    const content = onboardingContent(step);
    return `<div class="onboarding-shell"><aside class="onboarding-aside"><a class="brand" href="#overview"><span class="brand-mark"><span></span><span></span><span></span></span><span>locally</span></a><div class="onboarding-steps">${names.map((name, index) => { const no = index + 1; const done = state.onboarding.completed.includes(no); return `<div class="onboarding-step ${step === no ? 'active' : ''} ${done ? 'done' : ''}"><span class="step-no">${done ? icon('check') : no}</span><span>${name}</span></div>`; }).join('')}</div><p class="onboarding-aside-note">You can skip connections and begin with manual data. Nothing here makes decisions for the agency.</p></aside><section class="onboarding-main"><span class="eyebrow">Step ${step} of 5</span><h1>${content.title}</h1><p>${content.subtitle}</p>${content.body}<footer class="onboarding-footer">${step > 1 ? `<button class="button secondary" data-onboarding-back>Back</button>` : '<small>About 4 minutes</small>'}<button class="button primary" data-onboarding-next>${step === 5 ? 'Open client workspace' : 'Save and continue'}</button></footer></section></div>`;
  }

  function render() {
    const route = currentRoute();
    const renderers = { overview: renderOverview, locations: renderLocations, reviews: renderReviews, visibility: renderVisibility, 'website-audit': renderAudit, competitors: renderCompetitors, actions: renderActions, reports: renderReports, onboarding: renderOnboarding };
    main.innerHTML = route.startsWith('p2-') ? window.LocallyPhaseTwo.render(route, state) : renderers[route]();
    updateShell();
    document.body.classList.remove('menu-open');
    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('button, a, label');
    if (!target) return;

    if (target.dataset.action === 'open-menu') document.body.classList.add('menu-open');
    if (target.dataset.action === 'close-menu') document.body.classList.remove('menu-open');
    if (target.dataset.phase) location.hash = target.dataset.phase === 'two' ? 'p2-overview' : 'overview';
    if (target.dataset.routeLink) location.hash = target.dataset.routeLink;
    if (target.dataset.notificationFilter) { state.ui.notificationFilter = target.dataset.notificationFilter; saveState(); render(); }
    if (target.dataset.approvalFilter) { state.ui.approvalFilter = target.dataset.approvalFilter; saveState(); render(); }
    if (target.dataset.selectApproval) { state.ui.selectedApproval = target.dataset.selectApproval; saveState(); render(); }
    if (target.dataset.reviewStage) { state.ui.p2ReviewStage = target.dataset.reviewStage; saveState(); render(); showToast('Draft added to the approval queue'); }
    if (target.dataset.approvalDecision) { state.ui.p2ReviewStage = 'Approved'; saveState(); render(); showToast('Approved — ready for controlled publishing'); }
    if (target.dataset.demoAction) showToast(`${target.textContent.trim()} is mocked for this UI prototype`);
    if (target.dataset.openLocation) { state.locationFilter = target.dataset.openLocation; state.ui.locationTab = 'profile'; saveState(); location.hash = 'locations'; }
    if (target.dataset.locationTab) { state.ui.locationTab = target.dataset.locationTab; saveState(); render(); }
    if (target.dataset.reviewFilter) { state.ui.reviewFilter = target.dataset.reviewFilter; saveState(); render(); }
    if (target.dataset.openReview) { state.ui.selectedReview = target.dataset.openReview; saveState(); render(); }
    if (target.dataset.action === 'back-reviews') { state.ui.selectedReview = null; saveState(); render(); }
    if (target.dataset.auditView) { state.ui.auditView = target.dataset.auditView; saveState(); render(); }
    if (target.dataset.actionFilter) { state.ui.actionStatus = target.dataset.actionFilter; saveState(); render(); }
    if (target.dataset.reportFeedback) { state.ui.reportFeedback = target.dataset.reportFeedback; saveState(); render(); showToast('Report feedback saved'); }

    if (target.dataset.openAttention) {
      const item = state.attention.find((entry) => entry.id === target.dataset.openAttention);
      if (item) {
        state.locationFilter = item.locationId;
        if (item.id === 'critical-review') state.ui.selectedReview = 'r1';
        saveState();
        location.hash = item.route;
      }
    }

    if (target.dataset.createAction) {
      const list = target.dataset.auditKind === 'automated' ? state.audit.automated : state.audit.manual;
      const auditLocation = selectedLocation('dwarka');
      const baseId = target.dataset.createAction.replace(`${auditLocation.id}-`, '');
      const baseFinding = list.find((item) => item.id === baseId);
      const finding = baseFinding ? { ...baseFinding, id: target.dataset.createAction, locationId: auditLocation.id, status: target.dataset.findingStatus } : null;
      if (finding && !state.actions.some((item) => item.sourceRef === finding.id)) {
        const action = Core.actionFromFinding({ id: finding.id, title: `${finding.status === 'Fail' ? 'Fix' : 'Review'} ${finding.label.toLowerCase()}`, locationId: finding.locationId, source: 'Website audit', priority: finding.status === 'Fail' ? 'High' : 'Medium' });
        action.client = 'Madhur Sweets';
        action.due = '22 Jul';
        state.actions.unshift(action);
        saveState();
        render();
        showToast('Action created from website finding');
      }
    }

    if (target.dataset.action === 'save-draft' || target.dataset.action === 'save-note') { saveDraftInputs(); saveState(); showToast(target.dataset.action === 'save-draft' ? 'Review draft saved' : 'Internal note saved'); }
    if (target.dataset.action === 'request-approval') { saveDraftInputs(); saveState(); showToast('Approval requested from the account manager'); }
    if (target.dataset.action === 'publish-review') {
      const review = state.reviews.find((item) => item.id === target.dataset.reviewId);
      saveDraftInputs();
      if (review && Core.canPublishReview(review.approval) && review.draft.trim()) { review.status = 'Replied'; review.escalation = 'Resolved'; saveState(); render(); showToast('Reply published with human approval'); }
    }
    if (target.dataset.action === 'show-evidence') showToast('Evidence preview is mocked for this prototype');
    if (target.dataset.action === 'mark-irrelevant') showToast('Finding marked not relevant with an audit note');
    if (target.dataset.action === 'mock-import') showToast('This interaction is mocked in Phase 1');
    if (target.dataset.action === 'mock-share') showToast('Share action mocked — no message was sent');
    if (target.dataset.action === 'feedback-detail') showToast('Feedback preference recorded');
    if (target.dataset.action === 'print-report') window.print();
    if (target.dataset.action === 'reset-demo') { localStorage.removeItem(STORAGE_KEY); state = initialState(); saveState(); location.hash = 'overview'; render(); showToast('Demo data reset'); }

    if (target.hasAttribute('data-onboarding-next')) {
      saveOnboardingInputs();
      if (!state.onboarding.completed.includes(state.onboarding.step)) state.onboarding.completed.push(state.onboarding.step);
      if (state.onboarding.step < 5) { state.onboarding.step += 1; saveState(); render(); }
      else { saveState(); location.hash = 'overview'; showToast('Madhur Sweets workspace is ready'); }
    }
    if (target.hasAttribute('data-onboarding-back')) { saveOnboardingInputs(); state.onboarding.step -= 1; saveState(); render(); }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (target.id === 'location-selector') { state.locationFilter = target.value; state.ui.selectedReview = null; saveState(); render(); }
    if (target.id === 'period-selector') { state.period = target.value; saveState(); render(); }
    if (target.id === 'client-selector' && target.value === 'add') { target.value = 'madhur-sweets'; location.hash = 'onboarding'; }
    if (target.dataset.weeklyCheck) { const item = state.weeklyChecklist.find((entry) => entry.id === target.dataset.weeklyCheck); if (item) { item.done = target.checked; item.evidence = target.checked ? '15 Jul · just now' : 'Due this week'; saveState(); render(); } }
    if (target.dataset.approval) { const review = state.reviews.find((item) => item.id === target.dataset.reviewId); if (review) { review.approval[target.dataset.approval] = target.checked; saveDraftInputs(); saveState(); render(); } }
    if (target.dataset.actionStatus) { const action = state.actions.find((item) => item.id === target.dataset.actionStatus); if (action) { action.status = target.value; if (target.value === 'Completed') action.completedPeriod = state.period; saveState(); render(); showToast('Action status updated'); } }
    if (target.dataset.onboardingGoal) { const goals = state.onboarding.fields.goals; const id = target.dataset.onboardingGoal; state.onboarding.fields.goals = target.checked ? [...new Set([...goals, id])] : goals.filter((item) => item !== id); saveState(); render(); }
    if (target.dataset.onboardingConnection) { state.onboarding.fields.connection = target.dataset.onboardingConnection; saveState(); render(); }
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.dataset.reportField) { state.report[state.period][target.dataset.reportField] = target.value; saveState(); }
  });

  function saveDraftInputs() {
    document.querySelectorAll('[data-review-draft]').forEach((field) => { const review = state.reviews.find((item) => item.id === field.dataset.reviewDraft); if (review) review.draft = field.value; });
    document.querySelectorAll('[data-review-note]').forEach((field) => { const review = state.reviews.find((item) => item.id === field.dataset.reviewNote); if (review) review.internalNote = field.value; });
  }

  function saveOnboardingInputs() {
    document.querySelectorAll('[data-onboarding-field]').forEach((field) => { state.onboarding.fields[field.dataset.onboardingField] = field.value; });
    saveState();
  }

  window.addEventListener('hashchange', render);
  if (!location.hash) location.hash = 'overview';
  else render();
})();
