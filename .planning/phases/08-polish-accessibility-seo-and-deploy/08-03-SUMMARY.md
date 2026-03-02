---
phase: 08-polish-accessibility-seo-and-deploy
plan: "03"
subsystem: seo
tags: [astro, sitemap, seo, og, json-ld, schema, vercel, deployment]

# Dependency graph
requires:
  - phase: 08-01-SUMMARY.md
    provides: Self-hosted font, 18px body font-size, accessibility foundation
  - phase: 08-02-SUMMARY.md
    provides: WCAG AA touch targets, focus-visible, footer contrast, skip-to-content

provides:
  - "@astrojs/sitemap integration with auto-generated sitemap-index.xml"
  - "LocalBusiness JSON-LD structured data with address, geo, amenities"
  - "Full Open Graph tags with og:image (hero photo), og:site_name, og:locale, og:image dimensions"
  - "Twitter Card meta tags"
  - "Canonical URL link tag in head"
  - "Brand-first page title with location keyword"
  - "Optimized meta description (~155 chars)"
  - "robots.txt with Sitemap reference"
  - "Public OG image at /og-image.jpg"
affects:
  - "Search engine indexing"
  - "Social media link previews"
  - "Structured data rich results"

# Tech tracking
tech-stack:
  added: ["@astrojs/sitemap@3.7.0"]
  patterns:
    - "Astro.site + Astro.url.pathname for canonical URL generation"
    - "set:html for JSON-LD script tags to prevent HTML escaping"
    - "Static copy of hero image to public/ for OG image (not processed by Astro pipeline)"

key-files:
  created:
    - "public/og-image.jpg — Hero image copy as static OG image"
  modified:
    - "src/layouts/BaseLayout.astro — Enhanced OG tags, Twitter card, canonical URL, JSON-LD"
    - "src/pages/index.astro — Brand-first title, optimized meta description, ogImage prop"
    - "public/robots.txt — Added Sitemap URL reference"
    - "astro.config.mjs — Added site URL and @astrojs/sitemap integration"

key-decisions:
  - "Copied hero-image.png to public/og-image.jpg (PNG data, .jpg extension) — browsers parse image data not extension, valid for OG"
  - "Used @astrojs/sitemap for automatic sitemap-index.xml generation on build"
  - "JSON-LD uses LodgingBusiness schema type (more specific than LocalBusiness)"
  - "Canonical URL uses Astro.site fallback to production URL for local dev safety"

patterns-established:
  - "JSON-LD in BaseLayout via set:html — prevents HTML escaping, applies to all pages"
  - "OG image served from /public/ as static file — bypasses Astro image pipeline"

requirements-completed: [SEDO-01, SEDO-02, SEDO-03, SEDO-04]

# Metrics
duration: 5min
completed: 2026-03-02
---

# Phase 08 Plan 03: SEO Markup, sitemap.xml, and Production Deployment Summary

**@astrojs/sitemap integration, full OG/Twitter/JSON-LD SEO layer, and Vercel push — awaiting DNS cutover checkpoint**

## Status

**PAUSED AT CHECKPOINT — Tasks 1-2 complete, Task 3 (DNS cutover) awaiting human verification**

## Performance

- **Duration:** ~5 min (Tasks 1-2)
- **Started:** 2026-03-02T17:27:48Z
- **Completed:** 2026-03-02T17:33:00Z (partial — checkpoint pending)
- **Tasks:** 2 of 3 complete
- **Files modified:** 7

## Accomplishments

- Installed `@astrojs/sitemap` and configured `site: 'https://timberandthreadsretreat.com'` in astro.config.mjs — sitemap auto-generated on build
- Enhanced BaseLayout with full OG tags (width/height/site_name/locale), Twitter Card, canonical link, and LocalBusiness JSON-LD structured data
- Updated page title to brand-first format, meta description optimized to ~155 chars
- Added OG image as static file at `public/og-image.jpg`
- robots.txt updated with Sitemap reference
- Build exits 0, all dist files verified, changes pushed to GitHub triggering Vercel deployment

## Task Commits

1. **Task 1: SEO meta tags, Open Graph image, JSON-LD, sitemap** - `c0f05a1` (feat)
2. **Task 2: Deploy to Vercel preview** - No file changes; triggered via `git push origin main`
3. **Task 3: Client approval and DNS cutover** - CHECKPOINT PENDING

## Files Created/Modified

- `public/og-image.jpg` - Hero image copy as static Open Graph image at root URL
- `src/layouts/BaseLayout.astro` - Canonical link, full OG tags, Twitter Card, JSON-LD LocalBusiness schema
- `src/pages/index.astro` - Brand-first title, ~155-char meta description, ogImage prop passed
- `public/robots.txt` - Sitemap URL reference added
- `astro.config.mjs` - `site` URL and `@astrojs/sitemap` integration added
- `package.json` / `package-lock.json` - @astrojs/sitemap@3.7.0 added

## Decisions Made

- Copied PNG hero image to `public/og-image.jpg` with .jpg extension — browsers parse image data, not extension; valid for OG
- Used `@astrojs/sitemap` first-party Astro integration for automatic sitemap generation
- JSON-LD uses `LodgingBusiness` type (more specific than LocalBusiness, appropriate for retreat bookings)
- `set:html` directive used for JSON-LD script tag to prevent HTML escaping of JSON content

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

**External services require manual configuration.** The following steps must be completed by the site owner:

1. **Verify Vercel preview URL** — Go to https://vercel.com, open the `timberandthreads-v2` project, find the latest deployment URL (format: `https://timberandthreads-v2-{hash}.vercel.app`)
2. **Add domain in Vercel** — Settings > Domains > Add `timberandthreadsretreat.com` and `www.timberandthreadsretreat.com`
3. **Update Cloudflare DNS** — Copy DNS values shown by Vercel after domain addition; update A/CNAME record in Cloudflare DNS panel
4. **Verify production** — Open https://timberandthreadsretreat.com and confirm HTTPS, correct content

## Next Phase Readiness

This is the final plan in Phase 8 (the final phase). After DNS cutover is complete:
- Site is live at https://timberandthreadsretreat.com with HTTPS (Vercel auto-SSL)
- v2.1 milestone is shipped

---
*Phase: 08-polish-accessibility-seo-and-deploy*
*Completed: 2026-03-02 (partial — checkpoint pending)*
