# Phase 10: Calculator Per-Person Breakdown - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a per-person cost line to the existing pricing calculator breakdown panel. Group organizers need the individual cost to communicate to participants. The calculator already computes accommodation + meals + total; this phase adds one per-person line derived from that total. No new inputs, no new calculator features — just one additional output line.

</domain>

<decisions>
## Implementation Decisions

### Breakdown detail
- Single per-person total line (not itemized accommodation vs meals per person)
- Positioned directly below the "Estimated Total" inside the same divider block
- Include math context showing guest count, e.g. "Per person (6 guests): $180"
- Visually secondary to the total — smaller or lighter than the bold brand-colored total

### Flat-rate handling
- Same per-person treatment regardless of whether flat-rate pricing is active
- The existing amber callout banner ("Groups of 10-12: flat rate of $600/night") already explains the pricing model — per-person line doesn't need to reference or repeat it
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

</decisions>

<specifics>
## Specific Ideas

- The per-person number is the one group organizers copy into their group chat — it should be easy to read and communicate
- Existing calculator uses `formatCurrency()` for whole dollar amounts — per-person should stay consistent with this pattern

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-calculator-per-person-breakdown*
*Context gathered: 2026-03-02*
