---
phase: 04-contact-form-and-server-endpoint
verified: 2026-02-17T17:05:00Z
status: human_needed
score: 12/12 automated must-haves verified
re_verification: false
human_verification:
  - test: "Submit valid form and confirm email arrives in owner inbox"
    expected: "Owner receives a formatted HTML email from noreply@timberandthreadsretreat.com with name, email (as reply-to), and message. Subject: 'New inquiry from {name}'."
    why_human: "Requires live RESEND_API_KEY + verified sending domain in Resend dashboard. Cannot verify email delivery programmatically in CI."
  - test: "Submit form with honeypot field filled (simulate bot)"
    expected: "Server returns 200 with 'Message sent successfully!' but no email is delivered to owner."
    why_human: "Honeypot bypass behavior requires live API call with a filled website field. The fake-200 path is visible in code but delivery suppression cannot be confirmed without network call."
  - test: "Blur each empty field in sequence and confirm validation errors appear"
    expected: "Name field blur with empty input shows 'Please enter your name' below the field. Email blur with invalid value shows 'Please enter a valid email address'. Message blur with empty textarea shows 'Please enter a message'. Errors disappear when field is correctly filled and blurred again."
    why_human: "On-blur DOM event behavior requires a real browser interaction to confirm."
  - test: "Submit with valid fields and confirm spinner lifecycle"
    expected: "Button text changes from 'Send Message' to 'Sending...', spinner SVG appears during fetch, then button is restored in finally block regardless of outcome."
    why_human: "Requires live browser to observe async state transitions."
  - test: "Scroll-spy: click Contact nav link and verify section is highlighted"
    expected: "Nav 'Contact' link is visually active (highlighted/different style) when the contact section is in the viewport. IntersectionObserver highlights it on scroll."
    why_human: "Scroll-spy is driven by IntersectionObserver; requires a browser to verify visual state."
  - test: "Mobile layout at ~375px viewport width"
    expected: "Contact info column stacks above the form (single column, not side-by-side). All content readable without horizontal scroll."
    why_human: "Responsive layout requires browser resize or device emulation."
---

# Phase 4: Contact Form and Server Endpoint Verification Report

**Phase Goal:** Visitors can send an inquiry to the retreat owners through a contact form that validates input, delivers email reliably via Resend, and prevents spam -- the only server-side feature on the site
**Verified:** 2026-02-17T17:05:00Z
**Status:** human_needed -- all automated checks passed, 6 items require browser/live-service verification
**Re-verification:** No -- initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor sees phone number (click-to-call), email address, and physical address in the contact section | VERIFIED | `tel:+14173431473`, `mailto:timberandthreads24@gmail.com`, and address text present in Contact.astro lines 22-51 with Heroicons SVG icons |
| 2 | Visitor sees a form with name, email, and message fields | VERIFIED | `<form id="contact-form" novalidate>` with three labeled fields at lines 61-131 of Contact.astro |
| 3 | Leaving a field empty and blurring shows a validation error below that field | VERIFIED (code) | On-blur handlers registered at lines 257-259; `validateName/Email/Message` functions show/hide `*-error` spans. **Browser confirmation needed.** |
| 4 | Submitting with invalid/missing fields shows validation errors without clearing inputs | VERIFIED (code) | On-submit at line 263 re-validates all fields, focuses first invalid, returns early without `form.reset()`. **Browser confirmation needed.** |
| 5 | Submit button reads 'Send Message' and shows a spinner when clicked | VERIFIED | `<span id="btn-text">Send Message</span>` at line 122; `animate-spin` SVG spinner at lines 124-128; `btnText.textContent = 'Sending...'` at line 291 |
| 6 | Facebook social card appears below the contact info and form | VERIFIED | Facebook card HTML with "Visit Our Facebook Page" CTA at lines 150-197 of Contact.astro |
| 7 | Scroll-spy highlights Contact nav link when section is in view | VERIFIED (code) | `<section id="contact">` at line 1; Nav.astro line 12 has `{ label: 'Contact', href: '#contact' }`. **Browser confirmation needed.** |
| 8 | Submitting a valid form sends an email to the owner's inbox via Resend | VERIFIED (code) | `resend.emails.send()` at lines 89-96 of contact.ts with `from`, `to`, `replyTo`, `subject`, `html`, `text`. **Live email delivery needs human confirmation.** |
| 9 | Submitting with a filled honeypot field returns fake 200 without sending email | VERIFIED (code) | Honeypot check at lines 28-33 of contact.ts returns 200 before reaching Resend call. **End-to-end behavior needs human confirmation.** |
| 10 | Server validates all fields and returns 400 with error message for missing/invalid input | VERIFIED | Lines 38-59 of contact.ts validate name, email, message server-side and return `{ status: 400, message: errors.join('. ') }` |
| 11 | API key is only accessible server-side, never exposed in client JavaScript | VERIFIED | `RESEND_API_KEY` uses `import.meta.env` (no `PUBLIC_` prefix); grep of `dist/` confirms it does not appear in client bundles |
| 12 | Visitor sees success confirmation after valid submission OR error message on server failure without losing form input | VERIFIED | Success: form hidden + `#success-message` shown (lines 301-304). Error: `errorMsg.textContent` set + shown, no `form.reset()` call (lines 305-313) |

