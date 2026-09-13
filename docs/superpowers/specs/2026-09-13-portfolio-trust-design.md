# Portfolio Trust Design

## Scope

Harden Victor Chandra's static GitHub Pages portfolio without changing its hosting model. The site remains a presentation site with a `mailto:` contact action and no data-submission endpoint.

## Routes

- `/privacy/`: a plain-language Privacy Policy describing the limited processing on the static site, local theme/consent preferences, GitHub Pages delivery, and external links.
- `/terms/`: Terms and Conditions covering permitted use, intellectual-property ownership, third-party links, no warranty, and a contact method.
- Both pages use the current light/dark Naspad visual system, a compact header with a home link, and footer links back to the legal pages.

## Privacy, consent, and spam

- A dismissible consent banner appears until a visitor accepts or declines. The preference is saved in browser local storage only; no analytics, advertising, or non-essential cookies are introduced.
- The Privacy Policy states that preference storage is local to the visitor's browser and explains how to clear it.
- The existing `mailto:` link remains the only contact method. The site accepts no form submissions, so it exposes no form endpoint for spam attacks.
- Cloudflare Turnstile is intentionally excluded: meaningful validation requires a server-side verification endpoint and secret key, which static GitHub Pages does not provide.

## Security and hosting

- Keep GitHub Pages HTTPS enforcement. The current deployment redirects HTTP to HTTPS and sends HSTS.
- Keep secrets out of client code. Add repository checks that reject dotenv files and common secret-shaped assignments outside approved build configuration.
- Do not add a meta Content Security Policy because the current static framework output requires inline bootstrap scripts; an incorrect policy could break the site. GitHub Pages does not provide per-site custom response-header configuration.

## Discoverability and social sharing

- Set title and description metadata on the portfolio, Privacy, and Terms pages.
- Replace the social card with a 1200×630 dark-theme PNG: navy-black field, `VC.` identifier, Victor Chandra's name, and iOS/software-engineering positioning. It adopts the simple, typographic composition shown by ogimagecn while remaining a static asset compatible with GitHub Pages.
- Add generated `robots.txt` and `sitemap.xml` routes with the canonical GitHub Pages URL. Both legal routes and the home page appear in the sitemap.

## Responsive design

- Keep the existing shadcn controls. Make the header, CTA row, project cards, legal pages, and consent banner usable at 320px and above without horizontal overflow.
- Preserve keyboard focus, visible controls, dark mode, and reduced-motion behavior.

## Validation

- Extend the existing assert-based check to cover legal routes, metadata, consent behavior markers, the OG asset, robots, sitemap, and the absence of committed dotenv files.
- Build with the GitHub Pages base path, run the checks and focused lint, then verify the deployed home page, legal routes, robots, sitemap, and OG image over HTTPS.
