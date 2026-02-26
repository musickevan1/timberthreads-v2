# Requirements: Timber & Threads Website Enhancement

**Defined:** 2026-02-25
**Core Value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.

## v2.1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Pricing

- [ ] **PRIC-01**: All pricing references across the site reflect the new rate structure ($60/night standard, $75/night with meals for ≤10; $600/night flat for 10-12)
- [ ] **PRIC-02**: Booking requirements (min 4 persons, min 2 nights) displayed wherever pricing appears
- [ ] **PRIC-03**: User can estimate stay cost via interactive calculator with group size, nights, and food option inputs
- [ ] **PRIC-04**: Calculator enforces minimum constraints (4 persons, 2 nights) with clear feedback
- [ ] **PRIC-05**: Calculator displays real-time line-item breakdown (nightly rate, food cost, total) as user adjusts inputs
- [ ] **PRIC-06**: Calculator includes disclaimer note: "This is an estimate. Final pricing confirmed upon booking."

### Property

- [ ] **PROP-01**: All references updated from 4 bedrooms to 3 bedrooms (page copy, meta descriptions, alt text)
- [ ] **PROP-02**: Laundry facilities listed in amenities section
- [ ] **PROP-03**: Full kitchen with dishwasher confirmed visible in amenities

### Photography

- [ ] **PHOT-01**: IMG_4197, IMG_4204, IMG_4208, IMG_4237 edited, color-graded, and integrated into site
- [ ] **PHOT-02**: IMG_4204 cropped per client direction before integration
- [ ] **PHOT-03**: Dock, picnic table, and fire pit photos added to property showcase (when available)
- [ ] **PHOT-04**: All new images optimized for web (compressed, responsive) with descriptive alt text

### Performance

- [ ] **PERF-01**: Lighthouse mobile performance score 90+ on simulated Fast 3G
- [ ] **PERF-02**: Total JavaScript shipped to client under 50KB (islands only)
- [ ] **PERF-03**: First Contentful Paint under 2 seconds on Fast 3G
- [ ] **PERF-04**: Zero client-side JavaScript for static content sections
- [ ] **PERF-05**: All third-party embeds deferred until scrolled into view

### Accessibility

- [ ] **A11Y-01**: Minimum 16px font size, 18px preferred for body text
- [ ] **A11Y-02**: Touch targets minimum 44x44px for all interactive elements
- [ ] **A11Y-03**: WCAG AA color contrast compliance
- [ ] **A11Y-04**: Alt text on all images
- [ ] **A11Y-05**: Click-to-call phone numbers on mobile
- [ ] **A11Y-06**: Keyboard navigation support for all interactive elements

### SEO & Deploy

- [ ] **SEDO-01**: Deploy to Vercel on timberandthreadsretreat.com domain
- [ ] **SEDO-02**: robots.txt and sitemap.xml generated
- [ ] **SEDO-03**: Open Graph meta tags for social sharing preview
- [ ] **SEDO-04**: Semantic HTML structure with proper heading hierarchy

## v2.0 Validated Requirements

Shipped in v2.0 phases 1-4. Confirmed working.

### Foundation

- ✓ **FOUND-01**: Astro 5 project with Tailwind CSS v4, TypeScript strict, Vercel deployment — v2.0 Phase 1
- ✓ **FOUND-02**: BaseLayout with meta tags, Open Graph, fonts, global styles — v2.0 Phase 1
- ✓ **FOUND-03**: Mobile-first responsive design — v2.0 Phase 1
- ✓ **FOUND-04**: Navigation with smooth-scroll anchor links — v2.0 Phase 1
- ✓ **FOUND-05**: Image optimization pipeline (Cloudinary CDN + Astro Image) — v2.0 Phase 1
- ✓ **FOUND-06**: Production build verified on Vercel — v2.0 Phase 1

### Content Sections

- ✓ **CONT-01**: Hero section with full-screen background image, logo, tagline, CTAs — v2.0 Phase 2
- ✓ **CONT-02**: About section — v2.0 Phase 2
- ✓ **CONT-03**: Workshops section — v2.0 Phase 2
- ✓ **CONT-04**: Accommodations section — v2.0 Phase 2
- ✓ **CONT-05**: Connect section — v2.0 Phase 2
- ✓ **CONT-06**: Footer — v2.0 Phase 2
- ✓ **CONT-07**: All content migrated with no information loss — v2.0 Phase 2

### Embeds

- ✓ **EMBD-01**: Google Calendar embed, lazy-loaded — v2.0 Phase 2
- ✓ **EMBD-02**: Google Maps embed, lazy-loaded — v2.0 Phase 2
- ✓ **EMBD-03**: Map section with entrance photo and directions — v2.0 Phase 2

### Media

- ✓ **MDIA-01**: Photo gallery with Cloudinary CDN, organized by category — v2.0 Phase 3
- ✓ **MDIA-02**: Gallery lightbox with PhotoSwipe — v2.0 Phase 3
- ✓ **MDIA-03**: Responsive images with WebP/AVIF — v2.0 Phase 3
- ✓ **MDIA-04**: Video placeholder with poster — v2.0 Phase 3
- ✓ **MDIA-05**: Lazy-loaded images, hero eager-loaded — v2.0 Phase 3
- ✓ **MDIA-06**: Hardcoded gallery data — v2.0 Phase 3

### Contact

- ✓ **CNTC-01**: Contact section with phone, email, address — v2.0 Phase 4
- ✓ **CNTC-02**: Contact form with validation — v2.0 Phase 4
- ✓ **CNTC-03**: Server endpoint with Resend email delivery — v2.0 Phase 4
- ✓ **CNTC-04**: Honeypot spam prevention — v2.0 Phase 4
- ✓ **CNTC-05**: Success/error feedback — v2.0 Phase 4
- ✓ **CNTC-06**: Email credentials in env vars only — v2.0 Phase 4

## Future Requirements

Deferred beyond v2.1. Tracked but not in current roadmap.

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

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PRIC-01 | TBD | Pending |
| PRIC-02 | TBD | Pending |
| PRIC-03 | TBD | Pending |
| PRIC-04 | TBD | Pending |
| PRIC-05 | TBD | Pending |
| PRIC-06 | TBD | Pending |
| PROP-01 | TBD | Pending |
| PROP-02 | TBD | Pending |
| PROP-03 | TBD | Pending |
| PHOT-01 | TBD | Pending |
| PHOT-02 | TBD | Pending |
| PHOT-03 | TBD | Pending |
| PHOT-04 | TBD | Pending |
| PERF-01 | TBD | Pending |
| PERF-02 | TBD | Pending |
| PERF-03 | TBD | Pending |
| PERF-04 | TBD | Pending |
| PERF-05 | TBD | Pending |
| A11Y-01 | TBD | Pending |
| A11Y-02 | TBD | Pending |
| A11Y-03 | TBD | Pending |
| A11Y-04 | TBD | Pending |
| A11Y-05 | TBD | Pending |
| A11Y-06 | TBD | Pending |
| SEDO-01 | TBD | Pending |
| SEDO-02 | TBD | Pending |
| SEDO-03 | TBD | Pending |
| SEDO-04 | TBD | Pending |

**Coverage:**
- v2.1 requirements: 28 total
- Mapped to phases: 0
- Unmapped: 28 (pending roadmap creation)

---
*Requirements defined: 2026-02-25*
*Last updated: 2026-02-25 after initial definition*
