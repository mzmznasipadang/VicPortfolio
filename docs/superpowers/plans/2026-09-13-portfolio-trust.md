# Portfolio Trust Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add legal, privacy, discoverability, and mobile-resilience features to the static GitHub Pages portfolio.

**Architecture:** Keep the site static and GitHub Pages-compatible. Add server-free App Router pages, static discovery files, and one client-side consent component that persists only a preference in local storage. Retain `mailto:` contact, so no form endpoint or CAPTCHA is needed.

**Tech Stack:** React 19, Vinext static export, shadcn/ui, Tailwind CSS, Node assert scripts, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-13-portfolio-trust-design.md`

## Global Constraints

- Keep GitHub Pages as the host; HTTP-to-HTTPS and HSTS are already enforced.
- Do not add a contact form, third-party tracking, analytics, or client-visible secrets.
- Use the existing shadcn `Button` component and Naspad light/dark tokens.
- All new UI works at 320px wide, has visible focus, and respects reduced motion.
- Legal copy is a plain-language template, not legal advice.

---

## File Structure

- `app/privacy/page.tsx`: Privacy page with route-specific metadata.
- `app/terms/page.tsx`: Terms page with route-specific metadata.
- `components/legal-page.tsx`: Shared semantic legal-page shell.
- `components/cookie-consent.tsx`: Client-side consent banner and local-storage preference.
- `app/layout.tsx`: Root metadata and consent-banner mount.
- `app/page.tsx`: Mobile header/footer refinements and legal links.
- `app/globals.css`: Mobile-safe consent banner and typography rules.
- `app/robots.ts`, `app/sitemap.ts`: Static-exported discovery routes.
- `public/og.png`: 1200×630 dark social card.
- `scripts/check-portfolio.mjs`, `scripts/check-security.mjs`: Static presence and secret-exposure checks.
- `package.json`: Run both checks through `npm test`.

### Task 1: Legal pages and route metadata

**Files:**
- Create: `components/legal-page.tsx`
- Create: `app/privacy/page.tsx`
- Create: `app/terms/page.tsx`
- Modify: `scripts/check-portfolio.mjs`

**Interfaces:**
- Produces: `LegalPage({ title, updated, children })`, a reusable legal-content shell.
- Produces: `/privacy/` and `/terms/` static routes with route-specific `metadata`.

- [ ] **Step 1: Write the failing route checks**

```js
for (const route of ['../app/privacy/page.tsx', '../app/terms/page.tsx']) {
  assert.ok(existsSync(new URL(route, import.meta.url)), `Missing route: ${route}`);
}
assert.ok(readFileSync(new URL('../app/privacy/page.tsx', import.meta.url), 'utf8').includes('Privacy Policy'));
assert.ok(readFileSync(new URL('../app/terms/page.tsx', import.meta.url), 'utf8').includes('Terms and Conditions'));
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm test`

Expected: FAIL with `Missing route: ../app/privacy/page.tsx`.

- [ ] **Step 3: Implement the legal shell and pages**

```tsx
export function LegalPage({ title, updated, children }: LegalPageProps) {
  return <main className="mx-auto max-w-3xl px-6 py-12 sm:py-20">...</main>;
}

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Victor Chandra’s portfolio handles visitor preferences and links.',
};
```

Include the exact data inventory from the spec: GitHub Pages delivery, local theme and consent preferences, external links, and the `mailto:` contact option. Include no claim of collecting personal data.

- [ ] **Step 4: Run the check to verify it passes**

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/legal-page.tsx app/privacy/page.tsx app/terms/page.tsx scripts/check-portfolio.mjs
git commit -m "feat: add legal pages"
```

### Task 2: Consent preference and mobile navigation

