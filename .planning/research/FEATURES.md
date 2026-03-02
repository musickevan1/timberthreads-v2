# Feature Research

**Domain:** Retreat Center / Small Business Hospitality Website (v2.2 Polish Milestone)
**Researched:** 2026-03-02
**Confidence:** HIGH (existing codebase inspected directly; patterns verified via official docs and NN/g research)

---

> **NOTE — Milestone scope:** This file was updated for the v2.2 Client Preview Polish milestone. It extends the original v2.0 landscape (2026-02-16) with feature-specific research on (1) calculator-to-contact pre-fill flows, (2) visual driving routes on a map, (3) mobile header text branding, and (4) Playwright viewport testing. Existing table stakes and differentiators from v2.0 are preserved below the v2.2 section.

---

## v2.2 Feature Research

### 1. Calculator-to-Contact Pre-Fill Flow

**Goal:** After the user adjusts the pricing calculator and sees their estimate, a "Get a Quote" button scrolls them to the contact form and pre-populates the message field with the calculated estimate details.

**How it works (standard pattern):**

The widely-used pattern for this interaction is:

1. The CTA button (e.g., "Get a Quote") lives in the calculator's breakdown panel, adjacent to the total estimate.
2. On click, the page smooth-scrolls to `#contact`.
3. A pre-built message string is injected into the `<textarea id="message">` field.
4. The user sees the form ready to send with their estimate already described — they only need to add name, email, and any additional notes.

**Message content to pre-fill:**

The message should include enough detail for the owner to confirm pricing without going back and forth:

```
I'm interested in booking a retreat for [N] guests over [N] nights[, with meals included].

Estimated cost: $[total]
  - Accommodation: $[amount]
  - Meals: $[amount] (if applicable)

Please reach out to confirm availability and finalize details.
```

**UX principles from NN/g research:**

- Show results immediately on the calculator — never gate them behind a form. Users are in exploration mode and will abandon if forced to register first. (Source: NN/g Recommendations for Calculator and Quiz Tools)
- The contact form pre-fill is an *optional next step* after results are already visible, not a prerequisite.
- Pre-filling shows the user their data was "remembered," reducing re-entry friction and increasing form completion rates.

**Implementation path (Preact → vanilla DOM):**

The existing `PricingCalculator.tsx` (Preact island) computes `total`, `accommodationCost`, `foodCost`, `groupSize`, `nights`, and `includeMeals`. The "Get a Quote" button should:

1. Compute the pre-fill string using those values.
2. Use `window.location.hash = '#contact'` or `document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })` for scroll.
3. Set `(document.getElementById('message') as HTMLTextAreaElement).value = messageString` to inject the message.

The contact form (`Contact.astro`) exposes `id="message"` as a plain `<textarea>`. No URL parameter passing needed — everything happens in-page via direct DOM access across the static/island boundary. This works because both elements exist in the same browser document.

**Constraint:** The calculator is a Preact island (`client:load`). The contact form is plain Astro HTML with a `<script>` block. Cross-island communication via custom events or direct DOM mutation from the Preact component both work on the same page — no special bus needed.

**Per-person breakdown (companion feature):**

Per the PROJECT.md requirements, the calculator also needs a per-person breakdown line shown under the total. For standard rate groups: `total / groupSize = per-person cost`. For flat-rate groups (10-12): `total / groupSize` gives the per-person share of the flat rate. This is a display-only addition to the breakdown panel, not a separate component.

---

### 2. Google Maps Visual Driving Route

**Goal:** Upgrade the existing map embed to show a visual route line from a recognizable origin point (e.g., Kansas City or Hwy 7 junction) to the retreat address, rather than just a pin.

**Two approaches investigated:**

#### Option A: Maps Embed API directions mode (RECOMMENDED)

The Google Maps Embed API `directions` mode displays a visual route line between an origin and destination on an interactive iframe map. It shows distance and travel time.

URL format:
```
https://www.google.com/maps/embed/v1/directions
  ?key=YOUR_API_KEY
  &origin=Kansas+City,+MO
  &destination=306+NW+300+Rd,+Clinton,+MO+64735
  &mode=driving
```

**Cost:** FREE. The Maps Embed API has unlimited usage at no charge. Billing must be enabled on the Google Cloud project to get an API key, but there are zero usage fees for the Embed API specifically.

