# Requirements: Timber & Threads Website

**Defined:** 2026-02-25
**Core Value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.

## v2.2 Requirements

Requirements for Client Preview Polish milestone. Each maps to roadmap phases.

### Pricing & Calculator

- [ ] **PRIC-07**: Duplicate pricing tier cards removed from Accommodations section (kept in Pricing section only)
- [x] **PRIC-08**: Calculator displays per-person price breakdown under the total estimate
- [x] **PRIC-09**: "Get a Quote" button below calculator estimate scrolls to contact form
- [x] **PRIC-10**: Contact form message field pre-filled with estimate details (group size, nights, meals, total) when arriving from calculator — only if message field is empty

### Mobile Experience

- [ ] **MOBL-01**: Mobile header displays "Timber & Threads" text title alongside logo
- [x] **MOBL-02**: All site sections render correctly at 375px mobile viewport
- [x] **MOBL-03**: All site sections render correctly at 320px minimum viewport
- [x] **MOBL-04**: Mobile layout changes do not break desktop layout at 1280px

### Map & Directions

- [ ] **MAPS-01**: Embedded Google Map displays visual driving route to the property
- [ ] **MAPS-02**: Maps API key is domain-restricted and stored as environment variable

### Testing & Verification

- [x] **TEST-01**: Playwright tests verify key elements visible and functional at desktop viewport (1280px)
- [x] **TEST-02**: Playwright tests verify key elements visible and functional at mobile viewport (375px)
- [x] **TEST-03**: Playwright tests run against production build (astro preview)

## v2.1 Validated Requirements

Shipped in v2.1 phases 6-8. Confirmed working.

### Pricing

- ✓ **PRIC-01**: All pricing references reflect new rate structure ($60/$75 for ≤10; $600 flat for 10-12) — v2.1 Phase 6
- ✓ **PRIC-02**: Booking requirements (min 4 persons, min 2 nights) displayed with pricing — v2.1 Phase 6
- ✓ **PRIC-03**: Interactive calculator with group size, nights, and food option inputs — v2.1 Phase 6
- ✓ **PRIC-04**: Calculator enforces minimum constraints with clear feedback — v2.1 Phase 6
- ✓ **PRIC-05**: Calculator displays real-time line-item breakdown — v2.1 Phase 6
- ✓ **PRIC-06**: Calculator includes estimate disclaimer — v2.1 Phase 6

### Property

- ✓ **PROP-01**: All references updated from 4 bedrooms to 3 bedrooms — v2.1 Phase 6
- ✓ **PROP-02**: Laundry facilities listed in amenities — v2.1 Phase 6
- ✓ **PROP-03**: Full kitchen with dishwasher visible in amenities — v2.1 Phase 6

### Photography

- ✓ **PHOT-01**: IMG_4197, IMG_4204, IMG_4208, IMG_4237 edited and integrated — v2.1 Phase 7
- ✓ **PHOT-02**: IMG_4204 cropped per client direction — v2.1 Phase 7
- ✓ **PHOT-03**: Outdoor photos added to property showcase — v2.1 Phase 7
- ✓ **PHOT-04**: All new images optimized with descriptive alt text — v2.1 Phase 7

### Performance

- ✓ **PERF-01**: Lighthouse mobile 90+ on Fast 3G — v2.1 Phase 8
- ✓ **PERF-02**: JS under 50KB (islands only) — v2.1 Phase 8
- ✓ **PERF-03**: FCP under 2s on Fast 3G — v2.1 Phase 8
- ✓ **PERF-04**: Zero client-side JS for static sections — v2.1 Phase 8
- ✓ **PERF-05**: Third-party embeds deferred until scroll — v2.1 Phase 8

### Accessibility

- ✓ **A11Y-01**: 16px min font, 18px body text — v2.1 Phase 8
- ✓ **A11Y-02**: 44x44px touch targets — v2.1 Phase 8
- ✓ **A11Y-03**: WCAG AA contrast — v2.1 Phase 8
- ✓ **A11Y-04**: Alt text on all images — v2.1 Phase 8
- ✓ **A11Y-05**: Click-to-call phone numbers — v2.1 Phase 8
- ✓ **A11Y-06**: Keyboard navigation — v2.1 Phase 8

### SEO & Deploy

- ✓ **SEDO-01**: Deployed to timberandthreadsretreat.com — v2.1 Phase 8
- ✓ **SEDO-02**: robots.txt and sitemap.xml — v2.1 Phase 8
- ✓ **SEDO-03**: Open Graph meta tags — v2.1 Phase 8
- ✓ **SEDO-04**: Semantic HTML with heading hierarchy — v2.1 Phase 8

## v2.0 Validated Requirements

Shipped in v2.0 phases 1-4. Confirmed working.

### Foundation

