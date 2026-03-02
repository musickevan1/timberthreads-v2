# Architecture Research: v2.2 Feature Integration

**Domain:** Astro static site — incremental feature additions to existing single-page site
**Researched:** 2026-03-02
**Confidence:** HIGH

> This document supersedes the 2026-02-16 initial architecture research and focuses on
> how the four v2.2 milestone features integrate with the existing codebase. The prior
> research documented foundation patterns; this documents integration patterns.

---

## Existing Architecture Snapshot

Before describing new features, the current system that changes must integrate with:

```
src/
├── pages/
│   ├── index.astro                   # Single page — composes all sections
│   └── api/contact.ts                # Vercel serverless — POST handler (Resend)
├── layouts/
│   └── BaseLayout.astro              # HTML shell, meta, structured data
├── components/
│   ├── Nav.astro                     # Fixed header, hamburger, scroll-spy
│   ├── Hero.astro                    # Static section
│   ├── About.astro                   # Static section
│   ├── Workshops.astro               # Static section
│   ├── Accommodations.astro          # Static section (has CTA → #pricing-calculator)
│   ├── Calendar.astro                # Lazy iframe (IntersectionObserver)
│   ├── PricingSection.astro          # Static wrapper + mounts PricingCalculator island
│   ├── PricingCalculator.tsx         # Preact island (client:load) — isolated state
│   ├── Gallery.astro                 # Static, PhotoSwipe lightbox
│   ├── GalleryCategory.astro         # Static, renders image grid
│   ├── Contact.astro                 # Static HTML + inline <script> for form+validation
│   ├── Map.astro                     # Lazy iframe (IntersectionObserver)
│   └── Footer.astro                  # Static section
├── scripts/
│   └── scroll-spy.js                 # Global: highlights active nav link on scroll
├── data/
│   └── gallery.ts                    # Static gallery image data, ESM imports
└── assets/
    └── images/                       # Build-time optimized images
```

**Key constraints from existing architecture:**
- `output: 'static'` — no SSR at page request time, only the `/api/contact` endpoint uses Vercel Functions
- Preact is already installed (`@astrojs/preact`, `preact` in package.json)
- `PricingCalculator.tsx` uses `client:load` and has **isolated internal state** (no external bindings)
- `Contact.astro` form logic lives in an **inline `<script>`** tag — vanilla JS, DOM-only, no framework
- `Map.astro` uses a lazy-loaded iframe — **no Google Maps API key currently in use**
- `Nav.astro` brand text uses `hidden sm:block` — **invisible on mobile by design** (to fix in v2.2)

---

## Feature 1: Calculator State → Contact Form Pre-fill

### The Problem

`PricingCalculator.tsx` is a self-contained Preact island. `Contact.astro` has a plain `<textarea id="message">` filled by vanilla JS. These two live in separate parts of the DOM and don't share a runtime.

**The island boundary:** When Astro renders `PricingCalculator.tsx` with `client:load`, it boots a fresh Preact runtime scoped to that component tree. `Contact.astro`'s inline `<script>` runs in browser scope. They share only the DOM and the global `window` object.

### Recommended Pattern: Custom DOM Events

**Approach:** PricingCalculator dispatches a `CustomEvent` on `window` when the "Get a Quote" button is clicked. Contact.astro's inline script listens for that event and populates the textarea.

**Why this over nanostores:**

nanostores (`nanostores` + `@nanostores/preact`) is the Astro-recommended solution for cross-island communication and is the right choice when multiple islands need to synchronize reactive state. For this use case, it is overkill:

- The communication is one-directional: calculator → contact form
- It fires once per user action (button click), not continuously
- The target is not a hydrated island — it's a plain `<textarea>` managed by vanilla JS
- Adding nanostores would add a dependency (~1KB) and require refactoring Contact.astro into a Preact island to consume the store with `useStore`
- Custom events work across framework boundaries with zero dependencies

**Confidence:** HIGH — Astro's own docs list custom browser events as a supported cross-island communication method when nanostores is not needed.

