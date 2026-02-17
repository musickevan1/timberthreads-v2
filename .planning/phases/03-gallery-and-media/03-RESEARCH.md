# Phase 3: Gallery and Media - Research

**Researched:** 2026-02-17
**Domain:** Lightbox gallery, Cloudinary CDN responsive images, vanilla JS interactivity in Astro
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- Gallery layout: Separate scrollable sections per category (matching current site), not tabs or filters
- Grid: 3-column on desktop, 1-column on mobile
- Thumbnails: Uniform square (cropped to fill) — change from current 16:9
- Hover: zoom scale + overlay (carry over)
- Lightbox: Navigation arrows within category + swipe on mobile
- Lightbox: Keyboard: arrow keys to browse, Escape to close
- Lightbox: Click outside image to close
- Lightbox: "X of Y" counter displayed
- Lightbox: Captions below image
- Lightbox: Pinch-to-zoom and double-tap zoom on mobile
- Lightbox: Close button (top-right)
- Two categories: Facility and Quilting
- Photos: mix of existing images and new photos from Feb 15 shoot
- Gallery data: separate data file (JSON or TS array) with clean schema, admin-panel-ready
- Video placeholder: above gallery sections, full-width cinematic layout, poster image + play icon + "Coming Soon"
- Video hosting: undecided — placeholder must accommodate YouTube embed OR self-hosted/Cloudinary

### Claude's Discretion

- Whether to include an "All" combined view option alongside category sections
- Tablet breakpoint column count (2-col suggested)
- Exact hover transition timing and overlay opacity
- Loading skeleton design for gallery thumbnails
- Poster image selection for video placeholder
- Lightbox animation transitions (fade, slide, etc.)

### Deferred Ideas (OUT OF SCOPE)

- Admin panel for gallery image upload/management — future phase
- Drone footage video editing — outside scope, raw footage not yet processed
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MDIA-01 | Photo gallery with Cloudinary CDN delivery, organized by category (facility, quilting) | Cloudinary URL transform pattern documented; category-per-section architecture defined |
| MDIA-02 | Gallery lightbox interaction for full-size image viewing | PhotoSwipe v5 covers all required interactions (arrows, swipe, keyboard, close, counter, captions, pinch, double-tap) |
| MDIA-03 | Responsive images with automatic WebP/AVIF format selection | Cloudinary `f_auto/q_auto` handles format; srcset with width descriptors handles size selection |
| MDIA-04 | Video section placeholder with poster image (swap in promo video when ready) | Static HTML pattern documented; swap-ready by extracting src/embed to a prop |
| MDIA-05 | All images lazy-loaded below fold; hero image eager-loaded with fetchpriority="high" | Hero already implemented in Phase 1; gallery `<img loading="lazy">` is the pattern |
| MDIA-06 | Hardcoded gallery image data (no dynamic API calls on page load) | TypeScript data array in `src/data/gallery.ts` — read at build time, zero runtime requests |
</phase_requirements>

---

## Summary

This phase replaces the inline gallery placeholder in `index.astro` with a full Gallery component, a VideoPlaceholder component, and the client-side lightbox experience. The stack stays entirely vanilla — no React, no framework islands. PhotoSwipe v5 is the clear choice for lightbox: it ships as a pure ES module, supports every required mobile gesture (pinch-to-zoom, double-tap zoom, swipe navigation), and integrates directly with Astro's `<script>` tag as a bundled npm import (no `is:inline` needed).

Images are served from Cloudinary CDN using manual URL construction (no SDK). Thumbnails use `c_fill,g_auto,w_400,h_400/f_auto/q_auto` transforms to produce uniform square crops with intelligent gravity. Full-size images for the lightbox use `w_2000/f_auto/q_auto`. The gallery data lives in a TypeScript file at `src/data/gallery.ts` with a typed schema that stores `cloudinaryPublicId`, `width`, `height`, `alt`, `caption`, and `category` — image dimensions are included because PhotoSwipe requires them and they're also needed for future admin panel integration.

The video placeholder is a pure HTML/CSS component with a poster image, centered play-button SVG, and a "Coming Soon" badge. It is built swap-ready: video hosting props (`youtubeId`, `cloudinaryVideoId`, `selfHostedSrc`) are accepted but unused until the promo video is ready. Loading strategy is complete: the hero already has `fetchpriority="high"` from Phase 1; gallery images use native `loading="lazy"` on `<img>` tags.