**API key requirement:** YES — an API key is required for the `v1/directions` URL format. However, the key can be restricted to the production domain (`timberandthreadsretreat.com`) to prevent misuse. This is the standard Google recommendation for client-side embed keys.

**Existing embed:** The current Map.astro uses a keyless legacy embed URL (`https://www.google.com/maps/embed?pb=!1m18!...`). This legacy format is still supported but only shows a pin, not a route.

**Tradeoff:** Switching to directions mode requires a new Google Cloud project + restricted API key. This is a one-time 15-minute setup. The key goes in an environment variable; Vercel environment variables are free-tier compatible.

#### Option B: Google Maps share/embed iframe from directions URL (LOW confidence)

From Google Maps web UI, you can get directions from point A to point B and then use Share > Embed. This produces an iframe without an explicit `key` parameter. However, this URL format is undocumented, may break, and does not accept programmatic parameters. Not recommended for production.

#### Option C: Static route image (not viable without API key)

The Maps Static API (raster image, not interactive) also requires an API key and billing. No advantage over Option A for this use case. Excluded.

**Recommendation: Option A.** One-time API key setup. Free forever. Interactive route the user can zoom/pan. Consistent with existing lazy-load IntersectionObserver pattern already in Map.astro.

**Origin selection:** From Kansas City, MO (~90 min) is the most recognizable origin for the audience. Alternatively, "Hwy 7 & NW 221 Rd, Clinton, MO" would show only the local final miles matching the written directions. Kansas City is better for first-time visitors planning travel.

---

### 3. Mobile Header Text Branding

**Goal:** Show "Timber & Threads" text in the mobile header (currently hidden on small screens via `hidden sm:block`).

**Current state (Nav.astro):**

```html
<span class="font-serif text-2xl text-stone-800 ... hidden sm:block">Timber &amp; Threads</span>
<div class="w-0 h-1 bg-brand ... hidden sm:block"></div>
```

The logo image (`h-8 w-8`) is always visible. The text title and the brand underline are hidden below `sm` breakpoint (640px).

**Standard pattern:**

Responsive branding typically collapses to icon-only on very small screens (<360px) but preserves a text wordmark at typical mobile widths (375–430px). The 2026 pattern is a "responsive logo system" — full mark on desktop, simplified (icon + short name) on mobile.

At 375px (iPhone SE) with a hamburger button on the right, the header has roughly 280px of available width between logo and hamburger. The font-serif text at `text-xl` (not `text-2xl`) fits comfortably.

**Fix options:**

1. **Remove `hidden sm:block`, reduce font size on mobile:** Change to `text-xl sm:text-2xl` with no hidden class. The text shows on all screens. Works if the header has enough room.
2. **Show text below `sm`, hide underline animation:** Keep the title visible but drop the animated underline on mobile (it takes extra height). Show underline only `sm:block`.
3. **Responsive font scaling only:** Keep `hidden sm:block` but change `sm:` to something smaller, e.g., remove the hidden class entirely and rely on font size to keep it from overflowing.

**Recommended approach:** Remove `hidden sm:block` from the text span, change `text-2xl` to `text-xl sm:text-2xl`, keep the underline `hidden sm:block` (animation is a nice-to-have on desktop only). This keeps the header clean at all sizes without sacrificing brand clarity. Test at 375px and 320px viewports.

**Constraint:** The mobile hamburger is `w-11 h-11` at the right edge. The logo image is `h-8 w-8`. At 375px, the remaining space for the wordmark is approximately 260–280px — plenty for "Timber & Threads" at 20px serif.

---

### 4. Playwright Viewport Testing for Static Sites

**Goal:** Verify that all sections render correctly across desktop (1280px) and mobile (375px) viewport widths. Catch layout regressions introduced in v2.2.

**Playwright configuration approach:**

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4321', // Astro dev server port
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } },
    },
    {
      name: 'mobile-small',
      use: { viewport: { width: 375, height: 667 } }, // iPhone SE size
    },
  ],
});
```

**What to test for this milestone:**

| Check | Why |
|-------|-----|
| Mobile header shows "Timber & Threads" text | Core v2.2 requirement |
| Calculator "Get a Quote" button is visible and tappable (44px+) | Touch target requirement |
| Clicking "Get a Quote" scrolls to `#contact` and pre-fills message | Core v2.2 flow |
| Map iframe renders (or lazy-load placeholder visible) | Route embed check |
| No horizontal overflow at 375px | Common mobile regression |
| Pricing section shows rate cards, not duplicates | v2.2 cleanup requirement |

