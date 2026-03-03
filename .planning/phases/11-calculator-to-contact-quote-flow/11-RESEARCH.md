# Phase 11: Calculator-to-Contact Quote Flow - Research

**Researched:** 2026-03-02
**Domain:** Cross-island communication (Preact island → Astro static section), DOM pre-fill, smooth scroll, CSS animation
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Button Placement & Style**
- Button sits inside the breakdown panel, below the total/per-person line, above the disclaimer text
- Primary CTA styling: solid brand-color background, white text — same visual weight as "Send Message"
- Always visible from page load (calculator defaults of 6 guests / 3 nights produce a valid estimate)
- Button label: "Get a Quote"

**Pre-fill Message Format**
- Structured summary format with labeled lines, not a natural sentence
- Include both total and per-person cost
- Include a prompt line at the end encouraging the visitor to add dates/questions
- Only include meals line when meals toggle is on — mirror what the breakdown panel shows
- Example format:
  ```
  Group Size: 8 guests
  Nights: 3
  Meals: Included
  Estimated Total: $1,800 ($225/person)

  Please add your preferred dates or any questions below:

  ```

**Scroll & Arrival Experience**
- Smooth scroll animation to `#contact` section
- Brief highlight flash on the textarea (subtle brand-color border pulse, ~1 second fade) to draw attention to the pre-filled content
- Focus lands on the name field after scroll completes — message is already filled, visitor starts with contact info
- No URL hash change — avoid adding a history entry so back button works naturally

**Edge Cases & Draft Protection**
- If message field already has text, scroll to contact but do NOT overwrite — respect the visitor's draft (PRIC-10)
- On repeat clicks: if message still contains the exact previous pre-fill text (unedited), update it with new estimate; if visitor edited it, leave it alone
- Only include meals details when meals toggle is on; omit the line entirely when off

### Claude's Discretion

- Flat-rate note inclusion in pre-fill for groups of 10+
- Behavior when contact form is in success state (button visibility, scroll-only, etc.)
- Scroll timing/easing specifics
- Highlight flash animation implementation details

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PRIC-09 | "Get a Quote" button below calculator estimate scrolls to contact form | Implemented via `scrollIntoView({ behavior: 'smooth', block: 'start' })` on the `#contact` element; scroll-margin-top fix ensures heading clears the fixed nav |
| PRIC-10 | Contact form message field pre-filled with estimate details (group size, nights, meals, total) when arriving from calculator — only if message field is empty | Implemented via `CustomEvent` dispatched from PricingCalculator.tsx; listener in Contact.astro `<script>` reads `messageInput.value.trim()` before writing; DOM property assignment (`.value =`) updates the textarea without triggering validation |
</phase_requirements>

## Summary

This phase connects two existing, independently-built components: the Preact calculator island (`PricingCalculator.tsx`) and the Astro-native contact section (`Contact.astro`). The challenge is that these exist in different execution contexts — the calculator runs as a Preact island (client-hydrated), while the contact form lives in a plain `<script>` tag in an Astro component. They cannot directly import from each other.

The project has already established the correct pattern for this exact scenario: "Cross-island communication uses `CustomEvent` on `window`" (documented in STATE.md accumulated decisions). The calculator dispatches a `CustomEvent` with the estimate payload; a listener in `Contact.astro`'s script block receives it, pre-fills the textarea, scrolls to the section, adds a visual flash, and focuses the name field. This is a one-directional, one-time handoff — no shared state stores needed.

There is one pre-existing infrastructure issue to address: the global CSS sets `scroll-margin-top: 4rem` (64px) on all `section[id]` elements, but the fixed navigation bar has height `h-20` (80px / 5rem). This 16px mismatch means smooth scroll to `#contact` will place the section heading partially behind the nav bar. The fix is to increase `scroll-margin-top` to `5rem` globally (or specifically on `#contact`) — but this affects all sections and must be verified for visual correctness across the page.