**Primary recommendation:** Use PhotoSwipe v5 via npm import in Astro `<script>`, with manual Cloudinary URL construction via a helper function — no SDK, no framework, no `is:inline`.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `photoswipe` | 5.4.4 | Lightbox interaction, zoom, swipe, keyboard nav | Only vanilla JS lightbox with all required mobile gestures: pinch-to-zoom, double-tap zoom, swipe nav, keyboard, X-of-Y counter |
| Cloudinary CDN (URL API) | — | Thumbnail and full-size image delivery with format/quality optimization | Already in project (`res.cloudinary.com` domain allowed in `astro.config.mjs`); no SDK required |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `astro:content` (Zod) | Astro 5 built-in | Type-safe schema for gallery data | If gallery data moves to content collections (viable path); for now a plain TS array suffices |
| Native `<img loading="lazy">` | Browser built-in | Lazy load gallery thumbnails | Cloudinary URLs cannot use Astro's `<Image>` component optimization (external CDN handles transforms); use plain `<img>` with `loading="lazy"` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| PhotoSwipe | GLightbox | GLightbox (11KB gzip, simpler API) is viable BUT double-tap zoom was a pending GitHub issue (#259, open 2021) and not confirmed in docs. PhotoSwipe explicitly supports `doubleTapAction: 'zoom'` as the documented default. |
| PhotoSwipe | Hand-rolled lightbox | Lightbox code is deceptively complex (focus trap, scroll lock, touch event math, ARIA roles, keyboard edge cases). Do not hand-roll. |
| Manual Cloudinary URL | `astro-cloudinary` package | `astro-cloudinary` (CldImage) adds component overhead and env variable setup for features not needed here (no upload widget, no AI cropping). Manual URL construction is simpler and sufficient. |
| Plain TS array in `src/data/` | Astro content collections | Content collections add Zod schema validation but require `src/content.config.ts` and the `getCollection()` API. For hardcoded static data read at build time, a typed TS array is simpler. Either approach works; TS array is recommended to minimize setup. |

**Installation:**
```bash
npm install photoswipe
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── data/
│   └── gallery.ts           # Typed image array — single source of truth for gallery
├── components/
│   ├── Gallery.astro         # Top-level gallery section (video placeholder + category sections)
│   ├── GalleryCategory.astro # Renders one category grid + heading
│   └── VideoPlaceholder.astro # Cinematic poster + coming-soon overlay
└── styles/
    └── global.css           # Add PhotoSwipe CSS import here (or in BaseLayout)
```

### Pattern 1: Cloudinary URL Helper Function

**What:** A pure TypeScript function that builds Cloudinary transformation URLs. No SDK.
**When to use:** For every `<img src>` in the gallery — thumbnail and full-size.

```typescript
// src/data/gallery.ts (helper at top of file, or separate src/lib/cloudinary.ts)
// Source: Cloudinary docs — https://cloudinary.com/documentation/responsive_html

const CLOUD_NAME = 'timberandthreads'; // Replace with actual cloud name in Phase 3

export function cloudinaryUrl(
  publicId: string,
  transforms: string
): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

// Thumbnail: square crop, auto-gravity, auto-format, auto-quality
export function thumbUrl(publicId: string, size = 400): string {
  return cloudinaryUrl(publicId, `c_fill,g_auto,w_${size},h_${size}/f_auto/q_auto`);
}

// Full-size lightbox image: max width, auto-format, auto-quality
export function fullUrl(publicId: string, maxWidth = 2000): string {
  return cloudinaryUrl(publicId, `w_${maxWidth}/f_auto/q_auto`);
}
```

### Pattern 2: Gallery Data Schema

**What:** Typed TypeScript array. Includes image dimensions because PhotoSwipe requires `data-pswp-width` and `data-pswp-height` on each slide anchor.
**When to use:** All gallery images — both categories.

```typescript
// src/data/gallery.ts
// Source: PhotoSwipe docs — https://photoswipe.com/getting-started

export type GalleryCategory = 'facility' | 'quilting';

export interface GalleryImage {
  id: string;                   // Unique slug, e.g. 'facility-01'
  cloudinaryPublicId: string;   // e.g. 'retreat/facility/front-view'
  width: number;                // Full-size image width in px (required by PhotoSwipe)
  height: number;               // Full-size image height in px (required by PhotoSwipe)
  alt: string;                  // Accessibility description
  caption: string;              // Displayed in lightbox below image
  category: GalleryCategory;
  order?: number;               // Optional sort order within category
}

export const galleryImages: GalleryImage[] = [
  {
    id: 'facility-01',
    cloudinaryPublicId: 'retreat/facility/front-view',
    width: 3000,
    height: 2000,
    alt: 'Front view of the Timber & Threads Retreat building',
    caption: 'The retreat center nestled among the trees',
    category: 'facility',
  },
  // ... additional images
];

export const facilityImages = galleryImages.filter(img => img.category === 'facility');
export const quiltingImages  = galleryImages.filter(img => img.category === 'quilting');
```

