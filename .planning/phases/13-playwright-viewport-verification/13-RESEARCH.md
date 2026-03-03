# Phase 13: Playwright Viewport Verification - Research

**Researched:** 2026-03-02
**Domain:** End-to-end testing with Playwright against Astro production build
**Confidence:** HIGH

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MOBL-02 | All site sections render correctly at 375px mobile viewport | Playwright projects with custom viewport `{ width: 375, height: 812 }`; assertions use `toBeVisible()` on key elements at mobile size |
| MOBL-03 | All site sections render correctly at 320px minimum viewport | Playwright project with `{ width: 320, height: 568 }`; check for horizontal overflow via `page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)` |
| MOBL-04 | Mobile layout changes do not break desktop layout at 1280px | Playwright project with `{ width: 1280, height: 720 }`; assert same key elements visible; desktop-only elements (nav links, animated underline) present |
| TEST-01 | Playwright tests verify key elements visible and functional at desktop viewport (1280px) | Desktop project in playwright.config.ts; assert header brand, calculator, "Get a Quote" button, map iframe, contact form |
| TEST-02 | Playwright tests verify key elements visible and functional at mobile viewport (375px) | Mobile project in playwright.config.ts; assert header brand text visible, calculator no overflow, contact form accessible |
| TEST-03 | Playwright tests run against production build (`astro preview`) | `webServer` in config runs `npm run build && npm run preview`; `baseURL` set to `http://localhost:4321` |
</phase_requirements>

## Summary

Phase 13 adds Playwright end-to-end tests that run against the production build of the Astro site. The tests verify that key UI elements are visible and functional at desktop (1280px) and mobile (375px) viewports, and that clicking "Get a Quote" pre-fills the contact form message field.

This is a net-new testing infrastructure phase: Playwright is not yet installed (confirmed — `package.json` has no test dependencies). The implementation is straightforward: install `@playwright/test`, create `playwright.config.ts` with two viewport projects and a `webServer` that runs `npm run build && npm run preview` before tests, then write one test file with assertions.

Two non-trivial implementation details require attention. First, the Google Maps `iframe` in `Map.astro` is lazy-loaded via `IntersectionObserver` — it only gets its `src` when it scrolls into view. Tests asserting the iframe must scroll it into view first or force the `src` assignment via `page.evaluate`. Second, `PricingCalculator.tsx` uses `client:load` Preact hydration, so the "Get a Quote" button becomes interactive only after JavaScript runs. Playwright's auto-wait on `toBeVisible()` handles this reliably in production builds (no non-deterministic dev-server SSR).

**Primary recommendation:** Install `@playwright/test`, configure two named projects (`desktop-1280` and `mobile-375`) with explicit viewport dimensions (not device presets), use `webServer` to start `npm run build && npm run preview`, and write all assertions as `toBeVisible()` / `toHaveValue()` element checks — no screenshot comparisons.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @playwright/test | ^1.51.0 (latest stable) | Test runner, browser automation, assertions | Official Playwright test runner; includes everything needed — no separate install of playwright + jest |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | — | No additional libraries needed | Playwright bundles its own assertion library, browser binaries, and test runner |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @playwright/test | Cypress | Playwright handles multiple viewports as first-class projects; Cypress requires plugins for viewport switching; both are viable but Playwright is already the locked decision per STATE.md |
| @playwright/test | Vitest + happy-dom | DOM simulation, not real browser; viewport assertions would not reflect real CSS behavior |

