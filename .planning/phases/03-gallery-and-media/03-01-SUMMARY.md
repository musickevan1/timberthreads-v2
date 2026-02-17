---
phase: 03-gallery-and-media
plan: 01
subsystem: ui
tags: [astro, cloudinary, gallery, tailwind, typescript]

# Dependency graph
requires:
  - phase: 01-foundation-and-static-shell
    provides: Astro project, Tailwind v4 config, image assets, brand tokens
  - phase: 02-content-sections-and-embeds
    provides: inline gallery placeholder in index.astro that this plan replaces
provides:
  - Typed GalleryImage data layer in src/data/gallery.ts
  - Cloudinary URL helper functions (thumbUrl, fullUrl, srcsetUrl, cloudinaryUrl)
  - VideoPlaceholder component with poster, play icon, and Coming Soon badge
  - GalleryCategory component with responsive grid and PhotoSwipe data attributes
  - Gallery section component replacing inline placeholder in index.astro
affects:
  - 03-02 (Plan 02 adds PhotoSwipe lightbox — depends on data-pswp-* attrs established here)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Cloudinary URL composition via transform string builder functions
    - Gallery data as hardcoded TypeScript array — zero runtime API calls, pure static
    - PhotoSwipe data attributes (data-pswp-gallery, data-pswp-width, data-pswp-height, data-pswp-srcset) pre-wired for Plan 02

key-files:
  created:
    - src/data/gallery.ts
    - src/components/Gallery.astro
    - src/components/GalleryCategory.astro
    - src/components/VideoPlaceholder.astro
  modified:
    - src/pages/index.astro

key-decisions:
  - "Gallery data is hardcoded TypeScript (not CMS/API) — no runtime calls, fully static"
  - "CLOUD_NAME constant in gallery.ts is single update point when real Cloudinary account is configured"
  - "Thumbnail transforms use c_fill,g_auto for AI-gravity square crops — preserves subject in all photos"
  - "data-pswp-srcset includes 800w/1200w/2000w variants — PhotoSwipe can select optimal size on zoom"
  - "hero-front-view.jpeg reused as video poster (research recommendation) — no additional asset needed"
  - "No combined All view — only 2 categories, adds unnecessary complexity (per plan spec)"

patterns-established:
  - "Cloudinary URL helpers: all image URLs go through thumbUrl/fullUrl/srcsetUrl — never hand-build URLs"
  - "PhotoSwipe data attrs on anchor tags: data-pswp-gallery on grid, data-pswp-width/height/caption/srcset on each <a>"
  - "GalleryCategory is generic: accepts title + GalleryImage[] — can add more categories without changing component"

requirements-completed:
  - MDIA-01
  - MDIA-03
  - MDIA-04
  - MDIA-06

# Metrics
duration: 2min
completed: 2026-02-17
---

# Phase 3 Plan 01: Gallery Static Structure Summary

**Gallery section with Cloudinary CDN thumbnail delivery, typed TypeScript data layer, two category grids (Facility/Quilting), and cinematic video placeholder integrated into index.astro**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-17T17:17:26Z
- **Completed:** 2026-02-17T17:19:41Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Created `src/data/gallery.ts` with typed GalleryImage interface, 8 placeholder images (4 facility, 4 quilting), Cloudinary URL helper functions, and filtered category exports
- Built three Astro components — VideoPlaceholder with play icon overlay, GalleryCategory with responsive grid and PhotoSwipe data attributes, Gallery wrapping both
- Replaced inline gallery placeholder in index.astro with `<Gallery />` — build passes with zero errors, all verification checks confirmed

## Task Commits

Each task was committed atomically:

1. **Task 1: Create gallery data file** - `b8543c9` (feat)
2. **Task 2: Create VideoPlaceholder, GalleryCategory, and Gallery components** - `19685ef` (feat)
3. **Task 3: Replace inline gallery placeholder in index.astro** - `d5c5e20` (feat)

## Files Created/Modified

- `src/data/gallery.ts` - GalleryImage type, GalleryCategory type, galleryImages array, cloudinaryUrl/thumbUrl/fullUrl/srcsetUrl helpers, facilityImages and quiltingImages exports
- `src/components/VideoPlaceholder.astro` - Cinematic poster with play icon circle and Coming Soon badge
- `src/components/GalleryCategory.astro` - Responsive 1/2/3-col grid with square Cloudinary thumbnails, hover scale/overlay effects, PhotoSwipe data attributes
- `src/components/Gallery.astro` - Section wrapper with heading, teal divider, VideoPlaceholder, and two GalleryCategory grids
- `src/pages/index.astro` - Gallery import added, inline section placeholder replaced with `<Gallery />`

## Decisions Made

- Gallery data is hardcoded TypeScript — no CMS or API calls, fully static build output
- `CLOUD_NAME = 'timberandthreads'` constant centralizes Cloudinary account config in one location
- AI-gravity square crops (`c_fill,g_auto`) ensure subjects are framed correctly across all photos without manual hotspot setting
- `data-pswp-srcset` pre-wired with three responsive widths so PhotoSwipe (Plan 02) can serve optimal resolution on zoom
- `hero-front-view.jpeg` reused as video poster — appropriate cinematic landscape, no additional asset needed

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. Cloudinary integration uses placeholder public IDs that will 404 until real photos are uploaded. CLOUD_NAME in `src/data/gallery.ts` needs updating when the Cloudinary account is configured.

## Next Phase Readiness

- Plan 02 (PhotoSwipe lightbox) can start immediately — all `data-pswp-*` attributes are present and correct
- Gallery data file is ready for real image IDs once Cloudinary upload happens (only `cloudinaryPublicId` fields need updating)
- Video placeholder will remain until promo video is ready (noted in STATE.md blockers)

## Self-Check: PASSED

All files confirmed present. All task commits verified in git log.

---
*Phase: 03-gallery-and-media*
*Completed: 2026-02-17*
