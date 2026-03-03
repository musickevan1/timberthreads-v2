# Phase 11: Calculator-to-Contact Quote Flow - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Connect the pricing calculator to the contact form with a "Get a Quote" CTA. Clicking it scrolls to the contact section and pre-fills the message textarea with the visitor's estimate details. The calculator itself (Phase 10) and contact form submission logic are already built — this phase bridges them.

</domain>

<decisions>
## Implementation Decisions

### Button Placement & Style
- Button sits inside the breakdown panel, below the total/per-person line, above the disclaimer text
- Primary CTA styling: solid brand-color background, white text — same visual weight as "Send Message"
- Always visible from page load (calculator defaults of 6 guests / 3 nights produce a valid estimate)
- Button label: "Get a Quote"

### Pre-fill Message Format
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

### Scroll & Arrival Experience
- Smooth scroll animation to `#contact` section
- Brief highlight flash on the textarea (subtle brand-color border pulse, ~1 second fade) to draw attention to the pre-filled content
- Focus lands on the name field after scroll completes — message is already filled, visitor starts with contact info
- No URL hash change — avoid adding a history entry so back button works naturally

### Edge Cases & Draft Protection
- If message field already has text, scroll to contact but do NOT overwrite — respect the visitor's draft (PRIC-10)
- On repeat clicks: if message still contains the exact previous pre-fill text (unedited), update it with new estimate; if visitor edited it, leave it alone
- Only include meals details when meals toggle is on; omit the line entirely when off

### Claude's Discretion
- Flat-rate note inclusion in pre-fill for groups of 10+
- Behavior when contact form is in success state (button visibility, scroll-only, etc.)
- Scroll timing/easing specifics
- Highlight flash animation implementation details

</decisions>

<specifics>
## Specific Ideas

- Pre-fill format should mirror the breakdown panel's structure — visitor sees the same info they just looked at, now in text form
- The "Get a Quote" button is the conversion moment — make it feel like a natural next step, not a jarring transition

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 11-calculator-to-contact-quote-flow*
*Context gathered: 2026-03-02*
