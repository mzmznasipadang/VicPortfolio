import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

for (const text of ['Reflax', 'Apple Developer Academy', 'Dotcross AI', '78%', 'HealthKit', 'Bina Nusantara University', 'id="work"', 'id="stack"', 'id="contact"']) {
  assert.ok(page.includes(text), `Missing ${text}`);
}