**Files:**
- Create: `components/cookie-consent.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `scripts/check-portfolio.mjs`

**Interfaces:**
- Produces: `CookieConsent`, a client component that stores `cookie-consent` as `accepted` or `declined` in `localStorage`.
- Consumes: existing shadcn `Button` and Naspad CSS tokens.

- [ ] **Step 1: Write the failing consent and mobile checks**

```js
const consent = readFileSync(new URL('../components/cookie-consent.tsx', import.meta.url), 'utf8');
assert.ok(consent.includes("localStorage.getItem('cookie-consent')"));
assert.ok(consent.includes("localStorage.setItem('cookie-consent'"));
assert.ok(page.includes('href="/privacy"'));
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm test`

Expected: FAIL because `components/cookie-consent.tsx` is missing.

- [ ] **Step 3: Implement the smallest accessible banner and responsive layout changes**

```tsx
const choose = (value: 'accepted' | 'declined') => {
  localStorage.setItem('cookie-consent', value);
  setVisible(false);
};
```

Mount `<CookieConsent />` under the root layout body. Use two explicit buttons: `Accept` and `Decline`. On small viewports, let the header wrap instead of hiding all navigation, make the consent actions stack when needed, and keep footer legal links wrapped with `flex-wrap`.

- [ ] **Step 4: Run the check to verify it passes**

Run: `npm test && npx oxlint app/page.tsx app/layout.tsx components/cookie-consent.tsx`

Expected: PASS with no focused lint errors.

- [ ] **Step 5: Commit**

```bash
git add components/cookie-consent.tsx app/layout.tsx app/page.tsx app/globals.css scripts/check-portfolio.mjs
git commit -m "feat: add consent and mobile legal navigation"
```

### Task 3: Search metadata, static discovery, and social card

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Modify: `public/og.png`
- Modify: `scripts/check-portfolio.mjs`

**Interfaces:**
- Produces: root title template, canonical URL, Open Graph, and X metadata.
- Produces: `robots()` and `sitemap()` metadata routes for home, privacy, and terms.

- [ ] **Step 1: Write the failing discovery checks**

```js
for (const file of ['../app/robots.ts', '../app/sitemap.ts', '../public/og.png']) {
  assert.ok(existsSync(new URL(file, import.meta.url)), `Missing discovery asset: ${file}`);
}
assert.ok(layout.includes('title: { default:'));
assert.ok(layout.includes('metadataBase'));
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm test`

Expected: FAIL with `Missing discovery asset: ../app/robots.ts`.

- [ ] **Step 3: Implement metadata and discovery routes**

```ts
const siteUrl = 'https://mzmznasipadang.github.io/VicPortfolio';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/privacy/', '/terms/'].map((path) => ({ url: `${siteUrl}${path}` }));
}
```

Generate a replacement `public/og.png` at 1200×630. Use the dark Naspad palette, `VC.`, “Victor Chandra”, and “iOS Engineer · Software Engineer” in a simple typographic composition inspired by ogimagecn. Do not use a dynamic `next/og` route because GitHub Pages is static.

- [ ] **Step 4: Run the check to verify it passes**

Run: `GITHUB_ACTIONS=true npm run build && npm test && node scripts/check-github-pages.mjs`

Expected: PASS and generated output contains `robots.txt`, `sitemap.xml`, and `og.png`.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/robots.ts app/sitemap.ts public/og.png scripts/check-portfolio.mjs
git commit -m "feat: add portfolio search metadata"
```

### Task 4: Secret-exposure guard and deployment verification

**Files:**
- Create: `scripts/check-security.mjs`
- Modify: `package.json`
- Modify: `scripts/check-portfolio.mjs`

**Interfaces:**
- Produces: `npm run check:security`, which fails if tracked dotenv files or common private-key assignments appear in source files.

- [ ] **Step 1: Write the failing security test**

```js
assert.ok(existsSync(new URL('../scripts/check-security.mjs', import.meta.url)));
assert.ok(readFileSync(new URL('../package.json', import.meta.url), 'utf8').includes('check:security'));
```

- [ ] **Step 2: Run the check to verify it fails**

Run: `npm test`

Expected: FAIL because `scripts/check-security.mjs` does not exist.

- [ ] **Step 3: Implement the repository guard**

```js
const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n');
assert.ok(!tracked.some((file) => /(^|\/)\.env($|\.)/.test(file)), 'Do not commit dotenv files');
assert.ok(!sourceFiles.some((file) => /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(readFileSync(file, 'utf8'))));
```

Run `check:security` from `npm test`. Do not report the content of any matched value. Do not add a CAPTCHA because there is no submission endpoint; document that the live HTTPS configuration remains GitHub Pages-managed.

- [ ] **Step 4: Run full local verification**

Run: `GITHUB_ACTIONS=true npm run build && npm test && npx oxlint app components scripts && git diff --check`

Expected: exit code 0.

- [ ] **Step 5: Commit and publish**

```bash
git add scripts/check-security.mjs scripts/check-portfolio.mjs package.json
git commit -m "chore: guard portfolio secrets"
git push origin master
```

After the deployment completes, verify HTTPS redirects, HSTS, `/privacy/`, `/terms/`, `/robots.txt`, `/sitemap.xml`, and `/og.png` on the public URL.

## Self-Review

- Spec coverage: Tasks 1–4 cover routes, legal copy, consent, mobile layout, HTTPS verification, secret checks, no-form spam posture, metadata, static OG asset, robots, sitemap, and deploy verification.
- Placeholder scan: no unassigned tasks or undefined interfaces remain.
- Type consistency: `cookie-consent` is the only persisted preference key; all routes use the canonical GitHub Pages URL.
