# Requirements: Timber & Threads Website Enhancement

**Defined:** 2026-02-25
**Core Value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.

## v2.1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Pricing

- [x] **PRIC-01**: All pricing references across the site reflect the new rate structure ($60/night standard, $75/night with meals for ≤10; $600/night flat for 10-12)
- [x] **PRIC-02**: Booking requirements (min 4 persons, min 2 nights) displayed wherever pricing appears
- [ ] **PRIC-03**: User can estimate stay cost via interactive calculator with group size, nights, and food option inputs
- [ ] **PRIC-04**: Calculator enforces minimum constraints (4 persons, 2 nights) with clear feedback
- [ ] **PRIC-05**: Calculator displays real-time line-item breakdown (nightly rate, food cost, total) as user adjusts inputs
- [ ] **PRIC-06**: Calculator includes disclaimer note: "This is an estimate. Final pricing confirmed upon booking."

### Property

- [x] **PROP-01**: All references updated from 4 bedrooms to 3 bedrooms (page copy, meta descriptions, alt text)
- [x] **PROP-02**: Laundry facilities listed in amenities section
- [x] **PROP-03**: Full kitchen with dishwasher confirmed visible in amenities

### Photography

- [x] **PHOT-01**: IMG_4197, IMG_4204, IMG_4208, IMG_4237 edited, color-graded, and integrated into site
- [x] **PHOT-02**: IMG_4204 cropped per client direction before integration
- [x] **PHOT-03**: Dock, picnic table, and fire pit photos added to property showcase (when available)
- [x] **PHOT-04**: All new images optimized for web (compressed, responsive) with descriptive alt text

### Performance

- [x] **PERF-01**: Lighthouse mobile performance score 90+ on simulated Fast 3G
- [x] **PERF-02**: Total JavaScript shipped to client under 50KB (islands only)
- [x] **PERF-03**: First Contentful Paint under 2 seconds on Fast 3G
- [x] **PERF-04**: Zero client-side JavaScript for static content sections
- [x] **PERF-05**: All third-party embeds deferred until scrolled into view

### Accessibility

- [x] **A11Y-01**: Minimum 16px font size, 18px preferred for body text
- [x] **A11Y-02**: Touch targets minimum 44x44px for all interactive elements
- [x] **A11Y-03**: WCAG AA color contrast compliance
- [x] **A11Y-04**: Alt text on all images
- [x] **A11Y-05**: Click-to-call phone numbers on mobile
- [x] **A11Y-06**: Keyboard navigation support for all interactive elements

### SEO & Deploy

- [x] **SEDO-01**: Deploy to Vercel on timberandthreadsretreat.com domain
- [x] **SEDO-02**: robots.txt and sitemap.xml generated
- [x] **SEDO-03**: Open Graph meta tags for social sharing preview
- [x] **SEDO-04**: Semantic HTML structure with proper heading hierarchy

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
| PRIC-01 | Phase 6 | Complete |
| PRIC-02 | Phase 6 | Complete |
| PRIC-03 | Phase 6 | Pending |
| PRIC-04 | Phase 6 | Pending |
| PRIC-05 | Phase 6 | Pending |
| PRIC-06 | Phase 6 | Pending |
| PROP-01 | Phase 6 | Complete |
| PROP-02 | Phase 6 | Complete |
| PROP-03 | Phase 6 | Complete |
| PHOT-01 | Phase 7 | Complete |
| PHOT-02 | Phase 7 | Complete |
| PHOT-03 | Phase 7 | Complete |
| PHOT-04 | Phase 7 | Complete |
| PERF-01 | Phase 8 | Complete |
| PERF-02 | Phase 8 | Complete |
| PERF-03 | Phase 8 | Complete |
| PERF-04 | Phase 8 | Complete |
| PERF-05 | Phase 8 | Complete |
| A11Y-01 | Phase 8 | Complete |
| A11Y-02 | Phase 8 | Complete |
| A11Y-03 | Phase 8 | Complete |
| A11Y-04 | Phase 8 | Complete |
| A11Y-05 | Phase 8 | Complete |
| A11Y-06 | Phase 8 | Complete |
| SEDO-01 | Phase 8 | Complete |
| SEDO-02 | Phase 8 | Complete |
| SEDO-03 | Phase 8 | Complete |
| SEDO-04 | Phase 8 | Complete |

**Coverage:**
- v2.1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-02-25*
*Last updated: 2026-02-25 after roadmap creation (phases 6-8 assigned)*
