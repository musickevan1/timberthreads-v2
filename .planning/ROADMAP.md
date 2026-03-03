# Roadmap: Timber & Threads Website

## Milestones

- ✅ **v2.0 Website Rebuild** - Phases 1-4 (shipped 2026-02-17)
- ✅ **v2.1 Website Enhancement** - Phases 6-8 (shipped 2026-03-02)
- 🚧 **v2.2 Client Preview Polish** - Phases 9-14 (in progress)

## Phases

<details>
<summary>✅ v2.0 Website Rebuild (Phases 1-4) - SHIPPED 2026-02-17</summary>

### Phase 1: Foundation and Static Shell
**Goal**: A working Astro project deployed to Vercel with BaseLayout, global styles, responsive navigation, and the image optimization pipeline established -- so every subsequent phase builds on proven infrastructure
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06
**Success Criteria** (what must be TRUE):
  1. Running `npm run build` produces a zero-error production build, and the deployed Vercel preview loads in a browser
  2. The site displays a BaseLayout with navigation links that smooth-scroll to placeholder section anchors, and the layout is responsive across mobile, tablet, and desktop viewports
  3. A test image processed through Astro's `<Image>` component serves in WebP/AVIF format at responsive sizes, confirming the local image pipeline works
  4. A test image URL from Cloudinary CDN loads correctly, confirming the gallery image delivery path works
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md -- Scaffold Astro 5 project with Tailwind v4 CSS-first config, TypeScript strict, Vercel static adapter, and brand theme
- [x] 01-02-PLAN.md -- BaseLayout with meta/OG tags, sticky navigation with scroll-spy, hero section, footer, mobile menu, and section placeholders
- [x] 01-03-PLAN.md -- Image pipeline verification (Astro local + Cloudinary CDN) and Vercel production deploy with human review

### Phase 2: Content Sections and Embeds
**Goal**: Every content section from the current Next.js site is migrated into Astro components with no information loss, and the site looks like a complete (if not yet interactive) retreat website that a visitor can scroll through
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07, EMBD-01, EMBD-02, EMBD-03
**Success Criteria** (what must be TRUE):
  1. A visitor can scroll from Hero through About, Workshops, Accommodations, Calendar, Map, Connect, and Footer -- seeing all retreat information including pricing, amenities, and the island setting description
  2. The Google Calendar embed loads only when scrolled into view (not on initial page load), showing retreat availability
  3. The Google Maps embed loads only when scrolled into view, and the Map section includes the entrance photo with written directions
  4. All text content from the current Next.js site is present with no information loss (side-by-side comparison passes)
  5. The Hero section displays a full-screen background image with logo, tagline, and CTA buttons that link to relevant sections
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md -- Copy image assets, create About section (text + staggered image grid), create Workshops/Retreats section (3-card grid)
- [x] 02-02-PLAN.md -- Create Accommodations section (2 image cards), Calendar section (lazy-loaded Google Calendar + pricing/meals), Connect section (Facebook social card)
- [x] 02-03-PLAN.md -- Create Map/Location section (lazy-loaded Google Maps + driving directions + entrance photo), finalize index.astro assembly, human verification

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
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md -- Gallery data file, Cloudinary URL helpers, VideoPlaceholder/GalleryCategory/Gallery components, index.astro integration
- [x] 03-02-PLAN.md -- PhotoSwipe lightbox installation, caption support, loading strategy verification, human review

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
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md -- Contact section UI with info display, 3-field form, client-side validation, honeypot, spinner, and Facebook card
- [x] 04-02-PLAN.md -- Resend SDK install, POST /api/contact server endpoint, email delivery, .env.example, human verification

</details>

<details>
<summary>✅ v2.1 Website Enhancement (Phases 6-8) - SHIPPED 2026-03-02</summary>

