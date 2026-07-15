const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(projectRoot, 'css', 'styles.css'), 'utf8');
const phaseTwo = fs.readFileSync(path.join(projectRoot, 'js', 'phase2.js'), 'utf8');

test('notification severity marker styling does not collapse the status badge', () => {
  assert.match(phaseTwo, /class="severity-marker"/);
  assert.match(css, /\.notification-severity > \.severity-marker\s*\{/);
  assert.doesNotMatch(css, /\.notification-severity > span\s*\{/);
});