**Primary recommendation:** Dispatch `CustomEvent('calculator:quote-requested')` with estimate data from the Preact island's button handler; add a `window.addEventListener` in Contact.astro's existing `<script>` block to receive it; fix `scroll-margin-top` from `4rem` to `5rem` (or add a one-off override on `#contact`); implement the flash animation with a CSS class + `setTimeout` for removal.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Preact | 10.28.4 (existing) | Calculator island runtime | Already in project; PricingCalculator.tsx is a Preact island |
| `window.CustomEvent` | Browser built-in | Cross-island communication | Project decision established in STATE.md; no additional libraries needed |
| `Element.scrollIntoView()` | Browser built-in | Smooth scroll to `#contact` | Native, no history entry added, works with `scroll-behavior: smooth` already set on `html` |
| CSS `@keyframes` + transition | Browser built-in | Textarea highlight flash | No library needed for a ~1s single-use animation |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| None | N/A | N/A | This phase requires zero new npm packages |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `CustomEvent` | nanostores | CustomEvent is simpler and project has already decided against nanostores for this use case (STATE.md: "one-directional, one-time handoff is sufficient") |
| `scrollIntoView` | `window.scrollTo` with offset calculation | `scrollIntoView` + CSS `scroll-margin-top` is cleaner; `scrollTo` requires manual offset arithmetic that breaks if nav height changes |
| CSS class flash | Web Animations API / GSAP | CSS keyframe is sufficient for ~1s single-use; no external library justified |
| Inline style for flash | Tailwind class toggle | Both work; inline style avoids Tailwind purge concerns for dynamically-added classes |

**Installation:** No new packages required.

## Architecture Patterns

### Recommended Project Structure

```
src/components/
├── PricingCalculator.tsx   # Add "Get a Quote" button + handleGetQuote() + CustomEvent dispatch
└── Contact.astro           # Add window.addEventListener for 'calculator:quote-requested'
src/styles/
└── global.css              # Fix scroll-margin-top from 4rem to 5rem
```

Only two component files and one style file require modification.

### Pattern 1: Cross-Island Communication via CustomEvent (Project Standard)

**What:** The Preact island dispatches a typed `CustomEvent` on `window`; the Astro `<script>` block listens on `window`. This is the established project pattern for Preact-to-static communication.

**When to use:** Any time a Preact island needs to trigger behavior in a static Astro section. The project already decided this is the correct approach (STATE.md).

**Example — Dispatcher (in PricingCalculator.tsx):**

```typescript
function handleGetQuote() {
  window.dispatchEvent(
    new CustomEvent('calculator:quote-requested', {
      detail: {
        groupSize,
        nights,
        includeMeals,
        total,
        perPerson,
        isFlatRate,
      },
    })
  );
}
```

**Example — Listener (in Contact.astro `<script>`):**

```typescript
window.addEventListener('calculator:quote-requested', (e: Event) => {
  const evt = e as CustomEvent<QuoteDetail>;
  const { groupSize, nights, includeMeals, total, perPerson, isFlatRate } = evt.detail;
  // ... pre-fill and scroll logic
});
```

**Important:** TypeScript requires casting `Event` to `CustomEvent<T>` because `addEventListener` overloads do not know the event type for custom event names. Cast is safe — the event only comes from the calculator's dispatch.

### Pattern 2: DOM Pre-fill via Property Assignment

**What:** Set `messageInput.value = prefilledText` (DOM property, not `.setAttribute('value', ...)`) to update the textarea content. Property assignment updates the live DOM value; `setAttribute` only changes the HTML attribute (initial value) and won't affect a textarea that has already rendered.

**When to use:** Pre-filling any existing textarea or input after page load.

**Draft protection logic:**

```typescript
// Only pre-fill if message field is empty
if (messageInput.value.trim() === '') {
  messageInput.value = buildPrefilledMessage(evt.detail);
} else if (messageInput.value.trim() === lastPrefilledMessage) {
  // Visitor hasn't edited the previous pre-fill — update it with new estimate
  messageInput.value = buildPrefilledMessage(evt.detail);
}
// Otherwise: visitor has typed something custom — leave it alone
lastPrefilledMessage = buildPrefilledMessage(evt.detail);
```

**Note on `lastPrefilledMessage`:** A module-scoped variable (in the `<script>` block) stores the last pre-filled text to enable the repeat-click update behavior. This is a plain `let` variable — no state library needed.

### Pattern 3: Smooth Scroll Without Hash Change

**What:** Use `element.scrollIntoView({ behavior: 'smooth', block: 'start' })` rather than setting `window.location.hash = '#contact'`. Hash change adds a browser history entry (breaks back button) and triggers `hashchange` events that may interfere with the scroll-spy.

