import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import * as security from './check-security.mjs';

assert.ok(existsSync(new URL('../scripts/check-security.mjs', import.meta.url)));
assert.ok(readFileSync(new URL('../package.json', import.meta.url), 'utf8').includes('check:security'));
assert.equal(security.hasSecretExposure?.(`API_${'KEY: redacted'}`), true);
assert.equal(security.hasSecretExposure?.(`secret_${'token = "redacted"'}`), true);
assert.equal(security.hasSecretExposure?.(`API_${'KEY: process.env.API_KEY'}`), false);
assert.equal(security.hasSecretExposure?.(`pass${'word={password}'}`), false, 'JSX props are not secrets');
assert.equal(security.hasSecretExposure?.(`pass${'word=hunter2'}`), true);
for (const name of ['api_key', 'accessToken', 'password']) {
  assert.equal(security.hasSecretExposure(JSON.stringify({ [name]: 'redacted' })), true, `Quoted ${name} must be detected`);
}

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');

for (const file of ['../app/robots.ts', '../app/sitemap.ts', '../public/og.png']) {
  assert.ok(existsSync(new URL(file, import.meta.url)), `Missing discovery asset: ${file}`);
}
assert.ok(layout.includes('title: { default:'));
assert.ok(layout.includes('metadataBase'));

for (const text of ['Reflax', 'CountDown', 'ADASayembara', 'Coco', 'AshMap', '<ResumeButton ', 'Apple Developer Academy', 'Dotcross AI', '78%', 'HealthKit', 'Bina Nusantara University', 'hello@victorch.dev', '<Portrait ', 'https://linkedin.com/in/mzmznasipadang', 'id="work"', 'id="stack"', 'id="contact"', 'id="self-hosted"', 'href="#self-hosted"']) {
  assert.ok(page.includes(text), `Missing ${text}`);
}

for (const text of ['counts down to upcoming calendar events in real time', 'live queue status across attendees and admins']) {
  assert.ok(page.includes(text), `Missing project detail: ${text}`);
}

assert.ok(!page.includes('Binus Xplore'), 'Binus Xplore should be removed');
// Self-hosted apps live on naspadstudio.id subdomains; only the studio homepage link stays removed.
assert.ok(!/https:\/\/(www\.)?naspadstudio\.id/.test(page), 'Studio link should be removed');
assert.ok(!page.includes('dribbble.com'), 'Dribbble link should be removed');
assert.ok(page.includes('Tangerang Selatan, Indonesia<br />Dotcross AI'));

assert.ok(readFileSync(new URL('../components/resume-button.tsx', import.meta.url), 'utf8').includes('Download Resume'), 'Missing Download Resume');

const themeToggle = readFileSync(new URL('../components/theme-toggle.tsx', import.meta.url), 'utf8');
assert.ok(themeToggle.includes('Toggle night mode'));
assert.ok(page.includes('text-black dark:text-white'));
assert.ok(page.includes("import { gsap } from 'gsap'"));
assert.ok(page.includes("prefers-reduced-motion: no-preference"));
assert.ok(page.includes('motion-hero'));
assert.ok(page.includes('motion-project'));

for (const route of ['../app/privacy/page.tsx', '../app/terms/page.tsx']) {
  assert.ok(existsSync(new URL(route, import.meta.url)), `Missing route: ${route}`);
}
assert.ok(readFileSync(new URL('../app/privacy/page.tsx', import.meta.url), 'utf8').includes('Privacy Policy'));
assert.ok(readFileSync(new URL('../app/terms/page.tsx', import.meta.url), 'utf8').includes('Terms and Conditions'));

const legalPage = readFileSync(new URL('../components/legal-page.tsx', import.meta.url), 'utf8');
assert.ok(!legalPage.includes('href="/"'), 'Legal-page home link must stay relative');
assert.ok(legalPage.includes("import { Button } from '@/components/ui/button';"), 'Legal-page home link must use Button');
assert.ok(legalPage.includes('aria-label="Back to portfolio"'), 'Legal-page home link must have an accessible label');

const consent = readFileSync(new URL('../components/cookie-consent.tsx', import.meta.url), 'utf8');
assert.ok(consent.includes('localStorage.getItem(CONSENT_KEY)'));
assert.ok(consent.includes('localStorage.setItem(CONSENT_KEY'));
assert.ok(consent.includes('href={`${import.meta.env.BASE_URL}privacy.html`}'));
assert.ok(page.includes('href="privacy.html"'));
