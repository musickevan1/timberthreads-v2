# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-25)

**Core value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.
**Current focus:** Phase 6 — Pricing, Calculator, and Property Corrections

## Current Position

Phase: 6 of 8 (Pricing, Calculator, and Property Corrections)
Plan: 2 of 2 in current phase — COMPLETE
Status: Phase 6 complete — both plans human-verified; ready for Phase 7 (gallery and media)
Last activity: 2026-02-26 — Phase 6 Plan 2 complete and human-verified (approved)

Progress: [█████░░░░░] 50% (v2.0 complete, Phase 6 complete)

## Performance Metrics

**Velocity (v2.0):**
- Total plans completed: 10
- Average duration: 4 min
- Total execution time: ~40 min

**By Phase:**

| Phase | Plans | Avg/Plan |
|-------|-------|----------|
| 1. Foundation | 3 | 4 min |
| 2. Content | 3 | 4 min |
| 3. Gallery | 2 | 4 min |
| 4. Contact | 2 | 4 min |

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v2.0]: Astro 5 + Tailwind v4 + Vercel — static-first with islands for gallery lightbox and contact form only
- [v2.0]: Hardcoded gallery data — zero runtime API calls
- [v2.0]: PhotoSwipe for lightbox — code-split, only loaded on interaction
- [v2.1]: Pricing calculator must be an Astro island (client:load) — no server dependency, static-first
- [06-01]: Rate card uses sm:grid-cols-2 — two pricing tiers stack on mobile, side-by-side at sm breakpoint
- [06-01]: Seasonal date-based pricing removed entirely; group-size-based structure only ($60/$75 for <=10, $600 flat for 10-12)
- [06-01]: Meal options collapsed to single $15/night add-on (from three old tiers) to match new rate math
- [06-02]: Preact chosen over React for calculator island — lighter bundle, same hooks API for this use case
- [06-02]: client:load directive used for calculator so it is immediately interactive when users arrive via CTA click
- [06-02]: Meal rate for groups of 10-12 corrected to $12.50/person/day (2 meals & snacks), not $15/person/night

### Pending Todos

None.

### Blockers/Concerns

- Raw photos need editing/color grading before integration (IMG_4197, IMG_4204, IMG_4208, IMG_4237)
- IMG_4204 needs cropping per client direction
- Outdoor photos (dock, picnic table, fire pit) may not be available yet — Phase 7 should handle gracefully
- path-to-regexp HIGH vulnerability in @astrojs/vercel@9.0.4 transitive dep — deferred (build-time only, not shipped to client)

## Session Continuity

Last session: 2026-02-26
Stopped at: Phase 6 Plan 2 complete and human-verified — phase 6 fully done
Resume: Run `/gsd:execute-phase 7` to begin Phase 7 (gallery and media)
