# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-25)

**Core value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.
**Current focus:** Defining requirements for v2.1

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-02-25 — Milestone v2.1 started

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [v2.0]: Astro 5 + Tailwind v4 + Vercel — static-first with islands for gallery lightbox and contact form only
- [v2.0]: Resend over Nodemailer for email delivery (Vercel serverless compatibility)
- [v2.0]: PhotoSwipe for lightbox — code-split, only loaded on interaction
- [v2.0]: Hardcoded gallery data — zero runtime API calls
- [v2.0]: On-blur + on-submit validation for older demographic
- [v2.0]: Honeypot returns 200 (fake success) to suppress bot retry loops

### Pending Todos

None.

### Blockers/Concerns

- Raw photos need editing/color grading before integration (IMG_4197, IMG_4204, IMG_4208, IMG_4237)
- IMG_4204 needs cropping per client direction
- Additional outdoor photos needed (dock, picnic table, fire pit) — may not be available yet
- path-to-regexp HIGH vulnerability in @astrojs/vercel@9.0.4 transitive dep — deferred (build-time only)

## Session Continuity

Last session: 2026-02-25
Stopped at: Starting v2.1 milestone — defining requirements
Resume: Continue requirements definition workflow
