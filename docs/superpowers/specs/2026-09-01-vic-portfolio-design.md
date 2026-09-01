# Vic Portfolio Design

## Goal

Create a one-page portfolio for Victor Chandra that attracts iOS engineering roles while credibly showing software-engineering range.

## Audience and message

Recruiters and hiring managers should immediately see an iOS engineer who ships product work and can contribute beyond mobile. The primary message is: “iOS Engineer building thoughtful mobile products.”

## Experience

The site is a single responsive page with anchor navigation. Its first viewport presents Victor’s role, a concise introduction, and clear links to GitHub and contact. It continues with selected work, an iOS-first technical toolkit, a compact software-engineering toolkit, and a contact call to action.

Featured work uses only public GitHub evidence:

- Binus Xplore — Apple Developer Academy BINUS@Alam Sutera project, Swift.
- BLink — a Swift iOS project.

The visual direction is calm and premium, inspired by editorial product design rather than copying an Apple interface: warm off-white canvas, dark ink typography, a restrained blue accent, fine borders, generous spacing, and clear typographic hierarchy.

## Technical approach

Use the Sites scaffold with the shadcn add-on. Compose existing shadcn primitives for buttons, badges, cards, and separators; keep the product in one route with static content and no client-side state.

Deploy as a static GitHub Pages site via a GitHub Actions workflow. Configure the build for the repository base path so project pages load assets correctly. The workflow builds the static output and publishes it to GitHub Pages on pushes to the default branch.

## Content and links

Use publicly listed profile information: Victor Chandra, Tangerang Selatan, Indonesia, Apple Developer Academy, public GitHub account, `info@naspadstudio.id`, naspadstudio.id, ORCID, X, Dribbble, and Instagram. Do not invent employers, outcomes, timelines, project features, or private contact details.

## Quality constraints

- Meet keyboard navigation, visible focus, semantic heading, and responsive-layout basics.
- Include metadata and an Open Graph social image.
- Verify the production build before handoff.
- Keep the scope to one page; add project case-study routes only when detailed source material is provided.
