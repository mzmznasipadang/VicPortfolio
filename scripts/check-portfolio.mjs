import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');

for (const text of ['Reflax', 'CountDown', 'ADASayembara', 'Coco', 'Download Resume', 'Apple Developer Academy', 'Dotcross AI', '78%', 'HealthKit', 'Bina Nusantara University', 'vichndrlie@outlook.com', 'https://avatars.githubusercontent.com/u/41635105?v=4', 'https://linkedin.com/in/mzmznasipadang', 'id="work"', 'id="stack"', 'id="contact"']) {
  assert.ok(page.includes(text), `Missing ${text}`);
}

for (const image of ['reflax.png', 'coco.png', 'countdown.png', 'adasayembara.png']) {
  assert.ok(page.includes(`/projects/${image}`), `Missing image reference: ${image}`);
  assert.ok(existsSync(new URL(`../public/projects/${image}`, import.meta.url)), `Missing image asset: ${image}`);
}

assert.ok(!page.includes('Binus Xplore'), 'Binus Xplore should be removed');
assert.ok(!page.includes('naspadstudio.id'), 'Studio link should be removed');
assert.ok(!page.includes('dribbble.com'), 'Dribbble link should be removed');

const themeToggle = readFileSync(new URL('../components/theme-toggle.tsx', import.meta.url), 'utf8');
assert.ok(themeToggle.includes('Toggle night mode'));
assert.ok(page.includes('text-black dark:text-white'));
