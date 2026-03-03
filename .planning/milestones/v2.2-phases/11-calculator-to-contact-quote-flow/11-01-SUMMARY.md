---
phase: 11-calculator-to-contact-quote-flow
plan: 01
subsystem: ui
tags: [preact, custom-events, calculator, contact-form, scroll, animation]

# Dependency graph
requires:
  - phase: 06-pricing-calculator-and-property-corrections
    provides: PricingCalculator Preact island with groupSize, nights, includeMeals, total, perPerson state
  - phase: 10-calculator-per-person-breakdown
    provides: perPerson derived constant added to calculator breakdown panel
provides:
  - Get a Quote button in calculator breakdown panel dispatching CustomEvent
  - Contact.astro quote event listener with pre-fill, scroll, highlight, and focus
  - scroll-margin-top fix (4rem -> 5rem) for all section anchors
  - quote-highlight CSS animation for textarea border pulse
affects: [phase-12-google-maps, any future calculator enhancements]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Cross-island communication via CustomEvent on window (one-directional, one-time handoff)"
    - "Draft protection pattern: track lastPrefilledMessage, only overwrite if empty or unchanged"
    - "CSS animation re-trigger via void element.offsetWidth reflow trick"

key-files:
  created: []
  modified:
    - src/components/PricingCalculator.tsx
    - src/components/Contact.astro
    - src/styles/global.css

key-decisions:
  - "CustomEvent('calculator:quote-requested') on window — consistent with v2.2 decision, no nanostores needed for one-directional handoff"
  - "Draft protection uses lastPrefilledMessage string comparison — protects user edits on repeat clicks without complex state"
  - "scrollIntoView used instead of window.location.hash assignment — back button works naturally, scroll-spy not disrupted"
  - "Focus lands on name field (not textarea) after 600ms — message is pre-filled; visitor's next action is entering contact info"

patterns-established:
  - "Quote event payload: groupSize, nights, includeMeals, total, perPerson, isFlatRate — complete snapshot at click time"
  - "buildPrefilledMessage() is a pure function — easy to test, easy to modify format"

requirements-completed: [PRIC-09, PRIC-10]

# Metrics
duration: 2min
completed: 2026-03-03
---

# Phase 11 Plan 01: Calculator-to-Contact Quote Flow Summary

**CustomEvent-based Get a Quote flow: calculator button pre-fills contact form message with structured estimate summary, smooth-scrolls with highlight flash and name field focus, with draft protection on repeat clicks**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-03-03T02:44:19Z
- **Completed:** 2026-03-03T02:46:00Z
- **Tasks:** 3 (2 auto tasks + 1 human-verify checkpoint — approved)
- **Files modified:** 3

## Accomplishments
- Added Get a Quote button to PricingCalculator breakdown panel (below total/per-person, above disclaimer) dispatching `CustomEvent('calculator:quote-requested')` with full estimate payload
- Added Contact.astro event listener with buildPrefilledMessage() formatting, draft protection via lastPrefilledMessage tracking, highlight flash animation with reflow trick, smooth scroll via scrollIntoView, and 600ms delayed name field focus
- Fixed scroll-margin-top from 4rem to 5rem across all section anchors to match actual nav height (h-20 = 80px = 5rem)
- Added @keyframes quote-highlight animation and .quote-highlight class for ~1s brand-color border pulse on textarea

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Get a Quote button + fix scroll + highlight CSS** - `6990cac` (feat)
2. **Task 2: Add quote event listener to Contact.astro** - `61062a1` (feat)

## Files Created/Modified
- `src/components/PricingCalculator.tsx` - Added handleGetQuote() function and Get a Quote button JSX
- `src/components/Contact.astro` - Added buildPrefilledMessage(), lastPrefilledMessage, and window event listener
- `src/styles/global.css` - Fixed scroll-margin-top 4rem->5rem; added @keyframes quote-highlight + .quote-highlight

## Decisions Made
- CustomEvent on window — consistent with established v2.2 decision for cross-island communication
- Draft protection compares against lastPrefilledMessage string — simple, reliable, covers repeat-click scenario
- scrollIntoView instead of hash assignment — preserves back button behavior and avoids disrupting scroll-spy
- Focus on name field (not textarea) — message is pre-filled; user's natural next action is their name

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - build passed on first attempt, all patterns matched expected behavior.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Calculator-to-contact flow is fully implemented and builds cleanly
- Human verification of the complete flow needed (checkpoint pending)
- Phase 12 (Google Maps) can proceed — requires Google Maps Embed API key setup in Google Cloud Console first

## Self-Check: PASSED

- FOUND: src/components/PricingCalculator.tsx
- FOUND: src/components/Contact.astro
- FOUND: src/styles/global.css
- FOUND: .planning/phases/11-calculator-to-contact-quote-flow/11-01-SUMMARY.md
- FOUND: Task 1 commit 6990cac
- FOUND: Task 2 commit 61062a1
- FOUND: Requirements PRIC-09, PRIC-10 marked complete

---
*Phase: 11-calculator-to-contact-quote-flow*
*Completed: 2026-03-03*
