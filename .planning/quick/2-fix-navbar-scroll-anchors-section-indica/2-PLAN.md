---
phase: quick-2
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/scripts/scroll-spy.js
  - src/styles/global.css
  - src/components/Nav.astro
  - tests/nav-scroll-spy.spec.ts
autonomous: true
requirements: [NAV-SCROLL, NAV-INDICATOR, NAV-MOBILE-INDICATOR]

must_haves:
  truths:
    - "Clicking any desktop nav link scrolls page so the target section heading is visible below the fixed header, not hidden behind it"
    - "The teal text + underline indicator on desktop nav accurately highlights the section currently visible in the viewport"
    - "The mobile fullscreen menu shows which section is currently active with teal text styling before and after clicking a link"
    - "Scroll-spy correctly transitions between all 8 sections without dead zones or flickering"
  artifacts:
    - path: "src/scripts/scroll-spy.js"
      provides: "Improved IntersectionObserver scroll-spy with fixed-header-aware rootMargin"
    - path: "src/components/Nav.astro"
      provides: "Mobile nav links with active-state styling matching desktop indicator"
    - path: "src/styles/global.css"
      provides: "scroll-padding-top on html for reliable anchor scrolling"
    - path: "tests/nav-scroll-spy.spec.ts"
      provides: "Playwright tests verifying scroll anchoring and active indicators"
  key_links:
    - from: "src/scripts/scroll-spy.js"
      to: "src/components/Nav.astro"
      via: "aria-current attribute on nav links"
      pattern: "aria-current.*true"
    - from: "src/styles/global.css"
      to: "src/components/Nav.astro"
      via: "scroll-padding-top aligning with header h-20 (5rem)"
      pattern: "scroll-padding-top"
---

<objective>
Fix navbar scroll anchor alignment, section indicator accuracy, and add mobile active-section indicator.

Purpose: The desktop section indicator (teal text + underline) does not reliably track the visible section, anchor clicks can land with the section heading hidden behind the fixed header, and the mobile menu has no active-section indicator at all. These polish issues hurt the professional feel of the site.

Output: Corrected scroll-spy logic, scroll-padding for anchor alignment, mobile active styling, and Playwright tests proving all fixes work.
</objective>

<execution_context>
@/home/evan/.claude/get-shit-done/workflows/execute-plan.md
@/home/evan/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/scripts/scroll-spy.js
@src/components/Nav.astro
@src/styles/global.css
@src/pages/index.astro
@tests/viewport.spec.ts
@playwright.config.ts

<interfaces>
<!-- Nav.astro structure -->
Desktop nav: `header > nav > ul > li > a[href^="#"][aria-current]` — styled via `[&[aria-current='true']]:text-brand [&[aria-current='true']]:border-b-2 [&[aria-current='true']]:border-brand`
Mobile nav: `#mobile-menu > nav > a.mobile-nav-link[href^="#"][aria-current]` — currently NO active-state styling
Header height: `h-20` (5rem / 80px), `fixed top-0`

<!-- scroll-spy.js -->
Selects: `section[id]` and `nav a[href^="#"]`
Uses IntersectionObserver with rootMargin: '-2% 0% -90% 0%'
Sets aria-current='true'/'false' on matching links

<!-- Section IDs (in page order) -->
home, about, retreats, accommodations, calendar, pricing-calculator, gallery, contact, location

<!-- Nav link hrefs (in nav order) -->
#home, #about, #retreats, #accommodations, #calendar, #gallery, #contact, #location
Note: pricing-calculator is NOT in the nav (intentional)

<!-- CSS -->
html { scroll-behavior: smooth; }
section[id] { scroll-margin-top: 5rem; }
Brand color: --color-brand: #0D9488
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix scroll-spy rootMargin, add scroll-padding-top, add mobile active styling</name>
  <files>
    src/scripts/scroll-spy.js
    src/styles/global.css
    src/components/Nav.astro
  </files>
  <action>
**1. Fix scroll-spy IntersectionObserver rootMargin (src/scripts/scroll-spy.js):**

The current rootMargin `-2% 0% -90% 0%` creates a narrow 8% detection band near the viewport top that doesn't account for the 80px fixed header. This causes:
- Sections not triggering as "active" when their heading is visible just below the header
- Dead zones between sections where no link is highlighted
- Flickering when scrolling slowly