**Installation:**
```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

Only Chromium is needed for this phase (single-browser, two viewport projects). This keeps install fast and CI-cheap. Firefox/WebKit can be added later if cross-browser coverage is required.

## Architecture Patterns

### Recommended Project Structure
```
playwright.config.ts          # Config at project root (standard Playwright location)
tests/
└── viewport.spec.ts          # All viewport assertions in one file
```

No `e2e/` directory needed — the single-file approach matches the scope. Playwright's default `testDir: './tests'` convention works here.

### Pattern 1: Two Named Projects with Explicit Viewport Dimensions
**What:** Define two Playwright projects, each with a fixed viewport. Use explicit pixel dimensions, not device presets.
**When to use:** When requirements call out specific pixel widths (1280px, 375px) rather than "iPhone 12" semantics.
**Example:**
```typescript
// Source: https://github.com/microsoft/playwright.dev/blob/main/nodejs/versioned_docs/version-stable/api/class-testoptions.mdx
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'desktop-1280',
      use: {
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'mobile-375',
      use: {
        viewport: { width: 375, height: 812 },
      },
    },
  ],
});
```

**Key detail:** `reuseExistingServer: !process.env.CI` lets local development skip the build if a preview server is already running. In CI, it always rebuilds.

### Pattern 2: Element Visibility Assertions
**What:** Use `await expect(locator).toBeVisible()` for all element checks. Playwright auto-retries for up to the default 5-second assertion timeout, which covers Preact `client:load` hydration time.
**When to use:** Every assertion in this phase. No screenshot comparisons allowed per project decision.
**Example:**
```typescript
// Source: https://github.com/microsoft/playwright.dev/blob/main/nodejs/versioned_docs/version-stable/api/class-locatorassertions.mdx
test('desktop: header brand text visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Timber & Threads')).toBeVisible();
});
```

### Pattern 3: Checking Horizontal Overflow
**What:** MOBL-03 requires no horizontal overflow at 375px. Playwright has no built-in overflow assertion; use `page.evaluate()` to compare `scrollWidth` vs `clientWidth` on `document.body`.
**When to use:** Mobile overflow check (MOBL-02, MOBL-03).
**Example:**
```typescript
test('mobile: no horizontal overflow', async ({ page }) => {
  await page.goto('/');
  const hasOverflow = await page.evaluate(
    () => document.body.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);
});
```

### Pattern 4: Scrolling to Trigger Lazy-Loaded Iframe
**What:** `Map.astro` uses `IntersectionObserver` to assign `iframe.src` only when scrolled into view. A test asserting the iframe must trigger that observation.
**When to use:** Asserting `#maps-iframe` has a visible src (iframe rendered).
**Two approaches:**
```typescript
// Approach A: Scroll the iframe into view using Playwright's built-in method
// Source: https://github.com/microsoft/playwright.dev/blob/main/nodejs/versioned_docs/version-stable/api/class-locator.mdx
await page.locator('#maps-iframe').scrollIntoViewIfNeeded();

// Approach B: Force-assign the src via evaluate (bypasses IntersectionObserver entirely)
await page.evaluate(() => {
  const iframe = document.getElementById('maps-iframe') as HTMLIFrameElement;
  if (iframe && iframe.dataset.src) iframe.src = iframe.dataset.src;
});
```

Approach A is preferred — it tests the real user experience (observer fires on scroll). Approach B is a fallback if the observer does not fire reliably in headless Chromium.

### Pattern 5: Testing the Calculator-to-Contact Pre-fill
**What:** Click "Get a Quote", assert contact form `#message` textarea has expected content.
**Key implementation detail:** `PricingCalculator.tsx` dispatches `calculator:quote-requested` CustomEvent on `window`, and `Contact.astro` listens to pre-fill `#message`. Both are client-side scripts; in the production build (`client:load`) both run synchronously on page load before user interaction. The scroll is `smooth`, so the `#message` field may not be in view immediately.
**Example:**
```typescript
test('clicking Get a Quote pre-fills contact message', async ({ page }) => {
  await page.goto('/');
  // Wait for Preact island to hydrate
  await page.locator('button:has-text("Get a Quote")').waitFor({ state: 'visible' });
  await page.locator('button:has-text("Get a Quote")').click();
  // Scroll finishes in ~600ms; wait for the textarea to have content
  await expect(page.locator('#message')).not.toHaveValue('');
  // Assert specific prefill content
  await expect(page.locator('#message')).toContainText('Group Size:');
});
```

