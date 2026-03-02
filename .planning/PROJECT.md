# Timber & Threads Retreat — Website

## What This Is

The Timber & Threads Retreat website built with Astro — a static-first framework that ships zero JavaScript for content sections and only hydrates interactive islands. The retreat center is a quilting and crafting getaway on a small island surrounded by a lake in rural Clinton, Missouri. The site showcases the property, provides pricing information with an interactive calculator, and lets prospective guests inquire via a contact form.

## Current Milestone: v2.2 Client Preview Polish

**Goal:** Polish the site for client preview — clean up duplicate pricing, enhance the calculator-to-contact flow, optimize mobile viewport, add visual driving directions, and verify across viewports with Playwright.

**Target features:**
- Remove duplicate pricing cards from Accommodations section
- Per-person price breakdown under calculator total estimate
- "Get a Quote" button connecting calculator estimates to contact form
- Text title visible in mobile header
- Mobile viewport optimization and general polish
- Map with visual driving route highlighted
- Playwright-based desktop/mobile viewport verification

## Core Value

The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.

## Requirements

### Validated

<!-- Shipped in v2.0 phases 1-4 -->

- ✓ Astro 5 + Tailwind v4 project with responsive layout, navigation, image pipeline — v2.0 Phase 1
- ✓ All content sections migrated from Next.js site (Hero, About, Workshops, Accommodations, Calendar, Map, Connect, Footer) — v2.0 Phase 2
- ✓ Lazy-loaded Google Calendar and Google Maps embeds — v2.0 Phase 2
- ✓ Cloudinary CDN gallery with category organization and PhotoSwipe lightbox — v2.0 Phase 3
- ✓ Video placeholder section with poster image — v2.0 Phase 3
- ✓ Contact form with Resend email delivery, validation, honeypot spam prevention — v2.0 Phase 4
- ✓ Updated pricing with new rate structure ($60/$75 per person, $600 flat for 10-12) — v2.1 Phase 6
- ✓ Interactive pricing calculator (Preact island) with real-time estimates — v2.1 Phase 6
- ✓ Property details corrected (3 bedrooms, laundry facilities) — v2.1 Phase 6
- ✓ Gallery reorganized (property/bedrooms/workspaces/quilts) with new photography — v2.1 Phase 7
- ✓ Lighthouse 90+ mobile performance, self-hosted fonts, optimized images — v2.1 Phase 8
- ✓ WCAG AA accessibility (contrast, touch targets, keyboard nav, font sizes) — v2.1 Phase 8
- ✓ SEO markup (robots.txt, sitemap, OG tags, JSON-LD, semantic HTML) — v2.1 Phase 8

### Active

<!-- v2.2 scope -->

- [ ] Duplicate pricing cards removed from Accommodations section
- [ ] Calculator shows per-person price breakdown under total estimate
- [ ] "Get a Quote" button scrolls to contact form with pre-filled estimate details
- [ ] Mobile header shows "Timber & Threads" text title
- [ ] Mobile viewport optimized across all sections
- [ ] Map displays visual driving route to property
- [ ] Desktop and mobile viewports verified via Playwright

### Out of Scope

- Full visual redesign — client likes the current look, just refine it
- Admin gallery management — add in a later phase after public site is solid
- Dynamic gallery API (Cloudinary/Redis fetching) — hardcode images for now, wire up later
- Booking/payment system — not requested
- Workshop registration — not requested
- Mobile app — web only
- Promo video editing — separate workflow, placeholder already built
- Online store — not core business
- Newsletter subscription — client uses Facebook for updates
- Gallery image swap — deferred until client selects new images

## Context

**Current site state:** Astro 5 rebuild with phases 1-4 complete. All content migrated, gallery working with Cloudinary CDN + PhotoSwipe lightbox, contact form delivering via Resend. Not yet deployed to production domain. Video placeholder in place.

**Existing services:**
- Cloudinary — image CDN + uploads (timber+cloudinary@evanmusick.dev)
- Upstash Redis — gallery metadata persistence (not needed for public site)
- Vercel — hosting (timber+vercel@evanmusick.dev)
- Cloudflare — DNS + email routing (timber@evanmusick.dev)
- Resend — contact form email delivery

**Pricing update (from PRD):**
- Groups ≤10: $60/night/person (standard) or $75/night/person (with meals)
- Groups 10-12: $600/night flat + optional $12.50/person/day food add-on
- Minimum: 4 persons, 2 nights

**Property corrections:**
- Bedrooms: 4 → 3 (update everywhere: copy, meta, structured data, alt text)
- Add laundry facilities to amenities list
- Confirm full kitchen with dishwasher visibility

**New photos (need editing before integration):**
- IMG_4197, IMG_4204 (needs cropping), IMG_4208, IMG_4237
- Additional needed: dock, outdoor picnic table, fire pit

**Client:** timberandthreads24@gmail.com, (417) 343-1473
**Location:** 306 NW 300 Rd, Clinton, MO 64735

## Constraints

- **Framework:** Astro with Tailwind CSS — static-first, islands for interactivity
- **Audience:** Rural Missouri — many visitors on slow 3G/4G connections, must be fast
- **Budget:** Budget-conscious client — use free tiers where possible
- **Hosting:** Vercel free tier — bundle sizes matter
- **Domain:** timberandthreadsretreat.com (Cloudflare DNS, already configured)
- **Photos:** 4 images need editing/color grading, IMG_4204 needs cropping, additional outdoor photos needed
- **Calculator:** Must be static-first (client-side JS island), no server dependency

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Site is 90% static content — Astro ships zero JS for static sections | ✓ Good |
| Fresh repo over cleanup | Old repo had 53GB of video files, legacy code — clean start is faster | ✓ Good |
| Hardcoded gallery | No API calls on page load = faster, simpler | ✓ Good |
| Lazy-load embeds | Calendar + Maps iframes are heavy — defer to scroll | ✓ Good |
| Resend over Nodemailer | Vercel serverless compatibility, simpler API | ✓ Good |
| PhotoSwipe for lightbox | Code-split, only loads on interaction, well-maintained | ✓ Good |
| Video placeholder | Promo video not ready — section structure built, swap later | ✓ Good |

---
*Last updated: 2026-03-02 after v2.2 milestone start*