### Pattern 3: PhotoSwipe Initialization in Astro `<script>`

**What:** Import PhotoSwipe from npm in Astro's default (bundled) `<script>` tag. Astro processes it as an ES module. No `is:inline`.
**When to use:** In `Gallery.astro` or `GalleryCategory.astro` — once per page (Astro deduplicates).

```astro
<!-- Source: Astro docs — client-side scripts, PhotoSwipe docs -->
<script>
  import PhotoSwipeLightbox from 'photoswipe/lightbox';
  import 'photoswipe/style.css';

  // Initialize one lightbox per gallery category
  const galleries = document.querySelectorAll('[data-pswp-gallery]');

  galleries.forEach((gallery) => {
    const lightbox = new PhotoSwipeLightbox({
      gallery,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();
  });
</script>
```

Note: `photoswipe/style.css` imported in a `<script>` tag does NOT work — CSS must be imported via a `<style>` tag or in global.css. See Pitfall 1.

### Pattern 4: Gallery Thumbnail HTML Structure for PhotoSwipe

**What:** The `<a>` element wrapping each thumbnail image must carry `data-pswp-width`, `data-pswp-height`, and `href` pointing to full-size image. `data-cropped="true"` signals a square-cropped thumbnail to PhotoSwipe for transition animation.

```astro
---
// In GalleryCategory.astro
import { thumbUrl, fullUrl } from '../data/gallery';
import type { GalleryImage } from '../data/gallery';
const { images } = Astro.props as { images: GalleryImage[] };
---

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-pswp-gallery>
  {images.map((img) => (
    <a
      href={fullUrl(img.cloudinaryPublicId)}
      data-pswp-width={img.width}
      data-pswp-height={img.height}
      data-pswp-caption={img.caption}
      data-cropped="true"
      class="group relative overflow-hidden aspect-square block"
    >
      <img
        src={thumbUrl(img.cloudinaryPublicId)}
        alt={img.alt}
        loading="lazy"
        decoding="async"
        width="400"
        height="400"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <span class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">View</span>
      </div>
    </a>
  ))}
</div>
```

### Pattern 5: Video Placeholder (Swap-Ready)

**What:** Full-width cinematic section with poster image and "Coming Soon" overlay. Swap-ready by design.
**When to use:** Positioned above gallery sections in `Gallery.astro`.

```astro
---
// VideoPlaceholder.astro
// posterSrc: Cloudinary URL or local asset path
const { posterSrc } = Astro.props;
---

<div class="relative w-full aspect-video max-h-[60vh] overflow-hidden bg-stone-900">
  <!-- Poster image -->
  <img
    src={posterSrc}
    alt="Timber & Threads Retreat promo video coming soon"
    loading="lazy"
    class="w-full h-full object-cover opacity-70"
  />

  <!-- Play icon + Coming Soon overlay -->
  <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
    <!-- Play icon circle -->
    <div class="w-20 h-20 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center mb-4 backdrop-blur-sm">
      <svg class="w-8 h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </div>
    <!-- Coming Soon badge -->
    <span class="px-4 py-1.5 bg-brand/80 rounded-full text-sm font-medium tracking-wide">
      Promo Video Coming Soon
    </span>
  </div>
</div>
```

**Swap strategy:** When the video is ready, replace the `<div>` with a `<video>` tag (self-hosted) or `<iframe>` (YouTube). The component accepts a prop (e.g., `youtubeId`) — when set, render the embed instead of the poster. When unset, render the placeholder. This avoids touching the parent section structure.

### Anti-Patterns to Avoid

