# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-16)

**Core value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.
**Current focus:** Phase 1 - Foundation and Static Shell

## Current Position

Phase: 1 of 5 (Foundation and Static Shell)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-02-17 -- Plan 01-02 complete (BaseLayout, Nav, Hero, Footer, scroll-spy)

Progress: [##............] 13%

## Performance Metrics

**Velocity:**
- Total plans completed: 2
- Average duration: 5 min
- Total execution time: 10 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation-and-static-shell | 2/3 | 10 min | 5 min |

**Recent Trend:**
- Last 5 plans: 8 min, 2 min
- Trend: Accelerating

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: Astro 5 + Tailwind v4 + Vercel -- static-first with islands for gallery lightbox and contact form only
- [Roadmap]: Resend over Nodemailer for email delivery (Vercel serverless compatibility)
- [Roadmap]: Start with vanilla JS, add React only if interaction complexity justifies ~40KB cost
- [01-01]: Used @tailwindcss/vite (v4) not @astrojs/tailwind (deprecated for Tailwind v4)
- [01-01]: Defined --color-brand: #0D9488 explicitly in @theme because Tailwind v4 changed teal-600 to OKLCH (#009689)
- [01-01]: output: 'static' set in astro.config.mjs to prevent Vercel serverless treatment
- [01-01]: Self-hosted Inter via @fontsource-variable/inter to eliminate Google Fonts external request
- [01-02]: Two-layer hero (absolute bg + relative fg) isolates background for Phase 3 video swap without touching layout
- [01-02]: Tailwind arbitrary attr selector [&[aria-current='true']] for scroll-spy active states -- CSS-driven, no class toggling
- [01-02]: Mobile overlay min-h-[56px] tap targets for older demographic
- [01-02]: IntersectionObserver rootMargin '-5% 0% -90% 0%' for top-of-viewport section detection

### Pending Todos

None.

### Blockers/Concerns

- Raw photos from Feb 15 shoot need sorting/editing before gallery integration (Phase 3)
- Promo video not ready -- Phase 3 builds placeholder only
- path-to-regexp HIGH vulnerability in @astrojs/vercel@9.0.4 transitive dep -- deferred (build-time only, not browser-side)

## Session Continuity

Last session: 2026-02-17
Stopped at: Completed 01-02-PLAN.md (BaseLayout, Nav, Hero, Footer, scroll-spy)
Resume file: .planning/phases/01-foundation-and-static-shell/01-03-PLAN.md
