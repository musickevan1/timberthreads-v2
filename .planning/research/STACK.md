# Technology Stack

**Project:** Timber & Threads — v2.2 Client Preview Polish
**Domain:** Content/business website for quilting retreat center
**Researched:** 2026-03-02
**Confidence:** HIGH

---

## Context: Additive Research

This document adds v2.2-specific stack additions to the existing validated stack (Astro 5 + Tailwind v4 + Preact + PhotoSwipe + Resend + Vercel + Cloudinary). Do not re-research the base stack. Focus is on what is NEW for these four features:

1. Calculator estimates pre-filling the contact form
2. Google Maps visual driving route display
3. Mobile viewport optimization tooling
4. Playwright-based viewport testing

---

## New Stack Additions

### Feature 1: Calculator-to-Contact Pre-fill

**Verdict: No new libraries needed. Pure vanilla JS + URL search params.**

The Preact calculator island (`PricingCalculator.tsx`) runs client-side. The contact form (`Contact.astro`) uses `id="message"` on its textarea. The pattern:

1. The calculator's "Get a Quote" button calls `window.location.href = '/?estimate=...'` (or uses `window.location.hash` to jump to `#contact` after setting params)
2. A `<script>` tag in `Contact.astro` reads `URLSearchParams` on load and pre-fills `messageInput.value`
3. `.scrollIntoView({ behavior: 'smooth' })` scrolls to the contact section

This is standard browser APIs available in all evergreen browsers — no library required.

**Implementation pattern (to guide build phase):**

```typescript
// In PricingCalculator.tsx — "Get a Quote" button click handler
function handleGetQuote() {
  const summary = buildEstimateSummary(groupSize, nights, includeMeals, total);
  const params = new URLSearchParams({ estimate: summary });
  window.location.href = `/#contact?${params.toString()}`;
  // Hash + query combined: browser navigates to #contact anchor,
  // the Contact.astro script reads ?estimate= on DOMContentLoaded
}
```

```javascript
// In Contact.astro <script> — read pre-fill on page load
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const estimate = params.get('estimate');
  if (estimate && messageInput) {
    messageInput.value = decodeURIComponent(estimate);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }
});
```

**Note on Astro islands:** The Preact island and the Contact Astro script are separate execution contexts. Communication via URL params (navigate + read) is the correct approach — do not try to import the Preact component into the Astro script or vice versa. The island can also dispatch a `CustomEvent` on the `window` if same-page navigation is preferred, but URL params are simpler and survive page refreshes.

---

### Feature 2: Google Maps Visual Driving Route

**Verdict: Use Google Maps Embed API in `directions` mode. No new libraries. Requires API key (existing billing account OK).**

The existing `Map.astro` already uses a Maps Embed API iframe for the location pin view. Adding a route display means switching the embed URL to `directions` mode.

**Approach: Replace or supplement the existing embed with a directions-mode URL.**

```
https://www.google.com/maps/embed/v1/directions
  ?key=YOUR_MAPS_EMBED_API_KEY
  &origin=Clinton+MO
  &destination=306+NW+300+Rd+Clinton+MO+64735
  &mode=driving