- **Wrapping Gallery in a React island:** The gallery grid is static HTML — only PhotoSwipe JS needs to run client-side. No `client:load` directive needed. The `<script>` tag handles it.
- **Using Astro `<Image>` for Cloudinary thumbnails:** Astro's Image component cannot transform external Cloudinary URLs (it would just pass them through as `<img>`). Use plain `<img>` tags with `loading="lazy"` and Cloudinary URL transforms instead.
- **Forgetting `data-pswp-width`/`data-pswp-height`:** PhotoSwipe breaks silently if dimensions are missing. They must be stored in the data schema as actual pixel values for the full-size image.
- **One lightbox instance for all categories:** Initialize one PhotoSwipe lightbox per `[data-pswp-gallery]` container so navigation arrows only browse within a category, not across all images.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lightbox interaction | Custom modal with touch events | PhotoSwipe | Touch math (momentum, pinch detection, pointer coordinate tracking), focus trap management, scroll lock, ARIA roles, and keyboard edge cases are non-trivial and well-solved |
| Image format selection | Server-side image conversion | Cloudinary `f_auto` | Cloudinary detects browser Accept header and serves AVIF to supporting browsers, WebP otherwise, JPEG as fallback |
| Square crop with subject focus | Manual CSS `object-position` guessing | Cloudinary `c_fill,g_auto` | Cloudinary AI gravity detects the image subject and centers the crop on it |
| Responsive srcset for CDN images | JavaScript viewport listeners | HTML `srcset` + `sizes` | Pure HTML/browser-native; Cloudinary `w_` param generates the size variants |

**Key insight:** The three hard problems in this phase (lightbox gestures, image format selection, intelligent crop) are each fully solved by their respective tools. Every line of custom code in these areas would be worse than the library solution.

---

## Common Pitfalls

### Pitfall 1: PhotoSwipe CSS Must Be Imported via Style, Not Script

**What goes wrong:** `import 'photoswipe/style.css'` inside an Astro `<script>` tag does nothing — Astro's script processing does not handle CSS imports within `<script>` blocks.
**Why it happens:** Astro processes `<script>` tags as JS modules via Vite, which does handle CSS imports in `.js` files but not in Astro component script tags used this way.
**How to avoid:** Import PhotoSwipe CSS in the global stylesheet or in BaseLayout's `<style>` tag:
```css
/* In src/styles/global.css */
@import "photoswipe/dist/photoswipe.css";
```
Or in BaseLayout.astro:
```astro
<style>
  @import "photoswipe/dist/photoswipe.css";
</style>
```
**Warning signs:** Lightbox opens but has no styling (no backdrop, no controls visible, or layout broken).

### Pitfall 2: PhotoSwipe Requires Actual Full-Size Image Dimensions

**What goes wrong:** Passing thumbnail dimensions (400x400) to `data-pswp-width`/`data-pswp-height` causes the lightbox to display images at wrong scale or cut off.
**Why it happens:** PhotoSwipe uses these dimensions to calculate how to fit the full-size image in the viewport.
**How to avoid:** Store the full-size image's original pixel dimensions in the gallery data schema. If uploading to Cloudinary, the upload response includes `width` and `height`. Record these at upload time and hard-code in `gallery.ts`.
**Warning signs:** Lightbox images appear distorted, too small, or zoom target is wrong.

### Pitfall 3: Navigation Crosses Category Boundaries if One Lightbox Handles All Images

**What goes wrong:** Arrow navigation in the lightbox moves from the last Facility photo to the first Quilting photo.
**Why it happens:** A single PhotoSwipe instance initialized with a parent selector that includes all gallery images will navigate across all of them.
**How to avoid:** Use one PhotoSwipe instance per category section. Add `data-pswp-gallery` to each category's grid container, not to a parent wrapper:
```javascript
// Initialize separately for each category
document.querySelectorAll('[data-pswp-gallery]').forEach((gallery) => {
  const lb = new PhotoSwipeLightbox({ gallery, children: 'a', pswpModule: () => import('photoswipe') });
  lb.init();
});
```
**Warning signs:** Arrows navigate beyond the expected set of category photos.

### Pitfall 4: Cloudinary Cloud Name Placeholder Not Replaced

**What goes wrong:** Images return 404 because the URL still uses `'demo'` or a placeholder cloud name.
**Why it happens:** Phase 1 used `res.cloudinary.com/demo` for CDN path verification (per `01-03` prior decision). Phase 3 must replace this with the actual retreat cloud name.
**How to avoid:** Define `CLOUD_NAME` as a single constant in `src/data/gallery.ts` (or `src/lib/cloudinary.ts`). Update it once when the real Cloudinary account is set up. Never hardcode the cloud name in multiple places.
**Warning signs:** All gallery images return 404 or show Cloudinary demo images.

### Pitfall 5: Thumbnail Aspect Ratio Without Explicit Width/Height Causes Layout Shift

