# Timber & Threads Retreat — Website

## What This Is

The Timber & Threads Retreat website built with Astro — a static-first framework that ships zero JavaScript for content sections and only hydrates interactive islands. The retreat center is a quilting and crafting getaway on a small island surrounded by a lake in rural Clinton, Missouri. The site showcases the property with categorized photo galleries, provides pricing information with an interactive calculator that connects to a contact form, displays visual driving directions, and lets prospective guests inquire via email. Verified across desktop and mobile viewports with Playwright.

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

<!-- Shipped in v2.1 phases 6-8 -->

- ✓ Updated pricing with new rate structure ($60/$75 per person, $600 flat for 10-12) — v2.1 Phase 6
- ✓ Interactive pricing calculator (Preact island) with real-time estimates — v2.1 Phase 6
- ✓ Property details corrected (3 bedrooms, laundry facilities) — v2.1 Phase 6
- ✓ Gallery reorganized (property/bedrooms/workspaces/quilts) with new photography — v2.1 Phase 7
- ✓ Lighthouse 90+ mobile performance, self-hosted fonts, optimized images — v2.1 Phase 8
- ✓ WCAG AA accessibility (contrast, touch targets, keyboard nav, font sizes) — v2.1 Phase 8
- ✓ SEO markup (robots.txt, sitemap, OG tags, JSON-LD, semantic HTML) — v2.1 Phase 8

<!-- Shipped in v2.2 phases 9-14 -->

- ✓ Duplicate pricing cards removed from Accommodations, single source of truth in PricingSection — v2.2 Phase 9
- ✓ Mobile header displays brand text at all viewports (no hidden sm:block) — v2.2 Phase 9
- ✓ Calculator per-person cost breakdown below total estimate — v2.2 Phase 10
- ✓ "Get a Quote" button connecting calculator to contact form via CustomEvent — v2.2 Phase 11
- ✓ Contact form pre-filled with estimate details, draft protection for existing messages — v2.2 Phase 11
- ✓ Google Maps visual driving route (no-API-key pb= embed, no Google Cloud billing) — v2.2 Phase 12
- ✓ Playwright test suite (21 tests, 3 viewports) verifying all features against production build — v2.2 Phase 13
- ✓ 320px minimum viewport verified with overflow fix (email break-all) — v2.2 Phase 13

### Active

(None — planning next milestone)

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

**Current site state:** Astro 5 static site with 14 phases complete across 3 milestones (v2.0-v2.2). All content migrated from Next.js, gallery with Cloudinary CDN + PhotoSwipe lightbox, interactive pricing calculator (Preact island) with per-person breakdown and "Get a Quote" flow to contact form, Google Maps visual driving route, contact form delivering via Resend. Deployed to timberandthreadsretreat.com. Playwright tests covering desktop and mobile viewports.

**Codebase:** 2,458 LOC across Astro/TypeScript/TSX/CSS. 67 lines of Playwright tests.

**Existing services:**
- Cloudinary — image CDN + uploads (timber+cloudinary@evanmusick.dev)
- Vercel — hosting (timber+vercel@evanmusick.dev)
- Cloudflare — DNS + email routing (timber@evanmusick.dev)
- Resend — contact form email delivery

**Client:** timberandthreads24@gmail.com, (417) 343-1473
**Location:** 306 NW 300 Rd, Clinton, MO 64735

## Constraints

- **Framework:** Astro with Tailwind CSS — static-first, islands for interactivity
- **Audience:** Rural Missouri — many visitors on slow 3G/4G connections, must be fast
- **Budget:** Budget-conscious client — use free tiers where possible
- **Hosting:** Vercel free tier — bundle sizes matter
- **Domain:** timberandthreadsretreat.com (Cloudflare DNS, configured)
- **Calculator:** Static-first (client-side JS island), no server dependency
- **Testing:** Assertion-based Playwright tests, no screenshot comparisons (OS font rendering flakiness)

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
| Preact over React for calculator | Lighter bundle (~3KB vs ~40KB), same JSX API | ✓ Good |
| CustomEvent over nanostores | One-directional, one-time calculator→contact handoff — simpler than shared state | ✓ Good |
| No-API-key pb= map embed | Avoided Google Cloud billing setup, same visual driving route result | ✓ Good |
| Playwright against production build | Dev server has non-deterministic hydration timing — production build is deterministic | ✓ Good |
| scrollIntoView over hash navigation | Back button works naturally, scroll-spy not disrupted | ✓ Good |

---
*Last updated: 2026-03-03 after v2.2 milestone completion*
