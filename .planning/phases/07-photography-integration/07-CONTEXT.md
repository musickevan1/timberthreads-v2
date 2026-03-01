# Phase 7: Photography Integration - Context

**Gathered:** 2026-03-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Integrate updated retreat photography from `v2-gallery/` into the gallery and property sections. Photos are optimized for web, added to gallery data with alt text, and served through Astro's local image pipeline. No new site capabilities — this is content integration into existing gallery infrastructure.

</domain>

<decisions>
## Implementation Decisions

### Photo inventory
- Source: `v2-gallery/` directory (10 photos) — roadmap filenames (IMG_4197, etc.) are outdated
- Integrate 8 of 10 photos — exclude IMG_1493 (storage/folding chairs) and 79407220144__DA03E000 (laundry/washer-dryer) as not gallery-worthy
- Photos confirmed as:
  - IMG_0868 — Outdoor driveway/entrance with curved walkway, trees, parking
  - IMG_1486 — Quilting workspace with large cutting mat table, quilts on wall
  - IMG_1488 — Bedroom with beds, quilted bedding, quilts on walls
  - IMG_1489 — Bedroom with beds, quilts, wall hangings
  - IMG_1490 — Common area with large sectional sofa, quilts on walls, tool chest
  - IMG_1491 — Interior dining/work area with tables, quilts, natural light
  - IMG_1492 — Workspace with tables, TV, bright windows
  - IMG_1496 — Bedroom with twin beds, quilted bedding, window

### Gallery organization
- Claude decides category structure (current: Facility + Quilting — may add or reorganize)
- Claude decides whether new photos replace lower-quality existing ones (compare same subjects)
- Claude decides visual consistency treatment if needed
- Display order: logical walkthrough tour — exterior first, then common areas, then bedrooms, then workspaces

### Image placement
- Keep current Hero image — do not replace
- Claude decides whether any photos also appear in content sections (Accommodations, About) beyond gallery
- Add TODO placeholder comments in gallery data for future outdoor photos: dock, picnic table, fire pit
- No dock/picnic table/fire pit photos available yet

### Photo readiness
- Use photos as-is from camera — no editing, color-grading, or cropping required
- Astro build-time image pipeline (NOT Cloudinary) — local optimization, WebP/AVIF conversion, responsive srcset
- Claude balances quality vs file size for rural audience on slow connections (Lighthouse 90+ target in Phase 8)

### Claude's Discretion
- Gallery category restructuring (keep 2 categories, add a 3rd, or reorganize)
- Whether any new photos replace existing gallery images
- Photo placement in content sections beyond gallery
- Visual consistency adjustments between old and new photos
- Image compression/quality settings
- Alt text and caption writing (user reviews later)

</decisions>

<specifics>
## Specific Ideas

- Gallery order should feel like a property tour: arrive (exterior), enter (common areas), see bedrooms, then workspaces
- Quilts are a defining visual element — they appear in nearly every photo and should be highlighted in alt text/captions
- IMG_1493 (storage) and laundry photo explicitly excluded — not visually representative of the retreat experience

</specifics>

<deferred>
## Deferred Ideas

- Dock, picnic table, fire pit photography — photos not yet available, placeholder positions marked with TODO
- Outdoor photo category may be needed when those photos arrive

</deferred>

---

*Phase: 07-photography-integration*
*Context gathered: 2026-03-01*