**When to use:** Any programmatic scroll that should not pollute browser history.

**Example:**

```typescript
const contactSection = document.getElementById('contact');
contactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
```

The `scroll-behavior: smooth` on `html` (already in `global.css`) cooperates with `scrollIntoView({ behavior: 'smooth' })`. Both are needed for full cross-browser smooth scroll support.

### Pattern 4: Scroll-Margin-Top Fix

**What:** The fixed nav is `h-20` (5rem / 80px). The current global `scroll-margin-top: 4rem` on `section[id]` leaves a 16px gap where the heading is obscured behind the nav when scrollIntoView fires.

**Current state (global.css line 61):**
```css
section[id] {
  scroll-margin-top: 4rem;
}
```

**Fix — Option A (change global rule to match nav height):**
```css
section[id] {
  scroll-margin-top: 5rem;  /* matches h-20 nav exactly */
}
```

**Fix — Option B (add extra buffer for visual breathing room):**
```css
section[id] {
  scroll-margin-top: 5.5rem;  /* nav (5rem) + 0.5rem breathing room */
}
```

**Recommendation:** Update the global rule to `5rem`. This matches the actual nav height and is the minimum required for the heading to be fully visible. An additional `0.5rem` buffer (5.5rem total) would ensure comfortable visual separation. The STATE.md blockers section already calls this out: "check computed styles before adding to avoid duplication" — the fix is to correct the existing value, not add a new rule.

**Impact:** Changing this global rule affects all section scroll targets (Home, About, Retreats, Accommodations, Calendar, Gallery, Contact, Location). All sections are currently under-scrolling by 16px. Correcting this is a net improvement across the entire site.

### Pattern 5: Textarea Highlight Flash

**What:** A brief CSS animation on the textarea border (brand color pulse) signals to the visitor that content has been pre-filled. Implemented by temporarily adding a CSS class that applies a keyframe animation, then removing it after ~1 second.

**Approach — CSS keyframe (add to global.css):**

```css
@keyframes quote-highlight {
  0%   { border-color: var(--color-brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 20%, transparent); }
  70%  { border-color: var(--color-brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 20%, transparent); }
  100% { border-color: #d6d3d1; box-shadow: none; }  /* stone-300, the default border */
}

.quote-highlight {
  animation: quote-highlight 1s ease-out forwards;
}
```

**Approach — JS to add/remove class:**

```typescript
messageInput.classList.add('quote-highlight');
// Remove after animation completes to allow re-triggering on repeat clicks
messageInput.addEventListener('animationend', () => {
  messageInput.classList.remove('quote-highlight');
}, { once: true });
```

Using `animationend` with `{ once: true }` is more reliable than `setTimeout(1000)` because it fires exactly when the animation finishes regardless of tab visibility or system performance.

**Alternative (inline style approach):** Directly manipulate `messageInput.style` properties to avoid any Tailwind purge concerns with dynamically-added class names. Either approach is fine; the CSS class approach is cleaner.

### Pattern 6: Focus Management After Scroll

**What:** After scrollIntoView completes, focus the name field (not the textarea). The message is already filled; the visitor's next logical action is entering their name and email.

**Timing issue:** `scrollIntoView` is asynchronous in smooth scroll mode — there is no native completion callback. `setTimeout` is the established workaround.

```typescript
contactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
setTimeout(() => {
  nameInput?.focus();
}, 600);  // ~600ms covers typical smooth scroll duration
```

**Note:** 600ms is a commonly used value for this pattern. If the scroll animation takes longer on slow devices, focus fires slightly early (acceptable — focus still lands on the correct element; the user may just be mid-scroll). The CONTEXT.md leaves "scroll timing/easing specifics" to Claude's discretion.

### Pattern 7: Pre-fill Message Builder

**What:** A pure function that takes estimate values and returns the formatted string. Keeping it separate from the event handler makes it testable and reusable (needed for the repeat-click comparison).

**Example:**

```typescript
function buildPrefilledMessage(detail: {
  groupSize: number;
  nights: number;
  includeMeals: boolean;
  total: number;
  perPerson: number;
  isFlatRate: boolean;
}): string {
  const { groupSize, nights, includeMeals, total, perPerson } = detail;
  const lines: string[] = [];
  lines.push(`Group Size: ${groupSize} guest${groupSize !== 1 ? 's' : ''}`);
  lines.push(`Nights: ${nights}`);
  if (includeMeals) {
    lines.push('Meals: Included');
  }
  lines.push(`Estimated Total: $${total.toLocaleString()} ($${perPerson.toLocaleString()}/person)`);
  lines.push('');
  lines.push('Please add your preferred dates or any questions below:');
  lines.push('');
  return lines.join('\n');
}
```

