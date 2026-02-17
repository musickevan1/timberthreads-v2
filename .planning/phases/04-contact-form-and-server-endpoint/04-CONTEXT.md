# Phase 4: Contact Form and Server Endpoint - Context

**Gathered:** 2026-02-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Contact form where visitors can send inquiries to retreat owners, with server-side email delivery via Resend. Includes contact info display (phone, email, address), client-side validation, honeypot spam prevention, and success/error feedback. This is the only server-side feature on the entire site.

</domain>

<decisions>
## Implementation Decisions

### Contact section layout
- Side-by-side layout: contact info (phone, email, address) on the left, form on the right — stacks vertically on mobile
- All contact methods given equal weight — no single method is prioritized over others
- Icons alongside each contact detail (phone icon, email icon, map pin) — consistent with inline Heroicons SVG pattern used in other sections
- Address includes a "Get directions" link that scrolls to the existing Map section

### Form experience
- Submit button shows a spinner and is disabled during submission — important for slow rural connections
- On error (network or server), form preserves all user input so they can retry without retyping
- Submit button text: "Send Message"

### Tone and prompts
- Section heading: "Get in Touch"
- Warm 1-2 sentence intro paragraph under the heading (e.g., "Ready to plan your retreat? We'd love to hear from you.")
- Message field placeholder with suggestions: something like "Tell us about your group, preferred dates, or any questions..."

### Section integration
- Replaces the current Connect section but keeps the Facebook social card
- Layout: contact info + form (side by side) at top, Facebook card below as an alternative way to connect
- Facebook card stays roughly as-is in appearance and prominence
- Switch from `output: 'static'` to `output: 'hybrid'` in astro.config.mjs — all existing pages remain static/prerendered, only the /api/contact endpoint runs as a Vercel serverless function

### Claude's Discretion
- Validation approach (inline under fields vs on-submit — pick what's best for a 3-field form targeting an older demographic)
- Success state pattern (inline replacement vs toast — pick what's most appropriate)
- Section ID and nav label handling (keep scroll-spy working)
- Intro paragraph exact wording

</decisions>

<specifics>
## Specific Ideas

- Phone number should be click-to-call on mobile (tel: link)
- Message placeholder should guide visitors to mention group size, preferred dates, or questions
- Facebook card appearance should stay similar to the current Connect.astro component

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-contact-form-and-server-endpoint*
*Context gathered: 2026-02-17*
