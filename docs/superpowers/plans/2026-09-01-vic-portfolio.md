# Vic Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a one-page, iOS-first portfolio for Victor Chandra on GitHub Pages.

**Architecture:** A static Sites/Vinext page renders all portfolio content from a local constant. Shared shadcn primitives provide the interactive elements; native anchor links handle navigation. GitHub Actions builds the static site and publishes the generated artifact to GitHub Pages.

**Tech Stack:** React, TypeScript, Tailwind CSS, Sites/Vinext, shadcn/ui, Lucide, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-01-vic-portfolio-design.md`

## Global Constraints

- Scaffold with `@openai/sites@0.3.0` and `--add-ons shadcn`.
- Use installed `components/ui` primitives and `lucide-react`; add no UI dependency.
- Use public, verified GitHub-profile content only.
- Keep the product to one route with no client state or invented case-study claims.
- Configure a static build that deploys to GitHub Pages from the default branch.

---

### Task 1: Create the Sites project and verify its baseline

**Files:**
- Create: generated Sites project files, including `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `components/ui/*`, and `.openai/hosting.json`
- Modify: `package.json`

**Interfaces:**
- Produces: an installable, runnable shadcn-enabled Sites application.

- [ ] **Step 1: Scaffold the project with shadcn**

Run: `npm create --yes @openai/sites@0.3.0 . -- --yes --add-ons shadcn --install`

Expected: generated `app`, `components/ui`, and `.openai/hosting.json` directories.

- [ ] **Step 2: Inspect generated UI exports and scripts**

Run: `find components/ui -maxdepth 1 -type f | sort && node -e "const p=require('./package.json'); console.log(p.scripts)"`

Expected: Button, Badge, Card, and Separator primitives are available and a build script exists.

- [ ] **Step 3: Verify the untouched project builds**

Run: `npm run build`

Expected: successful build before product code is added.

- [ ] **Step 4: Commit the scaffold**

Run: `git add package.json package-lock.json app components public .openai && git commit -m "chore: scaffold Sites portfolio"`

Expected: a clean committed scaffold; do not stage `node_modules`.

### Task 2: Add the verified portfolio content and accessible page structure

**Files:**
- Modify: `app/page.tsx`
- Test: `app/page.tsx` build validation

**Interfaces:**
- Consumes: shadcn `Button`, `Badge`, `Card`, and `Separator` exports.
- Produces: one semantic page with `#work`, `#stack`, and `#contact` anchors.

- [ ] **Step 1: Write the content assertion before markup**

Create a minimal Node assertion command that reads `app/page.tsx` and checks the exact public anchors and verified project names:

```bash
node - <<'NODE'
const fs = require('fs');
const page = fs.readFileSync('app/page.tsx', 'utf8');
for (const text of ['Binus Xplore', 'BLink', 'info@naspadstudio.id', 'id="work"', 'id="stack"', 'id="contact"']) {
  if (!page.includes(text)) throw new Error(`Missing ${text}`);
}
NODE
```

- [ ] **Step 2: Run the assertion and verify it fails**

Run the command from Step 1 before adding the page.

Expected: failure because the starter page has none of the required portfolio content.

- [ ] **Step 3: Replace the starter page with the minimal page composition**

Use semantic `header`, `main`, `section`, `article`, and `footer` elements. Import shadcn components only through `@/components/ui/button`, `@/components/ui/badge`, `@/components/ui/card`, and `@/components/ui/separator`. Render the following verified content:

```tsx
const projects = [
  { name: 'Binus Xplore', detail: 'Apple Developer Academy BINUS@Alam Sutera project', stack: 'Swift', href: 'https://github.com/mzmznasipadang/Binus-Xplore' },
  { name: 'BLink', detail: "BLink, with Vic's mixes", stack: 'Swift', href: 'https://github.com/mzmznasipadang/BLink-Vic' },
];
```

Use `mailto:info@naspadstudio.id` for the contact button and `https://github.com/mzmznasipadang` for GitHub. Add accessible labels to every icon-only link.

