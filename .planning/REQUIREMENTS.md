# Requirements: Timber & Threads Website Rebuild

**Defined:** 2026-02-16
**Core Value:** The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [ ] **FOUND-01**: Astro 5 project with Tailwind CSS v4, TypeScript strict, and Vercel deployment pipeline
- [ ] **FOUND-02**: BaseLayout with meta tags, Open Graph, fonts, and global styles
- [ ] **FOUND-03**: Mobile-first responsive design with breakpoints at sm/md/lg/xl
- [ ] **FOUND-04**: Navigation with smooth-scroll anchor links to all sections
- [ ] **FOUND-05**: Image optimization pipeline established (Cloudinary CDN for gallery, Astro `<Image>` for local assets)
- [ ] **FOUND-06**: Production build verified on Vercel with zero errors

### Content Sections

- [ ] **CONT-01**: Hero section with full-screen background image, logo, tagline, and CTA buttons
- [ ] **CONT-02**: About section describing the island retreat setting and quilting/crafting focus
- [ ] **CONT-03**: Workshops section covering group retreats, family gatherings, and amenities with details
- [ ] **CONT-04**: Accommodations section with 4 bedrooms, 2 bathrooms, workspaces, and pricing ($500-600/night)
- [ ] **CONT-05**: Connect section with Facebook page link and social preview card
- [ ] **CONT-06**: Footer with copyright, contact info, and navigation links
- [ ] **CONT-07**: All content migrated from current Next.js site with no information loss

### Media

- [ ] **MDIA-01**: Photo gallery with Cloudinary CDN delivery, organized by category (facility, quilting)
- [ ] **MDIA-02**: Gallery lightbox interaction for full-size image viewing
- [ ] **MDIA-03**: Responsive images with automatic WebP/AVIF format selection
- [ ] **MDIA-04**: Video section placeholder with poster image (swap in promo video when ready)
- [ ] **MDIA-05**: All images lazy-loaded below the fold; hero image eager-loaded with fetchpriority="high"
- [ ] **MDIA-06**: Hardcoded gallery image data (no dynamic API calls on page load)

### Embeds

- [ ] **EMBD-01**: Google Calendar embed showing retreat availability, lazy-loaded via Intersection Observer
- [ ] **EMBD-02**: Google Maps embed showing retreat location, lazy-loaded via Intersection Observer
- [ ] **EMBD-03**: Map section with entrance photo and written directions/description

### Contact

- [ ] **CNTC-01**: Contact section with phone number, email address, and physical address
- [ ] **CNTC-02**: Contact form with name, email, and message fields with client-side validation
- [ ] **CNTC-03**: Server endpoint (POST /api/contact) with server-side validation and email delivery via Resend
- [ ] **CNTC-04**: Honeypot field for basic spam prevention
- [ ] **CNTC-05**: Success/error feedback displayed to user after form submission
- [ ] **CNTC-06**: Email credentials stored in environment variables, never exposed to client

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

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Admin & Gallery Management

- **ADMN-01**: Admin interface for gallery image management (add/remove/reorder)
- **ADMN-02**: Dynamic gallery powered by Cloudinary API + Upstash Redis
- **ADMN-03**: Protected admin routes with authentication

### Content Enhancements

- **CENH-01**: Detailed quilting amenity showcase (design walls, cutting stations)
- **CENH-02**: Nearby quilt shop directory with links and addresses
- **CENH-03**: Guest photo gallery from past retreats
- **CENH-04**: Sample itineraries and group booking guide
- **CENH-05**: Accessibility information section (stairs, mobility, bathrooms)

### Promo Video

- **VIDO-01**: Promo video integrated into video section (replacing placeholder)
- **VIDO-02**: Video optimized for streaming on slow connections

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Online booking/payment system | Conflicts with personal consultation workflow; high complexity |
| User accounts/login | Unnecessary for content site; no member portal needed |
| Live chat widget | Resource-intensive to staff; older demographic prefers phone/email |
| Blog | Time-consuming to maintain; creates staleness if not updated |
| Online store | Scope creep; not core business |
| Social media feed embeds | Can look stale; Facebook page link sufficient |
| Multi-language support | Unnecessary for rural Missouri demographic |
| Newsletter subscription | Client uses Facebook for updates; lower maintenance |
| Full visual redesign | Client likes current look; refine, don't redesign |
| Automated availability sync | Over-engineering; Google Calendar embed matches current workflow |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Pending |
| CONT-01 | Phase 2 | Pending |
| CONT-02 | Phase 2 | Pending |
| CONT-03 | Phase 2 | Pending |
| CONT-04 | Phase 2 | Pending |
| CONT-05 | Phase 2 | Pending |
| CONT-06 | Phase 2 | Pending |
| CONT-07 | Phase 2 | Pending |
| EMBD-01 | Phase 2 | Pending |
| EMBD-02 | Phase 2 | Pending |
| EMBD-03 | Phase 2 | Pending |
| MDIA-01 | Phase 3 | Pending |
| MDIA-02 | Phase 3 | Pending |
| MDIA-03 | Phase 3 | Pending |
| MDIA-04 | Phase 3 | Pending |
| MDIA-05 | Phase 3 | Pending |
| MDIA-06 | Phase 3 | Pending |
| CNTC-01 | Phase 4 | Pending |
| CNTC-02 | Phase 4 | Pending |
| CNTC-03 | Phase 4 | Pending |
| CNTC-04 | Phase 4 | Pending |
| CNTC-05 | Phase 4 | Pending |
| CNTC-06 | Phase 4 | Pending |
| PERF-01 | Phase 5 | Pending |
| PERF-02 | Phase 5 | Pending |
| PERF-03 | Phase 5 | Pending |
| PERF-04 | Phase 5 | Pending |
| PERF-05 | Phase 5 | Pending |
| A11Y-01 | Phase 5 | Pending |
| A11Y-02 | Phase 5 | Pending |
| A11Y-03 | Phase 5 | Pending |
| A11Y-04 | Phase 5 | Pending |
| A11Y-05 | Phase 5 | Pending |
| A11Y-06 | Phase 5 | Pending |
| SEDO-01 | Phase 5 | Pending |
| SEDO-02 | Phase 5 | Pending |
| SEDO-03 | Phase 5 | Pending |
| SEDO-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 37
- Unmapped: 0

---
*Requirements defined: 2026-02-16*
*Last updated: 2026-02-16 after initial definition*