```

- **Cost:** Maps Embed API is free with unlimited usage (verified March 2026). Billing account required but no charges incurred.
- **API key:** A Maps Embed API key is already likely provisioned for the existing embed. If not, create a separate key restricted to Maps Embed API and the production domain.
- **Route display:** The iframe renders a visual blue route line on the map between origin and destination — exactly what the client wants.

**Design decision for Map.astro:**

Two options:
1. **Replace** the current pin embed with a directions embed (simpler — one iframe, shows route)
2. **Tab toggle** between "Location" (pin view) and "Directions" (route view) (more complex, adds JS)

Recommendation: Replace the pin embed with the directions embed. Destination is the property address; origin defaults to `Clinton+MO` or leave blank to let Google show a "from your location" prompt. A static directions embed with a sensible default origin (e.g., Kansas City, MO — the nearest major city) is more useful than a bare pin, and aligns with the project goal of "visual driving route."

The lazy-load intersection observer already in `Map.astro` works unchanged with the new URL.

**Environment variable:**

```bash
# .env (and Vercel dashboard)
PUBLIC_GOOGLE_MAPS_EMBED_KEY=AIza...
```

Use `PUBLIC_` prefix because the key is embedded in client-side iframe src. Restrict the key to Maps Embed API + production domain in Google Cloud Console.

---

### Feature 3: Mobile Viewport Optimization Tooling

**Verdict: No new libraries. Browser DevTools + Tailwind responsive utilities + Lighthouse.**

The existing stack handles mobile optimization through:

- **Tailwind responsive prefixes** (`sm:`, `md:`, `lg:`) — already in use throughout the project
- **Chrome DevTools Device Mode** — built into Chrome, covers standard viewports (320px, 375px, 425px, 768px, 1024px+)
- **Astro's built-in Lighthouse integration** — `astro preview` then run Lighthouse for 90+ mobile score (already validated)

For v2.2 polish work, there is no tooling gap. The mobile issues (header text visibility, section optimization) are CSS/Tailwind fixes, not framework problems.

**Standard test viewports for this project:**

| Breakpoint | Width | Represents |
|------------|-------|------------|
| Mobile S | 320px | Older/small phones |
| Mobile M | 375px | iPhone SE, older iPhones |
| Mobile L | 425px | Large modern phones |
| Tablet | 768px | Tailwind `md:` breakpoint |
| Desktop | 1280px | Standard laptop |

The Tailwind `sm:` breakpoint is 640px and `md:` is 768px. Test at 375px and 768px to catch most mobile/tablet issues.

---

### Feature 4: Playwright Viewport Testing

**Verdict: Add `@playwright/test` as dev dependency. No other new packages.**

| Library | Version | Purpose |
|---------|---------|---------|
| `@playwright/test` | 1.58.2 | E2E + viewport testing framework |

**Why Playwright over alternatives:**

- **vs Cypress:** Playwright tests multiple browser engines (Chromium, WebKit, Firefox) from one config. Built-in device emulation with real device profiles. No cloud account required.
- **vs Vitest browser mode:** Playwright is the documented Astro recommendation for E2E tests. Vitest is for unit/component tests.
- **vs manual testing:** Playwright can run against `astro build && astro preview` output — the exact production artifact — in CI.

**Configuration for this project:**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321/',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:4321/',
  },
  projects: [
    // Desktop
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    // Mobile
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },       // 393x851
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },     // 390x844
  ],
});
```

**Test scope for v2.2:**

The Playwright tests should verify viewport-specific behavior, not full E2E flows. Recommended test assertions:

1. Mobile header shows "Timber & Threads" text at 390px width
2. Calculator "Get a Quote" button is visible and tappable (44px touch target) at mobile width
3. Contact form message field is pre-filled when landing with `?estimate=` param
4. Map section renders an iframe on scroll (lazy-load intersection observer fires)
5. No horizontal scroll overflow at 375px width (layout integrity check)

**Build step requirement:** Playwright's `webServer` command uses `npm run preview`, which requires `npm run build` first. Add a combined script:

```json
{
  "scripts": {
    "test:e2e": "astro build && playwright test"
  }
}
```

---

## Summary: What to Install

```bash
# Only new dev dependency for v2.2
npm install -D @playwright/test

# Install browser binaries (run once after install)
npx playwright install --with-deps chromium webkit
```

No new runtime dependencies. All other v2.2 features use existing browser APIs, existing Google Maps Embed infrastructure, and existing Tailwind utilities.

