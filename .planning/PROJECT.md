# Timber & Threads Retreat — Website

## What This Is

The Timber & Threads Retreat website built with Astro — a static-first framework that ships zero JavaScript for content sections and only hydrates interactive islands. The retreat center is a quilting and crafting getaway on a small island surrounded by a lake in rural Clinton, Missouri. The site showcases the property, provides pricing information with an interactive calculator, and lets prospective guests inquire via a contact form.

## Current Milestone: v2.1 Website Enhancement

**Goal:** Update pricing to the new rate structure, add an interactive pricing quote calculator, correct property details (3 bedrooms, laundry), integrate new photography, and complete polish/accessibility/deploy work carried from v2.0.

**Target features:**
- Updated pricing across the site (per-person rates for ≤10, flat rate for 10-12)
- Interactive pricing quote calculator with real-time estimates
- Property detail corrections (3 bedrooms, laundry facilities)
- New photography (dock, picnic table, fire pit, 4 edited images)
- Lighthouse 90+ performance, WCAG AA accessibility, SEO, production deploy

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

### Active

<!-- v2.1 scope -->

- [ ] Updated pricing across all site sections to new rate structure
- [ ] Interactive pricing quote calculator with real-time total estimates
- [ ] Property details corrected: 3 bedrooms (was 4), laundry facilities added
- [ ] New photography integrated (dock, picnic table, fire pit, 4 edited images)
- [ ] Lighthouse mobile performance score 90+ on Fast 3G
- [ ] WCAG AA accessibility compliance
- [ ] SEO markup (robots.txt, sitemap, OG tags, semantic HTML)
- [ ] Production domain deployment (timberandthreadsretreat.com)

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
*Last updated: 2026-02-25 after v2.1 milestone start*