**What goes wrong:** Gallery grid cells shift during image load because the browser doesn't know the reserved space.
**Why it happens:** Without explicit `width` and `height` attributes, browsers can't calculate aspect ratio before load.
**How to avoid:** Always include `width="400" height="400"` on thumbnail `<img>` tags (or use `aspect-square` CSS). The Tailwind `aspect-square` class on the container achieves the same result without inline attrs.
**Warning signs:** CLS (Cumulative Layout Shift) score spikes in DevTools Lighthouse.

### Pitfall 6: Lightbox Script Runs Before DOM Is Ready

**What goes wrong:** `document.querySelectorAll('[data-pswp-gallery]')` returns empty NodeList; lightbox never initializes.
**Why it happens:** In Astro static pages without View Transitions, the `<script>` module runs after DOM is parsed (type="module" defers execution), so this is usually fine. But if script is in `<head>` or placed before gallery HTML, it fails.
**How to avoid:** Keep Gallery component's `<script>` in the component file (after the HTML). Astro places bundled scripts at end of `<body>`. No special event listener needed for a simple static page.
**Warning signs:** Clicking gallery thumbnails opens the link URL instead of the lightbox.

---

## Code Examples

Verified patterns from official sources:

### Cloudinary Responsive Srcset for Full-Size Lightbox

```html
<!-- Source: https://cloudinary.com/documentation/responsive_html -->
<!-- Use this pattern for data-pswp-srcset to give PhotoSwipe responsive full-size options -->
<a href="https://res.cloudinary.com/CLOUD/image/upload/w_2000/f_auto/q_auto/PUBLIC_ID"
   data-pswp-width="3000"
   data-pswp-height="2000"
   data-pswp-srcset="
     https://res.cloudinary.com/CLOUD/image/upload/w_800/f_auto/q_auto/PUBLIC_ID 800w,
     https://res.cloudinary.com/CLOUD/image/upload/w_1200/f_auto/q_auto/PUBLIC_ID 1200w,
     https://res.cloudinary.com/CLOUD/image/upload/w_2000/f_auto/q_auto/PUBLIC_ID 2000w
   "
   data-cropped="true">
  <img src="https://res.cloudinary.com/CLOUD/image/upload/c_fill,g_auto,w_400,h_400/f_auto/q_auto/PUBLIC_ID"
       loading="lazy" width="400" height="400" alt="...">
</a>
```

### PhotoSwipe Initialization (npm, Astro `<script>`)

```typescript
// Source: https://photoswipe.com/getting-started
import PhotoSwipeLightbox from 'photoswipe/lightbox';

document.querySelectorAll<HTMLElement>('[data-pswp-gallery]').forEach((gallery) => {
  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: 'a',
    pswpModule: () => import('photoswipe'),
    // Mobile zoom behavior
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 1.5,
    maxZoomLevel: 3,
  });
  lightbox.init();
});
```

### Gallery Section Structure (Astro)

