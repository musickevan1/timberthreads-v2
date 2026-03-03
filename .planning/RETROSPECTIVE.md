# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v2.2 — Client Preview Polish

**Shipped:** 2026-03-03
**Phases:** 6 | **Plans:** 6

### What Was Built
- Mobile header brand text visible at all viewports (removed hidden sm:block)
- Duplicate pricing cards removed from Accommodations, single source of truth in PricingSection
- Calculator per-person cost breakdown (derived constant, not useState)
- "Get a Quote" button with CustomEvent dispatch to pre-fill contact form with draft protection
- Google Maps visual driving route using no-API-key pb= embed format
- Playwright test suite (21 tests, 3 viewport projects) against production build
- 320px minimum viewport overflow fix (email break-all)
- Tech debt cleanup: orphaned Connect.astro deleted, Phase 9 formally verified

### What Worked
- CustomEvent pattern for cross-island communication — simple, no shared state library needed, testable with Playwright
- No-API-key pb= map embed — eliminated Google Cloud billing blocker entirely
- Running Playwright against production build (`npm run build && npm run preview`) — deterministic, catches real issues like the 320px email overflow
- Derived constants over useState for computed values — perPerson recalculates automatically, no state sync bugs
- GSD verification workflow caught missing Phase 9 VERIFICATION.md and orphaned Connect.astro — Phase 14 was created specifically to close these gaps

### What Was Inefficient
- Phase 14 (tech debt cleanup) was needed only because Phase 9 didn't generate VERIFICATION.md during execution — verification should be part of every phase execution
- MAPS-02 requirement ("API key domain-restricted") became obsolete when the approach changed to no-API-key — requirement language should be goal-oriented ("secure map embed") not implementation-specific
- Some ROADMAP.md progress table entries had inconsistent column formatting (missing milestone column for phases 13-14)

### Patterns Established
- `CustomEvent` on `window` for one-directional cross-island communication (calculator → contact)
- `scrollIntoView({ behavior: 'smooth', block: 'start' })` + `scroll-margin-top` for section navigation
- Draft protection using `lastPrefilledMessage` string comparison for repeated pre-fill scenarios
- Three-viewport Playwright testing: desktop-1280, mobile-375, mobile-320 with project-level skip guards
- Google Maps `pb=` format with Place IDs for free directions embeds

### Key Lessons
1. Requirements should describe goals, not implementations — "secure map embed" not "API key domain-restricted" would have avoided the MAPS-02 superseded awkwardness
2. Verification should be generated as part of phase execution, not as a separate cleanup phase
3. The 320px viewport test was valuable — it found a real 8px overflow from a long email address that would have been invisible at 375px

### Cost Observations
- Model mix: Primarily sonnet for execution, sonnet for verification/integration checking
- Phases: 6 phases completed in ~2 days
- Notable: Phase 14 (tech debt) was lightweight — 2 min execution. Verification-as-cleanup is cheap but shouldn't be needed

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v2.0 | 4 | 10 | Initial build — Astro + content migration |
| v2.1 | 3 | 6 | Feature additions — calculator, photography, polish |
| v2.2 | 6 | 6 | Polish and verification — smaller phases, 1 plan each |

### Cumulative Quality

| Milestone | Tests | Requirements | Coverage |
|-----------|-------|-------------|----------|
| v2.0 | 0 | 6 categories | Manual verification |
| v2.1 | 0 | 9 categories | Manual + Lighthouse |
| v2.2 | 21 (Playwright) | 13 REQ-IDs | Automated viewport verification |

### Top Lessons (Verified Across Milestones)

1. Static-first architecture pays off on slow connections — zero JS for content sections, islands only for interactivity
2. Smaller phases (1 plan each) execute faster and are easier to verify than multi-plan phases
3. Automated tests catch real viewport bugs that manual testing misses (320px email overflow)
