---
phase: 04-contact-form-and-server-endpoint
plan: 01
subsystem: contact-section-ui
tags: [contact-form, validation, vanilla-js, heroicons, honeypot, accessibility]
dependency_graph:
  requires:
    - 02-02 (Connect.astro baseline and section id=contact scroll-spy wiring)
    - 01-02 (Nav.astro scroll-spy and IntersectionObserver pattern)
  provides:
    - Contact.astro: full contact section UI ready for server endpoint
    - index.astro: Connect replaced with Contact, scroll-spy unbroken
  affects:
    - 04-02 (server endpoint wiring -- form already POSTs to /api/contact)
tech_stack:
  added: []
  patterns:
    - Vanilla JS in Astro <script> block for form interactivity (no React)
    - On-blur + on-submit validation for older-demographic UX
    - CSS off-screen honeypot (absolute left-[-9999px]) for spam prevention
    - Inline success state replacing form (not toast) for slow-connection reliability
    - Heroicons inline SVG pattern consistent with Workshops.astro/Accommodations.astro
key_files:
  created:
    - src/components/Contact.astro
  modified:
    - src/pages/index.astro
decisions:
  - Validation fires on-blur and on-submit (not on-keypress) -- older users who type slowly benefit from no interruption
  - Success state replaces form inline -- more reliable than toast on slow rural connections
  - Facebook card preserved below form with divider separator -- keeps existing social proof
  - Connect.astro left intact (not deleted) -- kept as reference until Phase 4 fully verified
metrics:
  duration: 2 min
  completed: 2026-02-17
---

# Phase 4 Plan 01: Contact Section UI Summary

Contact.astro component with info display, form validation, spinner, and Facebook card -- replaces Connect section with id="contact" intact for scroll-spy.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create Contact.astro component with info display, form, and Facebook card | 56cd8c4 | src/components/Contact.astro |
| 2 | Wire Contact.astro into index.astro and add client-side validation | 3623b28 | src/pages/index.astro, src/components/Contact.astro |

## What Was Built

**Contact.astro** is a self-contained Astro component with three vertical areas inside `<section id="contact">`:

1. **Section heading:** "Get in Touch" with teal `w-24 h-1 bg-brand` divider and warm intro paragraph

2. **Two-column grid** (`grid-cols-1 lg:grid-cols-2 gap-12`):
   - Left: Contact info with phone (tel: link, click-to-call), email (mailto: link), and address (with "Get directions" link to #location). Each item uses inline Heroicons SVG (phone-solid, envelope-solid, map-pin-solid) with `w-5 h-5 text-brand flex-shrink-0`.
   - Right: `<form id="contact-form" novalidate>` with name/email/message fields, CSS off-screen honeypot (name="website"), error banner div, submit button with "Send Message" text + `animate-spin` spinner, and hidden success state.

3. **Facebook social card** below a `border-t border-stone-200` divider -- identical HTML to Connect.astro, with "Visit Our Facebook Page" CTA button.

**Client-side JavaScript** (vanilla, in `<script>` block):
- On-blur handlers for all three fields: name (empty check), email (regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), message (empty check)
- On-submit: re-validates all fields, focuses first invalid, then POSTs JSON to `/api/contact` with name/email/message/website
- Spinner lifecycle: disabled button + "Sending..." + spinner shown during fetch, restored in `finally`
- Success: `form.classList.add('hidden')` + `successMsg.classList.remove('hidden')` (inline replacement)
- Error: shows error banner with server message, preserves all input values (no `form.reset()`)
- Network error: specific "check your connection" message in error banner

## Verification Results

All checks passed:

- `npm run build` -- zero errors, 1 page built
- `id="contact"` present in built HTML (scroll-spy preserved)
- `tel:+14173431473` and `mailto:timberandthreads24@gmail.com` in built HTML
- Honeypot field (`name="website"`) in built HTML
- `fetch('/api/contact', ...)` in Contact.astro script
- `import Contact from` in index.astro (replacing Connect)
- Facebook card ("Visit Our Facebook Page") in built HTML

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

Files created/modified:
- [x] FOUND: src/components/Contact.astro
- [x] FOUND: src/pages/index.astro (modified)

Commits exist:
- [x] FOUND: 56cd8c4 (feat(04-01): create Contact.astro)
- [x] FOUND: 3623b28 (feat(04-01): wire and add validation)