**Note on trailing newline:** The CONTEXT.md example format ends with a blank line after the prompt sentence. This is intentional — it positions the cursor below the pre-filled content so the visitor can type naturally without first pressing Enter.

### Anti-Patterns to Avoid

- **Using `window.location.hash = '#contact'`:** Adds history entry, triggers scroll-spy resets, breaks back button. Use `scrollIntoView` instead.
- **Using `setAttribute('value', text)` on textarea:** Only sets initial HTML attribute, not the live DOM value. Use `.value =` (property assignment).
- **Importing Contact.astro into PricingCalculator.tsx:** Astro components cannot be imported into Preact islands. Use CustomEvent for communication.
- **Using nanostores or other shared state:** Project decision in STATE.md explicitly chose CustomEvent over nanostores for this one-directional handoff.
- **Adding `aria-live` to the textarea:** Not needed; the pre-fill happens synchronously with user-initiated action (button click). Screen readers will announce focus change to the name field.
- **Setting `window.location.hash` to avoid re-implementing scroll:** Hash change causes scroll-spy to update nav active state incorrectly mid-scroll.
- **Overwriting visitor draft without checking:** PRIC-10 explicitly requires checking `messageInput.value.trim() === ''` before pre-filling.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-island communication | Custom event bus, nanostores, React context | `window.CustomEvent` | Project decision; one-directional handoff needs no state store |
| Smooth scroll | Manual `requestAnimationFrame` scroll loop | `scrollIntoView({ behavior: 'smooth' })` + `scroll-margin-top` CSS | Native, accessible, respects `prefers-reduced-motion` media query |
| Pre-fill animation | Third-party animation library | CSS `@keyframes` + class toggle | 1-second single-use animation needs no library |

**Key insight:** Every sub-problem in this phase has a native browser solution. No npm installs needed.

## Common Pitfalls

### Pitfall 1: scroll-margin-top Mismatch (Already Known Risk)

**What goes wrong:** The `#contact` section heading scrolls to a position 16px behind the fixed nav, leaving it partially obscured. Success criterion 2 explicitly requires "section heading fully visible below the fixed navigation bar."

**Why it happens:** The global rule is `4rem` (64px) but the nav is `h-20` (80px). This is a pre-existing bug across all sections on the site, not specific to this phase.

**How to avoid:** Update `section[id] { scroll-margin-top: 4rem }` to `5rem` (or `5.5rem` for breathing room) in `global.css`. Verify all nav anchor links still scroll correctly after the change.

**Warning signs:** After clicking "Get a Quote", the "Get in Touch" heading is partially obscured by the nav bar.

### Pitfall 2: Smooth Scroll + Focus Timing Race

**What goes wrong:** Calling `nameInput.focus()` immediately after `scrollIntoView()` can fire focus before scroll completes, causing the browser to interrupt the smooth scroll animation and jump to the focused element.

**Why it happens:** `scrollIntoView` starts an animation but returns synchronously. The browser's smooth scroll and focus management can conflict.

**How to avoid:** Delay focus by ~600ms using `setTimeout`. The CONTEXT.md calls out "scroll timing/easing specifics" as Claude's discretion — 600ms is a reasonable value for this pattern.

**Warning signs:** Page jumps or jerks instead of smoothly scrolling; focus appears to land before scroll completes.

### Pitfall 3: TypeScript Error on CustomEvent in Contact.astro Script

**What goes wrong:** `window.addEventListener('calculator:quote-requested', handler)` — TypeScript does not know the event type for custom event names and infers `Event` (not `CustomEvent<T>`), making `e.detail` inaccessible.

**Why it happens:** TypeScript's `WindowEventMap` only includes built-in event types. Custom event names fall through to the `Event` overload.

**How to avoid:** Cast the event parameter: `(e as CustomEvent<QuotePayload>).detail`. The cast is safe because the event can only come from the calculator's dispatch.

