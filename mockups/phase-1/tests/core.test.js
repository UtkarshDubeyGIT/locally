const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const corePath = path.join(__dirname, '..', 'js', 'core.js');
let core = {};
try {
  core = require(corePath);
} catch {
  // The first red run intentionally happens before the implementation exists.
}

test('creates a July 2026 demo state for Madhur Sweets', () => {
  assert.equal(typeof core.createInitialState, 'function');
  const state = core.createInitialState();
  assert.equal(state.client.name, 'Madhur Sweets');
  assert.equal(state.period, '2026-07');
  assert.deepEqual(state.locations.map((location) => location.name), [
    'Dwarka',
    'Rohini',
    'Noida Sector 18',
  ]);
});

test('filters operational records by location while preserving all-location views', () => {
  const records = [
    { id: 1, locationId: 'dwarka' },
    { id: 2, locationId: 'rohini' },
    { id: 3, locationId: 'dwarka' },
  ];
  assert.deepEqual(core.filterByLocation(records, 'dwarka').map((item) => item.id), [1, 3]);
  assert.deepEqual(core.filterByLocation(records, 'all'), records);
});

test('requires every human approval check before a review reply can publish', () => {
  assert.equal(core.canPublishReview({ facts: true, policy: true, manager: false }), false);
  assert.equal(core.canPublishReview({ facts: true, policy: true, manager: true }), true);
});

test('turns a finding into a traceable open action', () => {
  const action = core.actionFromFinding({
    id: 'audit-map',
    title: 'Add Google Map embed',
    locationId: 'dwarka',
    source: 'Website audit',
    priority: 'High',
  });
  assert.equal(action.id, 'action-audit-map');
  assert.equal(action.status, 'Open');
  assert.equal(action.sourceRef, 'audit-map');
  assert.equal(action.owner, 'Unassigned');
});

test('returns the matching period snapshot without mutating demo state', () => {
  const state = {
    period: '2026-07',
    periods: {
      '2026-06': { rating: 4.1 },
      '2026-07': { rating: 4.2 },
    },
  };
  assert.equal(core.getPeriodSnapshot(state, '2026-06').rating, 4.1);
  assert.equal(state.period, '2026-07');
});

test('keeps multi-word status labels visually intact', () => {
  assert.equal(core.formatStatusLabel('Needs attention'), 'Needs\u00a0attention');
});

test('assigns meaningful visual cues to overview metrics', () => {
  assert.deepEqual(core.metricVisuals(), {
    locations: '📍',
    rating: '★',
    actions: '😟',
    reviews: '😰',
    report: '⏳',
  });
});