---

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Google Maps JavaScript API (full) | Requires JS bundle, billing monitoring, complex initialization. Overkill for a visual route display. | Maps Embed API iframe in directions mode — free, zero JS, same visual result |
| Google Directions API / Routes API | Server-side API returning JSON routing data. Not needed — we're displaying a map, not calculating routes programmatically. | Maps Embed API handles the visual route display |
| `@googlemaps/js-api-loader` | NPM package for Maps JavaScript API. Unnecessary added weight. | Direct iframe embed |
| State management library (Zustand, Jotai) | Not needed for passing estimate data from calculator to form. | URL search params — simpler, no dependency, works across component boundaries |
| Preact signals | Complex for a one-time data handoff between calculator and contact form. | URL params pattern |
| Cypress | Heavier install, slower, Electron-based, no multi-browser from config. | `@playwright/test` |
| `playwright` (full package) | Includes `playwright-core` + all browser downloads. For test-only use, `@playwright/test` is sufficient and includes what you need. | `@playwright/test` |
| Mobile-first CSS frameworks (Bootstrap, Bulma) | Conflicts with Tailwind, unnecessary overhead. | Existing Tailwind responsive utilities |

---

## Integration Points

| Feature | Touches | How |
|---------|---------|-----|
| Calculator pre-fill | `PricingCalculator.tsx` (add "Get a Quote" button + navigate), `Contact.astro` (add URLSearchParams reader in `<script>`) | Vanilla JS / browser navigation |
| Maps route display | `Map.astro` (swap iframe `data-src` URL to directions mode) | Embed URL change only |
| Mobile optimization | `Nav.astro` (show text title at mobile), any section with overflow/spacing issues | Tailwind responsive utilities |
| Playwright tests | New `tests/` directory + `playwright.config.ts` at project root | Dev tooling, no production impact |

---

## Version Compatibility

| Package | Version | Compatible With | Notes |
|---------|---------|-----------------|-------|
| `@playwright/test` | 1.58.2 | Node 18.x+ | Works with Astro's `preview` command on port 4321 |
| Maps Embed API | N/A (Google-hosted) | All browsers | iframe, no npm package, unlimited free usage |
| URLSearchParams | Browser built-in | All evergreen browsers, IE11+ | No polyfill needed for target audience |

---

## Alternatives Considered

| Feature | Recommended | Alternative | Why Not |
|---------|-------------|-------------|---------|
| Calculator → form data handoff | URL search params | `localStorage` | localStorage persists across sessions (stale data risk); URL params are ephemeral, inspectable, bookmarkable |
| Calculator → form data handoff | URL search params | `CustomEvent` on `window` | Custom events work only if both components are live simultaneously. Page navigation (scroll to section on different layout state) breaks the event approach. URL params survive the navigation. |
| Map route | Maps Embed API (directions mode) | Leaflet.js + OpenStreetMap | Leaflet adds ~140KB JS + tile requests. Embed API is zero JS, already trusted by users, shows Google's route quality. |
| Viewport testing | Playwright | BrowserStack | BrowserStack costs money. Playwright is free, runs locally and in CI, sufficient for this project's needs. |

---

## Sources

- [Google Maps Embed API — Usage and Billing](https://developers.google.com/maps/documentation/embed/usage-and-billing) — Confirmed free/unlimited (verified March 2026)
- [Google Maps Embed API — Directions Mode](https://developers.google.com/maps/documentation/embed/embedding-map) — URL format and parameters (verified March 2026)
- [Playwright — Emulation](https://playwright.dev/docs/emulation) — Device profiles including Pixel 5, iPhone 13 (verified March 2026)
- [Playwright — Installation](https://playwright.dev/docs/intro) — @playwright/test 1.58.2 (verified via npm March 2026)
- [Astro — Testing Guide](https://docs.astro.build/en/guides/testing/) — webServer config for Playwright + Astro (official docs)
- [URLSearchParams — MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) — Browser built-in, no polyfill needed
- [Element.scrollIntoView — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) — Browser built-in scroll behavior

---

*Stack research for: Timber & Threads v2.2 polish milestone (calculator flow, Maps route, mobile viewport, Playwright)*
*Researched: 2026-03-02*
