# Phase 10: Calculator Per-Person Breakdown - Research

**Researched:** 2026-03-02
**Domain:** Preact component modification, UI display logic
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Single per-person total line (not itemized accommodation vs meals per person)
- Positioned directly below the "Estimated Total" inside the same divider block
- Include math context showing guest count, e.g. "Per person (6 guests): $180"
- Visually secondary to the total — smaller or lighter than the bold brand-colored total
- Same per-person treatment regardless of whether flat-rate pricing is active
- The existing amber callout banner already explains the pricing model — per-person line does not reference or repeat it
- No special treatment at the boundary (group size = 10) since the math is equivalent
- Combined per-person total only, consistent with the single-line decision

### Claude's Discretion

- Exact visual styling (font size, weight, color) for the per-person line — should feel secondary to the total but clearly readable
- Label wording ("Per Person", "Cost Per Person", "Per Guest", etc.) — pick what fits the existing tone
- Whether to include helper text like "Share with your group" — decide based on whether it adds value or clutter
- Animation/transition behavior when values change — match whatever the existing total does
- Rounding approach (round to nearest dollar, round up, or show cents) — pick what makes sense for group organizers communicating costs
- Whether to show a "(rounded)" note — decide based on whether rounding is noticeable
- Handling any math gap between (per-person × group) and the exact total — the estimate disclaimer covers this

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PRIC-08 | Calculator displays per-person price breakdown under the total estimate | Implemented by adding a `perPerson` derived value and a new JSX line inside the existing divider block in `PricingCalculator.tsx`. No new state, no new libraries. |
</phase_requirements>

## Summary

This phase adds a single derived display line to an existing Preact island component. The pricing calculator already computes `total`, `groupSize`, and all intermediate values. The per-person cost is `Math.round(total / groupSize)` (or `Math.ceil`) and is displayed as a second line inside the existing "Estimated Total" divider block — visually subordinate to the bold brand-colored total.

No new libraries, no new state, no new inputs are needed. The implementation is a localized edit to one file: `src/components/PricingCalculator.tsx`. The only design decisions left to Claude are: exact label wording, typography styling, rounding method, and whether to suppress the line when inputs are below minimums (CONTEXT says yes — it must not show when below constraint thresholds).

The existing `formatCurrency()` helper rounds to whole dollars already (`amount.toLocaleString()` with no fraction digits) and is the correct tool for the per-person value. Rounding the per-person amount to the nearest dollar is the right choice for group communication purposes — cents add noise.

**Primary recommendation:** Add a `perPerson` constant derived from `Math.round(total / groupSize)`, then render a secondary text line directly below the "Estimated Total" row inside the same divider `<div>`. Gate the entire per-person line on a `showBreakdown` boolean (inputs meeting minimums) — but since the sliders enforce minimums, this is already guaranteed by slider `min` values; no additional conditional is needed unless the spec requires explicit hiding at boundary.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Preact | (existing, via @astrojs/preact) | Component runtime | Already in project; calculator is a Preact island |
| TypeScript | (existing) | Type safety | Project uses TSX throughout |
| Tailwind v4 | (existing) | Styling | All component styles use Tailwind utility classes |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `Number.toLocaleString()` | built-in | Integer formatting | Already used in `formatCurrency()` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `Math.round(total / groupSize)` | `Math.ceil(total / groupSize)` | Ceil always rounds up (slightly conservative estimate favoring the organizer); round is mathematically neutral. Either is fine; round is standard. |
| Inline per-person calc | Extracted helper function | For a single line, inline is readable enough; only worth extracting if reused |

**Installation:**

No new packages required.

## Architecture Patterns

### Recommended Project Structure

No structural changes. This is a single-file edit:

```
src/components/
└── PricingCalculator.tsx   # Add perPerson constant + JSX display line
```

### Pattern 1: Derived Value (no new state)

**What:** Compute `perPerson` from already-available `total` and `groupSize` at render time. No `useState` or `useEffect` needed — it is a pure calculation like `accommodationCost`, `foodCost`, and `total`.

**When to use:** Any time a displayed value is a pure function of existing state.

**Example:**

```typescript
// Directly after the existing `total` calculation:
const perPerson = Math.round(total / groupSize);
```

This integrates into the existing calculation block pattern:

