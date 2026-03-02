# Pitfalls Research

**Domain:** Astro Static Site — Client Preview Polish Features
**Researched:** 2026-03-02
**Confidence:** HIGH
**Scope:** v2.2 milestone — calculator-to-contact pre-fill, Google Maps route, mobile viewport polish, Playwright viewport verification

---

## Critical Pitfalls

### Pitfall 1: Calculator State Cannot Cross the Island Boundary Directly

**What goes wrong:**
The PricingCalculator (Preact island) and the Contact form (vanilla JS in Contact.astro) run in completely separate JavaScript contexts. You cannot pass a callback, ref, or reactive variable from one to the other. Attempts to use React/Preact context, component props, or shared module-level variables between them will silently fail — the calculator updates its local state but the contact form never sees the change.

**Why it happens:**
Astro's islands architecture intentionally isolates each island. Server-rendered `.astro` components cannot subscribe to client-side state changes at all. Module-level `let` variables in Preact are scoped to the island's bundle, not the global page scope. Developers coming from React/Next.js expect a shared store to just work, but Astro has no global React context.

**How to avoid:**
Use the browser's native global scope as the communication layer — two proven approaches:

**Option A: Custom DOM event (recommended for this project)**
The calculator island dispatches a `CustomEvent` on `window` when the user clicks "Get a Quote". The contact section's vanilla script listens for that event and pre-fills the message textarea. No additional dependencies. Works because both scripts run in the same browser tab.

```ts
// In PricingCalculator.tsx — dispatch on button click
window.dispatchEvent(new CustomEvent('calculator:quote-request', {
  detail: { groupSize, nights, includeMeals, total }
}));

// In Contact.astro <script> — listen and pre-fill
window.addEventListener('calculator:quote-request', (e) => {
  const { groupSize, nights, total } = e.detail;
  const textarea = document.getElementById('message') as HTMLTextAreaElement;
  if (textarea) {
    textarea.value = `Group size: ${groupSize} guests, ${nights} nights. Estimated total: $${total}.`;
  }
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
});
```

**Option B: Nano Stores (`@nanostores/preact`)**
Add `nanostores` as a shared store. Both the Preact island and a vanilla script (using `@nanostores/atom`) can read/write. Adds ~1KB but provides a reactive subscription pattern. Avoid if the custom event approach covers the use case — Nano Stores are most useful when multiple islands need real-time sync.

**Warning signs:**
- Calculator button click produces no effect in the contact section
- Console shows no errors (the failure is silent — event was fired but nobody was listening)
- Testing only within the Preact component and missing the cross-boundary test

**Phase to address:**
v2.2 — Calculator-to-Contact flow phase. The "Get a Quote" button implementation must use one of the two approaches above, not prop-drilling or module imports.

---

### Pitfall 2: The Contact Textarea Gets Pre-Filled But Validation Rejects It

**What goes wrong:**
The contact form has client-side validation that fires on `blur` and `submit`. The textarea's `value` is programmatically set from the calculator state, but the existing validation checks `messageInput.value.trim()` — this works correctly for direct DOM writes. However, if the pre-fill logic sets the `value` attribute instead of `.value` property, or if the form's input event listeners require user interaction to mark the field as "touched," the form may show a validation error when the user submits even though the textarea is pre-filled.

**Why it happens:**
There is a difference between the DOM property `.value` (reflects current content) and the HTML attribute `value` (reflects initial content). Libraries and some manual implementations set the attribute, which doesn't update the live DOM property. Additionally, the existing form validates `messageInput.value.trim()` directly, which reads the property — so pre-filling with `.value =` works, but `setAttribute('value', ...)` does not update what the validator sees.

**How to avoid:**
Always set `element.value = '...'` (DOM property assignment) rather than `element.setAttribute('value', '...')` when pre-filling. Test the full flow: click "Get a Quote," scroll to form, and immediately submit without typing — validation should pass.

**Warning signs:**
- Textarea appears to have content visually but validation still fires
- `messageInput.value` returns empty string despite visible text in field
- Test: `document.getElementById('message').value` in DevTools returns `''`

