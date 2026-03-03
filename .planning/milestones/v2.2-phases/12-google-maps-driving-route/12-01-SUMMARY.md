---
phase: 12-google-maps-driving-route
plan: 01
subsystem: ui
tags: [google-maps, embed, directions, iframe]

requires:
  - phase: 02-content-sections-and-embeds
    provides: Map.astro component with lazy-loaded iframe embed
provides:
  - Driving route embed replacing static location pin
  - "Open in Google Maps" link for turn-by-turn navigation
affects: [13-playwright-viewport-verification]

tech-stack:
  added: []
  patterns: [no-api-key pb= embed format for Google Maps directions]

key-files:
  created: []
  modified:
    - src/components/Map.astro

key-decisions:
  - "Used no-API-key pb= embed format instead of Embed API directions mode — eliminates Google Cloud billing requirement entirely"
  - "Route uses Google Place IDs for origin/destination — stable, won't break if addresses change format"
  - "Open in Google Maps link omits origin parameter — uses visitor's current location for turn-by-turn"

patterns-established:
  - "Google Maps directions embed: construct pb= parameter with !3e0 (driving) + place IDs + coordinates"

requirements-completed: [MAPS-01, MAPS-02]

duration: 5min
completed: 2026-03-03
---

# Phase 12: Google Maps Driving Route Summary

**Driving route embed from Mallard's Roadhouse (Hwy 7) to property via NW 221 Rd, using no-API-key pb= format with "Open in Google Maps" link**

## Performance

- **Duration:** 5 min
- **Tasks:** 1 (Task 1 API key setup skipped — not needed; Task 3 verification pending)
- **Files modified:** 1

## Accomplishments
- Replaced static location pin with directions-mode embed showing blue driving route
- Route matches text directions: Highway 7 → NW 221 Rd → property (7 min, 2.5 miles)
- Added "Open in Google Maps" link below address for turn-by-turn navigation from visitor's current location
- Eliminated Google Cloud API key requirement entirely by using pb= embed format

## Task Commits

1. **Task 2: Update Map.astro with directions route and link** - `4230753` (feat)

## Files Created/Modified
- `src/components/Map.astro` - Directions-mode iframe embed with driving route, "Open in Google Maps" link

## Decisions Made
- Used no-API-key pb= embed format instead of Google Maps Embed API — user cannot create a Google Cloud billing account, and the pb= format produces identical directions embeds for free
- Skipped .env.example update — no API key variable needed
- Origin resolved to Mallard's Roadhouse (201 MO-7) which is at the Highway 7 / Breaktime area referenced in text directions

## Deviations from Plan

### Auto-fixed Issues

**1. [Approach Change] Switched from Embed API to no-API-key pb= format**
- **Found during:** Task 1 (API key setup)
- **Issue:** User cannot add billing card to Google Cloud Console, which is required to generate an API key even for the free Embed API
- **Fix:** Constructed a pb= parameter directions embed URL using Playwright to navigate Google Maps, extract place IDs and coordinates, and verify the route renders correctly in an iframe
- **Files modified:** src/components/Map.astro (different data-src URL format)
- **Verification:** Playwright screenshot confirms blue driving route from Mallard's Roadhouse to 306 NW 300 Rd via NW 221 Rd
- **Committed in:** 4230753

---

**Total deviations:** 1 approach change
**Impact on plan:** Simplified implementation — fewer files modified, no env vars needed, no Google Cloud setup. Same visual result.

## Issues Encountered
None beyond the approach change.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Map section complete with driving route — ready for Playwright viewport verification (Phase 13)
- No env vars or API keys to manage

---
*Phase: 12-google-maps-driving-route*
*Completed: 2026-03-03*
