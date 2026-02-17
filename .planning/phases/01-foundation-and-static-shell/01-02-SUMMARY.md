---
phase: 01-foundation-and-static-shell
plan: 02
subsystem: ui
tags: [astro, tailwind, nav, scroll-spy, responsive, hero, intersection-observer, mobile-menu]

# Dependency graph
requires:
  - phase: 01-01
    provides: Tailwind v4 global.css with brand tokens, astro.config.mjs, @fontsource-variable/inter installed
provides:
  - BaseLayout.astro with full HTML shell (meta, OG tags, Inter font, Nav, Footer, named head slot)
  - Sticky navigation with 8 section links, frosted glass header, scroll-spy active states
  - IntersectionObserver scroll-spy tracking active section via aria-current on nav links
  - Mobile hamburger menu with full-screen overlay, large tap targets, body scroll lock, Escape key handling
  - Hero section (full-viewport, two-layer bg+fg structure ready for video swap in Phase 3)
  - Footer with three-column layout (brand, nav links, contact info), dynamic copyright year
  - index.astro with 8 placeholder sections (alternating backgrounds) matching nav anchors
  - hero-front-view.jpeg and logo.png images copied from current site
affects:
  - 01-03 (deployment targets this fully-built shell)
  - 02 (content sections drop into the placeholder anchors created here)
  - 03 (hero video swap uses the two-layer structure built here)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Astro Image component for responsive images (widths, sizes, eager/high-priority)
    - Two-layer hero structure (absolute bg layer + relative fg layer) for future video swap
    - Tailwind arbitrary attribute selectors for aria-current active state ([&[aria-current='true']]:...)
    - IntersectionObserver scroll-spy with rootMargin '-5% 0% -90% 0%' for precise top-of-viewport detection
    - Astro <script> tag with ES module import for client-side interactivity (no React/island needed)

key-files:
  created:
    - src/layouts/BaseLayout.astro
    - src/components/Nav.astro
    - src/components/Hero.astro
    - src/components/Footer.astro
    - src/scripts/scroll-spy.js
    - src/pages/index.astro
    - src/assets/images/hero-front-view.jpeg
    - src/assets/images/logo.png
  modified: []

key-decisions:
  - "Two-layer hero (absolute bg div + relative fg div) isolates background from foreground — Phase 3 swaps the bg Image tag for a video element without touching layout"
  - "Tailwind arbitrary attr selector [&[aria-current='true']] for scroll-spy active states — no JavaScript class toggling, purely CSS-driven visual feedback"
  - "Mobile menu as full-screen overlay with min-h-[56px] tap targets — accommodates older demographic with smaller screens and limited touch precision"
  - "IntersectionObserver rootMargin '-5% 0% -90% 0%' creates thin detection band at top 10% of viewport — section becomes active when its top edge enters view, not when it fills the screen"
  - "Nav brand logo uses empty alt='' because adjacent text already identifies the brand — avoids redundant screen reader announcement"

patterns-established:
  - "Pattern: BaseLayout is the HTML shell — every page wraps content in <BaseLayout> passing title/description/ogImage props"
  - "Pattern: Scroll-spy via IntersectionObserver sets aria-current attribute on nav links — CSS styles respond to aria-current, no class manipulation"
  - "Pattern: Section IDs are the source of truth for nav href targets (#home, #about, etc.) — must match exactly"
  - "Pattern: Astro <script> tags use ES module imports for client-side JS — no inline scripts, tree-shakeable"

requirements-completed: [FOUND-02, FOUND-03, FOUND-04]

# Metrics
duration: 2min
completed: 2026-02-17
---

# Phase 1 Plan 02: Layout Shell and Navigation Summary

**Sticky nav with IntersectionObserver scroll-spy, full-viewport hero (two-layer for video swap), mobile hamburger overlay, and 8-section single-page scaffold with BaseLayout, Footer, and OG meta tags**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-17T06:37:55Z
- **Completed:** 2026-02-17T06:40:34Z
- **Tasks:** 2
- **Files modified:** 8 created

