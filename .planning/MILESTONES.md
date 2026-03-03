# Milestones: Timber & Threads Retreat

## v2.2 Client Preview Polish (Shipped: 2026-03-03)

**Phases:** 9-14 (6 phases, 6 plans)
**Timeline:** 2026-03-02 → 2026-03-03 (2 days)
**Stats:** 42 commits, 53 files changed, 6,043 insertions, 324 deletions
**Requirements:** 13/13 satisfied (audit passed)

**Key accomplishments:**
- Mobile header shows "Timber & Threads" brand text at all viewports, duplicate pricing cards removed from Accommodations
- Calculator displays per-person cost breakdown below total estimate
- "Get a Quote" button dispatches CustomEvent to pre-fill contact form with estimate details (with draft protection)
- Google Maps embed upgraded from static pin to visual driving route using no-API-key pb= format
- Playwright test suite (21 tests across 3 viewport projects) verifying all v2.2 features against production build
- Tech debt cleared: orphaned Connect.astro deleted, Phase 9 verified, all requirements documented

---

## v2.0 — Website Rebuild (Partial)

**Dates:** 2026-02-16 → 2026-02-17 (phases 1-4)
**Status:** Phases 1-4 complete, Phase 5 (Polish/Deploy) carried to v2.1
**Last Phase:** 4

**What shipped:**
- Astro 5 + Tailwind v4 rebuild from scratch (replaced Next.js site)
- All content sections migrated: Hero, About, Workshops, Accommodations, Calendar, Gallery, Contact, Map, Connect, Footer
- Cloudinary CDN gallery with PhotoSwipe lightbox
- Contact form with Resend email delivery, honeypot spam prevention
- Lazy-loaded Google Calendar and Maps embeds
- Video placeholder section with poster image

**What carried forward to v2.1:**
- Lighthouse 90+ optimization
- WCAG AA accessibility audit
- SEO markup (robots.txt, sitemap, OG tags)
- Production domain deployment (timberandthreadsretreat.com)

**Stats:**
- 7 plans executed across 4 phases
- Average plan duration: 4 min
- Total execution time: 26 min

## v2.1 — Website Enhancement

**Dates:** 2026-02-25 → 2026-03-02 (phases 6-8)
**Status:** Complete
**Last Phase:** 8

**What shipped:**
- Updated pricing with new rate structure ($60/$75 per person, $600 flat for 10-12)
- Interactive pricing calculator (Preact island) with real-time estimates
- Property corrections (3 bedrooms, laundry facilities)
- Gallery reorganized to property/bedrooms/workspaces/quilts with new photography
- Lighthouse 90+ mobile performance, self-hosted Inter font
- WCAG AA accessibility (contrast, touch targets, keyboard nav, font sizes)
- SEO markup (robots.txt, sitemap, OG tags, JSON-LD LodgingBusiness)
- Production deployment prep (DNS cutover pending)

**Stats:**
- 6 plans executed across 3 phases
- Phases: 6 (Pricing/Calculator/Property), 7 (Photography), 8 (Polish/A11Y/SEO/Deploy)
