# Phase 3: Gallery and Media - Context

**Gathered:** 2026-02-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Photo gallery with category-based sections, lightbox viewing experience, Cloudinary CDN image delivery, and a video placeholder section. The gallery carries over the current site's gallery functionality (lightbox navigation, swipe, zoom, captions) into the Astro rebuild. Admin panel for image management is a future phase.

</domain>

<decisions>
## Implementation Decisions

### Gallery layout
- Separate scrollable sections per category (matching current site), not tabs or filters
- 3-column grid on desktop, 1-column on mobile (matching current site's mobile layout)
- Uniform square thumbnails (cropped to fill) — change from current site's 16:9 aspect-video
- Hover effect: zoom scale + overlay (carry over from current site)

### Lightbox experience (carry over from current site)
- Navigation arrows between photos within category + swipe on mobile
- Keyboard navigation: arrow keys to browse, Escape to close
- Click outside image to close
- "X of Y" counter displayed
- Captions below image
- Pinch-to-zoom and double-tap zoom on mobile
- Close button (top-right)

### Photo content & curation
- Two categories: Facility and Quilting (same as current site)
- Photos will be a mix of existing images and new photos from Feb 15 shoot
- Drone footage frames may be added to gallery later
- Gallery data in a separate data file (JSON or TS array) with a clean schema — structured to make a future admin panel easy to integrate

### Video placeholder
- Positioned above the gallery sections
- Full-width cinematic layout (edge-to-edge)
- Poster image with centered play icon overlay and "Coming Soon" indicator
- Video hosting undecided — build placeholder to accommodate either YouTube embed or self-hosted/Cloudinary later

### Claude's Discretion
- Whether to include an "All" combined view option alongside category sections
- Tablet breakpoint column count (2-col suggested based on current site)
- Exact hover transition timing and overlay opacity
- Loading skeleton design for gallery thumbnails
- Poster image selection for video placeholder
- Lightbox animation transitions (fade, slide, etc.)

</decisions>

<specifics>
## Specific Ideas

- "Keep how current site is for carryover features" — match existing gallery/lightbox behavior closely
- Data structure should anticipate admin panel integration (clean schema, separate from component)
- Image prep help needed later — user will bring sorted photos + potential drone frames for processing

</specifics>

<deferred>
## Deferred Ideas

- Admin panel for gallery image upload/management — future phase
- Drone footage video editing — outside scope, raw footage not yet processed

</deferred>

---

*Phase: 03-gallery-and-media*
*Context gathered: 2026-02-17*