## Accomplishments

- BaseLayout renders complete HTML shell with OG/meta tags, Inter font, Nav and Footer; every future page uses this layout
- Sticky nav with frosted glass effect, 8 section links with aria-current scroll-spy active states (teal color + bottom border); mobile hamburger opens full-screen overlay with large tap targets
- Hero fills 100vh with responsive srcset image (3 widths), dark overlay, logo, tagline, and two CTA buttons; two-layer structure ready for Phase 3 video swap

## Task Commits

Each task was committed atomically:

1. **Task 1: Create BaseLayout, Hero, Footer, and index page with section placeholders** - `7b485bf` (feat)
2. **Task 2: Create sticky navigation with scroll-spy and mobile menu** - `eba1b5c` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `src/layouts/BaseLayout.astro` - HTML shell with meta/OG tags, Inter import, Nav+Footer, named head slot
- `src/components/Nav.astro` - Sticky header, desktop links with aria-current active states, mobile hamburger, full-screen overlay, scroll-spy import, menu open/close JS
- `src/components/Hero.astro` - Full-viewport two-layer hero (bg Image + fg content) with logo, h1, tagline, two CTAs
- `src/components/Footer.astro` - Three-column desktop (brand, nav links, contact info), single-column mobile, dynamic copyright year
- `src/scripts/scroll-spy.js` - IntersectionObserver watching section[id] elements, sets aria-current on nav links
- `src/pages/index.astro` - Single-page layout with Hero + 7 placeholder sections (alternating bg colors), all anchors matching nav hrefs
- `src/assets/images/hero-front-view.jpeg` - Retreat front exterior photo (7.4MB source, Astro optimizes to WebP with responsive widths)
- `src/assets/images/logo.png` - Quilting patch logo (469kB source, Astro optimizes to tiny WebP)

## Decisions Made

- Two-layer hero structure (absolute background + relative foreground) isolates the background from foreground content — Phase 3 replaces the `<Image>` tag with a `<video>` element without touching layout or CTAs
- Tailwind arbitrary attribute selector `[&[aria-current='true']]:text-brand` on nav links — CSS responds directly to the aria-current attribute set by the JS scroll-spy, avoiding a separate class-toggling system
- Mobile overlay uses `min-h-[56px]` tap targets — designed for older demographic (primary retreat audience) who may have less precise touch control
- IntersectionObserver `rootMargin: '-5% 0% -90% 0%'` — creates a narrow detection band at the top 10% of the viewport; a section becomes "active" when its top enters this band, giving a natural feeling active state during scroll
- Nav logo `alt=""` (empty) — the adjacent brand text "Timber & Threads" already labels the link, so the logo image is decorative in this context

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required for this plan.

## Next Phase Readiness

- Full responsive layout shell is ready; `npm run build` produces zero errors with Vercel static output
- All 8 section anchor IDs are in place (`#home`, `#about`, `#retreats`, `#accommodations`, `#calendar`, `#gallery`, `#contact`, `#location`) — Phase 2 content drops straight into these sections
- Hero two-layer structure is ready for Phase 3 video background swap
- Images are optimized at build time via Astro's Image component (WebP, responsive srcset) — no manual optimization needed when higher-res images are swapped in

---
*Phase: 01-foundation-and-static-shell*
*Completed: 2026-02-17*

## Self-Check: PASSED

- src/layouts/BaseLayout.astro: FOUND
- src/components/Nav.astro: FOUND
- src/components/Hero.astro: FOUND
- src/components/Footer.astro: FOUND
- src/scripts/scroll-spy.js: FOUND
- src/pages/index.astro: FOUND
- src/assets/images/hero-front-view.jpeg: FOUND
- src/assets/images/logo.png: FOUND
- .planning/phases/01-foundation-and-static-shell/01-02-SUMMARY.md: FOUND
- Commit 7b485bf: FOUND
- Commit eba1b5c: FOUND