**Phase to address:**
v2.2 — Calculator-to-Contact phase. Verify during human review by clicking "Get a Quote," submitting the pre-filled form without modification, and confirming the email arrives.

---

### Pitfall 3: Scroll Offset from Fixed Nav Hides the Form Heading

**What goes wrong:**
`scrollIntoView({ behavior: 'smooth' })` or `window.scrollTo(...)` on the `#contact` anchor scrolls the top of the section to the top of the viewport. The fixed navigation header (80px tall on this site) overlaps the section heading, making it appear as if the page scrolled incorrectly. Users see the first 80px of the contact section hidden behind the nav bar.

**Why it happens:**
`scrollIntoView` targets the top edge of the element relative to the viewport's 0,0 origin, not accounting for any fixed overlay elements. The site's nav is `fixed top-0 h-20` (80px), which sits above the scrolled-to content.

**How to avoid:**
Use `scroll-margin-top` CSS on the target element, or use a manual scroll calculation:

```css
/* On section#contact in Contact.astro */
scroll-margin-top: 80px; /* matches nav height */
```

Or via JavaScript scroll offset:

```js
const section = document.getElementById('contact');
const navHeight = 80;
const top = section.getBoundingClientRect().top + window.scrollY - navHeight;
window.scrollTo({ top, behavior: 'smooth' });
```

The CSS `scroll-margin-top` approach is simpler and should be checked first — it may already be set from prior phases. If sections already have `scroll-margin-top: 80px` applied globally, no additional work is needed.

**Warning signs:**
- Clicking "Get a Quote" scrolls to contact section but the "Get in Touch" heading is hidden behind the navbar
- `#contact` anchor in the nav also misbehaves (points to section but heading is cut off)
- Chrome DevTools: inspect the section and check for `scroll-margin-top` in computed styles

**Phase to address:**
v2.2 — Calculator-to-Contact phase. Check `scroll-margin-top` on all section anchors during implementation. If not set globally, add it to `Contact.astro` specifically.

---

### Pitfall 4: Google Maps Directions Mode Requires an API Key — Not Zero-Setup

**What goes wrong:**
The current Maps embed uses a no-API-key iframe URL (the standard Google Maps share URL). The Maps Embed API's directions mode — which shows a visual driving route — requires an API key. Developers assume they can use the same share-link approach and are surprised when the directions iframe returns an error page instead of a map.

**Why it happens:**
Google Maps has two distinct embed approaches:
1. **Share link embed** (current site): `google.com/maps/embed?pb=...` — no API key, no billing, just location pin. Free, unlimited.
2. **Maps Embed API directions mode**: `google.com/maps/embed/v1/directions?key=API_KEY&origin=...&destination=...` — API key required, but the Embed API itself is free with unlimited usage (no per-request cost).

The confusion arises because both produce iframes, but they have completely different URL structures and requirements.

**How to avoid:**
- Get a Google Cloud project and enable the Maps Embed API (takes ~5 minutes, no billing required for the Embed API itself)
- Restrict the API key to "HTTP referrers" scoped to the production domain (`timberandthreadsretreat.com/*`)
- Use the directions mode URL:
  ```
  https://www.google.com/maps/embed/v1/directions
    ?key=YOUR_KEY
    &origin=Clinton+MO
    &destination=306+NW+300+Rd,+Clinton,+MO+64735
    &mode=driving
  ```
- Store the key in `.env` as `PUBLIC_GOOGLE_MAPS_KEY` and reference it in the Astro template (public env vars are safe to embed in client-visible HTML since the key is restricted by domain)
- Add the key to Vercel environment variables for production

**Warning signs:**
- Replacing the existing embed src with a directions URL but forgetting the API key produces a "This page can't load Google Maps correctly" error in the iframe
- Key works locally but fails in production because it's not added to Vercel environment variables
- Key set without domain restriction exposes it to quota abuse

**Phase to address:**
v2.2 — Maps route phase. Create the API key before writing code. Document the key restriction settings in a comment in Map.astro.

