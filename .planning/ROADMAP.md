# Roadmap: Timber & Threads Website Rebuild

## Overview

This roadmap delivers a ground-up Astro rebuild of the Timber & Threads Retreat website, optimized for quilters and families browsing on slow rural Missouri connections. The five phases follow the dependency chain from build infrastructure through static content, interactive media, server-side contact form, and finally cross-cutting polish. Each phase produces a deployable site on Vercel, with the client able to review real progress after Phase 2.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation and Static Shell** - Astro 5 + Tailwind v4 project with layout, navigation, image pipeline, and Vercel deploy
- [ ] **Phase 2: Content Sections and Embeds** - All static content migrated from current site with lazy-loaded Calendar and Maps embeds
- [ ] **Phase 3: Gallery and Media** - Photo gallery with Cloudinary CDN, lightbox interaction, video placeholder
- [ ] **Phase 4: Contact Form and Server Endpoint** - Contact form with validation, Resend email delivery, spam prevention
- [ ] **Phase 5: Polish, Accessibility, and Performance** - Lighthouse 90+, WCAG AA, SEO, production domain deploy

## Phase Details

### Phase 1: Foundation and Static Shell
**Goal**: A working Astro project deployed to Vercel with BaseLayout, global styles, responsive navigation, and the image optimization pipeline established -- so every subsequent phase builds on proven infrastructure
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06
**Success Criteria** (what must be TRUE):
  1. Running `npm run build` produces a zero-error production build, and the deployed Vercel preview loads in a browser
  2. The site displays a BaseLayout with navigation links that smooth-scroll to placeholder section anchors, and the layout is responsive across mobile, tablet, and desktop viewports
  3. A test image processed through Astro's `<Image>` component serves in WebP/AVIF format at responsive sizes, confirming the local image pipeline works
  4. A test image URL from Cloudinary CDN loads correctly, confirming the gallery image delivery path works
**Plans**: TBD

Plans:
- [ ] 01-01: Project scaffolding, Tailwind v4, TypeScript strict, Vercel adapter
- [ ] 01-02: BaseLayout, global styles, navigation, responsive design
- [ ] 01-03: Image optimization pipeline (Astro local + Cloudinary CDN) and production deploy verification

### Phase 2: Content Sections and Embeds
**Goal**: Every content section from the current Next.js site is migrated into Astro components with no information loss, and the site looks like a complete (if not yet interactive) retreat website that a visitor can scroll through
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, EMBD-01, EMBD-02, EMBD-03
**Success Criteria** (what must be TRUE):
  1. A visitor can scroll from Hero through About, Workshops, Accommodations, Calendar, Map, Connect, and Footer -- seeing all retreat information including pricing ($500-600/night), amenities, and the island setting description
  2. The Google Calendar embed loads only when scrolled into view (not on initial page load), showing retreat availability
  3. The Google Maps embed loads only when scrolled into view, and the Map section includes the entrance photo with written directions
  4. All text content from the current Next.js site is present with no information loss (side-by-side comparison passes)
  5. The Hero section displays a full-screen background image with logo, tagline, and CTA buttons that link to relevant sections
**Plans**: TBD

Plans:
- [ ] 02-01: Hero, About, and Workshops sections
- [ ] 02-02: Accommodations, Connect, and Footer sections
- [ ] 02-03: Google Calendar embed, Google Maps embed, and Map section with lazy loading

### Phase 3: Gallery and Media
**Goal**: Visitors can browse retreat photos organized by category with a smooth lightbox experience, all images delivered through Cloudinary CDN with automatic format optimization, and a video placeholder is ready for the promo video
**Depends on**: Phase 2
**Requirements**: MDIA-01, MDIA-02, MDIA-03, MDIA-04, MDIA-05, MDIA-06
**Success Criteria** (what must be TRUE):
  1. A visitor sees gallery photos organized into facility and quilting categories, with thumbnail images loading progressively as they scroll
  2. Clicking a gallery thumbnail opens a lightbox overlay showing the full-size image, and the lightbox can be closed with a button, Escape key, or clicking outside
  3. Gallery images are served from Cloudinary CDN in WebP or AVIF format at responsive sizes matching the visitor's viewport (no oversized images on mobile)
  4. The video section displays a poster image with clear indication that a promo video is coming, without any broken media or empty space
  5. Below-fold images are lazy-loaded and the hero image is eager-loaded with fetchpriority="high" -- verified by checking network waterfall in DevTools
**Plans**: TBD

Plans:
- [ ] 03-01: Gallery component with Cloudinary CDN integration and hardcoded image data
- [ ] 03-02: Lightbox interaction and responsive image optimization
- [ ] 03-03: Video placeholder section and image loading strategy (lazy/eager)

### Phase 4: Contact Form and Server Endpoint
**Goal**: Visitors can send an inquiry to the retreat owners through a contact form that validates input, delivers email reliably via Resend, and prevents spam -- the only server-side feature on the site
**Depends on**: Phase 3
**Requirements**: CNTC-01, CNTC-02, CNTC-03, CNTC-04, CNTC-05, CNTC-06
**Success Criteria** (what must be TRUE):
  1. The contact section displays the retreat phone number (clickable on mobile), email address, and physical address without requiring any form interaction
  2. A visitor can fill out name, email, and message fields, and the form shows validation errors for missing or invalid input before submission
  3. Submitting a valid form delivers an email to the retreat owner's inbox (via Resend), and the visitor sees a success confirmation message
  4. Submitting an invalid form or triggering a server error shows a clear error message to the visitor without losing their form input
  5. The honeypot field is invisible to real users and catches basic bot submissions; email credentials are not exposed in client-side JavaScript
**Plans**: TBD

Plans:
- [ ] 04-01: Contact section with info display and form with client-side validation
- [ ] 04-02: Server endpoint with Resend email delivery, honeypot, and error handling

### Phase 5: Polish, Accessibility, and Performance
**Goal**: The site meets Lighthouse 90+ on mobile Fast 3G, passes WCAG AA accessibility standards, has proper SEO markup, and is deployed to the production domain -- ready for real visitors on slow rural connections
**Depends on**: Phase 4
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06, SEDO-01, SEDO-02, SEDO-03, SEDO-04
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile audit on simulated Fast 3G scores 90+ for Performance, with First Contentful Paint under 2 seconds
  2. Total JavaScript shipped to the client is under 50KB, and static content sections ship zero client-side JavaScript
  3. All interactive elements have 44x44px minimum touch targets, body text is 18px, and color contrast passes WCAG AA (verified by axe-core audit with zero critical violations)
  4. Every image has descriptive alt text, all interactive elements are keyboard-navigable, and phone numbers are click-to-call on mobile
  5. The site is deployed to timberandthreadsretreat.com with robots.txt, sitemap.xml, Open Graph meta tags, and semantic HTML with proper heading hierarchy
**Plans**: TBD

Plans:
- [ ] 05-01: Performance audit and optimization (Lighthouse, JS budget, lazy loading verification)
- [ ] 05-02: Accessibility audit and fixes (WCAG AA, touch targets, keyboard nav, alt text)
- [ ] 05-03: SEO, meta tags, sitemap, and production domain deployment

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|---------------|--------|-----------|
| 1. Foundation and Static Shell | 0/3 | Not started | - |
| 2. Content Sections and Embeds | 0/3 | Not started | - |
| 3. Gallery and Media | 0/3 | Not started | - |
| 4. Contact Form and Server Endpoint | 0/2 | Not started | - |
| 5. Polish, Accessibility, and Performance | 0/3 | Not started | - |