**Test type:** Functional E2E tests, not visual regression snapshots. Visual snapshots require locked CI OS/fonts and Docker to prevent pixel-level flakiness — overkill for a client preview milestone. Simple selector + visibility assertions are stable and sufficient.

**Astro-specific notes:**

- Astro dev server runs on port 4321 by default. Use `webServer` config in Playwright to auto-start it.
- Preact islands (`client:load`) hydrate after page load. Use `page.waitForSelector` or `page.waitForFunction` before asserting on calculator state.
- The contact form is plain HTML — no hydration delay, assertions work immediately.

**Recommended test file structure:**

```
tests/
  desktop.spec.ts  — desktop viewport checks
  mobile.spec.ts   — mobile viewport checks
  calculator-flow.spec.ts — calculator → contact form flow
```

---

## Feature Landscape (Original v2.0 — Preserved)

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Mobile-responsive design | 70%+ travelers browse on mobile | MEDIUM | Foundational; all v2.2 features must work at 375px |
| Professional photography | Visual proof of quality; first impression | LOW | Already shipped in v2.1 |
| Clear contact information | Users leave if contact info is hidden | LOW | Already present; enhanced by calculator-to-form flow |
| Location & directions | Essential for trip planning | LOW | Existing text directions; v2.2 adds visual route |
| Availability calendar | Transparency builds trust | MEDIUM | Already shipped (Google Calendar embed) |
| Pricing information | Hiding prices creates friction | LOW | Static rate cards already shipped |
| Room/facility details | Users need to visualize the space | LOW | Already shipped with v2.1 corrections |
| Photo gallery | Visual proof before committing | LOW-MEDIUM | Already shipped with PhotoSwipe |
| About/story section | Establishes trust | LOW | Already shipped |
| Contact form | Core inquiry workflow | LOW | Already shipped with Resend delivery |
| Fast load times | Rural 3G/4G audience | MEDIUM | Lighthouse 90+ already achieved |

### Differentiators (Competitive Advantage)

Features that set product apart. Not required, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Interactive pricing calculator | Lets groups self-serve estimate before calling | MEDIUM | Already shipped; v2.2 adds per-person breakdown + quote CTA |
| Calculator-to-contact pre-fill | Reduces friction from "I'm interested" to "send inquiry" | LOW | **v2.2 target feature** |
| Visual driving route on map | More intuitive than text directions for first-time visitors | LOW | **v2.2 target feature** (requires Maps Embed API key) |
| Per-person cost breakdown | Helps group organizers split costs | LOW | **v2.2 target feature** (addition to calculator) |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Gate calculator results behind email | Capture leads, grow list | NN/g research: users abandon and feel tricked; destroys trust | Show results freely, offer "Get a Quote" as an optional next step |
| Live driving directions (Directions API, not Embed) | Personalized routing from user's address | Requires JS SDK, billing risk if API key exposed, complex implementation | Embed API directions mode with fixed origin (Kansas City) is sufficient |
| Visual regression snapshot tests | Pixel-perfect CI verification | Requires Docker, locked OS fonts; high maintenance for a client preview | Functional selector-based assertions are stable and sufficient for this milestone |
| URL parameter pre-fill for contact form | Allows sharing pre-filled URLs | Adds complexity, exposes data in URL history, requires encoding | Direct DOM mutation from the Preact island is simpler and stays in-page |
| Online booking / payment system | Reduce phone inquiries | High complexity, PCI concerns, conflicts with personal-quote workflow | Contact form → owner responds with quote. Keeps personal touch |

## Feature Dependencies

```
Calculator (existing Preact island)
    └──enables──> Per-person breakdown (display addition)
    └──enables──> Get a Quote button (CTA in breakdown panel)
                      └──requires──> Contact form message field (id="message" exists)
                      └──triggers──> Scroll to #contact + DOM pre-fill

Maps Embed API directions mode
    └──requires──> Google Cloud API key (one-time setup, free tier)
    └──replaces──> Existing pin-only embed URL

Mobile header text
    └──requires──> CSS change only (remove hidden sm:block)
    └──conflicts-with──> Header overflow at very narrow screens (test at 375px)

Playwright tests
    └──requires──> All v2.2 features complete (tests verify them)
    └──requires──> Astro dev server running (webServer config)
    └──enhanced-by──> Preact hydration waits (waitForSelector)
```

### Dependency Notes

