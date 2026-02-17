# Phase 1: Foundation and Static Shell - Context

**Gathered:** 2026-02-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Astro 5 + Tailwind v4 project with BaseLayout, global styles, responsive navigation, image optimization pipeline, and Vercel deployment. This is a faithful rebuild of the existing Next.js site — same visual design, optimized stack. The current site at timberandthreadsretreat.com is the design reference.

</domain>

<decisions>
## Implementation Decisions

### Design fidelity
- Same feel as current site, with minor polish allowed (better spacing, smoother transitions)
- Not pixel-perfect — match the overall design but allow tasteful refinements
- Current site has 6 React hydration errors and broken gallery ("Loading gallery images...") — these are the primary pain points to fix
- No other pain points reported — site works fine otherwise

### Color palette
- Keep current teal accent: #0D9488 (Tailwind teal-600) — this is the brand color
- Stone palette for backgrounds: stone-50, stone-100, teal-50, white
- Text colors: stone-800/900 for body, stone-600 for secondary
- Alternating section backgrounds pattern preserved

### Typography
- Inter for body text (400 weight, 16px base)
- Serif (Georgia/system serif) for headings (500 weight for h1, 400 for h2)
- Keep the same font pairing — provides "modern warmth"

### Navigation
- Sticky nav, always visible at top while scrolling
- Same section order: Home, About, Retreats, Accommodations, Calendar, Gallery, Contact, Location
- Active section highlighting via scroll-spy (nav link gets visual indicator for current section)
- Remove Admin link from footer (not in v1 scope)
- Smooth-scroll to sections on nav link click

### Navigation - Claude's discretion
- Mobile hamburger menu open style (recommended: full-screen overlay for older demographic with large tap targets)
- Nav logo treatment (text only vs logo image + text)
- Scroll animation speed/easing
- Nav background behavior (solid vs transparent-on-hero)
- Footer navigation links (mini nav vs minimal copyright + contact)

### Layout shell
- Alternating section backgrounds preserved (white, stone-100, teal-50, etc.)
- Hero section: full-viewport height with retreat front photo as background (pulled from current site)
- Hero structure: logo, tagline ("Relax, create, and connect in nature's embrace"), CTA buttons ("Learn More", "Contact Us to Book")
- Hero should be built to support future video background swap (Phase 3 promo video)

### Layout - Claude's discretion
- Max content width (current is ~1280px)
- Micro-interactions and scroll animations (tasteful polish that doesn't hurt performance)

### Images
- Pull images from current site to start
- User will provide original high-res versions when ready — swap in later
- Logo (quilting patch design) is finalized — won't change

### Claude's Discretion
- Mobile menu animation style
- Scroll animation speed and easing
- Nav background transparency behavior
- Footer structure and navigation
- Max content width
- Micro-interactions and polish (performance-first)

</decisions>

<specifics>
## Specific Ideas

- Current site is the design reference — timberandthreadsretreat.com
- "Refine, don't redesign" — visitors should recognize the same site, just faster and smoother
- Hero will eventually have a looping promo video background (same video as Phase 3 video section) — build the hero layout to accommodate this swap
- Gallery is broken on current site ("Loading gallery images...") — this rebuild fixes that via static Cloudinary approach

</specifics>

<deferred>
## Deferred Ideas

- Hero background video loop — Phase 3 (promo video not ready yet)
- Admin interface — v2 feature (ADMN-01 through ADMN-03)

</deferred>

---

*Phase: 01-foundation-and-static-shell*
*Context gathered: 2026-02-16*