`toContainText` is not a locator assertion — use `toHaveValue` on inputs/textareas:
```typescript
const messageValue = await page.locator('#message').inputValue();
expect(messageValue).toContain('Group Size:');
```

### Anti-Patterns to Avoid
- **Screenshot pixel comparisons:** Project decision explicitly forbids these. Use `toBeVisible()`, `toHaveValue()`, `inputValue()` instead.
- **`client:idle` hydration assumption:** The calculator uses `client:load`, which hydrates immediately. No special wait is needed beyond `toBeVisible()` auto-retry.
- **Asserting dev-server behavior:** STATE.md notes dev-server has non-deterministic hydration timing. Tests MUST run against `npm run preview` (production build).
- **Using `devices['Pixel 5']` preset:** The requirement specifies exact pixel widths (375px, 1280px). Device presets include user-agent and other emulation that is not needed here. Use `viewport: { width: N, height: N }` directly.
- **Asserting hidden elements:** `Nav.astro` desktop nav links are `hidden md:flex` — at 375px they are not in the DOM flow, but the hamburger button is. Assertions must match what is actually visible at each breakpoint.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Viewport switching | Custom browser.newContext() per test | Playwright `projects` in config | Projects are run separately and results clearly labeled; context juggling in tests is fragile |
| Waiting for hydration | `page.waitForTimeout(2000)` sleep | `locator.waitFor({ state: 'visible' })` or `expect().toBeVisible()` auto-retry | Sleep is flaky; Playwright's auto-wait polls until element is visible or timeout |
| Checking overflow | CSS parsing or screenshot diff | `page.evaluate(() => scrollWidth > clientWidth)` | Direct DOM measurement is reliable and deterministic |
| Running build before tests | Shell script wrapper | `webServer.command` in playwright.config.ts | Playwright manages server lifecycle, kills it after tests, retries on failure |

**Key insight:** Playwright's `webServer` + `projects` combination eliminates all orchestration glue code that developers typically write manually.

## Common Pitfalls

### Pitfall 1: `npm run build` Overwrites `dist/` Before Tests Run
**What goes wrong:** If two test runs execute in parallel (e.g., CI matrix), the second build overwrites the first while tests are running against it.
**Why it happens:** `astro build` writes to `dist/`, which `astro preview` serves from. Concurrent builds corrupt the served files.
**How to avoid:** Set `workers: 1` in playwright.config.ts for CI, or ensure the CI job only has one Playwright worker. For local dev `reuseExistingServer: true` avoids the issue entirely.
**Warning signs:** Tests that pass locally but fail intermittently in CI.

### Pitfall 2: Lazy Map Iframe Assertion Fails in Headless
**What goes wrong:** `IntersectionObserver` in headless Chromium may not fire unless the element is actually in the viewport at the configured viewport size.
**Why it happens:** Headless browsers implement IntersectionObserver, but with `fullyParallel: true` each test starts from the top of the page. If the `#location` section is below the fold at 375px, scrolling must be explicit.
**How to avoid:** Call `await page.locator('#maps-iframe').scrollIntoViewIfNeeded()` before asserting the iframe is visible. Alternatively, assert the iframe element exists in the DOM (it always does) rather than asserting it has a src loaded.
**Warning signs:** `Timeout waiting for toBeVisible` on the iframe selector.

### Pitfall 3: Preact Island "Get a Quote" Not Clickable
**What goes wrong:** Test clicks "Get a Quote" but nothing happens — textarea remains empty.
**Why it happens:** The Preact island (`client:load`) needs to hydrate before the button's `onClick` handler is bound. In the production build this is fast but not instantaneous.
**How to avoid:** Use `locator.waitFor({ state: 'visible' })` on the button before clicking. `toBeVisible()` confirms the button is in the DOM, but the Preact event handler attaches slightly after. A better approach: after clicking, use `expect(page.locator('#message')).not.toHaveValue('')` which will auto-retry until pre-fill arrives (up to assertion timeout).
**Warning signs:** Empty `#message` after click; no scroll to contact section.