```astro
---
// Gallery.astro — replaces inline placeholder in index.astro
import GalleryCategory from './GalleryCategory.astro';
import VideoPlaceholder from './VideoPlaceholder.astro';
import { facilityImages, quiltingImages } from '../data/gallery';
import posterImage from '../assets/images/hero-front-view.jpeg'; // placeholder until final poster chosen
---

<section id="gallery" class="py-16 md:py-24 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Gallery</h2>
      <div class="w-24 h-1 bg-brand mx-auto mb-8"></div>
    </div>

    <!-- Video placeholder: above gallery sections -->
    <div class="mb-16">
      <VideoPlaceholder posterSrc={posterImage.src} />
    </div>

    <!-- Category: Facility -->
    <GalleryCategory title="Facility" images={facilityImages} />

    <!-- Category: Quilting -->
    <GalleryCategory title="Quilting" images={quiltingImages} />
  </div>
</section>

<script>
  import PhotoSwipeLightbox from 'photoswipe/lightbox';

  document.querySelectorAll<HTMLElement>('[data-pswp-gallery]').forEach((gallery) => {
    const lightbox = new PhotoSwipeLightbox({
      gallery,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();
  });
</script>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `fancybox`, `magnific-popup` (jQuery-dependent) | PhotoSwipe, GLightbox (vanilla JS ES modules) | ~2019-2022 | No jQuery dependency, tree-shakeable, smaller bundles |
| `astro:assets` `<Image>` for all images | Plain `<img>` for CDN URLs, `<Image>` only for local assets | Astro 2+ | External CDN images don't benefit from Astro's image pipeline; use raw `<img>` tags |
| Cloudinary JS SDK for URL generation | Manual URL strings or tiny helper function | Always valid | SDK adds 60-100KB for URL-only use; helper function is 5 lines |
| Tabs/filters for gallery categories | Separate scrollable sections per category | — (user decision) | No JS needed for navigation; simpler, better for long-scroll sites |
| `data-src` + IntersectionObserver for lazy load | Native `loading="lazy"` on `<img>` | Broad browser support ~2020 | Built-in; no polyfill, no JS code needed |

**Deprecated/outdated:**
- `@astrojs/tailwind` integration: deprecated for Tailwind v4 — project already using `@tailwindcss/vite` correctly (Phase 1 decision)
- `lightgallery.js` commercial license: v2+ requires commercial license for production use — avoid
- `Fancybox v5` freemium model: requires license for commercial sites — avoid

---

## Open Questions

1. **Actual Cloudinary cloud name for the retreat**
   - What we know: Phase 1 used `'demo'` cloud for path verification
   - What's unclear: The real cloud name for the client's Cloudinary account
   - Recommendation: Use `'timberandthreads'` as a placeholder constant in `src/data/gallery.ts`. Update before launch. The single-constant approach from Pattern 1 means one change propagates everywhere.

2. **Full-size image dimensions for existing photos**
   - What we know: Five images exist in `src/assets/images/` as local files
   - What's unclear: Their pixel dimensions once uploaded to Cloudinary (needed for `data-pswp-width`/`data-pswp-height`)
   - Recommendation: Run `identify` (ImageMagick) or check Cloudinary upload response. For the planning phase, stub dimensions as `width: 3000, height: 2000` (typical 3:2 landscape). Exact values required before Phase 3 verification.

3. **PhotoSwipe CSS import path**
   - What we know: `import 'photoswipe/style.css'` in `<script>` does not work
   - What's unclear: Whether `@import "photoswipe/dist/photoswipe.css"` or `@import "photoswipe/style.css"` is the correct path after npm install
   - Recommendation: Verify after `npm install photoswipe` by checking `node_modules/photoswipe/` structure. Both paths have been seen in docs; the npm package entry point should clarify.

4. **"All" combined category view (Claude's Discretion)**
   - What we know: User left this to Claude's discretion
   - Recommendation: Do NOT include an "All" view. It adds JS complexity (filtering/showing all), breaks the clean per-category scrolling flow, and provides no user value when there are only two small categories. The separate-sections layout already shows everything.

5. **Tablet breakpoint (Claude's Discretion)**
   - Recommendation: Use 2-column grid at `md` (768px) as suggested. Tailwind classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.

6. **Hover transition timing (Claude's Discretion)**
   - Recommendation: `transition-transform duration-300` for scale, `transition-colors duration-300` for overlay. 300ms matches the project's existing transition patterns from Phase 1/2.

---

## Sources

### Primary (HIGH confidence)
- `/withastro/docs` (Context7) — script tag bundling, npm imports, Image component lazy loading, `fetchpriority`, `is:inline` behavior
- `/websites/cloudinary` (Context7) — `c_fill,g_auto`, `f_auto`, `q_auto`, srcset URL construction, URL API format
- `/websites/photoswipe` (Context7) — PhotoSwipe initialization, `doubleTapAction`, `data-pswp-*` attributes, dimension requirements
- https://photoswipe.com/getting-started/ — installation, HTML structure, dimension requirements
- https://photoswipe.com/click-and-tap-actions/ — confirmed `doubleTapAction: 'zoom'` as default

### Secondary (MEDIUM confidence)
- https://github.com/biati-digital/glightbox — GLightbox feature list; double-tap zoom confirmed as GitHub issue #259 (pending) — reason GLightbox was not chosen
- https://astro.cloudinary.dev/installation — `astro-cloudinary` package overview; confirmed not needed for this use case

### Tertiary (LOW confidence)
- WebSearch: vanilla JS lightbox options 2025/2026 — used only for ecosystem discovery; all final choices verified via official docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — PhotoSwipe features verified via official docs; Cloudinary URL patterns from official docs
- Architecture: HIGH — Astro `<script>` behavior from official docs; gallery structure follows established project patterns
- Pitfalls: HIGH (Pitfall 1-4) / MEDIUM (Pitfall 5-6) — CSS import pitfall is a known Astro behavior from docs; dimension pitfall from PhotoSwipe docs; others from reasoning about architecture

**Research date:** 2026-02-17
**Valid until:** 2026-03-17 (PhotoSwipe 5.x stable, Astro 5.x stable, Cloudinary URL API stable)