### Implementation Pattern

**In `PricingCalculator.tsx` — add "Get a Quote" button:**

```tsx
// Inside the breakdown panel, below the total line
function handleGetQuote() {
  const summary = buildQuoteSummary(groupSize, nights, includeMeals, total);

  // 1. Dispatch event with quote data
  window.dispatchEvent(
    new CustomEvent('calculator:quote-requested', {
      detail: { summary, total, groupSize, nights, includeMeals }
    })
  );

  // 2. Scroll to contact section
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

function buildQuoteSummary(groupSize, nights, includeMeals, total) {
  const isFlatRate = groupSize > 10;
  const lines = [
    `Group size: ${groupSize} people`,
    `Nights: ${nights}`,
    `Meals included: ${includeMeals ? 'Yes' : 'No'}`,
    `Rate type: ${isFlatRate ? `$600/night flat rate` : `$60/night per person`}`,
    `Estimated total: ${formatCurrency(total)}`,
    '',
    'Please let me know your available dates and any questions.',
  ];
  return lines.join('\n');
}

// In JSX:
<button
  type="button"
  onClick={handleGetQuote}
  class="w-full mt-4 px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors"
>
  Get a Quote
</button>
```

**In `Contact.astro` inline `<script>` — listen for event:**

```javascript
// Add inside the existing <script> tag, near the top with other DOM refs
window.addEventListener('calculator:quote-requested', (event) => {
  const { summary } = event.detail;

  // Pre-fill the message textarea
  messageInput.value = summary;

  // Clear any previous error state on message field
  messageError.classList.add('hidden');
});
```

**Data flow:**

```
User adjusts calculator sliders
    ↓
Clicks "Get a Quote" button (in PricingCalculator.tsx)
    ↓
buildQuoteSummary() formats text from current state
    ↓
window.dispatchEvent(CustomEvent 'calculator:quote-requested')
    ↓
Contact.astro inline script listener fires
    ↓
messageInput.value = summary  (DOM mutation)
    ↓
page.scrollIntoView({ behavior: 'smooth' }) → #contact section
    ↓
User sees contact form with pre-filled message
```

### Files Modified

| File | Change Type | What Changes |
|------|-------------|--------------|
| `src/components/PricingCalculator.tsx` | Modified | Add "Get a Quote" button, `handleGetQuote()`, `buildQuoteSummary()` |
| `src/components/Contact.astro` | Modified | Add `window.addEventListener('calculator:quote-requested', ...)` in existing `<script>` |

**No new files required.**

### Per-Person Breakdown Under Total

The existing breakdown panel in `PricingCalculator.tsx` shows accommodation and meals line items. The v2.2 requirement adds a per-person price breakdown under the total estimate.

Add inside the breakdown panel, after the `Estimated Total` line but before the disclaimer:

```tsx
{/* Per-person breakdown — only meaningful for standard rate (≤10 people) */}
{!isFlatRate && (
  <div class="text-sm text-stone-500 mt-1 text-right">
    {formatCurrency(Math.round(total / groupSize))} per person total
    {includeMeals && ` (${formatCurrency(75)} × ${nights} nights)`}
    {!includeMeals && ` ($60 × ${nights} nights)`}
  </div>
)}
{isFlatRate && includeMeals && (
  <div class="text-sm text-stone-500 mt-1 text-right">
    Accommodation: $600 flat + {formatCurrency(Math.round(foodCost / groupSize))} meals per person
  </div>
)}
```

---

## Feature 2: Google Maps Route Visualization

### Current State

`Map.astro` renders a lazy-loaded Google Maps embed using the `maps/embed` URL:

```
https://www.google.com/maps/embed?pb=!1m18...
```

This is the "legacy" embed URL from the Google Maps share dialog — it requires **no API key** and shows a location pin. It does **not** support directions mode.

### Options Analysis

**Option A: Maps Embed API — Directions Mode (RECOMMENDED)**

The Maps Embed API supports a `directions` mode that shows a visual route between two points:

```
https://www.google.com/maps/embed/v1/directions
  ?key=YOUR_API_KEY
  &origin=ADDRESS_OR_COORDS
  &destination=306+NW+300+Rd,+Clinton,+MO+64735
  &mode=driving
```

- **Requires:** Google Cloud API key with Maps Embed API enabled
- **Cost:** Maps Embed API is free with unlimited requests (confirmed: Google March 2025 billing changes did not affect Embed API)
- **Display:** Shows an interactive map with the route highlighted in blue, just like Google Maps directions
- **Maintenance:** URL is stable — no SDK to version, no JS to load
- **Integration:** Drop-in replacement for existing iframe `data-src` value

**Option B: Static Map Image with Path Drawing**

The Maps Static API generates a PNG/JPEG image with a custom path drawn:

```
https://maps.googleapis.com/maps/api/staticmap
  ?key=YOUR_API_KEY
  &size=600x400
  &path=color:0x0070f3ff|weight:5|ENC:{polyline}
  &markers=306+NW+300+Rd,Clinton,MO
```

- **Requires:** API key + separately geocoded route polyline (from Directions API, which has usage limits)
- **Cost:** Static API = $2/1000 requests after 10K/month free threshold. For a low-traffic site, free.
- **Display:** Non-interactive image — no scrolling, no zoom, no street view
- **Trade-off:** Faster initial load than iframe, but no user interaction. Getting the correct polyline for this rural address requires calling the Directions API separately.

**Option C: Keep Existing Embed + Add Visual Route Overlay Image**

Keep the existing location embed and add a static screenshot or image of the route above it.

- **Cost:** Zero — no API needed
- **Trade-off:** Manual maintenance (screenshot goes stale if roads change), no interactivity, feels low-quality

### Recommendation: Option A (Maps Embed Directions Mode)

Use the Maps Embed API with `v1/directions` mode. It's free, interactive, requires one API key (no billing risk for this traffic level), and produces a polished map that shows the actual driving route highlighted in blue.

**Approach:** The existing `Map.astro` lazy-load infrastructure (IntersectionObserver swapping `data-src` → `src`) stays unchanged. Only the iframe URL changes.

**New iframe URL:**

```
https://www.google.com/maps/embed/v1/directions
  ?key=GOOGLE_MAPS_API_KEY
  &origin=Highway+7+Clinton+MO
  &destination=306+NW+300+Rd+Clinton+MO+64735
  &mode=driving
```

Using "Highway 7 Clinton MO" as origin gives guests a familiar landmark to orient the route from — the directions text already references "From Highway 7."

**API Key Setup (one-time, ~5 minutes):**

1. Google Cloud Console → Create project or use existing
2. Enable "Maps Embed API" (NOT Maps JavaScript API, NOT Directions API)
3. Create API key → restrict to `timberandthreadsretreat.com` HTTP referrer
4. Add to Vercel environment variables as `PUBLIC_GOOGLE_MAPS_KEY`

**Note on environment variables in static Astro:** The API key appears in the iframe URL which is rendered at build time from the Astro component's frontmatter. Use `import.meta.env.PUBLIC_GOOGLE_MAPS_KEY` — the `PUBLIC_` prefix is required for Astro to expose the variable to client-side (and build-time) rendering. Since the URL is embedded in HTML, the key is visible in source — this is expected for Maps Embed API keys; the referrer restriction is the security control.

### Files Modified

| File | Change Type | What Changes |
|------|-------------|--------------|
| `src/components/Map.astro` | Modified | Change `data-src` URL from legacy embed to `v1/directions` URL |
| `.env` (local) | New entry | `PUBLIC_GOOGLE_MAPS_KEY=your_key_here` |
| Vercel dashboard | Config | Add `PUBLIC_GOOGLE_MAPS_KEY` environment variable |

**No new files required.**

**Map.astro frontmatter change:**