### Pitfall 4: `astro preview` Port Conflict
**What goes wrong:** `webServer` command fails because port 4321 is already in use from a local dev session.
**Why it happens:** `astro dev` and `astro preview` both default to port 4321. If `astro dev` is running, `npm run preview` fails to bind.
**How to avoid:** `reuseExistingServer: !process.env.CI` handles local dev gracefully — if something is already serving on 4321, Playwright reuses it. Stop `astro dev` before running tests locally.
**Warning signs:** `EADDRINUSE` error in webServer startup logs.

### Pitfall 5: Brand Text Selector Matching Multiple Elements
**What goes wrong:** `page.getByText('Timber & Threads')` matches both the `<span>` in the header AND any other occurrence in the page body.
**Why it happens:** `getByText` does a substring match by default and may find multiple elements.
**How to avoid:** Scope the selector: `page.locator('header').getByText('Timber & Threads')` or use `exact: true` with the full text string.
**Warning signs:** `strict mode violation: locator resolved to N elements` error.

## Code Examples

Verified patterns from official sources:

### Complete `playwright.config.ts` for this project
```typescript
// Based on: https://github.com/microsoft/playwright.dev/blob/main/nodejs/versioned_docs/version-stable/test-webserver.mdx
import { defineConfig } from '@playwright/test';

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
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'desktop-1280',
      use: {
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'mobile-375',
      use: {
        viewport: { width: 375, height: 812 },
      },
    },
  ],
});
```

### Desktop visibility assertions
```typescript
// Source: https://github.com/microsoft/playwright.dev/blob/main/nodejs/versioned_docs/version-stable/api/class-locatorassertions.mdx
test('desktop: key elements visible at 1280px', async ({ page }) => {
  await page.goto('/');

  // Header brand text
  await expect(page.locator('header').getByText('Timber & Threads')).toBeVisible();

  // Pricing calculator section
  await expect(page.locator('#pricing-calculator')).toBeVisible();

  // "Get a Quote" button (inside Preact island — auto-waits for hydration)
  await expect(page.getByRole('button', { name: 'Get a Quote' })).toBeVisible();

  // Map iframe — scroll into view first to trigger lazy load
  await page.locator('#maps-iframe').scrollIntoViewIfNeeded();
  await expect(page.locator('#maps-iframe')).toBeVisible();

  // Contact form
  await expect(page.locator('#contact-form')).toBeVisible();
});
```

### Mobile visibility + overflow assertions
```typescript
// viewport configured in playwright.config.ts projects
test('mobile: key elements visible at 375px', async ({ page }) => {
  await page.goto('/');

  // Header brand text must be visible (not hidden) — this was fixed in Phase 9
  // Nav.astro: `font-serif text-xl sm:text-2xl text-stone-800` — always visible
  await expect(page.locator('header').getByText('Timber & Threads')).toBeVisible();

  // Calculator section renders without horizontal overflow
  const hasOverflow = await page.evaluate(
    () => document.body.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);

  // Contact form accessible
  await expect(page.locator('#contact-form')).toBeVisible();
});
```

### Pre-fill flow assertion
```typescript
test('Get a Quote pre-fills contact message at desktop', async ({ page }) => {
  await page.goto('/');

  // Wait for Preact island to hydrate
  const quoteBtn = page.getByRole('button', { name: 'Get a Quote' });
  await quoteBtn.waitFor({ state: 'visible' });
  await quoteBtn.click();

  // Auto-retry until pre-fill text appears (smooth scroll + 600ms focus timer)
  const message = page.locator('#message');
  await expect(message).not.toHaveValue('');

  const messageValue = await message.inputValue();
  expect(messageValue).toContain('Group Size:');
  expect(messageValue).toContain('Estimated Total:');
});
```

