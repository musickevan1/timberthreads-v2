---
phase: 06-pricing-calculator-and-property-corrections
plan: 01
subsystem: ui
tags: [astro, tailwind, pricing, property-content]

# Dependency graph
requires: []
provides:
  - Updated pricing copy across Accommodations, Calendar, and Workshops sections
  - Rate card with two tiers ($60/night standard, $75/night with meals for <=10; $600/night flat for 10-12)
  - CTA button anchoring to #pricing-calculator (target for Plan 02)
  - Corrected bedroom count (3, not 4)
  - Laundry facilities listed in Accommodations and Workshops amenity lists
affects:
  - 06-02 (pricing calculator will render at the #pricing-calculator anchor this plan introduces)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Checkmark list item pattern: flex items-start gap-2 with brand SVG + span"
    - "Rate card pattern: bg-white rounded-lg shadow-sm p-8 max-w-3xl mx-auto text-center with grid sm:grid-cols-2 gap-6 for tiers"

key-files:
  created: []
  modified:
    - src/components/Accommodations.astro
    - src/components/Calendar.astro
    - src/components/Workshops.astro

key-decisions:
  - "Rate card uses sm:grid-cols-2 so two pricing tiers stack on mobile and side-by-side at sm breakpoint"
  - "Meal options simplified to single $15/night add-on line to match new rate structure ($75 = $60 base + $15 meals)"
  - "Removed seasonal Mar-Apr/May date-based pricing entirely — new structure is group-size-based only"

patterns-established:
  - "Rate card pattern: centered max-w-3xl card with two bg-stone-50 tier sub-cards using sm:grid-cols-2"

requirements-completed: [PRIC-01, PRIC-02, PROP-01, PROP-02, PROP-03]

# Metrics
duration: 2min
completed: 2026-02-26
---

# Phase 6 Plan 01: Pricing & Property Corrections Summary

**Per-person tiered rate card ($60/$75 for groups <=10, $600 flat for 10-12) added to Accommodations; bedroom count corrected to 3; laundry added to two amenity lists; Calendar updated to new rate structure**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-26T06:26:10Z
- **Completed:** 2026-02-26T06:28:03Z
- **Tasks:** 2 of 2 (all tasks complete including human-verify checkpoint)
- **Files modified:** 3

## Accomplishments
- Fixed bedroom count from 4 to 3 in Accommodations.astro
- Added "Laundry facilities" to Accommodations card list and Workshops Amenities card
- Added rate card below the two-column grid in Accommodations with both pricing tiers, booking minimums, and "Estimate Your Stay" CTA linking to #pricing-calculator
- Replaced outdated seasonal $500/$600 flat-rate pricing in Calendar with new per-person tier structure ($60, $75, $600)
- Simplified meal options in Calendar from three-tier to single $15/night add-on
- Production build passes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Update pricing and property details across Accommodations, Calendar, and Workshops** - `3e2b841` (feat)

2. **Task 2: Human verify — visual review of pricing and property corrections** - checkpoint approved

**Plan metadata:** `20db178` (docs: complete pricing and property corrections plan)

## Files Created/Modified
- `src/components/Accommodations.astro` - Fixed bedroom count, added laundry amenity, added rate card with CTA
- `src/components/Calendar.astro` - Replaced old pricing list with new per-person tier structure; simplified meal options
- `src/components/Workshops.astro` - Added laundry facilities to Amenities card

## Decisions Made
- Rate card uses `sm:grid-cols-2` layout so tiers stack on mobile (375px) and display side-by-side at small breakpoint and above — satisfies the mobile readability verification requirement
- Seasonal pricing (Mar-Apr 2025, May 2025+) removed entirely per new rate structure — group size is the only differentiator now
- Meal options collapsed from 3 tiers ($10 Continental, $12.50 Brunch & Dinner, $15 All 3 meals) to a single $15/night add-on matching $75 = $60 base + $15 meals math

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Accommodations has the `#pricing-calculator` anchor CTA ready — Plan 02 can implement the calculator component at that ID
- All pricing and property copy is accurate; Plan 02 can reference these values in the calculator logic ($60, $75, $600, min 4 persons, min 2 nights)
- Human verification checkpoint passed — user reviewed and approved all visual changes at http://localhost:4321

---
*Phase: 06-pricing-calculator-and-property-corrections*
*Completed: 2026-02-26*
