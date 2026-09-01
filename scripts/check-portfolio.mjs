import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

for (const text of ['Binus Xplore', 'BLink', 'info@naspadstudio.id', 'id="work"', 'id="stack"', 'id="contact"']) {
  assert.ok(page.includes(text), `Missing ${text}`);
}
