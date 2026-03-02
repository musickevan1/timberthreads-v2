---
phase: 08-polish-accessibility-seo-and-deploy
plan: "01"
subsystem: ui
tags: [performance, accessibility, fonts, lighthouse, tailwind, astro]

# Dependency graph
requires:
  - phase: 07-photography-integration
    provides: final component structure and gallery layout
provides:
  - self-hosted Inter Variable font from public/fonts/ with font-display swap
  - 18px body text baseline (A11Y-01)
  - 16px minimum text size enforced across all content components
  - Lighthouse Performance score 98 on simulated mobile Fast 3G
  - FCP 1205ms (under 2000ms threshold)
  - Confirmed JS budget under 50KB initial load
  - Confirmed IntersectionObserver embed deferral for Calendar and Maps
affects: [09-future-phases, deployment]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Self-hosted variable font with @font-face + font-display swap + preload link
    - 18px base body text with text-base as minimum for all content text

key-files:
  created:
    - public/fonts/inter-latin-wght-normal.woff2
  modified:
    - src/styles/global.css
    - src/layouts/BaseLayout.astro
    - src/components/Footer.astro
    - src/components/Connect.astro
    - src/components/Contact.astro
    - src/components/Nav.astro
    - src/components/Map.astro
    - src/components/PricingSection.astro
    - src/components/Accommodations.astro
    - src/components/PricingCalculator.tsx
    - src/components/About.astro
    - src/components/GalleryCategory.astro
    - src/components/PromoVideo.astro
    - src/components/VideoPlaceholder.astro

key-decisions:
  - "Self-hosted Inter uses inter-latin-wght-normal.woff2 (not inter-latin-wkst.woff2 as planned — that filename does not exist in the npm package)"
  - "Map step-number badges (1-6 in fixed 28px circles) kept at text-sm — decorative positional indicators, same info conveyed by list order"
  - "Body font-size raised to 1.125rem (18px) per A11Y-01 — all components use text-base or larger for content text"

patterns-established:
  - "Font self-hosting: copy woff2 from node_modules to public/fonts/, declare @font-face in global.css before @import tailwindcss, add preload link in BaseLayout head"
  - "Text size minimum: text-base (16px) for all content text; only permitted exceptions are aria-hidden decorative elements or fixed-size badge containers"

requirements-completed: [PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, A11Y-01]

# Metrics
duration: 5min
completed: 2026-03-02
---

# Phase 8 Plan 01: Performance Audit and Optimization Summary

**Self-hosted Inter Variable font with font-display swap, 18px body text, 16px text minimum enforced sitewide, Lighthouse Performance 98 and FCP 1205ms on simulated mobile Fast 3G**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-02T17:12:58Z
- **Completed:** 2026-03-02T17:18:00Z
- **Tasks:** 3
- **Files modified:** 15 (1 created)

## Accomplishments

- Self-hosted Inter Variable font from `public/fonts/` — eliminates npm CSS bundle import, enables preload, achieves font-display swap
- A11Y-01 satisfied: body text is 1.125rem (18px); all content text in all components upgraded from text-xs/text-sm to text-base minimum (16px)
- Lighthouse Performance: **98** on simulated mobile Fast 3G (threshold: 90+)
- FCP: **1205ms** (threshold: under 2000ms)
- Initial-load JS budget confirmed: ~32KB (Preact + PricingCalculator + Astro client) — well under 50KB
- PhotoSwipe (60KB) confirmed interaction-only, not initial-load
- IntersectionObserver embed deferral confirmed working for both Calendar and Maps in built output (4 occurrences in dist/client/index.html)
- Static sections (About, Accommodations, Hero, Footer) confirmed zero client-side JS

## Task Commits

Each task was committed atomically:

1. **Task 1: Self-host Inter font and enforce body text size** - `f3c51ab` (feat)
2. **Task 2: Audit and verify JS budget and embed deferral** - verification only, no code changes
3. **Task 3: Lighthouse score verification** - verification only, no code changes

