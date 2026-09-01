import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

for (const text of ['Reflax', 'CountDown', 'ADASayembara', 'Download iOS resume', 'Apple Developer Academy', 'Dotcross AI', '78%', 'HealthKit', 'Bina Nusantara University', 'id="work"', 'id="stack"', 'id="contact"']) {
  assert.ok(page.includes(text), `Missing ${text}`);
}

const themeToggle = readFileSync(new URL('../components/theme-toggle.tsx', import.meta.url), 'utf8');
assert.ok(themeToggle.includes('Toggle night mode'));
assert.ok(page.includes('text-black dark:text-white'));