Replace with a pixel-based rootMargin that accounts for the fixed header height:
- Top margin: `-80px` (negative of header height, so detection starts below the header)
- Bottom margin: `-60%` (so the active section is determined by which section occupies the top ~40% of the visible area below the header)
- Result: `rootMargin: '-80px 0px -60% 0px'`

Also improve the observer logic to handle the edge case where multiple sections can be intersecting simultaneously. Instead of updating on every `isIntersecting` entry independently (which causes flickering), collect the intersecting section that is closest to the top of the viewport:

```javascript
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

// Track which sections are currently intersecting
const activeSections = new Map();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSections.set(entry.target.id, entry.target);
      } else {
        activeSections.delete(entry.target.id);
      }
    });

    // Find the topmost intersecting section (closest to top of viewport)
    let activeId = null;
    let minTop = Infinity;
    activeSections.forEach((section, id) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < minTop) {
        minTop = rect.top;
        activeId = id;
      }
    });

    // Update all nav links
    navLinks.forEach((link) => {
      const isActive = activeId !== null && link.getAttribute('href') === `#${activeId}`;
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  },
  {
    // Start detection below the fixed header (80px).
    // Bottom margin leaves top 40% of visible area as the "active zone".
    rootMargin: '-80px 0px -60% 0px',
    threshold: 0,
  }
);

sections.forEach((section) => observer.observe(section));
```

**2. Add scroll-padding-top to html (src/styles/global.css):**

Add `scroll-padding-top: 5rem;` to the existing `html` rule (alongside `scroll-behavior: smooth`). This ensures that when the browser scrolls to an anchor (via click or URL hash), it accounts for the fixed header. This is more reliable than `scroll-margin-top` alone because it applies globally to the scroll container, not per-element. Keep the existing `scroll-margin-top: 5rem` on `section[id]` as a belt-and-suspenders approach.

**3. Add mobile nav active-state styling (src/components/Nav.astro):**

The mobile nav links in `#mobile-menu` currently have class `mobile-nav-link text-2xl font-serif text-stone-900 hover:text-brand py-3 px-8 transition-colors min-h-[56px] flex items-center` but NO `aria-current='true'` styling.

Add active-state styles to the mobile nav link class list using the same `[&[aria-current='true']]` pattern as desktop:
- `[&[aria-current='true']]:text-brand` — teal text color when active
- `[&[aria-current='true']]:font-semibold` — slightly bolder for emphasis on the large mobile text
- Do NOT add border-b-2 underline on mobile — it looks cluttered on the full-screen centered menu. Instead, the teal color + semibold is sufficient visual differentiation at this text size (text-2xl).

The updated mobile link class should be:
```
mobile-nav-link text-2xl font-serif text-stone-900 hover:text-brand py-3 px-8 transition-colors min-h-[56px] flex items-center [&[aria-current='true']]:text-brand [&[aria-current='true']]:font-semibold
```

**Important:** The scroll-spy already selects `nav a[href^="#"]` which matches both desktop and mobile links (both are inside `<nav>` elements), so the scroll-spy will set aria-current on mobile links too. No JS changes needed for mobile — only the CSS styling classes.
  </action>
  <verify>
    <automated>cd /home/evan/Projects/clients/timberandthreads-v2 && npx astro build 2>&1 | tail -5</automated>
  </verify>
  <done>
    - scroll-spy uses pixel-based rootMargin accounting for 80px header
    - scroll-spy tracks topmost intersecting section to prevent flickering
    - html has scroll-padding-top: 5rem for reliable anchor scrolling
    - Mobile nav links show teal text + semibold when active section matches
    - Build succeeds with no errors
  </done>
</task>

<task type="auto">
  <name>Task 2: Write Playwright tests verifying scroll anchoring and active indicators</name>
  <files>tests/nav-scroll-spy.spec.ts</files>
  <action>
Create `tests/nav-scroll-spy.spec.ts` with Playwright tests verifying all three fixes. The existing test infrastructure uses `playwright.config.ts` with three viewport projects (desktop-1280, mobile-375, mobile-320), baseURL `http://localhost:4321`, and a webServer that runs `npm run build && npm run preview`.

