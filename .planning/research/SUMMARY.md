# Project Research Summary

**Project:** Timber & Threads — v2.2 Client Preview Polish
**Domain:** Static business site for quilting retreat center (Astro + Preact islands)
**Researched:** 2026-03-02
**Confidence:** HIGH

## Executive Summary

This is a v2.2 polish milestone on a fully-shipped Astro 5 static site. The codebase is already deployed to Vercel with an established stack (Astro 5 + Tailwind v4 + Preact + PhotoSwipe + Resend + Cloudinary). The research focus is narrow and additive: four discrete improvements that bring the site to client-preview quality. Research confirms the approach is low-risk, well-documented, and achievable without any new runtime dependencies or architectural shifts.

The recommended approach follows existing patterns throughout. The calculator-to-contact pre-fill uses a native CustomEvent dispatched from the Preact island and received by a vanilla JS listener in Contact.astro — no state management library needed. The map upgrade swaps one iframe URL for another using the Maps Embed API directions mode (free, unlimited, no billing risk). Mobile header text is a single CSS class removal with a font-size adjustment. Playwright testing is the only new dependency, and only as a dev tool against the production build. Every feature is self-contained and can be built in sequence without blocking the others.

The primary risk is operational, not architectural: the Google Maps directions mode requires a one-time API key setup that must happen before Map.astro can be updated. All other features have zero external dependencies. The secondary risk is Playwright configuration: tests must run against `npm run build && npm run preview`, not the dev server, to avoid non-deterministic failures. Both risks are documented, low-recovery-cost, and fully avoidable with the patterns from research.

---

## Key Findings

### Recommended Stack

The base stack is unchanged and validated. The only new package is `@playwright/test` (1.58.2) as a dev dependency. All four v2.2 features use existing browser APIs, existing Google Maps Embed infrastructure, and existing Tailwind utilities.

See full details: `.planning/research/STACK.md`

