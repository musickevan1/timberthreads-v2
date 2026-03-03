# Phase 9: Mobile Header and Pricing Cleanup - Research

**Researched:** 2026-03-02
**Domain:** Astro component markup / Tailwind v4 responsive utilities
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Mobile header brand text:**
- Remove `hidden sm:block` from the brand name span in Nav.astro
- Adjust font size to `text-xl sm:text-2xl` so text fits at narrow viewports
- Animated underline decoration can stay hidden on mobile (it's a hover effect, not content)
- Must not overflow at 320px or push the hamburger button off-screen at 375px

**Pricing card removal from Accommodations:**
- Remove the entire "Rate Card" block (the `mt-12` div with heading "Pricing", two tier cards, minimums text, and "Estimate Your Stay" CTA) from Accommodations.astro
- Replace with a brief one-line pricing mention that links to the pricing calculator section
- Mention only the per-person base rate ($60/night) — do not include the large group flat rate or meal option in the teaser
- The full pricing detail (both tiers, meals, minimums) lives exclusively in PricingSection.astro

### Claude's Discretion

- Exact styling of the pricing teaser line (inline text with link vs. small card — whichever fits the section's existing design)
- Whether the teaser includes the meal option alongside the base rate
- Exact wording of the pricing teaser and link text
- Logo-to-text gap spacing on mobile

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MOBL-01 | Mobile header displays "Timber & Threads" text title alongside logo | Nav.astro line 31: `hidden sm:block` on the brand span — remove that class, add responsive font sizing |
| PRIC-07 | Duplicate pricing tier cards removed from Accommodations section (kept in Pricing section only) | Accommodations.astro lines 124–150: the entire `<!-- Rate Card -->` div — confirmed it is a duplicate of PricingSection.astro lines 17–31 |
</phase_requirements>

---

## Summary

Phase 9 is two independent surgical edits to two Astro component files. No new dependencies, no new architecture, no JavaScript changes. The entire scope is Tailwind utility class adjustments (MOBL-01) and markup deletion with a one-line replacement (PRIC-07).

For MOBL-01, the exact problem is `hidden sm:block` on line 31 of `src/components/Nav.astro`. The brand name span is suppressed below the `sm` breakpoint (640px). Removing that pair and adding `text-xl sm:text-2xl` controls the font size across viewports. The animated underline div on line 32 retains `hidden sm:block` because it is a hover decoration, not content. The header uses `flex items-center justify-between` with `shrink-0` on the brand link — this means the brand text and hamburger button are flex siblings that will share the row naturally. The main risk is overflow at 320px; `text-xl` (20px) on a `font-serif` brand name of 16 characters needs verification that it fits with the 44px hamburger button in a flex row at the narrowest supported viewport.

For PRIC-07, the duplicate block is lines 124–150 in `src/components/Accommodations.astro`. The authoritative pricing detail is already fully present in `src/components/PricingSection.astro`. The decision is to replace the entire block with a single teaser line (mentioning $60/night base rate and linking to `#pricing-calculator`). The teaser lives inside the section's existing `max-w-7xl` container, below the two feature cards.

**Primary recommendation:** Two single-file edits. Edit Nav.astro (5-word class change). Delete 27-line block from Accommodations.astro and insert a 1–3 line teaser. Build and visually verify at 320px, 375px, and 1280px.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^5.17.1 | Component framework | Project foundation — all page sections are `.astro` files |
| Tailwind CSS | ^4.1.18 | Utility-class responsive styling | Project-wide styling system; breakpoints defined by Tailwind v4 defaults |

### Supporting

No additional libraries needed. Both edits are pure markup/class changes within existing components.

### Alternatives Considered

None applicable. The decisions are locked; no library choices are involved.

---

## Architecture Patterns

### Relevant Project Structure

```
src/
├── components/
│   ├── Nav.astro            # MOBL-01 edit target
│   └── Accommodations.astro # PRIC-07 edit target
├── components/
│   └── PricingSection.astro # Authoritative pricing content (read-only reference)
└── styles/
    └── global.css           # Tailwind v4 @theme with --color-brand, breakpoints
```

### Pattern 1: Tailwind v4 Responsive Utility Classes

**What:** Tailwind v4 uses the same mobile-first breakpoint prefix syntax as v3. `sm:` activates at 640px and above. `hidden sm:block` hides an element on mobile and shows it at sm+. To reveal on all viewports, remove `hidden sm:block` entirely (element becomes visible by default).

**When to use:** When removing a mobile-hide that was masking content.

**Example (the exact change for MOBL-01):**
```html
<!-- BEFORE (line 31-32, Nav.astro) -->
<span class="font-serif text-2xl text-stone-800 group-hover:text-brand transition-colors hidden sm:block">Timber &amp; Threads</span>
<div class="w-0 h-1 bg-brand group-hover:w-full transition-all duration-300 hidden sm:block"></div>

<!-- AFTER -->
<span class="font-serif text-xl sm:text-2xl text-stone-800 group-hover:text-brand transition-colors">Timber &amp; Threads</span>
<div class="w-0 h-1 bg-brand group-hover:w-full transition-all duration-300 hidden sm:block"></div>
```

The underline `div` retains `hidden sm:block` — it is a hover decoration and should remain desktop-only.

### Pattern 2: Flex Row at Narrow Viewports

**What:** The nav brand link is `flex items-center gap-2 shrink-0`. The brand link and hamburger button are flex siblings under `flex items-center justify-between` in the nav. With `shrink-0` on the brand link, the logo+text block will not shrink. The hamburger button is `w-11 h-11` (44px). At 320px viewport, the usable width after `px-4` padding (32px total) is 288px. The brand block at `text-xl` with "Timber & Threads" in Georgia serif must fit within approximately 200–230px.

**Verification needed:** Visual check at 320px. If text wraps or overflows, `text-lg sm:text-xl` is available as a fallback without changing the locked decision philosophy (the locked decision specifies `text-xl sm:text-2xl` — implement as decided and verify).

### Pattern 3: Inline Pricing Teaser (Discretionary)

**What:** The section already contains two feature cards in a grid. The teaser should sit below the grid, naturally in the flow of the section, using the same `text-stone-600` body style with an anchor styled with `text-brand hover:underline` to link to `#pricing-calculator`.

**Recommended approach (inline text — fits existing section design):**
```html
<p class="text-center text-stone-600 mt-8">
  Stays from <strong class="text-stone-800">$60/night per person</strong> — <a href="#pricing-calculator" class="text-brand hover:underline">see full pricing and estimate your stay</a>.
</p>
```

This matches the section's existing `text-stone-600` paragraph style, requires no new container, and avoids introducing a card-shaped element that would echo the removed rate cards.

### Anti-Patterns to Avoid

- **Removing both `hidden sm:block` classes from the brand div:** The underline div must stay hidden on mobile — it relies on `group-hover:w-full` which only applies on pointer devices. Keeping it hidden on mobile avoids a static 1px-tall zero-width decorative line rendering at the start of the element on touch screens.
- **Adding `overflow-hidden` to the nav to "fix" overflow:** This would clip the dropdown/mobile menu. Verify at 320px first — text-xl is likely fine; don't pre-emptively add overflow hiding.
- **Keeping any part of the Rate Card block:** The entire `<!-- Rate Card -->` div (lines 124–150, `mt-12` wrapper through closing `</div>`) must be deleted. Do not leave the CTA or the minimums line.
- **Hard-coding pricing numbers in the teaser:** The teaser should mention only $60/night. Do not repeat the large group rate or meal option in the teaser (locked decision).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive text hiding | Custom JS visibility toggle | Tailwind `hidden sm:block` / remove those classes | Tailwind handles all responsive breakpoints via CSS |
| Pricing link | Custom scroll behavior | Plain `<a href="#pricing-calculator">` | The section already has `scroll-behavior: smooth` on `html` from global.css |

---

## Common Pitfalls

### Pitfall 1: Removing Only One of the Two `hidden sm:block` Classes

**What goes wrong:** If both `hidden sm:block` instances are removed from the brand div wrapper, the animated underline bar becomes a static visible element on mobile — a 1px-tall line appearing below the brand text. It looks broken.

**Why it happens:** The two sibling elements (span and div) both have `hidden sm:block`. The intent is to show the span (brand text) on mobile but keep the decorative underline div hidden.

**How to avoid:** Remove `hidden sm:block` only from the `<span>` element. Leave it on the `<div class="w-0 h-1 bg-brand ...">`.

**Warning signs:** Mobile viewport shows a horizontal line artifact below the brand name.

### Pitfall 2: Partial Deletion of the Rate Card Block

**What goes wrong:** Leaving any element from the Rate Card block (the minimums `<p>`, the CTA `<a>`, or the outer `mt-12` wrapper) creates orphaned markup — stray padding, an empty section, or a dangling link.

**Why it happens:** The block spans lines 124–150 and has multiple nested divs. Counting closing tags under pressure is error-prone.

**How to avoid:** Delete from the opening comment `<!-- Rate Card -->` (line 124) through and including the closing `</div>` of the `mt-12` wrapper (line 150 — the same div that opens at line 125). Then insert the teaser paragraph immediately after line 122 (`</div>` that closes the `grid` div).

**Warning signs:** `astro build` produces no error but visual inspection shows extra whitespace or a ghost link below the feature cards.

### Pitfall 3: Viewport Overflow at 320px

**What goes wrong:** "Timber & Threads" in Georgia serif at `text-xl` (20px/1.25rem) is approximately 160–180px wide. The logo is 32px. The gap is 8px (gap-2). Total brand block: ~200–220px. At 320px minus 32px padding = 288px available. The hamburger button is 44px. Remaining for brand: 244px. This should be safe, but font rendering varies.

**Why it happens:** Georgia serif metrics differ from sans-serif; the ampersand character can be wider than expected.

**How to avoid:** After implementing, check at exactly 320px in browser DevTools. The CONTEXT.md explicitly calls out 320px and 375px as verification viewports.

**Warning signs:** Horizontal scrollbar at 320px, or the hamburger button being pushed to a second line (it can't — it's in a flex row — but it could be visually clipped by overflow).

---

## Code Examples

Verified from direct source inspection:

### MOBL-01: Exact diff for Nav.astro line 31

```html
<!-- REMOVE from span class attribute: "hidden sm:block" -->
<!-- ADD to span class attribute: "text-xl sm:text-2xl" (replacing "text-2xl") -->

<!-- Result: -->
<span class="font-serif text-xl sm:text-2xl text-stone-800 group-hover:text-brand transition-colors">Timber &amp; Threads</span>
<!-- line 32 unchanged: -->
<div class="w-0 h-1 bg-brand group-hover:w-full transition-all duration-300 hidden sm:block"></div>
```

### PRIC-07: Block to delete from Accommodations.astro

Lines 124–150 inclusive (starting after the closing `</div>` of the cards grid):

```html
    <!-- Rate Card -->
    <div class="mt-12 bg-white rounded-lg shadow-sm p-8 max-w-3xl mx-auto text-center">
      <h3 class="font-serif text-2xl text-stone-800 mb-6">Pricing</h3>
      <div class="grid sm:grid-cols-2 gap-6 mb-6">
        <!-- Standard tier -->
        <div class="bg-stone-50 rounded-lg p-6">
          <p class="font-serif text-lg text-stone-800 mb-2">Groups of 10 or fewer</p>
          <p class="text-3xl font-bold text-brand mb-1">$60<span class="text-base font-normal text-stone-500">/night</span></p>
          <p class="text-stone-600 text-base">per person, standard</p>
          <p class="text-stone-500 text-base mt-2">or $75/night per person with meals</p>
        </div>
        <!-- Large group tier -->
        <div class="bg-stone-50 rounded-lg p-6">
          <p class="font-serif text-lg text-stone-800 mb-2">Groups of 10&ndash;12</p>
          <p class="text-3xl font-bold text-brand mb-1">$600<span class="text-base font-normal text-stone-500">/night</span></p>
          <p class="text-stone-600 text-base">flat rate for the entire center</p>
          <p class="text-stone-500 text-base mt-2">+ $12.50/person/day for meals</p>
        </div>
      </div>
      <p class="text-stone-500 text-base mb-6">Minimum 4 persons &middot; Minimum 2-night stay</p>
      <a
        href="#pricing-calculator"
        class="inline-flex items-center px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors"
      >
        Estimate Your Stay
      </a>
    </div>
```

### PRIC-07: Replacement teaser to insert at line 123 position

```html
    <p class="text-center text-stone-600 mt-8">
      Stays from <strong class="text-stone-800">$60/night per person</strong> — <a href="#pricing-calculator" class="text-brand hover:underline">see full pricing and estimate your stay</a>.
    </p>
```

---

## State of the Art

No framework or library changes. Both edits use patterns established in this project's existing codebase.

| Concern | Current Approach | Status |
|---------|-----------------|--------|
| Responsive breakpoints | Tailwind v4 with mobile-first `sm:` prefix | Unchanged — project standard |
| Smooth scroll to anchor | `scroll-behavior: smooth` on `html` in global.css | Already implemented — teaser link benefits for free |
| Pricing source of truth | PricingSection.astro | Confirmed — contains both tier cards, minimums, and PricingCalculator island |

---

## Open Questions

1. **Will `text-xl` (Georgia serif) fit at exactly 320px?**
   - What we know: The nav is `flex items-center justify-between` with `px-4` padding; at 320px, the usable content width is 288px; the logo+gap+text block needs to share that space with the 44px hamburger button — leaving ~244px for brand.
   - What's unclear: Exact pixel width of "Timber & Threads" in Georgia serif at 20px/1.25rem varies by platform (Mac vs. Android vs. Windows web view).
   - Recommendation: Implement as decided (`text-xl sm:text-2xl`), then verify at 320px in DevTools. If it overflows, the fallback within the spirit of the decision is `text-lg sm:text-2xl` — but only use the fallback if overflow is confirmed.

2. **Does the teaser mention the meal option?**
   - What we know: Locked decision says mention only $60/night — "do not include the large group flat rate or meal option in the teaser." The CONTEXT.md Claude's Discretion section also lists "Whether the teaser includes the meal option alongside the base rate" as discretionary.
   - What's unclear: These two statements appear slightly contradictory — the locked decision says exclude meals from teaser; the discretion section lists it as open.
   - Recommendation: Honor the locked decision (no meal option in teaser). The discretion note likely refers to the link text wording, not reversing the locked exclusion. Teaser = `$60/night per person` only.

---

## Sources

### Primary (HIGH confidence)

- Direct source inspection: `src/components/Nav.astro` — brand span at line 31, exact classes identified
- Direct source inspection: `src/components/Accommodations.astro` — Rate Card block lines 124–150, confirmed full extent
- Direct source inspection: `src/components/PricingSection.astro` — confirmed authoritative pricing content present (lines 17–31 contain identical rate card data)
- Direct source inspection: `src/styles/global.css` — `scroll-behavior: smooth` on html confirmed; `--color-brand` defined as `#0D9488`
- Direct source inspection: `package.json` — Astro 5.17.1, Tailwind CSS 4.1.18, no test framework present

### Secondary (MEDIUM confidence)

None required — phase is pure markup editing with no library API surface.

### Tertiary (LOW confidence)

None.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — confirmed from package.json and existing source files
- Architecture: HIGH — edits are fully identified; exact line ranges confirmed from source inspection
- Pitfalls: HIGH — derived from direct reading of the actual markup and understanding of Tailwind responsive utilities

**Research date:** 2026-03-02
**Valid until:** Stable indefinitely — no external dependencies; only internal file changes