### Add test script to package.json
```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui"
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `waitForTimeout(ms)` sleep | `expect().toBeVisible()` auto-retry | Playwright v1.10+ | Tests no longer rely on arbitrary sleep durations |
| `page.screenshot()` + pixel diff | `toBeVisible()` / `toHaveValue()` assertions | Project decision (STATE.md) | No OS font rendering flakiness in CI |
| `devices['Pixel 5']` device preset | Explicit `viewport: { width: 375 }` | Per project requirement | Direct pixel control, no unneeded user-agent emulation |
| `npm test` running dev server | `webServer` runs production build | Per project decision (STATE.md) | Tests reflect real visitor experience |

**Deprecated/outdated:**
- `page.waitForSelector()` with string argument: replaced by `locator.waitFor()` in Playwright v1.14+
- `ElementHandle` API: discouraged in favor of `Locator` API since v1.14

## Open Questions

1. **Should MOBL-03 (320px) get its own test project?**
   - What we know: Requirements list 320px as the minimum viewport. The phase success criteria mention 375px for mobile tests.
   - What's unclear: Whether 320px needs a separate Playwright project or just a single overflow check under the mobile-375 project.
   - Recommendation: Add a third project `mobile-320` with `viewport: { width: 320, height: 568 }` running only the overflow assertion. This is cheap (same test file, filtered by project) and satisfies MOBL-03 explicitly.

2. **Does `npm run build` need the `RESEND_API_KEY` env var?**
   - What we know: The contact form POSTs to `/api/contact` which uses Resend. The build is `output: 'static'` with Vercel adapter.
   - What's unclear: Whether `astro build` fails if `RESEND_API_KEY` is not set in the test environment.
   - Recommendation: Check if build succeeds without the key before writing the webServer command. If it fails, use `dotenv` or set `RESEND_API_KEY=test` in the test environment. Since the build is static and the API route is a serverless function, it likely builds without the key present.

## Sources

### Primary (HIGH confidence)
- `/microsoft/playwright.dev` (Context7) — installation, projects/viewport config, webServer config, toBeVisible assertions, scrollIntoViewIfNeeded, evaluate, toHaveValue
- Verified: Astro 5.17.2 preview defaults to port 4321 (confirmed from `node_modules/astro/dist/cli/preview/index.js`)
- Verified: `PricingCalculator.tsx` uses `client:load`, dispatches `calculator:quote-requested` CustomEvent (confirmed source read)
- Verified: `Map.astro` iframe lazy-loads via IntersectionObserver with `data-src` pattern (confirmed source read)
- Verified: `Contact.astro` listens on `window` for `calculator:quote-requested`, pre-fills `#message` textarea (confirmed source read)
- Verified: `Nav.astro` brand text always visible (no `hidden sm:block` on the `<span>`) per Phase 9 decision in STATE.md

### Secondary (MEDIUM confidence)
- Astro 5 `output: 'static'` with Vercel adapter: API routes compile to serverless functions; static build does not require API keys at build time (inferred from architecture, not directly verified against Astro docs)

### Tertiary (LOW confidence)
- IntersectionObserver fires reliably in headless Chromium when `scrollIntoViewIfNeeded()` is called: based on Playwright documentation description and common practice; not CI-tested against this specific project

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Playwright is the locked technology; version and installation confirmed via Context7 and npm registry
- Architecture: HIGH — playwright.config.ts patterns verified directly from Context7 official Playwright docs; component selectors verified by reading source files
- Pitfalls: MEDIUM — lazy iframe and Preact hydration pitfalls are based on pattern understanding; the specific IntersectionObserver behavior in headless Chromium is LOW confidence until tested

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (Playwright releases frequently; core API stable)