### Phase 6: Pricing, Calculator, and Property Corrections
**Goal**: Visitors see accurate pricing and property details everywhere on the site, and can interactively estimate their stay cost before contacting the retreat
**Depends on**: Phase 4 (content foundation complete)
**Requirements**: PRIC-01, PRIC-02, PRIC-03, PRIC-04, PRIC-05, PRIC-06, PROP-01, PROP-02, PROP-03
**Success Criteria** (what must be TRUE):
  1. Every pricing mention on the site reflects the new rate structure ($60/night standard or $75/night with meals for groups of 10 or fewer; $600/night flat rate for groups of 10-12), with booking minimums (4 persons, 2 nights) visible wherever pricing appears
  2. An interactive pricing calculator is accessible on the page -- visitor enters group size, number of nights, and food option, and sees a real-time line-item breakdown (nightly rate, food cost, total) update as they adjust any input
  3. The calculator enforces minimum constraints: entering fewer than 4 persons or fewer than 2 nights shows a clear inline message explaining the minimums
  4. The calculator displays a disclaimer note: "This is an estimate. Final pricing confirmed upon booking."
  5. All references to bedrooms read "3 bedrooms" (not 4), laundry facilities appear in the amenities list, and the full kitchen with dishwasher is visible in accommodations copy
**Plans**: 2 plans

Plans:
- [x] 06-01-PLAN.md -- Update pricing copy across all sections (Accommodations, pricing references, meta descriptions, alt text) and correct property details (3 bedrooms, laundry, kitchen)
- [x] 06-02-PLAN.md -- Build PricingCalculator Astro island component with real-time estimates, constraint validation, disclaimer, and integration into the page

### Phase 7: Photography Integration
**Goal**: The site showcases the retreat property with updated photography -- edited, color-graded, and optimized images integrated into the gallery and property sections
**Depends on**: Phase 6 (content stable before gallery additions)
**Requirements**: PHOT-01, PHOT-02, PHOT-03, PHOT-04
**Success Criteria** (what must be TRUE):
  1. The four edited photos (IMG_4197, IMG_4204, IMG_4208, IMG_4237) appear in the site gallery, served through Cloudinary CDN in WebP/AVIF format at responsive sizes
  2. IMG_4204 is visibly cropped per client direction (no unwanted edges or distracting elements in frame)
  3. New outdoor photos (dock, picnic table, fire pit) appear in the property showcase section when provided -- if not yet available, placeholder positions are marked in gallery data with a TODO comment
  4. Every new image has descriptive alt text that communicates the subject to screen reader users
**Plans**: 1 plan

Plans:
- [x] 07-01-PLAN.md -- Edit and color-grade IMG_4197, IMG_4204, IMG_4208, IMG_4237 (crop IMG_4204), upload to Cloudinary, integrate into gallery data with alt text

### Phase 8: Polish, Accessibility, SEO, and Deploy
**Goal**: The site meets Lighthouse 90+ on mobile Fast 3G, passes WCAG AA, has complete SEO markup, and is live at timberandthreadsretreat.com -- ready for real visitors on slow rural connections
**Depends on**: Phase 7 (all content and photography finalized)
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-04, PERF-05, A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06, SEDO-01, SEDO-02, SEDO-03, SEDO-04
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile audit on simulated Fast 3G scores 90+ for Performance, with First Contentful Paint under 2 seconds
  2. Total JavaScript shipped to the client is under 50KB (islands only), and all static content sections ship zero client-side JavaScript
  3. All interactive elements have 44x44px minimum touch targets, body text is at least 16px (18px preferred), and color contrast passes WCAG AA -- verified by axe-core audit with zero critical violations
  4. Every image has descriptive alt text, all interactive elements (including the pricing calculator) are keyboard-navigable, and phone numbers are click-to-call links on mobile
  5. The site is live at timberandthreadsretreat.com with robots.txt, sitemap.xml, Open Graph meta tags, and semantic HTML with proper heading hierarchy
**Plans**: 3 plans

Plans:
- [x] 08-01-PLAN.md -- Performance audit and optimization (Lighthouse, JS budget, lazy loading, third-party embed deferral)
- [x] 08-02-PLAN.md -- Accessibility audit and fixes (WCAG AA, touch targets, keyboard nav, font sizes, click-to-call)
- [x] 08-03-PLAN.md -- SEO markup (robots.txt, sitemap.xml, OG tags, semantic HTML) and production domain deployment

</details>

### 🚧 v2.2 Client Preview Polish (In Progress)

