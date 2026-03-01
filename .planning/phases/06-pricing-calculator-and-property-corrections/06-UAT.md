---
status: complete
phase: 06-pricing-calculator-and-property-corrections
source: [06-01-SUMMARY.md, 06-02-SUMMARY.md]
started: 2026-02-26T07:00:00Z
updated: 2026-03-01T19:50:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Bedroom Count Corrected
expected: Accommodations section shows 3 bedrooms (not 4)
result: pass

### 2. Laundry Facilities Listed
expected: "Laundry facilities" appears in both the Accommodations amenity list and the Workshops Amenities card
result: pass

### 3. Rate Card Display
expected: Accommodations section shows a rate card with two pricing tiers: $60/night standard and $75/night with meals for groups of 10 or fewer, and $600/night flat rate for groups of 10-12
result: pass

### 4. CTA Scrolls to Calculator
expected: Clicking "Estimate Your Stay" button in the Accommodations rate card scrolls the page down to the pricing calculator section
result: pass

### 5. Calendar Pricing Updated
expected: Calendar section shows per-person tier pricing ($60, $75, $600) instead of old seasonal flat rates. Meal option is a single $15/night add-on (not three tiers)
result: pass

### 6. Calculator Sliders and Real-Time Updates
expected: Pricing calculator has a group size slider and a nights slider. Moving either slider immediately updates the pricing breakdown below without page reload
result: pass

### 7. Small Group Pricing Math
expected: Set group size to 6, nights to 3, meals off. Breakdown shows 6 × $60 × 3 = $1,080 total (or equivalent line items summing to $1,080)
result: pass

### 8. Large Group Flat Rate
expected: Set group size to 11, nights to 3, meals off. Breakdown shows $600/night × 3 = $1,800 total (flat rate, not per-person)
result: pass

### 9. Meal Pricing Differentiation
expected: With meals ON — for groups ≤10, meal cost uses $15/person/night. For groups of 10-12, meal cost uses $12.50/person/day. Totals reflect the correct rate for each tier
result: pass

## Summary

total: 9
passed: 9
issues: 0
pending: 0
skipped: 0

## Gaps

[none]
