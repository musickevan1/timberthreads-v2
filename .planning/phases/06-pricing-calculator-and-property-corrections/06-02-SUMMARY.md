---
phase: 06-pricing-calculator-and-property-corrections
plan: 02
subsystem: ui
tags: [preact, astro-islands, pricing, calculator, tailwind]

# Dependency graph
requires:
  - phase: 06-01
    provides: Accommodations rate card with CTA anchor linking to #pricing-calculator
provides:
  - Interactive pricing calculator Astro island (Preact) with real-time line-item breakdown
  - PricingSection.astro wrapper with static two-tier rate summary and booking minimums
  - Integrated "Estimate Your Stay" section between Calendar and Gallery
affects: [07-gallery-and-media, 08-launch]

# Tech tracking
tech-stack:
  added: ["@astrojs/preact", "preact"]
  patterns:
    - "Astro island with client:load for immediately-interactive UI below fold"
    - "Preact functional component with useState for calculator state"
    - "/** @jsxImportSource preact */ pragma at top of .tsx files"

key-files:
  created:
    - src/components/PricingCalculator.tsx
    - src/components/PricingSection.astro
  modified:
    - astro.config.mjs
    - package.json
    - tsconfig.json
    - src/pages/index.astro
    - src/components/Accommodations.astro
    - src/components/Calendar.astro

key-decisions:
  - "Groups of 10-12 use $12.50/person/day for meals (2 meals & snacks) rather than $15/person/night — corrected post-checkpoint after pricing review"
  - "Preact chosen over React for the calculator island — lighter bundle, same hooks API"
  - "client:load directive used so calculator is ready when users arrive via CTA click"
  - "Static rate summary rendered in PricingSection.astro (not inside Preact island) so it's available without JS"
  - "Belt-and-suspenders constraint display: slider min attributes + inline text messages below each slider"

patterns-established:
  - "Preact island pattern: /** @jsxImportSource preact */ + import from preact/hooks"
  - "Section anchor pattern: id on outermost <section> element matches CTA href"
  - "Pricing breakdown uses aria-live='polite' region for screen reader announcements"

requirements-completed: [PRIC-03, PRIC-04, PRIC-05, PRIC-06]

# Metrics
duration: ~30min
completed: 2026-02-26
---

# Phase 6 Plan 2: Pricing Calculator Summary

**Preact-powered interactive pricing calculator island with sliders, meals toggle, real-time line-item breakdown, and corrected $12.50/person/day meal rate for 10-12 groups**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-02-26
- **Completed:** 2026-02-26
- **Tasks:** 2 auto tasks + 1 checkpoint (human-verify, approved)
- **Files modified:** 7

## Accomplishments
- Installed Preact integration (@astrojs/preact) and built PricingCalculator.tsx island with group size and nights sliders, meals toggle, and real-time breakdown
- Created PricingSection.astro with static two-tier rate summary ($60/$75 for groups <=10, $600 flat for 10-12), booking minimums text, and embedded calculator island
- Integrated "Estimate Your Stay" section between Calendar and Gallery in index.astro; CTA in Accommodations rate card scrolls to the section
- Post-checkpoint correction: meal pricing for groups of 10-12 corrected to $12.50/person/day (2 meals & snacks) rather than $15/person/night, propagated consistently across Calculator, PricingSection, Accommodations, and Calendar

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Preact integration and build PricingCalculator island** - `f209d97` (feat)
2. **Task 2: Create PricingSection wrapper and integrate into page** - `21dc2b5` (feat)
3. **Task 3: Checkpoint human-verify — approved**
4. **Post-checkpoint fix: Differentiate meal pricing for 10-12 flat rate tier** - `fc4313e` (fix)

## Files Created/Modified
- `src/components/PricingCalculator.tsx` - Preact island with sliders, meals toggle, real-time pricing breakdown, accessibility (aria-live, role=switch), and disclaimer
- `src/components/PricingSection.astro` - Section wrapper with id="pricing-calculator", heading, static two-tier rate summary, booking minimums, and PricingCalculator island
- `src/pages/index.astro` - Added PricingSection import and placement between Calendar and Gallery
- `astro.config.mjs` - Added @astrojs/preact integration
- `package.json` - Added @astrojs/preact and preact dependencies
- `tsconfig.json` - Updated JSX settings for Preact
- `src/components/Accommodations.astro` - Corrected meal pricing display to $12.50/person/day
- `src/components/Calendar.astro` - Corrected meal pricing display to $12.50/person/day

## Decisions Made
- Preact chosen over React for lighter bundle size — same hooks API, no behavior difference for this use case
- `client:load` directive chosen over `client:visible` because users navigate to the section via CTA click (need immediate interactivity, not lazy hydration)
- Static rate summary rendered in PricingSection.astro (Astro, not Preact) so it renders without JavaScript
- Belt-and-suspenders constraint enforcement: slider `min` attributes + inline text messages below each slider
- Meal rate for 10-12 groups corrected from $15/night to $12.50/person/day (2 meals & snacks) post-checkpoint after client pricing review

## Deviations from Plan

### Post-Checkpoint Pricing Correction

**1. [Rule 1 - Bug] Corrected meal pricing for groups of 10-12 from $15/night to $12.50/person/day**
- **Found during:** Post-checkpoint review (after Task 3 human-verify approval)
- **Issue:** Meal pricing for groups of 10-12 was using the same $15/person/night rate as smaller groups. The correct rate is $12.50/person/day (covers 2 meals & snacks), not $15/person/night
- **Fix:** Updated PricingCalculator.tsx meal cost logic for the flat-rate tier; updated display text in PricingSection.astro, Accommodations.astro, and Calendar.astro to show consistent $12.50/person/day language
- **Files modified:** src/components/PricingCalculator.tsx, src/components/PricingSection.astro, src/components/Accommodations.astro, src/components/Calendar.astro
- **Verification:** Build passes; meal cost for 11 persons, 3 nights = 11 × $12.50 × 3 = $412.50 (corrected from $495)
- **Committed in:** fc4313e (post-checkpoint fix commit)

---

**Total deviations:** 1 post-checkpoint pricing correction
**Impact on plan:** Pricing correction essential for accuracy — original $15 rate was incorrect for the 10-12 flat-rate tier. Fix propagated consistently across all pricing display surfaces.

## Issues Encountered
None beyond the post-checkpoint meal pricing correction documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Pricing calculator complete and human-verified; phase 6 (all 2 plans) is done
- Phase 7 (gallery and media) can begin; calculator section is correctly positioned between Calendar and Gallery
- Outdoor photos (dock, picnic table, fire pit) may not be available — Phase 7 should handle gracefully

---
*Phase: 06-pricing-calculator-and-property-corrections*
*Completed: 2026-02-26*