**Milestone Goal:** Polish the site for client preview -- remove duplicate pricing cards, enhance the calculator with per-person breakdown and a quote CTA that pre-fills the contact form, fix mobile header branding, add visual driving directions to the map, and verify all viewport sizes with Playwright.

#### Phase 9: Mobile Header and Pricing Cleanup
**Goal**: The site header shows the retreat name on mobile, and the Accommodations section no longer duplicates the pricing cards that belong in the Pricing section
**Depends on**: Phase 8 (polished baseline)
**Requirements**: MOBL-01, PRIC-07
**Success Criteria** (what must be TRUE):
  1. On a 375px mobile viewport, the header displays the "Timber & Threads" text alongside the logo without overflowing or pushing the hamburger button off-screen
  2. On a 320px mobile viewport, the header text remains legible and the layout does not overflow horizontally
  3. The Accommodations section contains no duplicate pricing tier cards -- pricing cards appear only in the Pricing/Calculator section
  4. The desktop layout at 1280px is unchanged after the mobile header fix -- sticky nav, logo, and links all render correctly
**Plans**: 1 plan

Plans:
- [ ] 09-01-PLAN.md -- Show brand text on mobile (Nav.astro), remove duplicate pricing cards from Accommodations section, add pricing teaser link

#### Phase 10: Calculator Per-Person Breakdown
**Goal**: The pricing calculator shows a per-person cost breakdown below the total estimate, giving group organizers the number they need to communicate individual costs to their group
**Depends on**: Phase 9
**Requirements**: PRIC-08
**Success Criteria** (what must be TRUE):
  1. After entering a valid group size and number of nights, the calculator breakdown panel displays a per-person cost line below the total estimate
  2. The per-person cost updates in real time as the visitor adjusts group size, nights, or the food option
  3. The per-person breakdown is not shown when the calculator inputs are below minimum constraints (fewer than 4 persons or fewer than 2 nights)
**Plans**: TBD

Plans:
- [ ] 10-01-PLAN.md -- Add per-person cost calculation and breakdown display to PricingCalculator.tsx Preact island

#### Phase 11: Calculator-to-Contact Quote Flow
**Goal**: Visitors can move directly from seeing their cost estimate to sending a quote request -- the "Get a Quote" button scrolls to the contact form and pre-fills it with the full estimate details so they never have to re-type what they just calculated
**Depends on**: Phase 10 (breakdown panel must exist before adding the CTA adjacent to it)
**Requirements**: PRIC-09, PRIC-10
**Success Criteria** (what must be TRUE):
  1. A "Get a Quote" button is visible below the calculator estimate when valid inputs are entered
  2. Clicking "Get a Quote" scrolls the page to the contact form section, with the section heading fully visible below the fixed navigation bar
  3. The contact form message field is pre-filled with a formatted summary of the estimate (group size, nights, meal option, total cost, per-person cost)
  4. If the visitor has already typed a message in the contact form, clicking "Get a Quote" does not overwrite their draft -- the pre-fill only applies to an empty message field
**Plans**: TBD

Plans:
- [ ] 11-01-PLAN.md -- Add "Get a Quote" button and `handleGetQuote()` to PricingCalculator.tsx; dispatch `CustomEvent('calculator:quote-requested')` with estimate payload; add listener in Contact.astro that pre-fills message field via DOM property assignment; verify scroll-margin-top on #contact section

#### Phase 12: Google Maps Driving Route
**Goal**: The embedded map shows an interactive visual driving route to the retreat property, replacing the static location pin with a route that first-time visitors can actually follow
**Depends on**: Phase 9 (site stable; API key setup can happen in parallel with Phases 10-11)
**Requirements**: MAPS-01, MAPS-02
**Success Criteria** (what must be TRUE):
  1. The map section displays an interactive Google Map showing a driving route from a nearby highway landmark to 306 NW 300 Rd, Clinton, MO 64735
  2. A visitor can zoom and pan the embedded route map without leaving the page
  3. An "Open in Google Maps" link lets visitors launch turn-by-turn navigation from their current location
**Plans**: 1 plan

Plans:
- [x] 12-01-PLAN.md -- Replace static map pin with no-API-key directions embed showing driving route from Highway 7 to property via NW 221 Rd, add "Open in Google Maps" link