**New additions for v2.2:**
- `@playwright/test` 1.58.2 — viewport regression testing, multi-browser device emulation — recommended over Cypress (heavier install, Electron-based, no multi-browser from config) and Vitest browser mode (unit-focused, not Astro's documented E2E choice)
- Google Maps Embed API `v1/directions` mode — interactive route display via iframe, zero JavaScript, free unlimited usage — replaces the existing no-key share URL embed
- `URLSearchParams` / `CustomEvent` / `scrollIntoView` — all native browser APIs, no polyfills needed for the target audience (all evergreen browsers)

**Confirmed "do not add":**
- No state management library (Zustand, Jotai, nanostores) — CustomEvent is sufficient for this one-directional, one-time handoff from calculator to contact form
- No Google Maps JavaScript API full SDK — Maps Embed API iframe achieves the same visual route result at zero bundle cost (~400KB avoided)
- No `localStorage` for passing calculator data — URL params and DOM events are ephemeral, inspectable, and do not persist stale estimates across sessions

### Expected Features

See full details: `.planning/research/FEATURES.md`

**v2.2 must-have (P1, required for client preview):**
- Per-person cost breakdown in calculator — display addition below total, no new component, self-contained Preact state math
- "Get a Quote" button — CTA in calculator breakdown panel; scrolls and pre-fills contact form message field
- Mobile header text — "Timber & Threads" visible on mobile via CSS class removal and font size adjustment
- Visual driving route on map — Maps Embed API directions mode (requires one-time API key setup)
- Playwright viewport tests — desktop 1280px + mobile 375px/390px verification across Chromium and WebKit; assertion-based only (no screenshot diffs)

**Should have (P2, next milestone):**
- Testimonials section — when client gathers 3+ written testimonials
- Virtual tour video — when promo video is edited and ready to swap in

**Defer permanently (out of scope):**
- Online booking / payment processing — conflicts with personal-quote workflow, adds PCI concerns
- Admin gallery management, user accounts, live chat — not the product model for this client

**Anti-features confirmed by NN/g research:**
- Do not gate calculator results behind email capture — users abandon immediately; results must be freely visible, "Get a Quote" is the optional next step after seeing results
- Do not add visual regression screenshot tests — OS font rendering differences between macOS (dev) and Linux (CI) cause 100% failure rates without Docker normalization; use assertion-based tests instead

### Architecture Approach

All v2.2 changes modify existing components. No new components are created. The critical integration pattern is cross-island communication between the Preact `PricingCalculator.tsx` island and the vanilla-JS-managed `Contact.astro` form: the island dispatches a named `CustomEvent` on `window`, and the contact form's existing inline `<script>` adds a listener that populates `messageInput.value` via DOM property assignment. The Map update is a single URL value change inside the existing lazy-load pattern — the IntersectionObserver infrastructure stays unchanged.

See full details: `.planning/research/ARCHITECTURE.md`

**Components modified in v2.2:**
1. `Nav.astro` — remove `hidden sm:block` from brand span; change `text-2xl` to `text-xl sm:text-2xl`
2. `PricingCalculator.tsx` — add per-person breakdown display and "Get a Quote" button with `handleGetQuote()` / `buildQuoteSummary()`; dispatch `CustomEvent('calculator:quote-requested')`
3. `Contact.astro` — add `window.addEventListener('calculator:quote-requested', ...)` in existing `<script>` block; set `messageInput.value` via DOM property assignment
4. `Map.astro` — swap `data-src` value to `v1/directions` URL using `import.meta.env.PUBLIC_GOOGLE_MAPS_KEY`

**New infrastructure only (no production impact):**
- `playwright.config.ts` + `tests/viewport.spec.ts` — dev tooling only
- `PUBLIC_GOOGLE_MAPS_KEY` env var in `.env` (gitignored) and Vercel dashboard

### Critical Pitfalls

See full details: `.planning/research/PITFALLS.md`

1. **Calculator state cannot cross the island boundary directly** — Module-level variables in Preact are scoped to the island bundle, not the global page. Never attempt prop-drilling or module imports across the island/Astro boundary. The fix: dispatch `CustomEvent` on `window` from the island; Contact.astro listens with `window.addEventListener`. Failure mode is silent — the button click appears to work but the textarea never updates.

2. **Pre-fill must use DOM property assignment, not attribute** — `element.setAttribute('value', ...)` does not update `element.value`, which is what form validation reads. Always use `messageInput.value = summary`. Verify by submitting the pre-filled form without any edits and confirming email delivery.

3. **Scroll offset hides section heading behind fixed nav** — `scrollIntoView()` targets the element's top edge at viewport 0,0, not accounting for the 80px fixed nav header. Fix: add `scroll-margin-top: 80px` to the `#contact` section. May already exist from prior phases — check computed styles before adding.

4. **Maps directions mode requires an API key — not zero-setup** — The existing embed uses a keyless share URL (`maps/embed?pb=...`). The `v1/directions` mode requires a Maps Embed API key. This is free and a one-time 5-minute setup, but it is a prerequisite that must exist before writing the Map.astro code. Restrict the key to the production domain; never commit to git.

5. **Playwright must test against the production build, not the dev server** — `astro dev` uses Vite HMR with on-demand compilation; Preact islands have extra hydration latency in dev mode. Tests against dev are non-deterministic. Configure `webServer.command: 'npm run build && npm run preview'`. Also avoid `toHaveScreenshot()` — OS font rendering differences make pixel comparisons 100% CI failures without Docker normalization.

---

## Implications for Roadmap

These five changes have minimal interdependencies. The recommended implementation order from ARCHITECTURE.md is validated by the pitfall analysis: start with zero-risk changes, sequence the one external-dependency item (API key) independently of frontend work, and run Playwright tests last to verify the complete set.

### Phase 1: Mobile Header Text
**Rationale:** Zero external dependencies, zero risk, standalone CSS change. Proves the header works at all viewports before more complex changes land on top of it.
**Delivers:** "Timber & Threads" text visible at all mobile widths; no layout overflow at 320px, 375px, or 640px; hamburger button and logo not displaced.
**Addresses:** Mobile branding feature (P1)
**Avoids:** Pitfall 7 (wrong breakpoint class removal); Pitfall 6 (mobile fixes breaking desktop sticky nav — verify desktop at 1280px after every mobile change)
**Research flag:** No further research needed. Direct codebase inspection confirmed the exact class and font size change required.

### Phase 2: Calculator Per-Person Breakdown
**Rationale:** Self-contained display addition inside the Preact island. No external effects. Sets up the breakdown panel that the "Get a Quote" button will live adjacent to in Phase 3.
**Delivers:** Per-person cost shown below the total estimate in the calculator breakdown panel.
**Addresses:** Per-person breakdown feature (P1); supports group organizers communicating costs to group members
**Avoids:** No special pitfall — this is display-only math within existing Preact reactive state
**Research flag:** No further research needed. Math and component location confirmed by codebase inspection.

### Phase 3: Calculator-to-Contact Pre-fill Flow
**Rationale:** Depends on Phase 2 for the breakdown panel layout. Two-file change (PricingCalculator.tsx + Contact.astro) with the cross-island boundary as the primary technical risk — well-understood from research.
**Delivers:** "Get a Quote" button in calculator scrolls to #contact and pre-fills the message textarea with a formatted group estimate summary; user can edit the pre-fill before sending.
**Addresses:** Calculator-to-contact pre-fill differentiator (highest user value, P1 per FEATURES.md prioritization matrix)
**Avoids:** Pitfall 1 (island boundary — use CustomEvent not module imports); Pitfall 2 (DOM property assignment not setAttribute); Pitfall 3 (scroll-margin-top for nav offset)
**Research flag:** No further research needed. CustomEvent pattern confirmed by Astro official docs and direct codebase inspection.

### Phase 4: Google Maps Driving Route
**Rationale:** Has the one external dependency (Google Cloud API key). Best sequenced after the frontend-only changes (Phases 1–3) so API key setup does not block development progress. The key must be created first, then Map.astro modification is minimal.
**Delivers:** Interactive driving route from Highway 7 to the retreat property, replacing the location pin embed; user can zoom and pan the route.
**Addresses:** Visual driving route feature (P1); more intuitive than text directions for first-time visitors
**Avoids:** Pitfall 4 (directions mode requires API key — create and restrict before coding); Pitfall 5 (preserve lazy-load pattern — change only the data-src URL value, not the IntersectionObserver pattern)
**Research flag:** API key setup is documented but is a manual prerequisite step (Google Cloud Console, ~15 minutes). Plan for this before writing code. Document key restriction settings in a comment in Map.astro for future maintainers.

### Phase 5: Playwright Viewport Tests
**Rationale:** Validation layer that confirms all prior phases work at desktop and mobile viewports. Goes last because it tests the other features — running before they are complete produces expected failures on incomplete work. The most isolated change (dev tooling only, no production impact).
**Delivers:** Automated viewport verification across Desktop Chrome (1280px), Pixel 5 (393px), and iPhone 12 (390px); 6 core assertion-based tests covering: header brand text visibility, calculator rendering, "Get a Quote" pre-fill flow, map iframe presence, and horizontal overflow check.
**Addresses:** Quality gate requirement (P1); validates all other v2.2 features as a complete set
**Avoids:** Pitfall 8 (no screenshot baselines — assertion-based tests only, zero OS-dependency flakiness); Pitfall 9 (webServer must build+preview, not dev server)
**Research flag:** No further research needed. Playwright + Astro preview integration is documented by official Astro testing guide with the exact webServer pattern needed.

### Phase Ordering Rationale

- Phases 1–3 have zero external dependencies; API key setup for Phase 4 does not block any frontend work
- Phase 2 naturally precedes Phase 3 — the per-person breakdown and "Get a Quote" button share the same breakdown panel in the calculator
- Phase 4's one external dependency (API key) is isolated; a developer can work on Phases 1–3 in parallel with API key provisioning happening asynchronously
- Phase 5 (Playwright) is deliberately last — it validates the complete v2.2 feature set; partial test suites during development produce noise, not signal
- Every phase modifies 1–2 files and can be reverted independently without affecting the others

### Research Flags

Phases requiring no further research (standard documented patterns):
- **Phase 1** — CSS class change, codebase inspection confirms exact fix
- **Phase 2** — Display math inside existing Preact island, no external surfaces
- **Phase 3** — CustomEvent pattern confirmed by Astro official docs
- **Phase 5** — Playwright + Astro preview pattern confirmed by official Astro testing guide

Phase requiring one manual prerequisite (no code research gap, just a setup step):
- **Phase 4** — Google Cloud Console API key creation (~15 minutes, one-time). The implementation is documented and straightforward once the key exists.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All additions use official docs or native browser APIs; @playwright/test 1.58.2 version confirmed via npm March 2026; Maps Embed API free tier confirmed unchanged after March 2025 billing restructure |
| Features | HIGH | NN/g research (official UX research) + direct codebase inspection of existing component IDs and class names; priorities confirmed by PROJECT.md scope |
| Architecture | HIGH | Official Astro docs + codebase inspection; no inference — exact component names, class names, and script locations confirmed by reading source files |
| Pitfalls | HIGH | Each pitfall identified from official docs, codebase inspection, or documented browser behavior; all critical pitfalls assessed as LOW recovery cost |

**Overall confidence:** HIGH

### Gaps to Address

- **Google Cloud API key availability:** Unknown whether an existing Google Cloud project is already provisioned for this client. If starting from scratch, add ~15 minutes for project creation and billing account confirmation (billing must be enabled on the project even though Maps Embed API usage is free).

- **`scroll-margin-top` on `#contact`:** Unknown whether this CSS property is already set globally from prior phases. Check computed styles on the contact section before Phase 3 implementation — if already present at 80px, no action needed.

- **Pre-fill guard for existing message content:** The UX pitfall research flagged a case where the user begins typing in the contact form, then clicks "Get a Quote," and the pre-fill overwrites their draft. The implementation should check `if (!messageInput.value.trim())` before overwriting. This is a one-line guard worth adding during Phase 3 to prevent user frustration.

- **320px viewport check:** Playwright tests are configured for 390px minimum. The mobile header text fix should be manually verified at 320px (the narrowest common phone width) since no automated test covers that breakpoint. Add as a manual verification step in Phase 1.

---

## Sources

### Primary (HIGH confidence)
- [Astro Docs — Share state between islands](https://docs.astro.build/en/recipes/sharing-state-islands/) — CustomEvent and nanostores cross-island patterns; custom events listed as supported alternative for simpler cases
- [Astro Docs — Client-Side Scripts](https://docs.astro.build/en/guides/client-side-scripts/) — inline script execution scope and DOM event access
- [Astro Docs — Testing](https://docs.astro.build/en/guides/testing/) — official Playwright setup with `npm run preview` webServer pattern
- [Google Maps Embed API — Embedding Maps](https://developers.google.com/maps/documentation/embed/embedding-map) — directions mode URL format, API key requirement, parameter reference
- [Google Maps Embed API — Usage and Billing](https://developers.google.com/maps/documentation/embed/usage-and-billing) — confirmed free, unlimited usage; unaffected by March 2025 billing restructure
- [Playwright Docs — Emulation](https://playwright.dev/docs/emulation) — device profiles (Pixel 5, iPhone 12/13)
- [Playwright Docs — webServer](https://playwright.dev/docs/test-webserver) — build+preview command chaining, reuseExistingServer pattern
- [NN/g — Recommendations for Calculator and Quiz Tools](https://www.nngroup.com/articles/recommendations-calculator/) — show results freely, make contact CTA optional next step
- Direct codebase inspection of `Nav.astro`, `PricingCalculator.tsx`, `Contact.astro`, `Map.astro` — HIGH confidence; exact class names and element IDs confirmed

### Secondary (MEDIUM confidence)
- [URLSearchParams — MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) — browser compatibility confirmed (all evergreen, IE11+)
- [BrowserStack — Playwright Best Practices 2026](https://www.browserstack.com/guide/playwright-best-practices) — test scope and CI recommendations
- [LogRocket — Islands Architecture Coordination](https://blog.logrocket.com/how-to-solve-coordination-problems-in-islands-architecture/) — event bus pattern as dependency-free cross-island coordination

### Tertiary (LOW confidence)
- None — all findings in this summary are backed by official docs or direct codebase inspection

---
*Research completed: 2026-03-02*
*Ready for roadmap: yes*