**Test 1: Desktop nav click scrolls section heading below header (desktop-1280 only)**
- Navigate to `/`
- Click the desktop nav link for "About" (`header nav a[href="#about"]`)
- Wait for smooth scroll to settle (use `page.waitForFunction` checking that `document.querySelector('#about').getBoundingClientRect().top` is between 0 and 100, with timeout 3000ms — the section top should be near viewport top but NOT negative, meaning not hidden behind header)
- Assert: `#about` section's `getBoundingClientRect().top` is >= 70 and <= 100 (accounting for 80px header + small tolerance). The section should land just below the header.
- Repeat for "Contact" (`#contact`) to verify it works for sections far down the page too.

**Test 2: Desktop scroll-spy highlights correct section (desktop-1280 only)**
- Navigate to `/`
- Scroll to `#accommodations` section using `page.locator('#accommodations').scrollIntoViewIfNeeded()`
- Wait 500ms for IntersectionObserver to fire
- Assert: `header nav a[href="#accommodations"]` has `aria-current="true"`
- Assert: all other desktop nav links have `aria-current="false"` (check at least `header nav a[href="#about"]` and `header nav a[href="#gallery"]`)

**Test 3: Desktop scroll-spy transitions cleanly between sections (desktop-1280 only)**
- Navigate to `/`
- Scroll to `#about`, wait 500ms, verify `a[href="#about"]` is active
- Scroll to `#gallery`, wait 500ms, verify `a[href="#gallery"]` is active and `a[href="#about"]` is NOT active
- This verifies no "stuck" indicators

**Test 4: Mobile menu shows active section indicator (mobile-375 only)**
- Navigate to `/`
- Scroll to `#retreats` section, wait 500ms for scroll-spy
- Open mobile menu by clicking `#hamburger-btn`
- Wait for `#mobile-menu` to be visible
- Assert: inside `#mobile-menu`, the link `a[href="#retreats"]` has `aria-current="true"`
- Assert: inside `#mobile-menu`, a different link like `a[href="#contact"]` has `aria-current="false"`

**Test 5: Mobile nav click scrolls correctly and closes menu (mobile-375 only)**
- Navigate to `/`
- Open mobile menu
- Click `a[href="#gallery"]` inside `#mobile-menu`
- Wait for menu to close (`#mobile-menu` should have class `hidden`)
- Wait for scroll to settle
- Assert: `#gallery` section's `getBoundingClientRect().top` is >= 70 and <= 100

Use `test.skip()` pattern from existing viewport.spec.ts for viewport-specific tests:
```typescript
if (testInfo.project.name !== 'desktop-1280') {
  test.skip();
}
```

For mobile tests:
```typescript
if (testInfo.project.name !== 'mobile-375') {
  test.skip();
}
```
  </action>
  <verify>
    <automated>cd /home/evan/Projects/clients/timberandthreads-v2 && npx playwright test tests/nav-scroll-spy.spec.ts --reporter=list 2>&1 | tail -30</automated>
  </verify>
  <done>
    - All 5 Playwright tests pass across the appropriate viewport projects
    - Desktop anchor scrolling lands sections below the fixed header
    - Desktop scroll-spy correctly highlights the active section
    - Desktop scroll-spy transitions cleanly between sections
    - Mobile menu displays active section with teal styling
    - Mobile nav click scrolls correctly and closes menu
  </done>
</task>

</tasks>

<verification>
1. `npx astro build` — no build errors
2. `npx playwright test tests/nav-scroll-spy.spec.ts --reporter=list` — all tests pass
3. `npx playwright test tests/viewport.spec.ts --reporter=list` — existing tests still pass (regression check)
</verification>

<success_criteria>
- Clicking any nav link (desktop or mobile) scrolls the page so the target section heading appears just below the 80px fixed header, never hidden behind it
- The desktop teal text + underline indicator accurately tracks whichever section occupies the top portion of the viewport while scrolling
- The mobile fullscreen menu shows the active section with teal text + semibold styling
- All new Playwright tests pass; all existing viewport tests still pass
</success_criteria>

<output>
After completion, create `.planning/quick/2-fix-navbar-scroll-anchors-section-indica/2-SUMMARY.md`
</output>