#### Phase 13: Playwright Viewport Verification
**Goal**: Automated tests confirm that every v2.2 feature works correctly at desktop and mobile viewport sizes, running against the production build so results reflect what real visitors experience
**Depends on**: Phases 9-12 (tests validate the complete v2.2 feature set)
**Requirements**: MOBL-02, MOBL-03, MOBL-04, TEST-01, TEST-02, TEST-03
**Success Criteria** (what must be TRUE):
  1. Running `npx playwright test` against the production build (`npm run build && npm run preview`) completes with all tests passing and no flaky failures
  2. Tests assert that key elements are visible at desktop 1280px: header brand text, pricing calculator, "Get a Quote" button, map iframe, and contact form
  3. Tests assert that key elements are visible at mobile 375px: header brand text visible (not hidden), calculator renders without horizontal overflow, contact form is accessible
  4. A test verifies that clicking "Get a Quote" pre-fills the contact form message field at both desktop and mobile viewports
  5. No test uses screenshot pixel comparisons -- all assertions are element visibility and content checks
**Plans**: TBD

Plans:
- [ ] 13-01-PLAN.md -- Install `@playwright/test`, create `playwright.config.ts` with desktop/mobile/Pixel 5/iPhone 12 profiles and `webServer` build+preview command, write `tests/viewport.spec.ts` with assertion-based tests covering all v2.2 features

#### Phase 14: Tech Debt Cleanup and Phase 9 Verification
**Goal**: Close audit gaps by verifying Phase 9 requirements (PRIC-07, MOBL-01), removing the orphaned Connect.astro file, and confirming REQUIREMENTS.md accuracy
**Depends on**: Phase 9 (verification of its completed work)
**Requirements**: PRIC-07, MOBL-01
**Gap Closure:** Closes gaps from v2.2 milestone audit
**Success Criteria** (what must be TRUE):
  1. Phase 9 has a VERIFICATION.md confirming PRIC-07 (no duplicate pricing cards in Accommodations) and MOBL-01 (mobile header shows brand text) are satisfied
  2. The orphaned `src/components/Connect.astro` file is deleted -- only `Contact.astro` exists for the contact section
  3. REQUIREMENTS.md traceability table shows PRIC-07 and MOBL-01 as Complete with correct phase assignments
**Plans**: 1 plan

Plans:
- [ ] 14-01-PLAN.md -- Verify Phase 9 requirements (PRIC-07, MOBL-01) with VERIFICATION.md, delete orphaned Connect.astro, update REQUIREMENTS.md

## Progress

**Execution Order:**
v2.0: 1 → 2 → 3 → 4 (complete)
v2.1: 6 → 7 → 8 (complete)
v2.2: 9 → 10 → 11 → 12 → 13 → 14

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation and Static Shell | v2.0 | 3/3 | Complete | 2026-02-17 |
| 2. Content Sections and Embeds | v2.0 | 3/3 | Complete | 2026-02-17 |
| 3. Gallery and Media | v2.0 | 2/2 | Complete | 2026-02-17 |
| 4. Contact Form and Server Endpoint | v2.0 | 2/2 | Complete | 2026-02-17 |
| 6. Pricing, Calculator, and Property Corrections | v2.1 | 2/2 | Complete | 2026-03-02 |
| 7. Photography Integration | v2.1 | 1/1 | Complete | 2026-03-01 |
| 8. Polish, Accessibility, SEO, and Deploy | v2.1 | 3/3 | Complete | 2026-03-02 |
| 9. Mobile Header and Pricing Cleanup | v2.2 | 1/1 | Complete | 2026-03-02 |
| 10. Calculator Per-Person Breakdown | v2.2 | 1/1 | Complete | 2026-03-02 |
| 11. Calculator-to-Contact Quote Flow | v2.2 | Complete    | 2026-03-03 | 2026-03-02 |
| 12. Google Maps Driving Route | v2.2 | Complete    | 2026-03-03 | - |
| 13. Playwright Viewport Verification | 1/1 | Complete    | 2026-03-03 | - |
| 14. Tech Debt Cleanup and Phase 9 Verification | v2.2 | 0/1 | Not started | - |
