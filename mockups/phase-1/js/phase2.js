(function (root) {
  'use strict';

  const esc = (value) => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const tone = (label) => {
    if (['Healthy', 'Active', 'Connected', 'Approved', 'Published', 'Data verified'].includes(label)) return 'success';
    if (['Failed', 'Critical'].includes(label)) return 'danger';
    if (['Retrying', 'Ready for review', 'Verification required', 'Awaiting approval', 'High', 'Important'].includes(label)) return 'warning';
    return '';
  };
  const badge = (label, customTone = tone(label)) => `<span class="status ${customTone}">${esc(label)}</span>`;
  const sourceBadge = (label) => `<span class="status manual">${esc(label)}</span>`;
  const humanBadge = () => `<span class="human-badge">${icon('check')} Human approval required</span>`;
  const header = (kicker, title, subtitle, actions = '') => `<header class="page-header">
    <div class="page-title-wrap"><div class="page-kicker">${esc(kicker)} <span class="slash">/</span> Phase 2 · Early growth</div><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div>
    ${actions ? `<div class="page-actions">${actions}</div>` : ''}
  </header>`;
  const sectionHeading = (title, copy = '', aside = '') => `<div class="section-heading"><div><h2>${title}</h2>${copy ? `<p>${copy}</p>` : ''}</div>${aside}</div>`;

  const automations = [
    ['Review synchronization', 'Every 30 minutes', '3 locations', 'Healthy', '8 min ago', 'In 22 min', '0', 'No'],
    ['Critical review alert', 'New critical review', '3 locations', 'Active', '18 min ago', 'Event-driven', '0', 'No'],
    ['AI review draft', 'New unanswered review', '3 locations', 'Active', '8 min ago', 'Event-driven', '0', 'Yes'],
    ['Weekly update compilation', 'Every Friday', 'Madhur Sweets', 'Ready for review', 'Fri 8:00 AM', 'Next Friday', '0', 'Yes'],
    ['Competitor stat refresh', 'Weekly', '9 competitors', 'Retrying', '2 hours ago', 'Retrying', '2', 'Analyst review'],
    ['Task reminders', 'Daily', '7 clients', 'Healthy', 'Today 9:00 AM', 'Tomorrow', '0', 'No'],
  ];

  const notifications = [
    { category: 'Critical', kind: 'Reviews', title: 'Critical review received', place: 'Noida Sector 18', detail: '1-star review mentioning stale food and staff behaviour.', meta: 'Assigned to Aditi · Unacknowledged · Escalates in 2 hours', actions: ['Acknowledge', 'Assign', 'Open review'] },
    { category: 'Important', kind: 'GBP changes', title: 'GBP opening hours changed', place: 'Rohini', detail: 'Google suggested updated Sunday hours. Branch verification is required.', meta: 'Received 36 minutes ago', actions: ['Review change', 'Create action'] },
    { category: 'Important', kind: 'Automation failures', title: 'Automation failed', place: 'Dwarka competitor refresh', detail: 'Retry attempt 2 of 3. Google Places request timed out.', meta: 'Failed 2 hours ago · Next retry in 12 minutes', actions: ['View error', 'Retry'] },
    { category: 'Informational', kind: 'Reports', title: 'Weekly report ready', place: 'Madhur Sweets', detail: 'Data compiled successfully and is awaiting analyst commentary.', meta: 'Compiled Friday at 8:00 AM', actions: ['Review report'] },
  ];

  const approvals = [
    { id: 'reply', tab: 'Review replies', type: 'Review reply', place: 'Noida Sector 18', risk: 'High', reason: 'Product quality and refund complaint', requested: 'Arjun', waiting: '42 minutes', due: 'In 1 hr 18 min' },
    { id: 'report', tab: 'Reports', type: 'Weekly report', place: 'Madhur Sweets', risk: 'Medium', reason: 'Data complete · Analyst commentary added', requested: 'Aditi', waiting: '2 hours', due: 'Today 4:00 PM' },
    { id: 'gbp', tab: 'GBP changes', type: 'GBP update', place: 'Rohini', risk: 'High', reason: 'Suggested Sunday closing time changed', requested: 'System', waiting: '36 minutes', due: 'Today 2:30 PM' },
    { id: 'reply-low', tab: 'Review replies', type: 'Review reply', place: 'Dwarka', risk: 'Low', reason: 'Positive product feedback', requested: 'Arjun', waiting: '18 minutes', due: 'Tomorrow' },
  ];

  function workflowRail(active = 1) {
    const steps = ['Sync', 'Detect', 'Prepare', 'Human review', 'Controlled action'];
    return `<div class="workflow-rail" aria-label="Phase 2 operating model">${steps.map((step, index) => `<div class="workflow-step ${index <= active ? 'active' : ''}"><span>${index + 1}</span><strong>${step}</strong></div>`).join('')}</div>`;
  }

  function renderOverview() {
    const attention = [
      ['Critical hygiene review', 'Noida Sector 18 · Assigned to Aditi', '18 min ago', 'danger', 'p2-reviews'],
      ['GBP opening-hours change', 'Rohini · Verification required', '36 min ago', 'warning', 'p2-approvals'],
      ['Failed competitor refresh', 'Dwarka · Retrying automatically', '2 hrs ago', 'danger', 'p2-automations'],
      ['Weekly client update', 'Madhur Sweets · Awaiting approval', 'Fri 8:00 AM', 'warning', 'p2-weekly'],
    ];
    return `${header('Automated operations overview', 'Madhur Sweets — work surfaced before it is missed', 'Automatic collection and preparation now reduce repetition. Judgment, public replies, and sensitive changes stay with people.', '<button class="button secondary" data-route-link="p2-automations">Check automation health</button><button class="button primary" data-route-link="p2-approvals">Review 4 approvals</button>')}
      ${workflowRail(2)}
      <section class="p2-metric-grid" aria-label="Phase 2 metrics">
        ${[['3','Connected locations','Healthy'],['12','New reviews synced','8 minutes ago'],['4','Awaiting approval','Human review'],['2','Critical alerts','Act now'],['1','Failed automation','Retrying'],['Ready','Weekly update','Review required']].map(([value,label,note], index) => `<div class="p2-metric ${index === 2 ? 'accented' : ''} ${index === 4 ? 'danger-metric' : ''}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('')}
      </section>
      <div class="p2-overview-grid">
        <section>${sectionHeading('Immediate attention', 'Ordered by risk and deadline, not activity volume.', badge('4 surfaced items', 'danger'))}<div class="attention-list">${attention.map(([title,detail,time,itemTone,route]) => `<button class="attention-row" data-route-link="${route}"><span class="signal ${itemTone}"></span><div><h3>${title}</h3><p>${detail}</p></div><time>${time}</time></button>`).join('')}</div></section>
        <aside class="approval-preview soft-panel">${sectionHeading('Approval queue', 'Nothing sensitive executes silently.', badge('4 waiting', 'warning'))}<div class="queue-summary"><button data-route-link="p2-approvals"><strong>2</strong><span>Review replies</span>${icon('chevron')}</button><button data-route-link="p2-approvals"><strong>1</strong><span>GBP change</span>${icon('chevron')}</button><button data-route-link="p2-weekly"><strong>1</strong><span>Weekly report</span>${icon('chevron')}</button></div>${humanBadge()}</aside>
      </div>
      <section class="section">${sectionHeading('Automation health', 'Scheduled and event-driven work remains visible and auditable.', '<button class="section-link" data-route-link="p2-automations">Open automation centre ' + icon('chevron') + '</button>')}<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Automation</th><th>Status</th><th>Last run</th><th>Next run</th></tr></thead><tbody>${automations.slice(0,5).map((row) => `<tr><td class="primary-cell">${row[0]}</td><td>${badge(row[3])}</td><td>${row[4]}</td><td>${row[5]}</td></tr>`).join('')}</tbody></table></div></section>`;
  }

  function renderIntegrations() {
    const cards = [
      ['Google Business Profile','Connected','3/3 locations','Last successful sync 8 minutes ago','Reviews sync: Healthy|Performance sync: Healthy|Notification events: Active'],
      ['PageSpeed Insights','Connected','3 monitored pages','Last audit yesterday','Performance and technical checks available'],
      ['Google Places','Connected','9 competitors','Last refresh 2 hours ago','One competitor refresh failed'],
      ['Email provider','Connected','Critical alerts + reports','Last delivery 26 minutes ago','Sends only approved reports'],
    ];
    return `${header('Integrations', 'Connections, with a visible manual fallback', 'External services speed up collection and notification. The workspace still supports manual entry when a service is unavailable.', '<button class="button primary" data-demo-action="sync">Sync all now</button>')}
      <div class="integration-grid">${cards.map((card,index) => `<article class="integration-card ${index === 2 ? 'has-warning' : ''}"><div class="integration-head"><div class="integration-mark">${card[0].split(' ').map((word) => word[0]).join('').slice(0,2)}</div><div><h2>${card[0]}</h2>${badge(card[1])}</div></div><div class="integration-stat"><strong>${card[2]}</strong><span>${card[3]}</span></div><ul>${card[4].split('|').map((line) => `<li>${line}</li>`).join('')}</ul><div class="card-actions"><button class="button secondary small" data-demo-action="history">View sync history</button><button class="button ghost small" data-demo-action="reconnect">Reconnect</button><button class="button primary small" data-demo-action="sync">Sync now</button></div></article>`).join('')}</div>
      <div class="fallback-strip">${icon('check')}<div><strong>Manual entry remains available if an integration is unavailable.</strong><span>Automation reduces repetition; it does not make the agency dependent on a single data source.</span></div></div>`;
  }

  function renderAutomations() {
    return `${header('Automation centre', 'Recurring work, openly monitored', 'See what runs, where it applies, and exactly where human approval enters the workflow.', '<button class="button secondary" data-demo-action="pause">Pause selected</button><button class="button primary" data-demo-action="new-automation">Add automation</button>')}
      <div class="automation-summary"><div><span>6 workflows</span><strong>5 operating</strong></div><div><span>Human review gates</span><strong>3 active</strong></div><div><span>Failures today</span><strong class="danger-text">1</strong></div><div><span>Next scheduled run</span><strong>22 minutes</strong></div></div>
      <section class="section">${sectionHeading('Active workflows', 'Static demonstration of scheduled and event-driven jobs.')}<div class="data-table-wrap"><table class="data-table automation-table"><thead><tr><th>Automation</th><th>Trigger</th><th>Coverage</th><th>Status</th><th>Last / next run</th><th>Failures</th><th>Approval</th></tr></thead><tbody>${automations.map((row) => `<tr><td class="primary-cell">${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${badge(row[3])}</td><td>${row[4]}<small>Next: ${row[5]}</small></td><td>${row[6]}</td><td>${row[7] === 'No' ? sourceBadge('Not required') : humanBadge()}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="failed-job"><div class="failed-job-icon">!</div><div><span class="eyebrow">Failed job · Retry 2 of 3</span><h2>Competitor refresh — Dwarka</h2><p>Google Places request timed out before all three competitor profiles returned. Existing observations remain unchanged.</p><div class="job-meta"><span>Last attempt: 2 hours ago</span><span>Next retry: in 12 minutes</span><span>Owner: Rohan</span></div></div><div class="failed-actions"><button class="button secondary" data-demo-action="details">View details</button><button class="button primary" data-demo-action="retry">Retry now</button></div></section>`;
  }

  function renderNotifications(state) {
    const filters = ['All','Critical','Reviews','GBP changes','Reports','Automation failures'];
    const selected = state.ui.notificationFilter || 'All';
    const visible = notifications.filter((item) => selected === 'All' || item.category === selected || item.kind === selected);
    return `${header('Notification centre', 'The inbox for events that need a person', 'Critical items interrupt; informational events wait quietly. Each notification points to a concrete next step.')}
      <div class="filter-bar">${filters.map((item) => `<button class="filter-chip ${selected === item ? 'active' : ''}" data-notification-filter="${item}">${item}</button>`).join('')}<span class="filter-summary">${visible.length} notifications</span></div>
      <div class="notification-list">${visible.map((item) => `<article class="notification-card ${item.category.toLowerCase()}"><div class="notification-severity"><span class="severity-marker"></span>${badge(item.category, item.category === 'Critical' ? 'danger' : item.category === 'Important' ? 'warning' : '')}</div><div><h2>${item.title}</h2><strong class="notification-place">${item.place}</strong><p>${item.detail}</p><span class="source-note">${item.meta}</span></div><div class="notification-actions">${item.actions.map((action) => `<button class="button ${action === 'Open review' || action === 'Review report' ? 'primary' : 'secondary'} small" data-demo-action="${action.toLowerCase()}">${action}</button>`).join('')}</div></article>`).join('') || '<div class="empty-state"><strong>No notifications in this view</strong><span>Choose another category to see the seeded examples.</span></div>'}</div>`;
  }

  function renderReviews(state) {
    const stage = state.ui.p2ReviewStage || 'AI draft ready';
    return `${header('Review inbox', 'A response prepared, never silently published', 'The critical review was synchronized automatically. Locally prepared a draft; the branch and a manager still control what happens next.', '<button class="button secondary" data-demo-action="request-info">Request branch information</button><button class="button primary" data-route-link="p2-approvals">Open approval queue</button>')}
      ${workflowRail(stage === 'Approved' ? 3 : 2)}
      <div class="review-detail-grid p2-review-detail"><div>
        <div class="review-stage-row">${badge('Synced automatically','success')} ${badge(stage, stage === 'Approved' ? 'success' : 'warning')} ${badge('Needs investigation','danger')}</div>
        <section class="review-quote"><div class="stars">★☆☆☆☆</div><blockquote>“The sweets seemed stale and the staff did not help when we complained.”</blockquote><div class="review-facts"><span><strong>Sentiment</strong> Negative</span><span><strong>Category</strong> Product quality</span><span><strong>Risk</strong> High</span><span><strong>Escalation</strong> Required</span></div></section>
        <section class="section"><div class="profile-grid"><article class="profile-item"><h3>Location</h3><div class="value">Noida Sector 18</div>${sourceBadge('Google Business Profile')}</article><article class="profile-item"><h3>Freshness</h3><div class="value">Synced 8 minutes ago</div>${sourceBadge('Notification event')}</article></div></section>
        <section class="detail-section"><label class="field-label" for="p2-note">Internal branch note</label><textarea id="p2-note">Branch is checking the 14 July evening batch. Do not promise compensation until the replacement policy is confirmed.</textarea><div class="editor-footer"><small>Internal only · Last updated by Aditi</small><button class="button secondary small" data-demo-action="save">Save note</button></div></section>
      </div><aside class="ai-draft-panel"><div class="ai-draft-head"><div><span class="eyebrow">AI-prepared draft</span><h2>Reply suggestion</h2></div>${sourceBadge('Prepared · not published')}</div><textarea aria-label="AI-prepared reply">Hello Prateek, thank you for bringing this to our attention. We are checking the batch and speaking with our Sector 18 team. We take freshness seriously and would like to understand your order details so we can address this properly.</textarea><div class="draft-meta"><span>Tone: Warm, respectful</span><span>Model: Reply Assistant v2</span><span>Generated: 8 minutes ago</span></div><div class="risk-warning"><strong>Fact check required</strong><p>Do not publish until the branch confirms whether a replacement was offered.</p></div><div class="fact-list"><label><input type="checkbox"> Batch date confirmed</label><label><input type="checkbox"> Replacement offer confirmed</label></div><div class="approval-actions"><button class="button secondary" data-demo-action="edit">Edit draft</button><button class="button secondary" data-demo-action="regenerate">Regenerate</button><button class="button ghost" data-demo-action="reject">Reject suggestion</button><button class="button primary" data-review-stage="Awaiting approval">Send for approval</button></div>${humanBadge()}</aside></div>`;
  }

  function renderApprovals(state) {
    const filters = ['All','Review replies','Reports','GBP changes','High risk'];
    const selectedFilter = state.ui.approvalFilter || 'All';
    const visible = approvals.filter((item) => selectedFilter === 'All' || item.tab === selectedFilter || (selectedFilter === 'High risk' && item.risk === 'High'));
    const selected = approvals.find((item) => item.id === state.ui.selectedApproval) || approvals[0];
    return `${header('Central approval queue', 'Human judgment is the control layer', 'Replies, reports, and sensitive profile changes collect here with evidence and an audit trail.', '<button class="button secondary" data-demo-action="assign">Assign queue</button>')}
      <div class="filter-bar">${filters.map((item) => `<button class="filter-chip ${selectedFilter === item ? 'active' : ''}" data-approval-filter="${item}">${item}</button>`).join('')}<span class="filter-summary">${visible.length} waiting</span></div>
      <div class="approval-workspace"><div class="approval-queue-list">${visible.map((item) => `<button class="approval-item ${selected.id === item.id ? 'selected' : ''}" data-select-approval="${item.id}"><div><span class="eyebrow">${item.type}</span><h3>${item.place}</h3><p>${item.reason}</p></div><div class="approval-item-meta">${badge(item.risk, item.risk === 'High' ? 'warning' : '')}<span>${item.waiting}</span><small>Due ${item.due}</small></div></button>`).join('')}</div>
      <aside class="approval-detail"><div class="approval-detail-head"><div><span class="eyebrow">Selected approval</span><h2>${selected.type} · ${selected.place}</h2></div>${badge(selected.risk, selected.risk === 'High' ? 'warning' : '')}</div><div class="detail-callout"><strong>Original data</strong><p>${selected.id === 'reply' ? '1-star review: “The sweets seemed stale and the staff did not help…”' : selected.id === 'gbp' ? 'Current Sunday hours: 9:00 AM–9:30 PM' : '12 reviews · 10 replies · Maps impressions +8%'}</p></div><div class="detail-callout proposed"><strong>Proposed ${selected.id === 'gbp' ? 'change' : 'content'}</strong><p>${selected.id === 'reply' ? 'A warm acknowledgement that avoids liability and asks for order details.' : selected.id === 'gbp' ? 'Sunday closing time: 10:00 PM · awaiting branch confirmation' : 'Weekly summary with analyst notes and three recommended actions.'}</p></div><div class="approval-checklist"><label><input type="checkbox" checked> Source data reviewed</label><label><input type="checkbox" checked> Brand policy checked</label><label><input type="checkbox"> Final evidence confirmed</label></div><div class="audit-mini"><span class="eyebrow">Audit history</span><p><strong>${selected.requested}</strong> requested approval · ${selected.waiting} ago</p><p><strong>Locally</strong> attached source and policy checks</p></div><div class="approval-actions horizontal"><button class="button primary" data-approval-decision="approved">Approve</button><button class="button secondary" data-demo-action="changes">Request changes</button><button class="button ghost" data-demo-action="reject">Reject</button><button class="button ghost" data-demo-action="assign">Assign</button></div></aside></div>`;
  }

  function renderWeekly() {
    return `${header('Weekly client update', 'A compiled update, finished by an analyst', 'The system assembles verified signals. The analyst explains what they mean; a manager approves before anything is sent.', '<button class="button secondary" data-demo-action="preview-email">Preview client email</button><button class="button primary" disabled>Send approved report</button>')}
      <div class="report-status-row">${badge('System compiled','success')} ${badge('Data verified','success')} ${badge('Analyst commentary required','warning')} ${humanBadge()}</div>
      <article class="weekly-sheet"><header><div><span class="eyebrow">Week ending 17 July 2026</span><h1>Weekly Local SEO Update<br><span>Madhur Sweets</span></h1></div><div class="weekly-status"><strong>Ready for review</strong><span>Compiled Friday · 8:00 AM</span></div></header><div class="weekly-body"><section class="weekly-stat-grid">${[['12','New reviews'],['10','Replies published'],['2','Awaiting approval'],['3','Keywords improved'],['1','Keyword declined'],['4','Actions completed'],['2','Need client input'],['+8%','Maps impressions']].map(([value,label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('')}</section><div class="attention-callout"><span>!</span><div><strong>Noida Sector 18 requires attention</strong><p>A critical product-quality review is waiting for branch facts and manager approval.</p></div></div><section class="narrative-grid"><div class="narrative-block"><h3>What changed this week?</h3><textarea>Dwarka visibility improved across three tracked searches. Review response volume increased after synchronization began.</textarea></div><div class="narrative-block"><h3>What requires attention?</h3><textarea>Noida Sector 18 has a high-risk review. Rohini Sunday hours still need branch verification.</textarea></div><div class="narrative-block"><h3>Recommended next actions</h3><textarea>Confirm the Sector 18 replacement policy, verify Rohini hours, and refresh Dwarka competitor observations.</textarea></div></section><div class="weekly-footer"><span>Analyst: Aditi · Manager approval pending</span><div><button class="button secondary" data-demo-action="save">Save commentary</button><button class="button primary" data-demo-action="submit-approval">Submit for approval</button></div></div></div></article>`;
  }

  function renderVisibility() {
    const rows = [['sweet shop in Dwarka','Dwarka','Mobile',7,5,'dwarka-map-1507.png'],['mithai near me','Sector 12','Mobile',4,6,'sector12-search.png'],['wedding sweets Dwarka','West Delhi','Desktop',12,8,'west-delhi-wedding.png'],['sweet shop Rohini','Rohini Sec 9','Mobile',5,5,'rohini-maps.png'],['best mithai Noida','Sector 18','Mobile',6,9,'noida-mithai.png'],['wedding sweets Noida','Central Noida','Desktop',10,10,'noida-wedding.png']];
    return `${header('Visibility', 'Synchronized performance, observed rankings', 'GBP performance and exact ranking observations remain visibly separate so the UI never overstates what Google provides.')}
      <section>${sectionHeading('GBP performance', 'Automatically synchronized through GBP Performance data.', badge('Synced 1 hour ago','success'))}<div class="performance-grid">${[['Search impressions','44,430','+6%'],['Maps impressions','26,430','+8%'],['Website clicks','5,182','+5%'],['Call clicks','1,098','+3%'],['Direction requests','2,132','+7%']].map(([label,value,change]) => `<div class="performance-card"><span>${label}</span><strong>${value}</strong><small>${change} vs last period</small></div>`).join('')}</div></section>
      <section class="section deterministic-summary"><div><span class="eyebrow">Deterministic summary · No AI</span><h2>3 improved · 2 stable · 1 declined</h2><p>Dwarka had the largest improvement based on recorded position movement.</p></div><div class="summary-bars"><span style="--size:75%">Improved</span><span style="--size:50%">Stable</span><span style="--size:25%">Declined</span></div></section>
      <section class="section">${sectionHeading('Ranking observations', 'Exact ranking observations are manually entered or imported.', sourceBadge('Evidence required'))}<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Keyword</th><th>Target area</th><th>Device</th><th class="numeric">Previous</th><th class="numeric">Current</th><th>Movement</th><th>Evidence</th></tr></thead><tbody>${rows.map((row) => { const change = row[3]-row[4]; return `<tr><td class="primary-cell">${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td class="numeric">${row[3]}</td><td class="numeric"><strong>${row[4]}</strong></td><td><span class="delta ${change > 0 ? 'up' : change < 0 ? 'down' : 'flat'}">${change > 0 ? '↑ '+change : change < 0 ? '↓ '+Math.abs(change) : '—'}</span></td><td><button class="evidence-link" data-demo-action="evidence">${row[5]}</button></td></tr>`; }).join('')}</tbody></table></div></section>`;
  }

  function renderCompetitors() {
    const cards = [
      ['Bikaner House','Dwarka','4.4','1,820','+42','14','Review volume increased faster than Madhur Sweets this week.','Competitor visibility may be benefiting from stronger review velocity.'],
      ['BTW Rohini','Rohini','4.3','2,260','+18','8','New storefront photos and two category edits were detected.','The updates may improve profile freshness, but no causal ranking claim is possible.'],
      ['Haldiram’s','Noida Sector 18','4.5','4,420','+31','11','Peak-hour service reviews increased while owner replies remained slow.','Madhur Sweets should resolve quality issues before increasing promotion.'],
    ];
    return `${header('Competitor updates', 'Automatic refresh, analyst-owned conclusions', 'Profile facts can refresh automatically. Interpretations remain provisional until an analyst reviews them.', '<button class="button secondary" data-demo-action="refresh">Refresh watchlist</button>')}
      <div class="competitor-update-grid">${cards.map((item,index) => `<article class="competitor-update-card"><div class="competitor-head"><div><span class="eyebrow">${item[1]} · Refreshed ${index === 0 ? '2 hours ago' : 'yesterday'}</span><h2>${item[0]}</h2></div>${index === 0 ? badge('Fresh','success') : badge('Scheduled')}</div><div class="competitor-metrics"><div><strong>${item[2]}</strong><span>Rating</span></div><div><strong>${item[3]}</strong><span>Reviews <em>${item[4]}</em></span></div><div><strong>${item[5]}</strong><span>New photos</span></div></div><div class="detected-change"><strong>System-detected change</strong><p>${item[6]}</p></div><div class="analyst-interpretation"><strong>Analyst interpretation</strong><p>${item[7]}</p><small>Interpretation, not a proven causal conclusion.</small></div><div class="card-actions"><button class="button secondary small" data-demo-action="note">Add analyst note</button><button class="button primary small" data-demo-action="task">Create task</button><button class="button ghost small" data-demo-action="irrelevant">Not relevant</button></div></article>`).join('')}</div>`;
  }

  function renderPolicies() {
    return `${header('Client automation policies', 'Madhur Sweets decides where automation stops', 'Policies vary by client. This assisted setup keeps learning and quality ahead of hands-off execution.', '<button class="button primary" data-demo-action="save-policies">Save policy changes</button>')}
      <div class="policy-layout"><section class="policy-main"><article class="policy-section">${sectionHeading('Review reply policy', 'Drafting is assisted; publishing is controlled.')}<div class="policy-rows"><div><span>AI drafts enabled</span>${badge('Yes','success')}</div><div><span>Human approval required</span><strong>Always</strong></div><div class="policy-stack"><span>Manager approval required for</span><div>${['Refunds','Hygiene complaints','Legal threats','Discrimination','Safety issues'].map((item) => sourceBadge(item)).join(' ')}</div></div></div></article><article class="policy-section">${sectionHeading('Notification preferences')}<div class="policy-rows"><div><span>Critical reviews</span><strong>Immediate email + in-app</strong></div><div><span>Positive reviews</span><strong>Daily digest</strong></div><div><span>GBP suspension</span><strong>Notify all managers</strong></div><div><span>Weekly update</span><strong>Friday morning</strong></div><div><span>Monthly report</span><strong>First working day</strong></div></div></article><article class="policy-section">${sectionHeading('Brand response settings')}<div class="policy-rows"><div><span>Tone</span><strong>Warm, respectful, family-oriented</strong></div><div class="policy-stack"><span>Avoid</span><ul><li>Admitting liability</li><li>Promising refunds</li><li>Blaming branch staff</li><li>Making unverifiable claims</li></ul></div></div></article></section><aside><div class="automation-level"><span class="eyebrow">Automation preference</span><h2>Assisted</h2><p>Optimize for learning and quality with high human involvement.</p><div class="level-scale"><span></span><span class="active"></span><span></span></div><div class="level-labels"><small>Manual</small><small>Assisted</small><small>Autonomous</small></div>${humanBadge()}</div><div class="onboarding-assist soft-panel"><span class="eyebrow">Human-led onboarding</span><h2>System-assisted setup</h2><p>Client discovery remains human-led. Locally automates setup and recurring administration.</p><ul>${['Import connected GBP locations','Create default checklists','Configure notification rules','Define escalation categories','Select reporting cadence','Define reply tone and forbidden claims'].map((item) => `<li>${icon('check')} ${item}</li>`).join(' ')}</ul><button class="button secondary" data-demo-action="onboarding">Preview assisted onboarding</button></div></aside></div>`;
  }

  function render(route, state) {
    const renderers = {
      'p2-overview': renderOverview,
      'p2-integrations': renderIntegrations,
      'p2-automations': renderAutomations,
      'p2-notifications': () => renderNotifications(state),
      'p2-reviews': () => renderReviews(state),
      'p2-approvals': () => renderApprovals(state),
      'p2-visibility': renderVisibility,
      'p2-competitors': renderCompetitors,
      'p2-weekly': renderWeekly,
      'p2-policies': renderPolicies,
    };
    return (renderers[route] || renderOverview)();
  }

  root.LocallyPhaseTwo = { render };
})(typeof globalThis !== 'undefined' ? globalThis : this);