**Plan metadata:** (docs commit to follow)

## Files Created/Modified

- `public/fonts/inter-latin-wght-normal.woff2` - Self-hosted Inter Variable latin subset (48KB)
- `src/styles/global.css` - Added @font-face declaration with font-display swap; body font-size 1rem -> 1.125rem
- `src/layouts/BaseLayout.astro` - Removed @fontsource-variable/inter import; added `<link rel="preload">` for font
- `src/components/Footer.astro` - Copyright text-sm -> text-base, admin links text-xs -> text-base
- `src/components/Connect.astro` - "Last updated" caption text-sm -> text-base
- `src/components/Contact.astro` - Form labels, error messages, "Get directions" link text-sm -> text-base
- `src/components/Nav.astro` - Desktop nav links text-sm -> text-base
- `src/components/Map.astro` - GPS warning and photo caption text-sm -> text-base
- `src/components/PricingSection.astro` - All pricing descriptions text-sm -> text-base
- `src/components/Accommodations.astro` - All pricing descriptions text-sm -> text-base
- `src/components/PricingCalculator.tsx` - Slider labels, constraint messages, line items, disclaimer text-xs/text-sm -> text-base
- `src/components/About.astro` - Hover "View Gallery" labels text-sm -> text-base
- `src/components/GalleryCategory.astro` - Hover "View" label text-sm -> text-base
- `src/components/PromoVideo.astro` - Badge text text-sm -> text-base
- `src/components/VideoPlaceholder.astro` - Badge text text-sm -> text-base

## Decisions Made

- Used `inter-latin-wght-normal.woff2` (actual file in the npm package's `files/` directory) instead of `inter-latin-wkst.woff2` as the plan specified — the wkst filename does not exist in this version of @fontsource-variable/inter; wght is the correct variable weight axis filename
- Map step-number badges (1-6 inside 28px circles) kept at text-sm — these are positional decorators in a numbered list, the information is conveyed by order; upgrading would cause overflow in the fixed circle container
- format changed from `'woff2'` to `'woff2-variations'` to match the npm package's own declaration, ensuring browsers correctly identify this as a variable font

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Font filename correction: wkst -> wght**
- **Found during:** Task 1 (Self-host Inter font)
- **Issue:** Plan specified `inter-latin-wkst.woff2` as the font filename, but this file does not exist in `node_modules/@fontsource-variable/inter/files/`. The actual variable weight file is `inter-latin-wght-normal.woff2`.
- **Fix:** Used `inter-latin-wght-normal.woff2` throughout (CSS @font-face, HTML preload link, and copy command). Also used `format('woff2-variations')` (as used by the npm package's own CSS) instead of `format('woff2')`.
- **Files modified:** `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `public/fonts/inter-latin-wght-normal.woff2`
- **Verification:** Build passes; font file exists at correct path
- **Committed in:** f3c51ab (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - incorrect filename in plan)
**Impact on plan:** Necessary correction — the plan had a wrong filename. Fix is equivalent to plan intent. No scope creep.

## Issues Encountered

- Astro `preview` command not supported by the `@astrojs/vercel` adapter — used `npx serve dist/client` for Lighthouse testing instead. This is a known pre-existing constraint.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Performance and A11Y-01 foundation complete
- Ready for Phase 8 Plan 02 (accessibility audit and ARIA improvements)
- Lighthouse Performance 98 confirmed — strong baseline for remaining optimizations

## Self-Check: PASSED

- public/fonts/inter-latin-wght-normal.woff2 exists
- 08-01-SUMMARY.md exists
- Commit f3c51ab exists in git history
- 1.125rem body font-size in global.css confirmed
- @font-face declaration in global.css confirmed
- No @fontsource-variable/inter import in BaseLayout.astro confirmed

---
*Phase: 08-polish-accessibility-seo-and-deploy*
*Completed: 2026-03-02*
