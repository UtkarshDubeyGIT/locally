(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LocallyCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function createInitialState() {
    return {
      client: { id: 'madhur-sweets', name: 'Madhur Sweets' },
      period: '2026-07',
      locationFilter: 'all',
      locations: [
        { id: 'dwarka', name: 'Dwarka' },
        { id: 'rohini', name: 'Rohini' },
        { id: 'noida-sector-18', name: 'Noida Sector 18' },
      ],
    };
  }

  function filterByLocation(records, locationId) {
    if (locationId === 'all') return records;
    return records.filter((record) => record.locationId === locationId);
  }

  function canPublishReview(checklist) {
    return Boolean(checklist.facts && checklist.policy && checklist.manager);
  }

  function actionFromFinding(finding) {
    return {
      id: `action-${finding.id}`,
      title: finding.title,
      locationId: finding.locationId,
      source: finding.source,
      sourceRef: finding.id,
      priority: finding.priority,
      owner: 'Unassigned',
      status: 'Open',
    };
  }

  function getPeriodSnapshot(state, period) {
    return state.periods[period];
  }

  function formatStatusLabel(label) {
    return String(label).replaceAll(' ', '\u00a0');
  }

  function metricVisuals() {
    return { locations: '📍', rating: '★', actions: '😟', reviews: '😰', report: '⏳' };
  }

  return { createInitialState, filterByLocation, canPublishReview, actionFromFinding, getPeriodSnapshot, formatStatusLabel, metricVisuals };
});