**Warning signs:** TypeScript error: "Property 'detail' does not exist on type 'Event'."

### Pitfall 4: animationend Not Firing on Hidden Tabs

**What goes wrong:** If the user clicks "Get a Quote" while the tab is hidden (background tab), CSS animations may be paused by the browser. `animationend` fires when the animation actually completes, which may be delayed.

**Why it happens:** Browser throttles background tab animations.

**How to avoid:** This is an edge case that doesn't warrant special handling — the animation is a non-critical visual enhancement. If `animationend` fires late, the class simply stays on a bit longer. Acceptable.

### Pitfall 5: Repeat-Click Draft Protection Logic

**What goes wrong:** On the second "Get a Quote" click, if the visitor has edited the pre-filled message, the message should NOT be overwritten. The logic for this requires storing the last pre-filled string to compare.

**Why it happens:** Without storing the previous pre-fill, there is no way to distinguish "visitor kept the pre-fill unchanged" from "visitor edited it."

**How to avoid:** Use a module-scoped variable `let lastPrefilledMessage = ''` in the Contact.astro script block. After pre-filling, store the text. On subsequent clicks, compare `messageInput.value.trim() === lastPrefilledMessage.trim()` — if equal, the visitor hasn't edited it and it is safe to update.

### Pitfall 6: Contact Form Success State

**What goes wrong:** The contact form hides itself on successful submission (`form.classList.add('hidden')`). If a visitor clicks "Get a Quote" after having already submitted the form, the contact section will scroll into view but show only the success message — no form to pre-fill.

**Why it happens:** The success state replaces the form with a success message div; the form is hidden.

**How to avoid:** This is left to Claude's discretion per CONTEXT.md. Recommended behavior: scroll to `#contact` regardless, but skip pre-fill if the form is hidden (i.e., `form.classList.contains('hidden')`). The visitor sees the success confirmation and knows they've already contacted the retreat.

```typescript
const form = document.getElementById('contact-form') as HTMLFormElement;
if (form && !form.classList.contains('hidden')) {
  // pre-fill logic
}
// scroll always happens
```

## Code Examples

Verified patterns from direct source file reads:

### Existing Calculation Variables (PricingCalculator.tsx lines 60-83)

```typescript
const [groupSize, setGroupSize] = useState(6);
const [nights, setNights] = useState(3);
const [includeMeals, setIncludeMeals] = useState(false);

const isFlatRate = groupSize > 10;
// ... calculation ...
const perPerson = Math.round(total / groupSize);
```

All five values needed for the pre-fill message are already available as Preact state or derived constants. No new state variables needed.

### Button Insertion Point in PricingCalculator.tsx

The button goes **between** the per-person line and the disclaimer. Current structure (lines 176-188):

```tsx
{/* Divider */}
<div class="border-t border-stone-200 pt-3 mt-3">
  <div class="flex justify-between items-center">
    <span class="font-serif text-lg text-stone-800">Estimated Total</span>
    <span class="text-2xl font-bold text-brand">{formatCurrency(total)}</span>
  </div>
  <div class="flex justify-between items-center mt-1">
    <span class="text-sm text-stone-500">Per person ({groupSize} guests)</span>
    <span class="text-sm font-medium text-stone-600">{formatCurrency(perPerson)}</span>
  </div>
</div>

{/* ← "Get a Quote" button goes HERE */}

{/* Disclaimer */}
<p class="text-base text-stone-400 mt-6 pt-4 border-t border-stone-100">
  This is an estimate. Final pricing confirmed upon booking.
</p>
```

The breakdown panel uses `flex flex-col` on its container — button and disclaimer stack naturally.

### "Get a Quote" Button (Preact TSX)

```tsx
<button
  type="button"
  onClick={handleGetQuote}
  class="w-full mt-6 px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
>
  Get a Quote
</button>
```

Matches the visual weight of the "Send Message" button in Contact.astro (which uses `px-8 py-4 bg-brand text-white rounded-lg font-medium`). Uses `w-full` to span the panel width.

### Existing Contact.astro Script Structure

The existing `<script>` block in Contact.astro (lines 203-322) already has:
- `const messageInput = document.getElementById('message') as HTMLTextAreaElement;`
- `const nameInput = document.getElementById('name') as HTMLInputElement;`
- `const form = document.getElementById('contact-form') as HTMLFormElement;`

