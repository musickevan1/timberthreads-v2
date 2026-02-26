# Phase 6: Pricing, Calculator, and Property Corrections - Context

**Gathered:** 2026-02-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Update all pricing references across the site to reflect the new rate structure, build an interactive pricing calculator for stay cost estimation, and correct property details (bedrooms, laundry, kitchen). The calculator is a new Astro island component. Property corrections are mechanical copy changes.

</domain>

<decisions>
## Implementation Decisions

### Calculator placement & discovery
- Own dedicated section after Accommodations, before Contact
- Section has a heading (e.g., "Estimate Your Stay") with a brief intro sentence
- Rate summary (both pricing tiers) displayed alongside the calculator in the same section
- CTA buttons in pricing copy elsewhere on the page smooth-scroll to the calculator section

### Input controls
- Sliders for group size (range: 4-12) and number of nights (range: 2-7)
- Toggle switch for meals: "Include meals (+$15/night)" on/off
- Subtle "Min 4" and "Min 2" labels at the low end of each slider
- Slider ranges enforce constraints — visitors can't select below minimums

### Breakdown display
- Clean card/panel with line items: nightly rate x nights, food cost (if toggled), total
- Real-time updates as sliders move
- When group size crosses 10, breakdown updates smoothly with explanatory note: "Groups of 10-12: flat rate of $600/night"
- Inline constraint messages below relevant slider if somehow invalid (belt-and-suspenders with slider range)
- Disclaimer at bottom: "This is an estimate. Final pricing confirmed upon booking."

### Pricing presentation sitewide
- Rate card / pricing block in Accommodations section showing both tiers clearly
- Accommodations rate card includes CTA button scrolling to calculator
- Booking minimums (4 persons, 2 nights) mentioned in accommodations intro text
- No pricing in hero or above-the-fold area — pricing lives in Accommodations + calculator sections only

### Property corrections
- All bedroom references updated from 4 to 3 (page copy, meta descriptions, alt text)
- Laundry facilities added to amenities list
- Full kitchen with dishwasher confirmed visible in accommodations copy

### Claude's Discretion
- Exact slider styling and animation
- Card/panel visual design for the breakdown
- Typography and spacing within the calculator
- Error state handling for edge cases
- Exact wording for section intro and rate summary
- How rate card in Accommodations section is styled

</decisions>

<specifics>
## Specific Ideas

- User specifically requested sliders (not steppers or dropdowns) for group size and nights inputs
- Toggle switch for meals add-on, not radio buttons or checkbox
- The calculator section should show the rate structure alongside the interactive tool — visitors see the tiers and can estimate in one place
- Transition at 10+ guests should feel smooth, not jarring — brief explanatory note when flat rate kicks in

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-pricing-calculator-and-property-corrections*
*Context gathered: 2026-02-26*