**Score:** 12/12 truths verified at code level (6 need browser/live-service confirmation)

---

## Required Artifacts

### Plan 01 Artifacts

| Artifact | Expected | Lines | Status | Details |
|----------|----------|-------|--------|---------|
| `src/components/Contact.astro` | Contact section with info display, form, validation, honeypot, success/error states, Facebook card | 322 (min: 150) | VERIFIED | Substantive implementation, all sections present |
| `src/pages/index.astro` | Updated page importing Contact instead of Connect | -- | VERIFIED | Line 8: `import Contact from '../components/Contact.astro'`; Line 36: `<Contact />` |

### Plan 02 Artifacts

| Artifact | Expected | Lines | Status | Details |
|----------|----------|-------|--------|---------|
| `src/pages/api/contact.ts` | POST endpoint with validation, honeypot check, Resend email delivery | 111 (min: 40) | VERIFIED | `prerender = false` + `POST` export present; all phases of request handling implemented |
| `.env.example` | Documentation of required environment variables | 5 | VERIFIED | Contains `RESEND_API_KEY` and `OWNER_EMAIL` with comments |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `Contact.astro` | Nav.astro scroll-spy | `id="contact"` on section | WIRED | Line 1 of Contact.astro: `<section id="contact">`; Nav.astro line 12: `href: '#contact'` |
| `Contact.astro` | `/api/contact` | `fetch` in submit handler | WIRED | Line 295: `await fetch('/api/contact', { method: 'POST', ... })` with JSON body |
| `index.astro` | `Contact.astro` | import and render | WIRED | Line 8: `import Contact from '../components/Contact.astro'`; Line 36: `<Contact />` |
| `contact.ts` | Resend SDK | `import { Resend } from 'resend'` | WIRED | Line 2: import confirmed; line 63: instantiated with `import.meta.env.RESEND_API_KEY` |
| `contact.ts` | environment variables | `import.meta.env.RESEND_API_KEY` | WIRED | Line 63: `RESEND_API_KEY`; line 91: `OWNER_EMAIL` -- both `import.meta.env`, no `PUBLIC_` prefix |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| CNTC-01 | 04-01 | Contact section with phone number, email address, and physical address | SATISFIED | `tel:+14173431473`, `mailto:timberandthreads24@gmail.com`, "306 NW 300 Rd, Clinton, MO 64735" all present with icons in Contact.astro lines 22-51 |
| CNTC-02 | 04-01 | Contact form with name, email, and message fields with client-side validation | SATISFIED | Three-field `<form id="contact-form" novalidate>` with on-blur + on-submit validation at lines 61-131, script block lines 203-322 |
| CNTC-03 | 04-02 | Server endpoint (POST /api/contact) with server-side validation and email delivery via Resend | SATISFIED (code) | contact.ts 111 lines; validation (lines 38-59), Resend send (lines 89-96), error handling (lines 98-104). Delivery requires live human test. |
| CNTC-04 | 04-01 | Honeypot field for basic spam prevention | SATISFIED | CSS off-screen div (`left-[-9999px]`) at lines 63-73 of Contact.astro; server honeypot check at lines 28-33 of contact.ts |
| CNTC-05 | 04-01 | Success/error feedback displayed to user after form submission | SATISFIED | Success state at lines 133-145 (inline replacement, not toast); error banner at lines 58-59; network error at line 313 |
| CNTC-06 | 04-02 | Email credentials stored in environment variables, never exposed to client | SATISFIED | `import.meta.env.RESEND_API_KEY` (no PUBLIC_ prefix); `dist/` scan confirms key not in client bundle; `.env.example` documents both vars |