- ✓ **FOUND-01**: Astro 5 + Tailwind v4 + TypeScript + Vercel — v2.0 Phase 1
- ✓ **FOUND-02**: BaseLayout with meta tags, OG, fonts, global styles — v2.0 Phase 1
- ✓ **FOUND-03**: Mobile-first responsive design — v2.0 Phase 1
- ✓ **FOUND-04**: Navigation with smooth-scroll anchor links — v2.0 Phase 1
- ✓ **FOUND-05**: Image optimization pipeline (Cloudinary + Astro Image) — v2.0 Phase 1
- ✓ **FOUND-06**: Production build verified on Vercel — v2.0 Phase 1

### Content Sections

- ✓ **CONT-01**: Hero section — v2.0 Phase 2
- ✓ **CONT-02**: About section — v2.0 Phase 2
- ✓ **CONT-03**: Workshops section — v2.0 Phase 2
- ✓ **CONT-04**: Accommodations section — v2.0 Phase 2
- ✓ **CONT-05**: Connect section — v2.0 Phase 2
- ✓ **CONT-06**: Footer — v2.0 Phase 2
- ✓ **CONT-07**: All content migrated — v2.0 Phase 2

### Embeds

- ✓ **EMBD-01**: Google Calendar lazy-loaded — v2.0 Phase 2
- ✓ **EMBD-02**: Google Maps lazy-loaded — v2.0 Phase 2
- ✓ **EMBD-03**: Map with entrance photo and directions — v2.0 Phase 2

### Media

- ✓ **MDIA-01**: Gallery with Cloudinary CDN by category — v2.0 Phase 3
- ✓ **MDIA-02**: PhotoSwipe lightbox — v2.0 Phase 3
- ✓ **MDIA-03**: Responsive WebP/AVIF images — v2.0 Phase 3
- ✓ **MDIA-04**: Video placeholder with poster — v2.0 Phase 3
- ✓ **MDIA-05**: Lazy-loaded images, hero eager — v2.0 Phase 3
- ✓ **MDIA-06**: Hardcoded gallery data — v2.0 Phase 3

### Contact

- ✓ **CNTC-01**: Contact section with phone, email, address — v2.0 Phase 4
- ✓ **CNTC-02**: Contact form with validation — v2.0 Phase 4
- ✓ **CNTC-03**: Resend email delivery — v2.0 Phase 4
- ✓ **CNTC-04**: Honeypot spam prevention — v2.0 Phase 4
- ✓ **CNTC-05**: Success/error feedback — v2.0 Phase 4
- ✓ **CNTC-06**: Email credentials in env vars — v2.0 Phase 4

## Future Requirements

Deferred beyond v2.2. Tracked but not in current roadmap.

### Admin & Gallery Management

- **ADMN-01**: Admin interface for gallery image management
- **ADMN-02**: Dynamic gallery powered by Cloudinary API + Upstash Redis
- **ADMN-03**: Protected admin routes with authentication

### Content Enhancements

- **CENH-01**: Detailed quilting amenity showcase
- **CENH-02**: Nearby quilt shop directory
- **CENH-03**: Guest photo gallery from past retreats
- **CENH-04**: Sample itineraries and group booking guide

### Promo Video

- **VIDO-01**: Promo video integrated (replacing placeholder)
- **VIDO-02**: Video optimized for streaming on slow connections

### Gallery Updates

- **GALL-01**: Gallery image swap with client-selected photos

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Online booking/payment system | Conflicts with personal consultation workflow; high complexity |
| User accounts/login | Unnecessary for content site |
| Live chat widget | Resource-intensive to staff; older demographic prefers phone/email |
| Blog | Time-consuming to maintain |
| Online store | Not core business |
| Social media feed embeds | Can look stale; Facebook page link sufficient |
| Multi-language support | Unnecessary for rural Missouri demographic |
| Newsletter subscription | Client uses Facebook for updates |
| Full visual redesign | Client likes current look |
| Gallery image swap | Deferred until client selects new images |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PRIC-07 | Phase 9 → Phase 14 (verify) | Pending |
| PRIC-08 | Phase 10 | Complete |
| PRIC-09 | Phase 11 | Complete |
| PRIC-10 | Phase 11 | Complete |
| MOBL-01 | Phase 9 → Phase 14 (verify) | Pending |
| MOBL-02 | Phase 13 | Complete |
| MOBL-03 | Phase 13 | Complete |
| MOBL-04 | Phase 13 | Complete |
| MAPS-01 | Phase 12 | Pending |
| MAPS-02 | Phase 12 | Pending |
| TEST-01 | Phase 13 | Complete |
| TEST-02 | Phase 13 | Complete |
| TEST-03 | Phase 13 | Complete |

**Coverage:**
- v2.2 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---
*Requirements defined: 2026-02-25*
*Last updated: 2026-03-02 after v2.2 roadmap creation*
