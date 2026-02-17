# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-16)

**Core value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.
**Current focus:** Phase 3 - Gallery and Media

## Current Position

Phase: 3 of 5 (Gallery and Media)
Plan: 1 of 3 in current phase
Status: In progress
Last activity: 2026-02-17 -- Phase 3, Plan 01 complete (gallery static structure, Cloudinary data layer, video placeholder)

Progress: [#######.......] 47%

## Performance Metrics

**Velocity:**
- Total plans completed: 6
- Average duration: 4 min
- Total execution time: 24 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation-and-static-shell | 3/3 | 15 min | 5 min |
| 02-content-sections-and-embeds | 3/5 | 9 min | 3 min |
| 03-gallery-and-media | 1/3 | 2 min | 2 min |

**Recent Trend:**
- Last 5 plans: 2 min, 5 min, 2 min, 2 min
- Trend: Fast

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
- [01-03]: Cloudinary 'demo' cloud used for Phase 1 CDN path verification -- Phase 3 replaces with retreat cloud name
- [01-03]: Astro <Image> widths=[400,800,1200] + sizes="(max-width:768px) 100vw, 50vw" -- confirmed WebP/AVIF srcset pattern for responsive images
- [02-01]: Section IDs use v2 nav names (about, retreats) not original site names -- scroll-spy depends on exact ID/href match
- [02-01]: Inline Heroicons SVG paths for card icons and bullet checkmarks -- zero new dependencies
- [02-01]: entrance-driveway.jpeg copied in Plan 01 for use in Plan 03 Map section
- [02-02]: Connect.astro uses id=contact so #contact nav href resolves until Phase 4 contact form replaces it
- [02-02]: Pricing kept in Calendar section (not separate) matching original layout, satisfying CONT-07 no-information-loss
- [02-02]: Google Calendar iframe data-src + IntersectionObserver 200px rootMargin pattern established for Plan 03 Maps reuse
- [02-03]: Map and directions shown side-by-side (two-column grid) -- rural visitors need directions visible immediately without tabs
- [02-03]: maps-iframe ID distinct from calendar-iframe to prevent IntersectionObserver conflicts between both embed sections
- [02-03]: Gallery left as inline placeholder in index.astro (not a stub component) since Phase 3 replaces with full Gallery component
- [03-01]: Gallery data is hardcoded TypeScript array in src/data/gallery.ts — zero runtime API calls, fully static build
- [03-01]: CLOUD_NAME = 'timberandthreads' constant is single update point when real Cloudinary account is configured
- [03-01]: Thumbnail transforms use c_fill,g_auto for AI-gravity square crops — preserves subject framing automatically
- [03-01]: data-pswp-srcset pre-wired with 800w/1200w/2000w so PhotoSwipe (Plan 02) can select optimal zoom resolution
- [03-01]: hero-front-view.jpeg reused as video poster — no additional asset needed

### Pending Todos

None.

### Blockers/Concerns

- Raw photos from Feb 15 shoot need sorting/editing before gallery integration (Phase 3)
- Promo video not ready -- Phase 3 builds placeholder only
- path-to-regexp HIGH vulnerability in @astrojs/vercel@9.0.4 transitive dep -- deferred (build-time only, not browser-side)

## Session Continuity

Last session: 2026-02-17
Stopped at: Completed 03-gallery-and-media 03-01-PLAN.md
Resume file: .planning/phases/03-gallery-and-media/03-02-PLAN.md