```typescript
// Pricing logic
const isFlatRate = groupSize > 10;
let accommodationCost: number;
let foodCost: number;
let total: number;

// ... existing calculation ...

const perPerson = Math.round(total / groupSize);
```

### Pattern 2: Subordinate Display Line in Existing Divider Block

**What:** Add the per-person line inside the existing `<div class="border-t border-stone-200 pt-3 mt-3">` block, below the Estimated Total row.

**When to use:** When a secondary metric belongs to the same visual grouping as the primary total.

**Example structure:**

```tsx
{/* Divider */}
<div class="border-t border-stone-200 pt-3 mt-3">
  <div class="flex justify-between items-center">
    <span class="font-serif text-lg text-stone-800">Estimated Total</span>
    <span class="text-2xl font-bold text-brand">{formatCurrency(total)}</span>
  </div>
  {/* Per-person line — new addition */}
  <div class="flex justify-between items-center mt-1">
    <span class="text-sm text-stone-500">Per person ({groupSize} guests)</span>
    <span class="text-sm font-medium text-stone-600">{formatCurrency(perPerson)}</span>
  </div>
</div>
```

The `text-sm text-stone-500/600` styling makes it clearly secondary to the `text-2xl font-bold text-brand` total. `mt-1` keeps it close to the total without visual separation.

### Pattern 3: Visibility Gating

**What:** The success criteria states the per-person line must not show when inputs are below minimum constraints (fewer than 4 persons or fewer than 2 nights).

**Assessment:** The sliders enforce `min={4}` and `min={2}` respectively — values below the minimum are unreachable through normal interaction. The initial state is `groupSize=6, nights=3`, both above minimums. Therefore the per-person line is always visible during normal use and no conditional is technically required.

**However:** The requirement says "not shown when below minimum constraints." Since the slider prevents going below the min, the safest reading is: show it whenever both constraints are met (which is always true given slider enforcement). A defensive guard adds zero user-visible behavior change but satisfies the letter of the requirement:

```tsx
const meetsMinimums = groupSize >= 4 && nights >= 2;
// ...
{meetsMinimums && (
  <div class="flex justify-between items-center mt-1">
    ...
  </div>
)}
```

This is a judgment call left to the planner — both approaches are valid. The simpler approach (no conditional, always shown) is equally correct given slider constraints.

### Anti-Patterns to Avoid

- **Adding new state for perPerson:** It is a derived value; `useState` would introduce stale-state bugs.
- **Using `toFixed(2)` for per-person display:** The CONTEXT.md and `formatCurrency` convention use whole dollar amounts. Showing cents adds noise for group communication.
- **Duplicating formatCurrency logic:** Always call the existing `formatCurrency()` helper.
- **Placing the line outside the divider block:** The decision specifies it belongs "directly below the Estimated Total inside the same divider block." Don't add a new section.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Integer currency formatting | Custom formatter | `formatCurrency()` (already in file) | Existing helper; consistency with all other line items |
| Rounding | Manual bit arithmetic | `Math.round()` | Standard, readable, correct |

**Key insight:** This phase is purely additive — one derived constant and one JSX block. No new libraries, no new abstractions needed.

## Common Pitfalls

### Pitfall 1: Division When groupSize Could Be Zero

**What goes wrong:** `total / groupSize` would produce `Infinity` or `NaN` if `groupSize` were 0.

**Why it happens:** Defensive coding gap.

**How to avoid:** Not a real risk here — the slider enforces `min={4}`, so `groupSize` is always >= 4 at render time. However if a guard is desired: `const perPerson = groupSize > 0 ? Math.round(total / groupSize) : 0;`

**Warning signs:** `Infinity` or `NaN` appearing in the display.

### Pitfall 2: Rounding Mismatch Communication

**What goes wrong:** If `total` is not evenly divisible by `groupSize`, the per-person × groupSize total will differ from the displayed total. The estimate disclaimer covers this, but it could confuse users.

**Why it happens:** Integer division.

**How to avoid:** The existing estimate disclaimer ("This is an estimate. Final pricing confirmed upon booking.") is sufficient per the CONTEXT.md decision. No additional note needed. Using `Math.round` (vs `Math.ceil`) minimizes the gap.

**Warning signs:** Groups of 11 at $600/night with meals will produce non-integer per-person amounts. The rounding is expected and covered by the disclaimer.

### Pitfall 3: Styling That Competes With the Total