- [ ] **Step 4: Run the content assertion and deployment build**

Run the assertion from Step 1, then `npm run build`.

Expected: assertion passes and build succeeds.

- [ ] **Step 5: Commit the page**

Run: `git add app/page.tsx && git commit -m "feat: add iOS portfolio content"`

### Task 3: Apply the visual system and metadata

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: the sections and classes in `app/page.tsx`.
- Produces: responsive light and dark tokens, meaningful metadata, and visible keyboard focus.

- [ ] **Step 1: Define the theme before page styling**

Set warm canvas, ink, muted, border, and blue-accent design tokens in both theme blocks in `app/globals.css`. Preserve `:focus-visible` styling and use responsive CSS for the project grid.

- [ ] **Step 2: Apply page-level styling**

Style a readable editorial layout: constrained content column, fine borders, generous vertical rhythm, two-column work grid above 760px, and a stacked mobile layout. Respect `prefers-reduced-motion` for any hover transition.

- [ ] **Step 3: Add site metadata**

Set title to `Victor Chandra — iOS Engineer` and description to `iOS engineer and software developer building thoughtful mobile products.` in `app/layout.tsx`. Set matching Open Graph and X title and description; omit an image until the social card exists.

- [ ] **Step 4: Verify the build**

Run: `npm run build`

Expected: successful production build with no TypeScript errors.

- [ ] **Step 5: Commit the visual system**

Run: `git add app/globals.css app/layout.tsx && git commit -m "feat: style portfolio and metadata"`

### Task 4: Create the social preview and GitHub Pages deployment

**Files:**
- Create: `public/og.png`
- Modify: `app/layout.tsx`
- Create: `.github/workflows/deploy.yml`
- Modify: `vite.config.ts`

**Interfaces:**
- Consumes: the product title and metadata from Task 3.
- Produces: a portable static artifact and an automated GitHub Pages deployment.

- [ ] **Step 1: Generate and inspect the social card**

Generate exactly one 1200×630 landscape image with the legible copy `Victor Chandra` and `iOS Engineer · Thoughtful mobile products`, using the portfolio’s warm off-white, dark ink, and blue palette. Save it as `public/og.png`.

- [ ] **Step 2: Wire the social image metadata**

Add `/og.png` as the Open Graph and X image in `app/layout.tsx` using the generated framework metadata API.

- [ ] **Step 3: Configure project-page paths and add GitHub Pages deployment**

Set `base: process.env.GITHUB_ACTIONS ? '/VicPortfolio/' : '/'` in `vite.config.ts` so JavaScript and CSS work both locally and under the repository Pages path. Create `.github/workflows/deploy.yml` using `actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, and `actions/deploy-pages@v4`. Trigger it on pushes to `master` and `workflow_dispatch`; install with `npm ci`, run `npm run build`, then upload `dist/`.

- [ ] **Step 4: Verify the final build**

Run: `npm run build`

Expected: production output contains the portfolio assets and the build completes successfully.

- [ ] **Step 5: Commit deployment support**

Run: `git add public/og.png app/layout.tsx .github/workflows/deploy.yml package.json && git commit -m "ci: deploy portfolio to GitHub Pages"`

### Task 5: Preview and publish

**Files:**
- Modify: none unless a compile or blocking-runtime error is found.

**Interfaces:**
- Consumes: the completed production build and GitHub Pages workflow.
- Produces: a live GitHub Pages URL.

- [ ] **Step 1: Start the development server**

Run the generated development command and retain its session.

- [ ] **Step 2: Force one route render**

Request the exact local URL printed by the server.

Expected: a non-error response after successful compilation.

- [ ] **Step 3: Open the meaningful preview**

Open the local portfolio only after the page, theme, and content from Tasks 2–3 compile.

- [ ] **Step 4: Push the default branch to the GitHub repository**

Run: `git push -u origin master`

Expected: GitHub Actions publishes the static artifact.

- [ ] **Step 5: Verify the Pages deployment**

Confirm the workflow is green and return the deployed GitHub Pages URL.
