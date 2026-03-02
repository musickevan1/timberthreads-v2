# Phase 8: Polish, Accessibility, SEO, and Deploy - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Get the site production-ready: Lighthouse 90+ on mobile Fast 3G, WCAG AA accessibility compliance, complete SEO markup, and live at timberandthreadsretreat.com. This phase replaces the existing Next.js site at the production domain. No new features — only quality, accessibility, SEO, and deployment work.

</domain>

<decisions>
## Implementation Decisions

### Performance trade-offs
- Protect image quality first — if Lighthouse 90+ requires trade-offs, simplify animations/interactions before compressing images
- Self-host fonts locally (no Google Fonts CDN requests) — bundle font files for fastest loading on slow 3G
- 50KB JS budget for client-side islands (pricing calculator, PhotoSwipe lightbox)
- Zero client-side JS for static content sections (Astro's default)

### Social sharing & SEO
- OG image: use the hero/property photo — shows the actual retreat location
- Page title format: brand-first — "Timber & Threads Retreat | Quilting & Crafting Getaway in Clinton, MO"
- Add LocalBusiness JSON-LD structured data (address, phone, description) for local search visibility
- robots.txt, sitemap.xml, semantic HTML heading hierarchy required

### Accessibility approach
- Body text: 18px, strict 16px minimum everywhere on the site (no exceptions)
- Color contrast: adjust brand colors as needed to pass WCAG AA 4.5:1 ratio — accessibility wins over exact palette preservation
- Focus indicators: use `:focus-visible` only (visible for keyboard navigation, hidden on mouse click)
- Touch targets: 44x44px minimum for all interactive elements
- Phone numbers: click-to-call links on mobile
- All images must have descriptive alt text
- Pricing calculator and all interactive elements must be keyboard-navigable

### Go-live strategy
- Replacing existing Next.js site currently live at timberandthreadsretreat.com
- Preview-first approach: deploy to Vercel preview URL, get client approval, THEN switch DNS (Cloudflare → Vercel)
- Single-page site on both old and new — no URL redirects needed
- No analytics integration — keep the site light

### Claude's Discretion
- Embed loading strategy for Google Calendar and Maps (keep current lazy-load or upgrade to click-to-load — whatever Lighthouse needs)
- Animation/transition trimming (keep site feeling polished, cut what hurts performance)
- Meta description copy (capture retreat vibe in ~155 characters)
- Skip-to-content link (add if it meaningfully improves keyboard experience for single-page layout)
- Loading skeleton and error state design
- Exact font subsetting and loading strategy details

</decisions>

<specifics>
## Specific Ideas

- Font loading: self-host rather than CDN to eliminate third-party requests on slow rural connections
- DNS cutover: Cloudflare DNS already configured for the domain — switch points to Vercel
- Client approval gate: Vercel preview URL must be approved before DNS flip — no surprises on launch day
- Audience context: rural Missouri visitors on slow 3G/4G — performance isn't just a score, it's the difference between the site loading or not

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-polish-accessibility-seo-and-deploy*
*Context gathered: 2026-03-02*
