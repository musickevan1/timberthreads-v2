# Project Research Summary

**Project:** Timber & Threads Website Rebuild (v2)
**Domain:** Small business hospitality / quilting retreat center website
**Researched:** 2026-02-16
**Confidence:** HIGH

## Executive Summary

Timber & Threads is a quilting retreat center on an island in Truman Lake near Clinton, Missouri. The website rebuild migrates from Next.js to Astro 5, targeting a single-page scrolling site that serves an older demographic (quilters) on slow rural 3G/4G connections. The expert consensus is clear: Astro's zero-JS-by-default architecture is the ideal framework for this use case, delivering 40%+ faster load times than Next.js for content-heavy sites. The stack is mature and well-documented -- Astro 5.17, Tailwind CSS v4, Cloudinary for gallery images, Resend for contact form email, deployed on Vercel free tier. There are no exotic technology choices; every piece has official documentation and established integration patterns.

The recommended approach is a static-first single-page site with islands architecture. The page renders as pure HTML/CSS with zero JavaScript, except for two interactive islands: a gallery lightbox and a contact form. Both use `client:visible` to defer hydration until the user scrolls to them. Google Maps and Google Calendar embeds use lazy-loaded iframes via Intersection Observer. The contact form submits to a single Vercel serverless endpoint that sends email via Resend. Every other section -- hero, about, services, pricing, testimonials, location -- is static Astro components with Tailwind styling. This architecture naturally solves the core constraint: fast loading on slow rural connections.

The biggest risks are performance-related, not architectural. Over-hydrating components with `client:load` instead of `client:visible` can negate Astro's entire advantage. Unoptimized images (placed in `public/` instead of using Astro's `<Image>` or Cloudinary) will be catastrophic on 3G -- a single 3MB JPEG takes 30+ seconds. Google Maps iframes block the main thread with 100+ HTTP requests if not lazy-loaded. These are all preventable with discipline established in Phase 1. The project is low-risk overall: the stack is proven, the scope is small, and the patterns are well-documented.

## Key Findings

### Recommended Stack

The stack is deliberately minimal and budget-conscious. Every choice optimizes for performance on slow connections and zero ongoing hosting cost.

**Core technologies:**
- **Astro 5.17.2**: Static site framework -- zero JS by default, View Transitions API for SPA-like feel, built-in image optimization via Sharp
- **Tailwind CSS v4**: Utility-first CSS via native Vite plugin (`@tailwindcss/vite`) -- zero config, 5x faster builds than v3, mobile-first utilities
- **Resend 6.9.2**: Email delivery for contact form -- works on Vercel serverless (unlike Nodemailer), free tier of 100 emails/day
- **astro-cloudinary 1.3.5**: Gallery images via Cloudinary CDN -- responsive sizing, automatic AVIF/WebP, lazy loading
- **Vercel**: Static hosting + single serverless function -- zero-config deploy, free tier, global edge network
- **TypeScript (strict)**: Built into Astro, catches bugs at dev time

**Critical version note:** Use `@tailwindcss/vite` plugin, NOT the deprecated `@astrojs/tailwind` integration. Tailwind v4 is zero-config -- no `tailwind.config.mjs` needed.

### Expected Features