```astro
---
import { Image } from 'astro:assets';
import entranceDriveway from '../assets/images/entrance-driveway-summer.jpg';

const mapsKey = import.meta.env.PUBLIC_GOOGLE_MAPS_KEY;
const mapsDirectionsUrl = `https://www.google.com/maps/embed/v1/directions?key=${mapsKey}&origin=Highway+7+Clinton+MO&destination=306+NW+300+Rd+Clinton+MO+64735&mode=driving`;
---
```

Then update the iframe's `data-src`:

```astro
<iframe
  id="maps-iframe"
  data-src={mapsDirectionsUrl}
  ...
```

---

## Feature 3: Mobile Header Text Title

### Current State

In `Nav.astro`, the brand text "Timber & Threads" uses `hidden sm:block` — invisible on all screens narrower than 640px (Tailwind's `sm` breakpoint):

```astro
<span class="font-serif text-2xl text-stone-800 group-hover:text-brand transition-colors hidden sm:block">
  Timber &amp; Threads
</span>
<div class="w-0 h-1 bg-brand group-hover:w-full transition-all duration-300 hidden sm:block"></div>
```

The mobile header currently shows only the logo image and the hamburger button.

### Fix

Remove `hidden sm:block` from the brand name span. The animated underline div can remain hidden on mobile (it's a hover decoration, not content).

**Concern:** Will the text fit in the mobile header between logo and hamburger?

The nav is `h-20` (80px tall) and uses `flex items-center justify-between`. The brand link is `flex items-center gap-2 shrink-0`. On a 375px wide iPhone SE:
- Logo: 32px wide
- Gap: 8px
- Text "Timber & Threads" at `text-2xl` (24px / 1.5rem): approximately 180-200px
- Hamburger button: 44px
- Total: ~32 + 8 + 190 + 44 = ~274px + padding

With `px-4` (16px × 2), available space = 375 - 32 = 343px. The text fits, but tight on very small screens (320px wide).

**Recommendation:** Scale down the font size on mobile. Use `text-xl sm:text-2xl` instead of `text-2xl`:

```astro
<span class="font-serif text-xl sm:text-2xl text-stone-800 group-hover:text-brand transition-colors">
  Timber &amp; Threads
</span>
```

Keep `hidden sm:block` on the animated underline div — that decoration does not need to show on mobile.

### Files Modified

| File | Change Type | What Changes |
|------|-------------|--------------|
| `src/components/Nav.astro` | Modified | Remove `hidden sm:block` from brand span, adjust font size |

**No new files required.**

---

## Feature 4: Playwright Test Setup

### Current State

No Playwright or testing infrastructure exists. `package.json` has no test scripts. No `playwright.config.ts`.

### Setup Pattern for Astro Static Site

Playwright integrates with Astro's `npm run preview` command to test against the built static output — the closest approximation to production.

**Why preview (not dev):**
- `astro dev` uses Vite's dev server with HMR, module transform, and no optimization
- `astro preview` serves the actual built `dist/` — same as Vercel production
- Testing against preview catches build-time issues (image optimization, Preact island hydration, URL routing)

**Playwright `webServer` configuration:** The `command` field can chain shell commands. For static Astro, the correct pattern is:

```typescript
webServer: {
  command: 'npm run build && npm run preview',
  url: 'http://localhost:4321/',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000,  // build takes time
}
```

`reuseExistingServer: !process.env.CI` means: reuse an already-running preview server locally (faster iteration), but always rebuild fresh in CI.

### Files to Create

```
timberandthreads-v2/
├── playwright.config.ts              # NEW — Playwright configuration
├── tests/
│   └── viewport.spec.ts              # NEW — desktop/mobile viewport tests
└── package.json                      # MODIFIED — add test scripts and devDependencies
```

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321/',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### `tests/viewport.spec.ts` — What to Test

The v2.2 goal is viewport verification across desktop and mobile. Focus tests on visual correctness checks rather than unit logic:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Page loads and renders', () => {
  test('homepage has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Timber & Threads Retreat/);
  });
});

test.describe('Mobile header', () => {
  test('shows brand text on mobile', async ({ page }) => {
    await page.goto('/');
    // The brand name should be visible (not hidden) on mobile
    const brandText = page.locator('nav').getByText('Timber & Threads');
    await expect(brandText).toBeVisible();
  });
});

test.describe('Pricing calculator', () => {
  test('calculator renders and shows estimate', async ({ page }) => {
    await page.goto('/');
    await page.locator('#pricing-calculator').scrollIntoViewIfNeeded();
    // Sliders should be interactive
    await expect(page.locator('#group-size')).toBeVisible();
    await expect(page.locator('#nights')).toBeVisible();
  });

  test('"Get a Quote" pre-fills contact form message', async ({ page }) => {
    await page.goto('/');
    await page.locator('#pricing-calculator').scrollIntoViewIfNeeded();
    // Click "Get a Quote"
    await page.getByRole('button', { name: /get a quote/i }).click();
    // Contact form message should be populated
    const messageField = page.locator('#message');
    await expect(messageField).not.toHaveValue('');
  });
});

test.describe('Map section', () => {
  test('map iframe renders in location section', async ({ page }) => {
    await page.goto('/');
    await page.locator('#location').scrollIntoViewIfNeeded();
    // Iframe should be present (lazy-loaded, may not have src yet — check presence)
    await expect(page.locator('#maps-iframe')).toBeVisible();
  });
});

test.describe('No horizontal overflow on mobile', () => {
  test('page does not overflow viewport width', async ({ page }) => {
    await page.goto('/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width ?? 375;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });
});
```