**Orphaned requirements:** None -- all 6 CNTC requirements declared in REQUIREMENTS.md are covered by plans 01 and 02.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| Contact.astro | 83, 97, 111 | `placeholder="..."` | Info | HTML input placeholder attributes -- not stub code, this is correct UX |

No blockers or warnings found. The placeholder hits are proper HTML form attributes, not stub implementations.

---

## Human Verification Required

### 1. End-to-End Email Delivery

**Test:** Set `RESEND_API_KEY` (from resend.com) and `OWNER_EMAIL` in `.env`. Run `npm run dev`. Fill the contact form with valid data and click "Send Message".
**Expected:** Form shows inline success confirmation ("Thank you for reaching out!"). Owner inbox receives a formatted HTML email with the visitor's name, email (as reply-to), and message.
**Why human:** Requires a live Resend API key and verified sending domain. Cannot confirm email delivery programmatically.

### 2. Honeypot Spam Silencing

**Test:** Using browser DevTools or curl, send a POST to `/api/contact` with `website: "http://spam.com"` in the body alongside valid name/email/message.
**Expected:** Server returns HTTP 200 with `{ message: "Message sent successfully!" }` but no email arrives in owner inbox.
**Why human:** The fake-200 code path is verified in source, but confirming no email is actually sent requires a live API call.

### 3. On-Blur Field Validation

**Test:** Run `npm run dev`. Visit localhost:4321. Click into the Name field, leave it empty, tab away.
**Expected:** "Please enter your name" error text appears below the field. Repeat for email (empty or invalid format) and message. Fill each correctly and tab away -- errors should disappear.
**Why human:** On-blur DOM event behavior requires a real browser.

### 4. Submit Spinner Lifecycle

**Test:** Fill all three fields with valid data, click "Send Message" (with or without live API key).
**Expected:** Button immediately shows "Sending..." text with an animated spinner. After response (success or error), button is restored to "Send Message" with spinner hidden.
**Why human:** Async state transitions require live browser observation.

### 5. Scroll-Spy Behavior

**Test:** Run `npm run dev`. Scroll to the Contact section, or click "Contact" in the top nav.
**Expected:** The "Contact" nav link is visually highlighted (different color or style) while the section is in the viewport. Scrolling away removes the highlight.
**Why human:** IntersectionObserver scroll-spy requires a browser to confirm the visual state change.

### 6. Mobile Responsive Layout

**Test:** Run `npm run dev` and resize browser to ~375px width (or use DevTools device emulation).
**Expected:** Contact info column stacks above the form (single column layout). All text, inputs, and buttons remain accessible without horizontal scrolling.
**Why human:** Responsive CSS (`grid-cols-1 lg:grid-cols-2`) requires browser rendering to confirm.

---

## Summary

Phase 4 goal is **substantially achieved**. All 12 automated must-haves are verified at code level:

- `Contact.astro` (322 lines) is a complete, substantive implementation -- contact info display with Heroicons SVGs, a three-field form with honeypot, client-side on-blur/on-submit validation, spinner lifecycle, inline success state, error banner with input preservation, and Facebook social card.
- `src/pages/api/contact.ts` (111 lines) is a complete server endpoint -- request parse guard, fake-200 honeypot, server-side validation, HTML injection escaping, Resend email delivery with `replyTo`, and proper error logging.
- `index.astro` correctly imports and renders `Contact` (Connect replaced).
- `RESEND_API_KEY` confirmed absent from client bundle.
- All 6 CNTC requirements are covered.
- Build passes cleanly with zero errors.

The 6 human verification items are all behavioral (browser interactions and live email delivery) and are not code deficiencies -- they are inherently untestable without a browser or live Resend account. The code structure correctly implements every behavior specified.

---

_Verified: 2026-02-17T17:05:00Z_
_Verifier: Claude (gsd-verifier)_
