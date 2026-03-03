---
gsd_state_version: 1.0
milestone: v2.2
milestone_name: Client Preview Polish
status: unknown
last_updated: "2026-03-03T02:15:28.713Z"
progress:
  total_phases: 10
  completed_phases: 9
  total_plans: 19
  completed_plans: 19
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-02)

**Core value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.
**Current focus:** Phase 10 — Calculator Per-Person Breakdown

## Current Position

Phase: 10 of 13 (Calculator Per-Person Breakdown)
Plan: 1 of 1 in current phase (complete)
Status: Complete — phase 10 done, ready for phase 11
Last activity: 2026-03-02 — 10-01 complete (per-person line verified in browser)

Progress: [###░░░░░░░] 30% (v2.2)

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

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v2.1]: Pricing calculator is a Preact island (client:load) — no server dependency
- [v2.1]: Preact chosen over React for calculator island — lighter bundle
- [v2.2]: Cross-island communication uses CustomEvent on window (not nanostores) — one-directional, one-time handoff is sufficient
- [v2.2]: Maps upgrade uses Embed API directions mode (iframe, free) — avoids JS SDK bundle cost (~400KB)
- [v2.2]: Playwright tests must run against production build (`npm run build && npm run preview`) — dev server has non-deterministic hydration timing
- [v2.2]: No screenshot-based tests — assertion-only to avoid OS font rendering flakiness in CI
- [09-01]: Brand text hidden sm:block removed — text is now always visible on mobile; animated underline decoration keeps hidden sm:block (desktop-only hover effect)
- [09-01]: Rate Card block fully removed from Accommodations — single source of truth is PricingSection.astro; pricing teaser shows only $60/night base rate
- [Phase 10-01]: perPerson is a derived constant (Math.round(total / groupSize)), not useState — recalculates on every render automatically

### Pending Todos

None.

### Blockers/Concerns

- [Phase 12 prerequisite]: Google Maps Embed API key must be created in Google Cloud Console before Map.astro can be updated. One-time ~15 min setup. Unknown if a Cloud project exists for this client.
- [Phase 11 risk]: `scroll-margin-top` on `#contact` section may already be set from v2.1 — check computed styles before adding to avoid duplication.
- [v2.0 carry-forward]: path-to-regexp HIGH vulnerability in @astrojs/vercel@9.0.4 transitive dep — deferred (build-time only, not shipped to client)

## Session Continuity

Last session: 2026-03-02
Stopped at: Completed 10-01-PLAN.md (all tasks complete, checkpoint approved)
Resume: Phase 11 — contact section anchor fix
