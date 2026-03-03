# Phase 9: Mobile Header and Pricing Cleanup - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Two surgical fixes: (1) show the "Timber & Threads" retreat name in the mobile header, and (2) remove the duplicate pricing rate cards from the Accommodations section. No new features — just correcting visibility and eliminating content duplication.

</domain>

<decisions>
## Implementation Decisions

### Mobile header brand text
- Remove `hidden sm:block` from the brand name span in Nav.astro
- Adjust font size to `text-xl sm:text-2xl` so text fits at narrow viewports
- Animated underline decoration can stay hidden on mobile (it's a hover effect, not content)
- Must not overflow at 320px or push the hamburger button off-screen at 375px

### Pricing card removal from Accommodations
- Remove the entire "Rate Card" block (the `mt-12` div with heading "Pricing", two tier cards, minimums text, and "Estimate Your Stay" CTA) from Accommodations.astro
- Replace with a brief one-line pricing mention that links to the pricing calculator section
- Mention only the per-person base rate ($60/night) — do not include the large group flat rate or meal option in the teaser
- The full pricing detail (both tiers, meals, minimums) lives exclusively in PricingSection.astro

### Claude's Discretion
- Exact styling of the pricing teaser line (inline text with link vs. small card — whichever fits the section's existing design)
- Whether the teaser includes the meal option alongside the base rate
- Exact wording of the pricing teaser and link text
- Logo-to-text gap spacing on mobile

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. The roadmap success criteria are precise enough: 375px and 320px viewport checks, no horizontal overflow, desktop 1280px unchanged.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 09-mobile-header-and-pricing-cleanup*
*Context gathered: 2026-03-02*