---

### Pitfall 5: Replacing the Current Map Embed Breaks the Existing Lazy-Load Observer

**What goes wrong:**
Map.astro currently uses an Intersection Observer to lazy-load the iframe: the `src` is stored in `data-src` and only set when the element scrolls into view. Replacing or modifying the embed src without understanding this pattern causes the map to either load immediately on page load (defeating the lazy-load optimization) or never load at all (if the data-src swap is broken).

**Why it happens:**
The lazy-load script reads `iframe.dataset.src` and sets `iframe.src` on intersection. If you directly set the `src` attribute in the HTML (even to the new directions URL), the observer's `if (src) iframe.src = src` branch still works correctly — but if you accidentally leave `src` populated AND `data-src` populated, the iframe loads immediately AND the observer fires a duplicate load.

**How to avoid:**
Keep the existing lazy-load pattern. Only change the `data-src` value to the new directions URL:

```html
<!-- Keep data-src, leave src empty -->
<iframe
  id="maps-iframe"
  data-src="https://www.google.com/maps/embed/v1/directions?key=...&origin=...&destination=..."
  src=""
  ...
/>
```

Do not add a non-empty `src` attribute when using the lazy-load pattern. The existing observer script needs zero changes.

**Warning signs:**
- Map loads immediately on page load (check Network tab — maps requests visible on initial load, not on scroll)
- Lighthouse mobile score drops after the map change
- Observer script errors in console: `iframe.dataset.src` is undefined

**Phase to address:**
v2.2 — Maps route phase. Read the existing lazy-load script before modifying `Map.astro`. Verify map still lazy-loads after the change.

---

### Pitfall 6: Mobile Viewport Fixes Break Desktop Layout

**What goes wrong:**
When fixing mobile-specific layout issues (spacing, font sizes, hidden elements), developers apply classes or styles without viewport prefix specificity. The fix works on mobile but shifts or hides elements on desktop. Common patterns:
- Adding `overflow-x: hidden` on `body` or a parent to fix horizontal scroll on mobile — this clips `position: sticky` and `position: fixed` elements on desktop, causing the nav to stop sticking.
- Changing a padding or margin without the `sm:` prefix, shrinking the desktop layout.
- Setting `min-height: 100vh` to fix a short section on mobile — on iOS Safari with the dynamic browser chrome, `100vh` equals the maximum viewport height (with chrome collapsed), causing content overflow when the chrome is visible.