- **Calculator → Quote button:** The "Get a Quote" button must live inside the Preact island to access reactive state (`total`, `groupSize`, `nights`, `includeMeals`). It cannot be a static Astro button outside the island without a custom event system.
- **Maps API key:** The directions mode URL requires an API key even though usage is free. Key should be in an environment variable restricted to the production domain. This must be set up before Map.astro can switch to the new embed URL format.
- **Playwright tests last:** Testing validates all other v2.2 features are working. It should be the final step in the milestone, not a blocker for earlier features.
- **Mobile header has no dependencies:** Pure CSS change, can be done independently at any point.

## MVP Definition

### v2.2 Launch With

Minimum to ship client preview:

- [x] **Duplicate pricing cards removed** — Accommodations section cleaned up (already planned)
- [ ] **Per-person breakdown in calculator** — Addition to existing breakdown panel
- [ ] **"Get a Quote" button** — CTA in calculator breakdown; scrolls + pre-fills contact form message
- [ ] **Mobile header text** — "Timber & Threads" visible on mobile via CSS fix
- [ ] **Visual driving route on map** — Maps Embed API directions mode (requires API key setup)
- [ ] **Playwright viewport tests** — Desktop 1280px + mobile 375px verification

### Add After v2.2 (Future)

- [ ] **Testimonials section** — Social proof; triggered when client gathers 3+ written testimonials
- [ ] **Virtual tour video** — When promo video is edited and ready to swap into placeholder
- [ ] **Gallery image swap** — When client selects from new photography batch

### Out of Scope (Never)

- Online booking / payment processing
- Admin gallery management interface
- User accounts
- Live chat

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Per-person cost breakdown | MEDIUM | LOW (display only) | P1 |
| Get a Quote button + pre-fill | HIGH | LOW (DOM mutation, same page) | P1 |
| Mobile header text visible | MEDIUM | LOW (CSS change only) | P1 |
| Visual driving route (Maps Embed API) | MEDIUM | MEDIUM (API key setup + URL change) | P1 |
| Playwright viewport tests | HIGH (quality gate) | LOW-MEDIUM (config + 6 checks) | P1 |
| Testimonials section | HIGH | LOW | P2 |
| Video placeholder swap | HIGH | LOW (client must supply video) | P2 |

**Priority key:**
- P1: Required for v2.2 milestone / client preview
- P2: Next milestone candidate
- P3: Future consideration

## Sources

### Calculator-to-Form Pre-Fill
- [12 Design Recommendations for Calculator and Quiz Tools — NN/g](https://www.nngroup.com/articles/recommendations-calculator/) — HIGH confidence (official UX research)
- [How to Use URL Parameters to Pre-Fill Form Fields — Formaloo](https://www.formaloo.com/blog/how-to-use-url-parameters-to-pre-fill-form-fields) — MEDIUM confidence
- [Calculators and Quizzes: User Expectations — NN/g](https://www.nngroup.com/articles/calculator-expectations/) — HIGH confidence (official UX research)

### Google Maps Embed API
- [Embed a map — Maps Embed API — Google for Developers](https://developers.google.com/maps/documentation/embed/embedding-map) — HIGH confidence (official docs)
- [Maps Embed API Usage and Billing — Google for Developers](https://developers.google.com/maps/documentation/embed/usage-and-billing) — HIGH confidence (official docs)
- [Maps Embed API Directions Mode](https://developers.google.com/maps/documentation/embed/embedding-map#directions_mode) — HIGH confidence (official docs)

### Mobile Header / Responsive Branding
- [Responsive Logo: Why Your Business Needs a Responsive Logo in 2026 — Kirnanitechnologies](https://blog.kirnanitechnologies.com/responsive-logo-2026/) — MEDIUM confidence
- Direct codebase inspection of Nav.astro — HIGH confidence

### Playwright Viewport Testing
- [Playwright Emulation — playwright.dev](https://playwright.dev/docs/emulation) — HIGH confidence (official docs)
- [Configuration use options — playwright.dev](https://playwright.dev/docs/test-use-options) — HIGH confidence (official docs)
- [15 Best Practices for Playwright Testing in 2026 — BrowserStack](https://www.browserstack.com/guide/playwright-best-practices) — MEDIUM confidence

---
*Feature research for: Timber & Threads Quilting Retreat — v2.2 Client Preview Polish*
*Researched: 2026-03-02*
*Overall confidence: HIGH (official docs + direct codebase inspection + NN/g research)*
