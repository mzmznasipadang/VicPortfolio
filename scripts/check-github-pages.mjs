import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const index = new URL('../dist/client/index.html', import.meta.url);
assert.ok(existsSync(index), 'GitHub Pages export is missing index.html');

const page = readFileSync(index, 'utf8');
for (const image of ['reflax.png', 'coco.png', 'countdown.png', 'adasayembara.png']) {
  assert.ok(page.includes(`src="projects/${image}"`), `GitHub Pages export has an invalid image path: ${image}`);
}

assert.ok(page.includes('href="favicon.svg"'), 'GitHub Pages export has an invalid favicon path');