**Why it happens:**
Mobile-first Tailwind means unprefixed classes apply to all viewports. Developers testing only in DevTools device emulation miss real device behavior (especially iOS Safari's dynamic viewport chrome). The `overflow-x: hidden` fix is particularly insidious because it appears to solve the mobile scroll issue but breaks sticky positioning globally.

**How to avoid:**
- Never use `overflow: hidden` on `body` or any ancestor of a `position: sticky` element — this is the #1 cause of sticky nav breaking after mobile fixes.
- Use `overflow-x: hidden` on a non-ancestor wrapper element if needed, not on `body`.
- Use `min-h-svh` (small viewport height, `100svh`) instead of `min-h-screen` (`100vh`) for full-height mobile sections — `svh` accounts for the browser chrome.
- Apply ALL mobile-only fixes with explicit breakpoint prefixes: check each class added or removed for viewport scope.
- Test desktop (1280px) after every mobile fix in the browser, not just DevTools.

**Warning signs:**
- Fixed nav disappears or stops sticking after a mobile padding fix
- Horizontal scrollbar appears on desktop after overflow fix
- Sections that were full-height are now too short or too tall on desktop
- DevTools emulation looks correct but real iOS device shows different behavior

**Phase to address:**
v2.2 — Mobile viewport optimization phase. After each mobile fix, manually verify desktop at 1280px. Run Playwright desktop viewport test to catch regressions.

---

### Pitfall 7: The Mobile Header Text Fix Uses `hidden` Instead of `block` and Breaks at Wrong Breakpoint

**What goes wrong:**
The nav brand text currently uses `hidden sm:block` — invisible below 640px, visible at 640px and above. The fix to show the text in mobile adds `block` without removing `hidden`, or applies it at the wrong breakpoint. Specifically, if the mobile menu is also using the brand text as a heading, having it visible in both the main nav and the mobile menu overlay creates visual duplication or layout issues.

**Why it happens:**
The existing code is:
```html
<span class="font-serif text-2xl text-stone-800 ... hidden sm:block">Timber &amp; Threads</span>
```
Removing `hidden` makes it visible everywhere. But the mobile menu is a full-screen overlay and doesn't show the main nav header at all when open. The issue is specifically in the compact header (hamburger visible, logo visible, but no text) — the text should appear when the header is in compact mode but there's enough horizontal space.

The question is: should the text be visible at ALL mobile widths, or only at specific widths (sm: 375px–639px range)?

**How to avoid:**
The fix is simply to remove `hidden` from the brand text span, keeping `sm:block` (which becomes redundant but harmless). The brand text will then show on all widths. If the logo + text combination is too wide on very narrow phones (320px), add explicit truncation or reduce font size on mobile:
```html
<span class="font-serif text-lg sm:text-2xl text-stone-800 ...">Timber &amp; Threads</span>
```

Do NOT restructure the nav layout — the hamburger button already hides the desktop nav links on mobile, so the header row has space for logo + text + hamburger.

**Warning signs:**
- Brand text appears in both the sticky header AND the mobile overlay menu (visual duplication)
- At 320px width, brand text + logo overflows and pushes the hamburger button off-screen
- Text is visible at sm: but still hidden on mobile after the fix (wrong class removed)

**Phase to address:**
v2.2 — Mobile header fix. Simple change but test at 320px, 375px, and 640px widths explicitly.

---

### Pitfall 8: Playwright Screenshot Tests Are Flaky in CI Due to Font Rendering

**What goes wrong:**
Playwright's `toHaveScreenshot()` generates pixel-perfect baseline images on the machine where they're first run. When those baselines are generated on macOS (with sub-pixel antialiasing) and then compared in CI on Linux (without sub-pixel antialiasing), the screenshots never match. Tests fail 100% of the time in CI despite the page looking identical visually.

**Why it happens:**
Font rendering is OS-dependent. macOS uses sub-pixel antialiasing; most Linux distributions do not. Even identical font files render different pixel values at the subpixel level. Playwright's screenshot diff has a default threshold of 0.2 (20% pixel difference tolerance), but font antialiasing differences can exceed this threshold even for identical layouts.

**How to avoid:**
For this project, avoid `toHaveScreenshot()` pixel comparisons entirely — they are overkill for layout verification and introduce fragile OS dependencies. Instead:

**Use assertion-based viewport tests (HIGH confidence, zero flakiness):**
```ts
// playwright.config.ts
use: {
  baseURL: 'http://localhost:4321',
}

// tests/viewport.spec.ts
test('mobile nav shows hamburger not desktop links', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /open navigation/i })).toBeVisible();
  await expect(page.locator('ul.hidden.md\\:flex')).toBeHidden();
});

test('desktop nav shows links not hamburger', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /open navigation/i })).toBeHidden();
  await expect(page.locator('a[href="#contact"]').first()).toBeVisible();
});
```

If screenshot tests are truly needed, run them exclusively in a Playwright Docker container that matches CI's Linux environment, and generate baselines in that same container.

**Warning signs:**
- Tests pass locally but fail in CI with "screenshot diff exceeded threshold"
- Pixel differences are small (1-3px) and concentrated in text rendering
- `--update-snapshots` fixes tests locally but CI fails again after the next commit

**Phase to address:**
v2.2 — Playwright testing phase. Start with assertion-based tests. If screenshot tests are added later, document that baselines must be generated in the CI environment (Linux), not locally (macOS).

---

### Pitfall 9: Playwright Tests Against `npm run dev` Are Non-Deterministic

**What goes wrong:**
Running Playwright tests against the Vite dev server (`npm run dev`) introduces timing non-determinism. The dev server serves unoptimized files, applies hot-module replacement, and may be compiling components while tests run. Tests that rely on specific element visibility timing fail intermittently because the dev server can be slower than the test's default timeout on first load.

**Why it happens:**
Vite's dev server builds on-demand — the first request for a page triggers component compilation. If a test navigates to a page before compilation finishes, it may see a partially rendered state. `client:load` Preact islands have additional hydration latency in dev mode that doesn't exist in production.

**How to avoid:**
Run Playwright tests against the production build served locally:

```ts
// playwright.config.ts
webServer: {
  command: 'npm run build && npx serve dist',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
  timeout: 120 * 1000, // build can take 30-60s
}
```

This ensures tests run against the same artifact that ships to Vercel. Build once, run all tests against the output.

**Warning signs:**
- Tests pass on the second run but fail on the first (dev server compilation lag)
- Tests fail with timeout waiting for elements that are definitely in the DOM
- Calculator island renders correctly in browser but test can't find it

**Phase to address:**
v2.2 — Playwright setup. Configure `webServer` in `playwright.config.ts` to build before testing, not to use the dev server.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using `window.postMessage` for calculator-to-contact instead of CustomEvent | Familiar API | Requires origin matching, more complex than needed for same-page communication | Never for same-page same-origin communication |
| Hard-coding the Google Maps API key in the template string | No env setup needed | Key visible in git history, no domain restriction, quota abuse risk | Never — always use environment variable |
| Pixel-perfect screenshot baselines on macOS for CI on Linux | Visual regression coverage | 100% CI failure rate due to font rendering differences | Never without Docker normalization |
| Testing only in Chrome DevTools device emulation | Fast, no additional config | Misses real iOS Safari viewport chrome behavior, `position:sticky` edge cases | OK for development speed, not for final verification |
| Using `overflow-x: hidden` on `body` to fix mobile scroll | Fixes the immediate scrollbar | Breaks `position: sticky` and `position: fixed` elements globally | Never — scope overflow to specific elements |
| Using `toHaveScreenshot()` for all layout tests | Catches visual regressions | OS-dependent baselines, flaky in CI, high maintenance cost | Only when visual fidelity is the explicit requirement |

## Integration Gotchas

Common mistakes when connecting features to external services or other components.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Calculator → Contact pre-fill | Setting `setAttribute('value', ...)` instead of `.value = ...` | Always use DOM property assignment: `element.value = '...'` |
| Calculator → Contact scroll | Using `scrollIntoView()` without `scroll-margin-top` | Set `scroll-margin-top: 80px` on `#contact` section (matches nav height) |
| Maps Embed directions mode | Using share URL (`maps/embed?pb=...`) instead of API endpoint | Use `maps/embed/v1/directions?key=...` with explicit API key |
| Maps API key | Unrestricted key committed to git | Restrict by HTTP referrer to production domain; store in `.env` / Vercel env vars |
| Maps lazy-load + directions URL | Directly populating `src` attribute, bypassing observer | Keep existing `data-src` pattern; only change the URL value, not the pattern |
| Playwright + dev server | Running `playwright test` against `npm run dev` | Configure `webServer` to build and serve the production dist |
| Playwright viewports | Generating screenshot baselines on macOS | Generate on Linux (CI) or avoid pixel-diff tests entirely |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Synchronous scroll + pre-fill in the same click handler | Works fast locally, races on slow devices | Debounce or chain with `requestAnimationFrame` | First time on slow 3G Android |
| Maps directions iframe loading immediately (not lazy) | Adds 100+ HTTP requests on page load | Keep/verify lazy-load pattern from Map.astro | First mobile user on 3G |
| Running full Playwright suite on every commit | Slow CI pipeline | Scope tests to specific viewports; skip screenshot tests unless layout changed | When suite grows beyond ~20 tests |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Google Maps API key without HTTP referrer restriction | Key scraped from page source and used for quota abuse, unexpected billing | Set API key restriction to `https://timberandthreadsretreat.com/*` and `http://localhost:4321/*` |
| Maps API key committed to git | Key permanently exposed in git history even after removal | Store in `.env` (gitignored), use Vercel environment variables for production |
| Pre-filled calculator data in contact form includes user-manipulable estimates | No security risk (estimates are client-side only, no server trust) | Treat the pre-fill as a convenience hint, not authoritative data — always confirm pricing with customer |

## UX Pitfalls

Common user experience mistakes specific to these v2.2 features.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| "Get a Quote" scrolls to contact form but form is blank | Confusing — why did I get sent to an empty form? | Always pre-fill textarea with estimate summary before scrolling |
| Pre-fill overwrites message user already typed | Frustrating data loss — user was mid-compose | Check if textarea has existing content before pre-filling; only pre-fill if empty |
| Maps shows a route but the origin is wrong (city center, not highway turnoff) | Wrong directions confuse guests on rural roads | Use specific `origin` that matches the written directions (Highway 7 / NW 221 Road intersection) |
| Mobile header shows brand text but overflows at narrow widths | Text pushed off-screen or behind hamburger button | Test at 320px (narrowest common width); reduce font size or add truncation if needed |
| Calculator "Get a Quote" button looks like a submit button | User thinks it sends the form | Label clearly: "Get a Quote — Pre-fill Contact Form" or use a different visual treatment (secondary style) |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Calculator-to-Contact button:** Often missing the actual pre-fill — verify by clicking the button and confirming the textarea has content before the user types anything.
- [ ] **Contact form pre-fill:** Often missing validation pass-through — verify by clicking "Get a Quote," then immediately submitting without adding more text. Confirm the form submits (not rejected).
- [ ] **Scroll offset:** Often missing `scroll-margin-top` — verify by clicking "Get a Quote" and confirming the section heading is fully visible below the nav bar, not hidden behind it.
- [ ] **Maps directions URL:** Often missing the API key in Vercel env — verify by deploying to Vercel preview and confirming the map loads (not "This page can't load Google Maps correctly").
- [ ] **Maps lazy-load:** Often broken by URL change — verify by checking the Network tab on fresh load; maps requests should NOT appear until the user scrolls to the location section.
- [ ] **Mobile header text:** Often missing at 320px width — verify at the narrowest common viewport; text and hamburger should not overlap.
- [ ] **Mobile overflow fix:** Often breaks sticky nav — verify desktop at 1280px after any overflow-x change; nav should still stick on scroll.
- [ ] **Playwright tests:** Often only run locally — verify they pass in CI (GitHub Actions or equivalent) before signing off; font rendering in CI may differ from local.
- [ ] **API key restriction:** Often created but not restricted — verify in Google Cloud Console that the key has HTTP referrer restrictions set to the production domain.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Calculator pre-fill not crossing island boundary | LOW | Switch to CustomEvent pattern; add window listener in Contact.astro script |
| Pre-fill sets attribute not property, validation rejects | LOW | Change `setAttribute` to `.value =` assignment; retest full form submit flow |
| Scroll lands behind nav | LOW | Add `scroll-margin-top: 80px` to `#contact` section; no JS changes needed |
| Maps directions URL missing API key | LOW | Create key in Google Cloud Console (5 minutes); add to `.env` and Vercel; redeploy |
| Maps lazy-load broken by src change | LOW | Restore `data-src` pattern; clear `src` attribute; verify observer fires on scroll |
| Mobile fix broke desktop sticky nav | MEDIUM | Identify which `overflow` rule caused it; scope it to a non-ancestor element; retest |
| Playwright screenshot tests fail in CI | LOW | Delete screenshot baselines; switch to assertion-based tests; no pixel diffs |
| Playwright running against dev server | LOW | Add `webServer` config to `playwright.config.ts` to build before testing |
| Google Maps API key exposed in git | MEDIUM | Rotate the key immediately in Google Cloud Console; add new key to Vercel env; force-push scrub if necessary |

## Pitfall-to-Phase Mapping

How v2.2 roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Calculator state can't cross island boundary | Calculator-to-Contact phase | Click "Get a Quote" → confirm textarea pre-fills immediately |
| Pre-fill uses attribute not property | Calculator-to-Contact phase | Submit pre-filled form without edits → confirm delivery |
| Scroll offset hides heading behind nav | Calculator-to-Contact phase | Visual check: heading visible below nav after scroll |
| Maps directions requires API key | Maps route phase | Map loads in Vercel preview with route visible |
| Existing lazy-load broken by URL change | Maps route phase | Network tab: no maps requests on initial load |
| Mobile fix breaks desktop sticky nav | Mobile viewport phase | Desktop 1280px: nav sticks after mobile fixes applied |
| Mobile header text overflow at 320px | Mobile header phase | Manual test at 320px width |
| Playwright screenshot baselines flaky in CI | Playwright setup | CI pass rate 100% on first run (no flaky failures) |
| Playwright against dev server | Playwright setup | Tests configured to use production build via webServer config |

## Sources

### Official Documentation
- [Astro Docs: Share State Between Islands](https://docs.astro.build/en/recipes/sharing-state-islands/) — CustomEvent and Nano Stores approaches
- [Astro Docs: Share State Between Components](https://docs.astro.build/en/recipes/sharing-state/)
- [Google Maps Embed API: Embedding Maps](https://developers.google.com/maps/documentation/embed/embedding-map) — confirmed directions mode support and API key requirement
- [Google Maps Embed API: Usage and Billing](https://developers.google.com/maps/documentation/embed/usage-and-billing) — confirmed free, unlimited usage
- [Playwright Docs: Emulation](https://playwright.dev/docs/emulation) — viewport and device configuration
- [Playwright Docs: Visual Comparisons](https://playwright.dev/docs/test-snapshots) — screenshot testing and thresholds
- [New CSS Viewport Units (svh, lvh, dvh)](https://ishadeed.com/article/new-viewport-units/) — mobile viewport height fix

### Community Resources
- [BetterStack: 9 Playwright Best Practices](https://betterstack.com/community/guides/testing/playwright-best-practices/) — flaky test prevention
- [Playwright Flaky Tests — GitHub Issue #20097](https://github.com/microsoft/playwright/issues/20097) — font rendering OS differences
- [Why Playwright Visual Testing Doesn't Scale](https://argos-ci.com/blog/playwright-visual-testing-limits) — screenshot test limitations
- [Sharing State with Islands Architecture](https://frontendatscale.com/blog/islands-architecture-state/) — cross-island state patterns
- [Google Maps API Pricing 2025 Guide](https://nicolalazzari.ai/articles/understanding-google-maps-apis-a-comprehensive-guide-to-uses-and-costs)
- [CSS Tricks: The 100vh Mobile Problem](https://css-tricks.com/the-trick-to-viewport-units-on-mobile/) — sticky nav and overflow interaction

---

## Retained Pitfalls from v2.0–v2.1 (Still Applicable)

The following pitfalls from the original research remain relevant and should not be re-introduced:

| Pitfall | Status | Note |
|---------|--------|------|
| Over-hydration (`client:load` everywhere) | Avoid | Calculator uses `client:load` (correct); no new islands in v2.2 |
| Images in `public/` bypass optimization | Avoid | No new images expected in v2.2; use `src/assets/` if any added |
| Tailwind dynamic classes purged in production | Avoid | Any new conditional classes in calculator or nav must use complete strings |
| Google Maps iframe blocking main thread | Mitigated | Existing lazy-load pattern must be preserved through v2.2 changes |
| Form validation UX | Mitigated | Existing validation in Contact.astro works; pre-fill must integrate with it |
| Missing 3G throttle testing | Always apply | Test map lazy-load and calculator on Slow 3G before sign-off |

---
*Pitfalls research for: Astro static site, v2.2 Client Preview Polish features*
*Researched: 2026-03-02*
*Target: Rural Missouri audience (slow 3G/4G connections)*
*Stack: Astro 5, Preact island, Tailwind v4, Vercel, Google Maps Embed API, Playwright*