**What goes wrong:** If per-person line is styled the same as or bolder than the total, it visually competes and de-emphasizes the primary number.

**Why it happens:** Copy-pasting the total row's classes.

**How to avoid:** Use `text-sm` (vs `text-2xl`) and `text-stone-500` or `text-stone-600` (vs `text-brand`) for the per-person line. The visual hierarchy must be clear.

### Pitfall 4: aria-live Region Already Covers This

**What goes wrong:** The breakdown panel has `aria-live="polite"` — no additional ARIA work needed for the per-person line.

**Why it happens:** Developers sometimes add redundant `aria-live` to child elements.

**How to avoid:** Do not add `aria-live` to the per-person line element. The parent panel's `aria-live="polite"` already announces all content changes within it.

## Code Examples

Verified from reading the actual source file `src/components/PricingCalculator.tsx`:

### Existing Calculation Block (lines 65-81)

```typescript
// Pricing logic
const isFlatRate = groupSize > 10;
let accommodationCost: number;
let foodCost: number;
let total: number;

const mealRate = isFlatRate ? 12.5 : 15;

if (!isFlatRate) {
  accommodationCost = 60 * groupSize * nights;
  foodCost = includeMeals ? mealRate * groupSize * nights : 0;
  total = accommodationCost + foodCost;
} else {
  accommodationCost = 600 * nights;
  foodCost = includeMeals ? mealRate * groupSize * nights : 0;
  total = accommodationCost + foodCost;
}

// ADD AFTER THIS BLOCK:
const perPerson = Math.round(total / groupSize);
```

### Existing Divider Block (lines 168-175) — Target Insertion Site

```tsx
{/* Divider */}
<div class="border-t border-stone-200 pt-3 mt-3">
  <div class="flex justify-between items-center">
    <span class="font-serif text-lg text-stone-800">Estimated Total</span>
    <span class="text-2xl font-bold text-brand">{formatCurrency(total)}</span>
  </div>
  {/* INSERT per-person line here */}
</div>
```

### formatCurrency Helper (line 4-6)

```typescript
function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}
```

`toLocaleString()` with no arguments returns whole integers as integers (e.g., `180` → `"180"`) and adds comma separators for thousands. This is the correct function for per-person amounts.

## State of the Art

No library version changes or external technology decisions are relevant to this phase. Everything is internal component editing.

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| N/A | Preact islands for interactive widgets | v2.0 Phase 1 | Calculator runs as Preact island; this edit stays within that model |

## Open Questions

1. **Defensive `meetsMinimums` guard vs. always-show**
   - What we know: Sliders enforce minimums so the guard has zero user-visible effect
   - What's unclear: Whether the success criteria "not shown when below minimum" demands explicit conditional code or trusts the slider enforcement
   - Recommendation: Add the explicit guard (`groupSize >= 4 && nights >= 2`) to satisfy the success criteria literally and for defensive correctness. Zero cost.

2. **Label wording**
   - What we know: CONTEXT says this is Claude's discretion; example given is "Per person (6 guests): $180"
   - What's unclear: Whether to use label-left/amount-right layout (matching other line items) or inline format like the CONTEXT example
   - Recommendation: Use left-label / right-amount layout (matching other rows) with label text `"Per person (N guests)"` — consistent with the breakdown panel's existing pattern.

## Sources

### Primary (HIGH confidence)

- Direct file read: `/home/evan/Projects/clients/timberandthreads-v2/src/components/PricingCalculator.tsx` — complete component source, all current styling classes, `formatCurrency` signature, state structure, existing divider block location
- Direct file read: `/home/evan/Projects/clients/timberandthreads-v2/src/styles/global.css` — Tailwind `@theme` block confirming `--color-brand: #0D9488` and `text-brand` utility availability
- Direct file read: `.planning/phases/10-calculator-per-person-breakdown/10-CONTEXT.md` — all locked decisions and discretion areas

### Secondary (MEDIUM confidence)

- Preact derived-value pattern (no `useState` for computed values) — standard React/Preact convention; `Math.round` for integer rounding is JavaScript built-in

### Tertiary (LOW confidence)

None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — entire implementation is within a file I have fully read
- Architecture: HIGH — insertion site and pattern are directly observable in the source
- Pitfalls: HIGH — derived from actual code (division risk, rounding gap, aria-live already present)

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (stable — no external libraries, pure component edit)
