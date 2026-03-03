---
gsd_state_version: 1.0
milestone: v2.2
milestone_name: Client Preview Polish
status: in_progress
last_updated: "2026-03-02"
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 5
  completed_plans: 1
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-02)

**Core value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.
**Current focus:** Phase 9 — Mobile Header and Pricing Cleanup

## Current Position

Phase: 9 of 13 (Mobile Header and Pricing Cleanup)
Plan: 1 of 1 in current phase (awaiting checkpoint:human-verify)
Status: In progress — checkpoint:human-verify pending
Last activity: 2026-03-02 — 09-01 Task 1 complete, awaiting visual verification

Progress: [##░░░░░░░░] 20% (v2.2)

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

### Pending Todos

None.

### Blockers/Concerns

- [Phase 12 prerequisite]: Google Maps Embed API key must be created in Google Cloud Console before Map.astro can be updated. One-time ~15 min setup. Unknown if a Cloud project exists for this client.
- [Phase 11 risk]: `scroll-margin-top` on `#contact` section may already be set from v2.1 — check computed styles before adding to avoid duplication.
- [v2.0 carry-forward]: path-to-regexp HIGH vulnerability in @astrojs/vercel@9.0.4 transitive dep — deferred (build-time only, not shipped to client)

## Session Continuity

Last session: 2026-03-02
Stopped at: Completed 09-01 Task 1 (auto task); paused at Task 2 (checkpoint:human-verify)
Resume: Run `npm run dev`, open http://localhost:4321, verify mobile header and accommodations at 320px/375px/1280px, then confirm checkpoint