The listener for `calculator:quote-requested` can be appended at the bottom of this same script block, reusing these already-declared references. No new `<script>` tag needed.

### Existing scroll-margin-top Rule (global.css line 60-62)

```css
section[id] {
  scroll-margin-top: 4rem;  /* current — under-scrolls by 16px (nav is 5rem/80px) */
}
```

Fix: change `4rem` to `5rem` (exact nav height) or `5.5rem` (nav + 8px breathing room).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hash-based cross-component communication | `CustomEvent` on `window` | Established in v2.2 | No history pollution, no URL side effects |
| `scrollTo` with manual offset | `scrollIntoView` + `scroll-margin-top` | Modern CSS standard | Declarative, maintenance-free when nav height changes |
| Direct component imports | Event bus / CustomEvent | Astro architecture | Required because Preact islands and Astro scripts have separate scopes |

**No deprecated patterns in use.**

## Open Questions

1. **Flat-rate note in pre-fill for groups of 10+**
   - What we know: CONTEXT.md lists this as Claude's discretion
   - What's unclear: Whether adding "Pricing: Flat rate ($600/night)" to the pre-fill helps the host understand the visitor's context
   - Recommendation: Include it when `isFlatRate` is true, as a note between the group size and total. Mirrors the amber callout in the breakdown panel. Example: `"Pricing: Flat rate for 10-12 guests"` on its own line.

2. **Button behavior when form is in success state**
   - What we know: After form submission, `form.classList.add('hidden')` and `successMsg.classList.remove('hidden')`. The form DOM is hidden, not destroyed.
   - What's unclear: Whether to show/hide or disable the "Get a Quote" button when the form is in success state
   - Recommendation: Keep the button visible and functional. On click: scroll to `#contact` (visitor sees their success confirmation), but skip pre-fill since the form is hidden. No need to disable the button — the visitor may have submitted in a separate session or may simply want to scroll to the contact section.

3. **`scroll-margin-top` global change scope**
   - What we know: Changing `4rem` to `5rem` (or `5.5rem`) affects all 8 nav-linked sections. The current under-scroll of 16px is a pre-existing bug.
   - What's unclear: Whether the planner wants to fix this globally (correct approach) or apply a one-off rule to `#contact` only (minimal-impact approach)
   - Recommendation: Fix globally. All sections currently under-scroll by 16px when reached via the fixed nav. This is a legitimate bug fix that improves the whole site, not a scope expansion.

## Sources

### Primary (HIGH confidence)

- Direct file read: `/home/evan/Projects/clients/timberandthreads-v2/src/components/PricingCalculator.tsx` — full component source; all state variables, derived values, JSX structure, insertion point for button
- Direct file read: `/home/evan/Projects/clients/timberandthreads-v2/src/components/Contact.astro` — full component source; existing DOM element references in `<script>`, form success state behavior, textarea id
- Direct file read: `/home/evan/Projects/clients/timberandthreads-v2/src/styles/global.css` — confirmed `scroll-margin-top: 4rem` at line 61, `scroll-behavior: smooth` at line 57
- Direct file read: `/home/evan/Projects/clients/timberandthreads-v2/src/components/Nav.astro` — confirmed nav height `h-20` (5rem / 80px)
- Direct file read: `.planning/STATE.md` — confirmed "Cross-island communication uses CustomEvent on window (not nanostores) — one-directional, one-time handoff is sufficient"
- Direct file read: `.planning/phases/11-calculator-to-contact-quote-flow/11-CONTEXT.md` — all locked decisions and discretion areas

### Secondary (MEDIUM confidence)

- `scrollIntoView({ behavior: 'smooth', block: 'start' })` + `setTimeout` for focus — well-established browser pattern for post-scroll focus management; no completion callback exists natively
- `animationend` event with `{ once: true }` for class removal — standard pattern for CSS animation cleanup

### Tertiary (LOW confidence)

None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all technologies are existing project dependencies or browser built-ins; no new npm packages
- Architecture: HIGH — insertion points verified by reading actual source files; pattern matches STATE.md established decisions
- Pitfalls: HIGH — scroll-margin mismatch measured from actual source (4rem vs 5rem); TypeScript CustomEvent cast is a known TypeScript limitation; all other pitfalls derived from reading actual code

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (stable — all implementation is internal; no external APIs or fast-moving libraries)
