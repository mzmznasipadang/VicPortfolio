import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const index = new URL('../dist/client/index.html', import.meta.url);
assert.ok(existsSync(index), 'Static export is missing index.html');

const page = readFileSync(index, 'utf8');
assert.ok(page.includes('href="favicon.svg"'), 'Static export has an invalid favicon path');

const site = 'https://victorch.dev/';
const sitemap = readFileSync(new URL('../dist/client/sitemap.xml', import.meta.url), 'utf8');
for (const route of ['privacy', 'terms']) {
  const filename = `${route}.html`;
  const html = readFileSync(new URL(`../dist/client/${filename}`, import.meta.url), 'utf8');
  assert.ok(sitemap.includes(`<loc>${site}${filename}</loc>`), `Sitemap must target exported ${filename}`);
  assert.ok(page.includes(`href="${filename}"`), `Home must link to exported ${filename}`);
  assert.ok(html.includes(`<link rel="canonical" href="${site}${filename}"`), `${route} needs its own canonical`);
  assert.ok(html.includes(`<meta property="og:url" content="${site}${filename}"`), `${route} needs its own social URL`);
  const title = route === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions';
  for (const property of ['property="og:title"', 'name="twitter:title"']) {
    assert.ok(html.includes(`${property} content="${title}`), `${route} needs its own social title`);
  }
  const description = route === 'privacy'
    ? 'How Victor Chandra’s portfolio handles visitor preferences, analytics and links.'
    : 'Terms for using Victor Chandra’s portfolio.';
  for (const property of ['name="description"', 'property="og:description"', 'name="twitter:description"']) {
    assert.ok(html.includes(`${property} content="${description}"`), `${route} needs its own description`);
  }
  assert.ok(html.includes('aria-label="Toggle night mode"'), `${route} must offer a theme control`);
  assert.ok(html.includes('href="./"'), `${route} home link must resolve to the portfolio`);
  for (const legal of ['privacy.html', 'terms.html']) {
    assert.ok(html.includes(`href="${legal}"`), `${route} must link to ${legal}`);
  }
}
