---
gsd_state_version: 1.0
milestone: v2.2
milestone_name: Client Preview Polish
status: unknown
last_updated: "2026-03-03T03:02:01.282Z"
progress:
  total_phases: 11
  completed_phases: 10
  total_plans: 19
  completed_plans: 19
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-02)

**Core value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.
**Current focus:** Phase 12 — Google Maps Driving Route

## Current Position

Phase: 12 of 13 (Google Maps Driving Route)
Plan: 1 of 1 in current phase (complete)
Status: Plan 12-01 executed — awaiting verification
Last activity: 2026-03-03 — Driving route embed implemented with no-API-key approach

Progress: [####░░░░░░] 40% (v2.2)

## Performance Metrics

**Velocity (v2.1):**
- Total plans completed: 6
- Average duration: ~4 min
- Total execution time: ~24 min

**By Phase:**

| Phase | Plans | Avg/Plan |
|-------|-------|----------|
| 6. Pricing/Calculator | 2 | 4 min |
| 7. Photography | 1 | 4 min |
| 8. Polish/A11Y/SEO | 3 | 4 min |
| 10. Per-Person Breakdown | 1 | 5 min |
| 11. Calculator-to-Contact | 1 | 2 min |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v2.1]: Pricing calculator is a Preact island (client:load) — no server dependency
- [v2.1]: Preact chosen over React for calculator island — lighter bundle
- [v2.2]: Cross-island communication uses CustomEvent on window (not nanostores) — one-directional, one-time handoff is sufficient
- [v2.2]: Maps upgrade uses no-API-key pb= embed format for directions (iframe, free, no Google Cloud billing needed) — avoids JS SDK bundle cost (~400KB)
- [v2.2]: Playwright tests must run against production build (`npm run build && npm run preview`) — dev server has non-deterministic hydration timing
- [v2.2]: No screenshot-based tests — assertion-only to avoid OS font rendering flakiness in CI
- [09-01]: Brand text hidden sm:block removed — text is now always visible on mobile; animated underline decoration keeps hidden sm:block (desktop-only hover effect)
- [09-01]: Rate Card block fully removed from Accommodations — single source of truth is PricingSection.astro; pricing teaser shows only $60/night base rate
- [Phase 10-01]: perPerson is a derived constant (Math.round(total / groupSize)), not useState — recalculates on every render automatically
- [Phase 11-01]: Draft protection uses lastPrefilledMessage string comparison — simple, reliable, covers repeat-click scenario
- [Phase 11-01]: scrollIntoView instead of window.location.hash — back button works naturally, scroll-spy not disrupted
- [Phase 11-01]: Focus lands on name field (not textarea) after 600ms — message is pre-filled; visitor's next action is their name

### Pending Todos

None.

### Blockers/Concerns

- [Phase 12 RESOLVED]: Google Maps API key requirement eliminated — used no-API-key pb= embed format instead of Embed API directions mode. Same visual result, zero setup required.
- [Phase 11 risk RESOLVED]: scroll-margin-top was globally set on section[id] — changed 4rem to 5rem to match nav height. No duplication issue.
- [v2.0 carry-forward]: path-to-regexp HIGH vulnerability in @astrojs/vercel@9.0.4 transitive dep — deferred (build-time only, not shipped to client)

## Session Continuity

Last session: 2026-03-03
Stopped at: Phase 12 plan 12-01 executed — awaiting verification
Resume: Run phase 12 verification, then proceed to Phase 13 (Playwright Viewport Verification)