### `package.json` changes

Add to `scripts`:

```json
"test": "playwright test",
"test:ui": "playwright test --ui"
```

Add to `devDependencies` (after `npm install -D @playwright/test`):

```json
"@playwright/test": "^1.50.0"
```

After installing, run `npx playwright install --with-deps chromium` to download browser binaries.

---

## System Overview — v2.2 State

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Browser (Client Layer)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  Nav.astro  [MODIFIED: brand text now visible on mobile]     │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌─────────────────────────┐    ┌──────────────────────────────┐    │
│  │  PricingCalculator.tsx  │    │  Contact.astro               │    │
│  │  Preact island          │    │  (inline <script>)           │    │
│  │  [MODIFIED: +GetQuote   │───▶│  [MODIFIED: +event listener  │    │
│  │   button + per-person   │    │   pre-fills #message]        │    │
│  │   breakdown]            │    │                              │    │
│  └─────────────────────────┘    └──────────────────────────────┘    │
│         CustomEvent: 'calculator:quote-requested'                    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  Map.astro  [MODIFIED: directions mode iframe URL]           │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                         Vercel Edge                                  │
│  ┌──────────────────────┐    ┌────────────────────────────────────┐ │
│  │  Static HTML (dist/) │    │  /api/contact  (serverless fn)     │ │
│  └──────────────────────┘    └────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                       External Services                              │
│  ┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐    │
│  │  Google Maps │   │  Google Calendar  │   │  Resend (email)  │    │
│  │  Embed API   │   │  Embed            │   │                  │    │
│  │  [NEW: key + │   │  (unchanged)      │   │  (unchanged)     │    │
│  │   directions]│   │                  │   │                  │    │
│  └──────────────┘   └──────────────────┘   └──────────────────┘    │
├─────────────────────────────────────────────────────────────────────┤
│                        CI / Testing                                  │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Playwright  [NEW]                                             │ │
│  │  npm run build → npm run preview → tests/viewport.spec.ts     │ │
│  │  Projects: Desktop Chrome | Pixel 5 | iPhone 12               │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Responsibilities — v2.2 Changes

| Component | Before | After v2.2 |
|-----------|--------|------------|
| `Nav.astro` | Brand text hidden on mobile | Brand text visible on mobile (font size adjusted) |
| `PricingCalculator.tsx` | Shows estimate only | Shows estimate + per-person breakdown + "Get a Quote" button |
| `Contact.astro` | Receives user-typed messages | Also accepts pre-filled messages from calculator via CustomEvent |
| `Map.astro` | Shows location pin only | Shows driving route from Hwy 7 to property |

---

## Data Flow Changes

### Calculator-to-Contact Pre-fill Flow

```
User interacts with calculator sliders
    ↓ (Preact state updates, re-render)
Current state: { groupSize, nights, includeMeals, total }
    ↓
User clicks "Get a Quote"
    ↓
handleGetQuote() called in PricingCalculator.tsx
    ↓
buildQuoteSummary() formats multi-line string from current state
    ↓
window.dispatchEvent(CustomEvent('calculator:quote-requested', { detail: { summary } }))
    ↓ (crosses framework boundary via DOM event bus)
Contact.astro inline <script> listener fires
    ↓
messageInput.value = event.detail.summary
    ↓
document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
    ↓
User sees contact form with pre-filled message about their group
```

### Map Directions Flow

```
User scrolls to #location section
    ↓
IntersectionObserver (rootMargin: '200px') fires
    ↓
iframe.dataset.src → iframe.src (URL swap)
    ↓
Browser fetches Google Maps Embed API with directions mode URL
    ↓
Google renders interactive route map: Hwy 7 → 306 NW 300 Rd, Clinton MO
    ↓ (unchanged from here)
Map is interactive, user can zoom/pan
```

---

## Integration Points — New vs Existing

### New Components

None — all v2.2 changes modify existing components.

### Modified Components

| Component | Integration Point | Communication Pattern |
|-----------|-------------------|----------------------|
| `PricingCalculator.tsx` → `Contact.astro` | "Get a Quote" button click | `window.dispatchEvent(CustomEvent)` |
| `Map.astro` → Google Maps | iframe `data-src` URL | HTTP GET at scroll time |
| `Nav.astro` | CSS class change only | None (static HTML) |

### New Infrastructure

| Item | Purpose | Touches |
|------|---------|---------|
| `playwright.config.ts` | Playwright config | Testing only |
| `tests/viewport.spec.ts` | Viewport tests | Testing only |
| `PUBLIC_GOOGLE_MAPS_KEY` env var | Maps Embed API auth | `Map.astro` frontmatter |

---

## Build Order Recommendation

These four features have minimal interdependencies. The recommended order reduces risk:

**Step 1: Mobile header text (5 min, zero risk)**
- Remove `hidden sm:block` from Nav.astro brand span
- Adjust font size for mobile fit
- Verify: no overflow, hamburger still functional
- No other components affected

**Step 2: Calculator per-person breakdown (15 min, contained)**
- Add per-person math inside `PricingCalculator.tsx` breakdown panel
- Self-contained change — only modifies display logic, no external effects
- Verify: math is correct at all slider positions

**Step 3: Calculator → Contact pre-fill (30 min, two-file change)**
- Add `handleGetQuote()` and "Get a Quote" button to `PricingCalculator.tsx`
- Add `window.addEventListener` to `Contact.astro` inline script
- Verify: button scrolls to contact, message textarea populates with correct text
- Verify: user can still edit the pre-filled message

**Step 4: Map directions (20 min + one-time API key setup)**
- Create Google Cloud project, enable Maps Embed API, create key with referrer restriction
- Add `PUBLIC_GOOGLE_MAPS_KEY` to `.env` and Vercel dashboard
- Update `Map.astro` `data-src` to use `v1/directions` URL
- Verify: map shows route (not just pin)

**Step 5: Playwright setup (45 min, new infrastructure)**
- `npm install -D @playwright/test`
- Create `playwright.config.ts`
- Create `tests/viewport.spec.ts`
- Run `npx playwright install --with-deps chromium`
- Run `npm test` — first run builds the site, tests execute
- Verify: all projects (Desktop Chrome, Pixel 5, iPhone 12) pass

**Rationale for this order:**
- Steps 1-3 are purely frontend changes with no external dependencies
- Step 4 requires an API key — the external dependency should not block frontend progress
- Step 5 (Playwright) goes last because it tests all the other features; running it before they're done is wasteful

---

## Anti-Patterns Specific to These Features

### Anti-Pattern 1: Using nanostores for This One-Directional Calculator Flow

**What people do:** Add `nanostores` + `@nanostores/preact`, convert Contact.astro into a Preact island to consume the store.

**Why it's wrong:** The target of the communication (`<textarea id="message">`) is a plain DOM element managed by vanilla JS. Converting Contact.astro to a Preact island would require rewriting the existing form handling logic (validation, submit, success/error states) in Preact, adding complexity for zero user-visible benefit.

**Do this instead:** CustomEvent from PricingCalculator.tsx, `window.addEventListener` in Contact.astro's existing inline script.

### Anti-Pattern 2: Loading Maps JavaScript API for Route Display

**What people do:** Add the Google Maps JavaScript API script (`<script src="https://maps.googleapis.com/maps/api/js?key=...">`) and use the JS SDK to draw a route on a map.

**Why it's wrong:** The Maps JS API is ~400KB, requires async initialization, and turns the map into a hydrated JavaScript component — all to show a static driving route that changes maybe once a decade. The Maps Embed API iframe achieves the same visual result with zero JavaScript.

**Do this instead:** Use the Maps Embed API `v1/directions` iframe. Same visual output, no JavaScript bundle, no SDK to maintain.

### Anti-Pattern 3: Testing Against `astro dev` Instead of `astro preview`

**What people do:** Set Playwright's `webServer.command` to `npm run dev` for faster startup.

**Why it's wrong:** `astro dev` doesn't run the build pipeline — images aren't optimized, Preact islands may hydrate differently, and Vercel Functions aren't simulated. Tests pass against dev but fail in production.

**Do this instead:** `command: 'npm run build && npm run preview'`. The build takes ~30 seconds but tests validate the actual production output.

### Anti-Pattern 4: Hardcoding the API Key in Map.astro

**What people do:** Inline the Maps API key directly in the iframe `data-src` string as a literal.

**Why it's wrong:** The key ends up committed to git history, making rotation harder and potentially exposing it if the repo is ever made public.

**Do this instead:** Use `import.meta.env.PUBLIC_GOOGLE_MAPS_KEY`. The key is still visible in rendered HTML (unavoidable for client-side APIs), but it's not in version control. Apply referrer restrictions in Google Cloud Console as the primary security control.

---

## Sources

### Cross-Island Communication (HIGH confidence)
- [Astro Docs — Share state between islands](https://docs.astro.build/en/recipes/sharing-state-islands/) — recommends nanostores for reactive state sharing, lists custom events as alternative for simpler cases
- [Astro Docs — Client-Side Scripts](https://docs.astro.build/en/guides/client-side-scripts/) — confirms inline `<script>` tags run in browser scope, can listen to DOM events
- [LogRocket — Islands Architecture Coordination](https://blog.logrocket.com/how-to-solve-coordination-problems-in-islands-architecture/) — covers event bus pattern as dependency-free cross-island coordination

### Google Maps Embed API (HIGH confidence)
- [Google Developers — Embed a map](https://developers.google.com/maps/documentation/embed/embedding-map) — confirms `v1/directions` mode, required parameters, API key requirement
- [Google Developers — Maps Embed API Usage and Billing](https://developers.google.com/maps/documentation/embed/usage-and-billing) — confirms free with unlimited requests
- [Google Developers — March 2025 billing changes](https://developers.google.com/maps/billing-and-pricing/march-2025) — confirms Embed API not affected by 2025 restructure

### Playwright with Astro (HIGH confidence)
- [Astro Docs — Testing](https://docs.astro.build/en/guides/testing/) — official Playwright setup with `npm run preview` pattern
- [Playwright Docs — webServer](https://playwright.dev/docs/test-webserver) — `command`, `reuseExistingServer`, chaining build+preview
- [Playwright Docs — Emulation](https://playwright.dev/docs/emulation) — `devices['Pixel 5']`, `devices['iPhone 12']` presets

---

*Architecture research for: Timber & Threads v2.2 feature integration*
*Researched: 2026-03-02*