**Must have (table stakes) -- all P1 for launch:**
- Mobile-responsive design (70%+ of traffic will be mobile)
- Professional photography with optimized gallery (visual proof of quality)
- Clear contact info on every page (phone, email, address)
- Contact form with inquiry-to-quote workflow
- Availability calendar (embedded Google Calendar)
- Transparent pricing (rates, deposits, what's included)
- Room/facility details with amenity descriptions
- Location with embedded Google Maps and written directions
- About/story section (trust and personal connection)
- Social proof (3-5 testimonial quotes)
- Fast load times (optimized images, lazy loading, Core Web Vitals)

**Should have (differentiators) -- add post-launch:**
- Detailed quilting amenity showcase (75-foot design walls, cutting stations)
- Nearby quilt shop directory
- Guest photo gallery from past retreats
- Sample itineraries and group booking guide
- Accessibility information (critical for older demographic)

**Defer (v2+):**
- Virtual tour / 360-degree video (wait for budget)
- Event calendar / public workshop schedule
- Any form of online booking/payment system (anti-feature -- conflicts with personal consultation workflow)

### Architecture Approach

Single-page scrolling site built as composable Astro section components. The page is assembled in `index.astro` by importing discrete sections (Hero, About, Services, Gallery, Contact, Footer). Interactive features use islands architecture -- React or vanilla JS components hydrated only when visible. A single server API endpoint (`/api/contact`) handles form submissions. All images flow through either Astro's built-in `<Image>` component (local assets) or Cloudinary CDN (gallery). Third-party embeds (Maps, Calendar) use lazy-loaded iframes via Intersection Observer.

**Major components:**
1. **Static sections** (`.astro` files) -- Hero, About, Services, Pricing, Testimonials, Location, Footer. Pure HTML/CSS, zero JavaScript.
2. **Interactive islands** -- Gallery lightbox and Contact form. Hydrated with `client:visible`. Minimal JS footprint.
3. **Lazy-loaded embeds** -- Google Maps and Google Calendar iframes. Loaded via Intersection Observer when scrolled into view.
4. **Server endpoint** -- `POST /api/contact` serverless function. Validates input, sends email via Resend.
5. **BaseLayout** -- Common wrapper with meta tags, fonts, Open Graph, global styles.

### Critical Pitfalls

1. **Over-hydration destroys performance** -- Default to no client directive. Use `client:visible` for below-fold islands, never `client:load` unless critical first-screen interaction. One documented case: switching directives reduced JS from 150KB to 45KB and improved Lighthouse from 72 to 94.
2. **Images in `public/` bypass all optimization** -- Place images in `src/` (for Astro `<Image>`) or use Cloudinary CDN. A single unoptimized 3MB JPEG takes 30+ seconds on 3G. Test on throttled connections before every phase sign-off.
3. **Google Maps iframe blocks main thread** -- Never embed directly. Use `loading="lazy"` plus Intersection Observer, or a static map image placeholder with click-to-activate. Saves 100+ HTTP requests on initial load.
4. **Tailwind classes get purged in production** -- Never use string interpolation for class names (`bg-${color}-500`). Use complete literal class names. Test production builds before every phase completion.
5. **Vercel edge runtime breaks Node.js libraries** -- Use serverless mode for the contact form endpoint, not edge. Configure `@astrojs/vercel` adapter explicitly.

## Conflicts and Tensions Between Research Areas

Three conflicts emerged across the research files that need resolution:

1. **Nodemailer vs. Resend:** ARCHITECTURE.md and PITFALLS.md reference Nodemailer for email delivery, but STACK.md explicitly recommends Resend because Nodemailer does not work on Vercel edge functions and has worse DX. **Resolution: Use Resend.** The architecture patterns for the server endpoint remain the same; only the email library changes. This simplifies deployment (no SMTP config) and avoids the Vercel edge compatibility pitfall entirely.

2. **React islands vs. vanilla JS:** ARCHITECTURE.md assumes React for gallery and contact form islands (`@astrojs/react`, `.tsx` files). STACK.md says to avoid UI frameworks entirely and use plain `<script>` tags for interactivity. **Resolution: Evaluate per-component.** The contact form (validation, loading states, error handling) benefits from a lightweight framework. The gallery lightbox could go either way. If React is used, it should be the only framework dependency, and `@astrojs/react` must be added. If vanilla JS suffices for both, skip React entirely for zero framework overhead. Recommend starting with vanilla JS `<script>` tags and only adding React if the interaction complexity justifies the ~40KB bundle cost.

3. **Tailwind config file:** ARCHITECTURE.md shows a `tailwind.config.mjs` file in the project structure. STACK.md notes Tailwind v4 is zero-config. **Resolution: No config file needed.** Tailwind v4 uses CSS-first configuration. Custom theme values go in `global.css` via `@theme` directive, not a JavaScript config file.

## Biggest Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Slow load times on rural 3G/4G** | CRITICAL | HIGH if not careful | Test on throttled 3G before every phase sign-off. Optimize all images. Lazy-load embeds. Zero JS by default. |
| **Contact form spam** | HIGH | HIGH (bots find forms fast) | Honeypot field, rate limiting (5/hr per IP), consider Friendly Captcha. Implement before first deploy. |
| **Over-hydration negating Astro benefits** | HIGH | MEDIUM (Next.js habits) | Document directive strategy in Phase 1. Code review all `client:` directives. Budget: <50KB JS total. |
| **Cloudinary double-optimization** | MEDIUM | MEDIUM | Use `astro-cloudinary` CldImage component, not Astro's `<Image>` for CDN images. Verify images serve from Cloudinary CDN directly. |
| **Production CSS differs from dev** | MEDIUM | LOW-MEDIUM | Never use dynamic Tailwind class interpolation. Test production build before each phase completion. |

## Implications for Roadmap

Based on combined research, the project naturally divides into 5 phases ordered by dependency chain and risk reduction.

### Phase 1: Foundation and Static Shell
**Rationale:** Every other phase depends on the build pipeline, layout, and styling infrastructure. Establishing image optimization strategy and Tailwind configuration here prevents the two most common Astro pitfalls (images in `public/`, Tailwind purging) from ever occurring.
**Delivers:** Working Astro project deployed to Vercel with BaseLayout, global styles, navigation, and empty section scaffolding. Production build verified.
**Features addressed:** Mobile-responsive design (foundational), fast load times (infrastructure)
**Pitfalls avoided:** Tailwind purging (configure correctly from start), images in `public/` (establish image pipeline)
**Stack elements:** Astro 5.17, Tailwind CSS v4, Vercel static deploy, TypeScript strict

### Phase 2: Content Sections (Static)
**Rationale:** All static sections are independent of each other and require no server-side logic. Building these first validates the component composition pattern and produces a visually complete site without any JavaScript complexity.
**Delivers:** Complete static content -- Hero with optimized hero image, About, Services/Amenities, Pricing, Testimonials, Location (with lazy-loaded Google Maps iframe), Footer with contact info.
**Features addressed:** Professional photography, clear contact info, pricing, room/facility details, location and directions, about/story, social proof, availability calendar (embedded Google Calendar)
**Pitfalls avoided:** Google Maps blocking (lazy-load from start), eager image loading (enforce `loading="lazy"` below fold)

### Phase 3: Gallery with Cloudinary
**Rationale:** The gallery is the most visually important interactive feature and the primary showcase for the retreat. It requires Cloudinary integration and the first interactive island (lightbox). Building it before the contact form keeps scope focused on read-only interactivity.
**Delivers:** Photo gallery organized by category (rooms, facilities, lake, quilting spaces) with Cloudinary CDN delivery, responsive images, and lightbox interaction.
**Features addressed:** Photo gallery (table stakes), professional photography showcase
**Pitfalls avoided:** Large component rendering cliff (static thumbnails + single island), Cloudinary double-optimization (use CldImage), function props to islands (data-only props)
**Stack elements:** astro-cloudinary, `client:visible` directive

### Phase 4: Contact Form and Server Endpoint
**Rationale:** The contact form is the only feature requiring server-side rendering. Adding the Vercel adapter and serverless function last avoids configuring SSR until it is actually needed. This phase introduces the most integration complexity (form validation, email delivery, spam prevention).
**Delivers:** Working contact form with client-side validation, server-side validation, email delivery via Resend, honeypot spam prevention, rate limiting, success/error feedback.
**Features addressed:** Contact form (inquiry-to-quote workflow), clear contact info (enhanced)
**Pitfalls avoided:** Vercel edge runtime (use serverless mode), contact form spam (honeypot + rate limiting), missing CORS/CSRF
**Stack elements:** Resend, `@astrojs/vercel` adapter, `output: 'server'` with `prerender: true` on static pages

### Phase 5: Polish, Accessibility, and Performance Audit
**Rationale:** Final phase focuses on cross-cutting concerns that span all sections. Smooth scrolling, anchor navigation, accessibility audit (WCAG AA), 3G performance testing, and SEO optimization. This is where the site goes from "works" to "works well for the target audience."
**Delivers:** Accessible, performant, SEO-optimized site. Smooth scroll navigation. ARIA labels and focus management. Verified fast on 3G. Open Graph meta tags. robots.txt and sitemap.
**Features addressed:** Fast load times (verified), accessibility (older demographic), mobile UX refinement
**Pitfalls avoided:** Missing 3G testing (comprehensive audit), tiny touch targets (44x44px minimum), FOUC during hydration

### Phase Ordering Rationale

- **Foundation before content:** Tailwind, image pipeline, and layout must exist before sections can be built. Getting the production build working with zero content catches config issues early.
- **Static sections before islands:** Validates the build process works end-to-end without JavaScript complexity. Produces a deployable site after Phase 2 that the client can review.
- **Gallery before contact form:** Gallery is read-only interactivity (simpler state). Contact form requires SSR mode, which changes the build configuration. Keeping the SSR change late reduces the surface area of config issues.
- **Polish last:** Accessibility, performance auditing, and SEO are cross-cutting. They touch every section and are most efficient to do once all content exists.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (Gallery):** Cloudinary integration specifics -- whether to use `CldImage` component, `cldAssetsLoader` for content collections, or direct URL construction. Also: lightbox implementation choice (vanilla JS vs. a library like GLightbox vs. React island). This decision affects whether React is needed at all.
- **Phase 4 (Contact Form):** Resend API integration patterns with Astro server endpoints. Spam prevention strategy (honeypot vs. Friendly Captcha vs. Cloudflare Turnstile). Rate limiting implementation on Vercel serverless.

**Phases with standard patterns (skip deep research):**
- **Phase 1 (Foundation):** Well-documented Astro + Tailwind + Vercel setup. Official docs sufficient.
- **Phase 2 (Content Sections):** Pure Astro components with Tailwind. Standard patterns, no integration complexity.
- **Phase 5 (Polish):** Standard accessibility and performance practices. Lighthouse and axe-core audits.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified against npm and official docs (Feb 2026). Astro 5.17, Tailwind v4, Resend 6.9.2 all production-ready. |
| Features | MEDIUM | Based on competitor analysis and hospitality best practices, not user research for this specific business. Feature list is solid but priority could shift with client input. |
| Architecture | HIGH | Official Astro documentation, islands architecture well-documented, project structure follows community conventions. Minor conflict with STACK.md on React usage resolved above. |
| Pitfalls | HIGH | Sourced from official docs, GitHub issues, and documented migration experiences. Performance pitfalls verified with specific metrics. |

**Overall confidence:** HIGH

### Gaps to Address

- **React vs. vanilla JS decision:** STACK.md and ARCHITECTURE.md disagree. Needs resolution in Phase 3 planning based on lightbox complexity. Recommend prototyping both approaches.
- **Resend integration specifics:** STACK.md recommends Resend but ARCHITECTURE.md has Nodemailer examples. Phase 4 planning should use Resend API docs and the Astro + Resend guide (linked in STACK.md sources).
- **Client content readiness:** Features research assumes professional photography exists. If photos are not yet taken, Phase 2 and Phase 3 will need placeholder images and a content delivery plan.
- **Google Calendar embed behavior:** Features research recommends embedded Google Calendar for availability. Needs verification that the client maintains a Google Calendar and that the embed meets their workflow.
- **Accessibility depth:** Features research flags WCAG AA as the target, but no specific accessibility audit has been done on the current site. Phase 5 should include an axe-core audit.

## Sources

### Primary (HIGH confidence)
- Astro 5.17 Official Documentation -- project structure, islands, endpoints, images, View Transitions, Vercel adapter
- Tailwind CSS v4 Release Documentation -- zero-config setup, Vite plugin, migration from v3
- Vercel Deployment Documentation -- static + serverless, free tier, environment variables
- Astro GitHub Issues (#11454) -- rendering performance with large component lists
- W3C WAI: Older Users and Web Accessibility -- accessibility standards

### Secondary (MEDIUM confidence)
- astro-cloudinary 1.3.5 Documentation -- CldImage component, content collections loader
- Resend npm package (6.9.2) -- API client for email delivery
- Multiple Astro migration blog posts (Celaya, Clemmons, lik.ai, makersden) -- Next.js to Astro pitfalls
- Competitor quilting retreat sites (Stitchin Heaven, 1847 Quilt Retreat, Camellia Palms) -- feature expectations
- Hospitality website best practices guides -- feature prioritization

### Tertiary (LOW confidence)
- Specific performance metrics from migration blog posts (150KB to 45KB JS reduction, Lighthouse 72 to 94) -- single-source anecdotes, directionally correct but not guaranteed for this project

---
*Research completed: 2026-02-16*
*Ready for roadmap: yes*
