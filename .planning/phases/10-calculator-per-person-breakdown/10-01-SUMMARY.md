---
phase: 10-calculator-per-person-breakdown
plan: 01
subsystem: ui
tags: [preact, calculator, pricing]

# Dependency graph
requires:
  - phase: 06-pricing-calculator-and-property-corrections
    provides: PricingCalculator.tsx with total/groupSize/nights/includeMeals state and formatCurrency helper
provides:
  - Per-person cost derived value in PricingCalculator.tsx
  - Per-person display line below Estimated Total in breakdown panel
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Derived values computed inline (not useState) for real-time updates without extra state"
    - "formatCurrency() for all monetary display — whole dollars, no cents"

key-files:
  created: []
  modified:
    - src/components/PricingCalculator.tsx

key-decisions:
  - "perPerson is a derived constant (Math.round(total / groupSize)), not useState — recalculates on every render automatically"
  - "Math.round keeps per-person as whole dollar consistent with formatCurrency convention"
  - "Per-person line placed inside existing divider block directly below Estimated Total"
  - "text-sm/text-stone-500/text-stone-600 vs text-2xl/font-bold/text-brand makes per-person clearly subordinate"
  - "No conditional guard needed — slider min values enforce groupSize>=4 and nights>=2"

patterns-established:
  - "Per-person line: text-sm label (stone-500) + text-sm font-medium amount (stone-600) = visually secondary to total"

requirements-completed: [PRIC-08]

# Metrics
duration: 10min
completed: 2026-03-03
---

# Phase 10 Plan 01: Calculator Per-Person Breakdown Summary

**Per-person cost line added to pricing calculator breakdown panel — derived from total/groupSize, displaying "Per person (N guests): $X" below the Estimated Total with real-time updates**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-03T01:45:49Z
- **Completed:** 2026-03-03T01:56:44Z
- **Tasks:** 1 of 2 (Task 2 is checkpoint:human-verify)
- **Files modified:** 1

## Accomplishments
- Added `const perPerson = Math.round(total / groupSize)` as a derived constant after total calculation
- Added per-person display row inside divider block directly below "Estimated Total"
- Label shows "Per person (N guests)" with live groupSize value; amount uses `formatCurrency(perPerson)`
- Visually subordinate styling: `text-sm text-stone-500` label, `text-sm font-medium text-stone-600` amount
- Build verified: `npm run build` completes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Add per-person cost calculation and display line to PricingCalculator.tsx** - `d16197e` (feat)

_Task 2 (checkpoint:human-verify) awaits visual verification in browser._

## Files Created/Modified
- `src/components/PricingCalculator.tsx` - Added perPerson derived constant and per-person display line in breakdown panel

## Decisions Made
- Used `Math.round()` for whole dollar amounts consistent with `formatCurrency()` convention (no cents shown)
- Positioned inside existing divider block, not outside it — keeps total and per-person visually grouped
- No aria-live on per-person line — parent panel already has `aria-live="polite"`
- No conditional guard — slider constraints enforce minimum values making guard unnecessary

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Task 1 complete and committed; per-person calculation is live in the built output
- Task 2 requires visual verification in browser before plan is fully complete
- After checkpoint approval, plan 01 is done and phase 10 is complete

## Self-Check: PASSED

- FOUND: src/components/PricingCalculator.tsx
- FOUND: .planning/phases/10-calculator-per-person-breakdown/10-01-SUMMARY.md
- FOUND: commit d16197e (feat(10-01): add per-person cost breakdown to pricing calculator)
- FOUND: `const perPerson = Math.round(total / groupSize)` at line 83
- FOUND: `formatCurrency(perPerson)` display line at line 178

---
*Phase: 10-calculator-per-person-breakdown*
*Completed: 2026-03-03*
