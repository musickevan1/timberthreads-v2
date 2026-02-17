# Phase 2: Content Sections and Embeds - Research

**Researched:** 2026-02-17
**Domain:** Astro 5 content components, IntersectionObserver lazy-loading, Google Calendar/Maps embeds, image asset migration
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | Hero section with full-screen background image, logo, tagline, and CTA buttons | Hero.astro already built in Phase 1 — needs verification against success criteria, minor tweaks only |
| CONT-02 | About section describing the island retreat setting and quilting/crafting focus | Full text extracted from `About.tsx`; 2-column layout with staggered image grid; 4 gallery images identified |
| CONT-03 | Workshops section covering group retreats, family gatherings, and amenities with details | Full content extracted from `Workshops.tsx`; 3-card grid layout; all bullet points captured |
| CONT-04 | Accommodations section with 4 bedrooms, 2 bathrooms, workspaces, and pricing ($500-600/night) | Full content from `Accommodations.tsx` + `Calendar.tsx` pricing block; images identified |
| CONT-05 | Connect section with Facebook page link and social preview card | Full content from `Connect.tsx`; Facebook URL confirmed |
| CONT-06 | Footer with copyright, contact info, and navigation links | Footer.astro already built in Phase 1 with contact info; nav links present |
| CONT-07 | All content migrated from current Next.js site with no information loss | Source content fully inventoried; all sections mapped |
| EMBD-01 | Google Calendar embed showing retreat availability, lazy-loaded via Intersection Observer | Calendar embed URL confirmed; `data-src` swap pattern documented |
| EMBD-02 | Google Maps embed showing retreat location, lazy-loaded via Intersection Observer | Maps embed URL confirmed; same lazy-load pattern applies |
| EMBD-03 | Map section with entrance photo and written directions/description | Directions text extracted from `Map.tsx`; `entrance-driveway.jpeg` image identified |
</phase_requirements>

---

## Summary

Phase 1 established a working Astro 5 + Tailwind v4 shell with Hero, Nav, Footer, and image pipeline. Phase 2 fills in the seven remaining content sections (About, Workshops/Retreats, Accommodations, Calendar, Connect, Map/Location) as pure Astro components with no client-side JavaScript frameworks. All source content has been inventoried from the original Next.js site's TypeScript components in `/home/evan/Projects/clients/timberandthreads/src/components/`.

The two interactive embeds (Google Calendar, Google Maps) require lazy loading via `IntersectionObserver`. The pattern is established: render an `<iframe>` with `data-src` instead of `src`, then a `<script>` in the same component swaps the attribute when the container scrolls into view. This avoids the performance cost of loading Google's iframe infrastructure on initial page load.

The section naming in the current v2 nav uses `retreats`, `contact`, and `location` — but the original site and requirements use `workshops`, `connect`, and `location`. The existing Nav.astro and Footer.astro use the v2 names (`retreats`, `contact`, `location`). The planner must decide: keep v2 names (simpler) or align to original names. Keeping v2 names is simpler since Nav.astro already uses them. The `#connect` and `#map` sections from the original can map to `#contact` and `#location` respectively in v2 without user-visible difference.

**Primary recommendation:** Build all seven content sections as plain `.astro` files using the content extracted below. Use the `data-src` IntersectionObserver pattern for Calendar and Maps iframes. Copy all gallery images from the original site's `/public/assets/gallery/` to v2's `src/assets/images/`.

---

## Content Inventory (Source of Truth)

This is the complete text and structure extracted from the original Next.js site. Zero information loss means every bullet, heading, and paragraph from this inventory must appear in the v2 component.

### CONT-01: Hero (already built — `src/components/Hero.astro`)

The Hero.astro from Phase 1 already satisfies CONT-01:
- Full-screen background image: `hero-front-view.jpeg` (two-layer abs+rel pattern)
- Logo: `logo.png`, width 130, eager loading
- H1: "Timber & Threads Retreat"
- Tagline: "Relax, create, and connect in nature's embrace"
- CTA 1: "Learn More" → `#about`
- CTA 2: "Contact Us to Book" → `#contact`

**Action needed:** None for structure. Verify CTA buttons link to correct section IDs used in v2.

---

### CONT-02: About Section (`#about`)

**Heading:** "Welcome to Timber & Threads"
**Decorative divider:** teal bar `w-24 h-1 bg-brand`

**Paragraph 1:**
> Nestled on a peaceful island surrounded by a small lake in Clinton, Missouri, Timber & Threads Retreat offers a unique quilting and crafting getaway. Our retreat center is designed to inspire creativity while providing a serene escape from the busy world.

**Paragraph 2:**
> Our all-on-one-level facility features comfortable accommodations, dedicated workspaces, and a tranquil natural setting. Whether you're here for a quilting retreat, crafting weekend, or family gathering, we provide an environment where creativity and relaxation flow naturally.

**Image grid (4 images, staggered layout):**
| Image file | Alt text |
|-----------|---------|
| `quilt-workspace.jpeg` | Quilting workspace |
| `quilt-display-1.jpeg` | Quilt display |
| `quilt-display-2.jpeg` | Quilt display |
| `quilt-display-3.jpeg` | Quilt display |

**Layout:** 2-col (text left, staggered 2x2 image grid right), stacking to 1-col on mobile.

---

### CONT-03: Workshops / Retreats Section (`#retreats`)

**Heading:** "Quilting Retreats"
**Subtext:** "Our retreat center is perfect for quilting groups, crafting weekends, and creative gatherings."

**Three cards:**

**Card 1 — Group Retreats**
> Bring your quilting or crafting group for a dedicated creative getaway. Our space is perfect for groups looking to work on projects together in a peaceful setting.
- Accommodates multiple workstations
- Dedicated cutting and ironing stations
- Comfortable seating for long creative sessions
- Flexible space for group activities

**Card 2 — Family Gatherings**
> Our retreat center is also perfect for family gatherings. The workroom doubles as a comfortable living space when not being used for crafting activities.
- Comfortable accommodations for families
- Full kitchen for meal preparation
- Peaceful lake setting
- All-on-one-level accessibility

**Card 3 — Amenities**
> We provide everything you need for a comfortable and productive stay at our retreat center.
- Starlink Internet access
- Full kitchen with dishwasher
- Coffee, tea, and basic beverages provided
- Optional meal service available
- Outdoor picnic area
- Peaceful lake views

**CTA button at bottom:** "Contact Us to Book" → `#contact`

---

### CONT-04: Accommodations Section (`#accommodations`)

**Heading:** "Stay With Us"
**Subtext:** "Experience comfort and tranquility in our purpose-built quilting retreat facility."

**Card 1 — Comfortable Accommodations** (image: `hero-front-view.jpeg`)
> Our retreat center is all on one level with comfortable accommodations for your quilting or crafting group, featuring peaceful lake views.
- 4 bedrooms with comfortable beds
- 2 bathrooms (one with tub/shower, one with walk-in shower)
- Bedding and towels provided
- Full kitchen with dishwasher

**Card 2 — Creative Workspaces** (image: `quilt-workspace.jpeg`)
> Our workroom doubles as a living room for family rentals, but is perfectly equipped for quilting and crafting retreats.
- 30 x 60 tables with comfortable leather chairs
- 2 cutting tables and 2 ironing stations
- Starlink Internet access
- Outdoor picnic table for meals or quiet time

**Pricing (from Calendar section — must NOT be lost):**

**Pricing Information:**
- March - April 2025: $500 per night
- May 2025 onwards: $600 per night
- Minimum 2-night stay required
- $250 refundable deposit (up to 10 days before arrival)
- Entire center rental includes all amenities

**Meal Options:**
- Continental Breakfast & Lunch: $10 per person/day
- Brunch & Dinner: $12.50 per person/day
- All 3 Meals: $15 per person/day
- Dietary restrictions accommodated
- Full kitchen available for self-catering

**Note:** In the original site, pricing lives inside the Calendar section. For Phase 2, pricing can stay with Accommodations (logically appropriate) or Calendar. The planner should choose a location. Keeping it in Calendar (below the embed) mirrors the original layout.

---

### EMBD-01: Calendar Section (`#calendar`)

**Heading:** "Availability Calendar"
**Subtext:** "Plan your creative getaway at Timber & Threads Retreat"

**Google Calendar embed URL (verbatim):**
```
https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&title=Availability%20Calendar&showPrint=0&src=dGltYmVyYW5kdGhyZWFkczI0QGdtYWlsLmNvbQ&color=%23039BE5
```

**Container:** aspect ratio 4:3 (paddingTop: 75% in original) — renders as responsive responsive box.

**Contact note below calendar:**
> To check availability and make a reservation, please contact us directly.
> Calendar is updated regularly to reflect current bookings.
- "Contact Us" button → `#contact`

**Pricing block** (see CONT-04 above — decision: keep here or move to Accommodations).

---

### EMBD-02 + EMBD-03: Map / Location Section (`#location`)

**Heading:** "Find Us"
**Subtext:** "Discover the tranquil location of Timber & Threads Retreat"

**Google Maps embed URL (verbatim):**
```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3096.2619813937!2d-93.73333482388574!3d38.35667797966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87c0a4a27a7f5e9d%3A0x5c7c6a35c3a3e3!2s306%20NW%20300%20Rd%2C%20Clinton%2C%20MO%2064735!5e0!3m2!1sen!2sus!4v1709769600000!5m2!1sen!2sus
```

**Address:** 306 NW 300 Rd, Clinton, MO 64735

**Directions (6 steps — all must be preserved):**
1. From Highway 7, turn North onto NW 221 Road *(near Golden Valley Fireworks and Breaktime Convenience Store)*
2. Follow the Blacktop Road to the "T" intersection
3. Turn left at the intersection
4. On the first curve, look for a large fence and gate *(You can't miss the gate entrance)*
5. Go through the gate
6. Follow the road to the right *(Continue until you see the Timber & Threads Retreat center)*

**Tip:** GPS coordinates can sometimes be unreliable in rural areas. Follow these directions carefully or call ahead if you're unsure.

**Entrance photo:** `entrance-driveway.jpeg`
**Caption heading:** "Approach to the Retreat"
**Caption text:** "A scenic view of the entrance and driveway leading to Timber & Threads Retreat. Notice the welcoming gate and the natural surroundings that await you."

**Layout decision:** The original used interactive React tabs (Google Maps / Driving Directions). In Astro's static-first approach, both can render simultaneously in a simpler two-column layout — map left, directions right, entrance photo below or beside. No JS needed for tabs if both are visible. The planner can choose: static two-column (recommended) or use CSS `details`/`summary` for a no-JS accordion if space is tight.

---

### CONT-05: Connect Section (`#connect`)

**Heading:** "Connect With Us"
**Subtext:** "Stay updated with our latest news and events"

**Facebook page URL:**
```
https://www.facebook.com/people/Timber-and-Threads-Retreat-Center/61571800331062/
```

**Description:**
> Stay connected with Timber & Threads Retreat Center on Facebook for the latest updates, events, and quilting inspiration.

**Button:** "Visit Our Facebook Page" → Facebook URL (target=_blank, rel=noopener noreferrer)

**Social preview card content:**
- Header: "Timber and Threads Retreat Center" (Facebook blue bar)
- Body: "Join our community of quilters and crafters! Follow our page for:"
  - Upcoming retreat dates
  - Special events and workshops
  - Photos of recent quilting projects
  - Retreat center updates
- Note: "Last updated: March 2025"

---

### CONT-06: Footer (already built — `src/components/Footer.astro`)

The Footer.astro from Phase 1 already satisfies CONT-06:
- Brand column: name + tagline description
- Navigation column: all 8 section links
- Contact column: phone (417) 343-1473, email timberandthreads24@gmail.com, Missouri Ozarks, MO
- Copyright line with dynamic year

**Action needed:** None. Footer is complete. Verify contact info matches original.

---

## Standard Stack

### Core (already installed in v2)
| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| astro | ^5.17.1 | Component framework | Static output, no React needed |
| tailwindcss | ^4.1.18 | Utility CSS | v4 CSS-first config already in global.css |
| @astrojs/vercel | ^9.0.4 | Deployment adapter | Static mode, already configured |

### No New Dependencies Required

All Phase 2 sections are pure Astro components with vanilla JS. No React, no component library, no new npm packages needed.

**Rationale:** The original site's "interactive" features (tab switching in Map, scroll-to-contact button in Calendar) are trivially implementable as either static layout changes (show both tabs simultaneously) or vanilla JS (scroll button). The prior decision says "Start with vanilla JS, add React only if interaction complexity justifies ~40KB cost" — none of Phase 2's interactions justify React.

---

## Image Asset Migration

The v2 project currently only has two images in `src/assets/images/`:
- `hero-front-view.jpeg`
- `logo.png`

**Images needed for Phase 2** (all in `/home/evan/Projects/clients/timberandthreads/public/assets/gallery/`):

| File | Used In |
|------|---------|
| `quilt-workspace.jpeg` | About section (image grid), Accommodations (workspace card) |
| `quilt-display-1.jpeg` | About section (image grid) |
| `quilt-display-2.jpeg` | About section (image grid) |
| `quilt-display-3.jpeg` | About section (image grid) |
| `entrance-driveway.jpeg` | Map section (entrance photo) |
| `bedroom-1.jpeg` | Phase 3 gallery (not needed for Phase 2 content, but copy now) |
| `bedroom-2.jpeg` | Phase 3 gallery |
| `bathroom.jpeg` | Phase 3 gallery |
| `kitchen.jpeg` | Phase 3 gallery |
| `hero-porch-view.jpeg` | Phase 3 gallery |

**For Phase 2, copy these 5 files at minimum:**
```bash
cp /home/evan/Projects/clients/timberandthreads/public/assets/gallery/quilt-workspace.jpeg \
   /home/evan/Projects/clients/timberandthreads-v2/src/assets/images/
cp /home/evan/Projects/clients/timberandthreads/public/assets/gallery/quilt-display-1.jpeg \
   /home/evan/Projects/clients/timberandthreads-v2/src/assets/images/
cp /home/evan/Projects/clients/timberandthreads/public/assets/gallery/quilt-display-2.jpeg \
   /home/evan/Projects/clients/timberandthreads-v2/src/assets/images/
cp /home/evan/Projects/clients/timberandthreads/public/assets/gallery/quilt-display-3.jpeg \
   /home/evan/Projects/clients/timberandthreads-v2/src/assets/images/
cp /home/evan/Projects/clients/timberandthreads/public/assets/gallery/entrance-driveway.jpeg \
   /home/evan/Projects/clients/timberandthreads-v2/src/assets/images/
```

**Astro `<Image>` usage for these files:**
```astro
---
import { Image } from 'astro:assets';
import quiltWorkspace from '../assets/images/quilt-workspace.jpeg';
---
<Image
  src={quiltWorkspace}
  alt="Quilting workspace"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 50vw"
  class="object-cover w-full h-full"
/>
```

---

## Architecture Patterns

### Component File Structure

Each content section becomes its own `.astro` file in `src/components/`. Index.astro imports and renders them in order.

```
src/
├── components/
│   ├── Nav.astro              (Phase 1 - complete)
│   ├── Hero.astro             (Phase 1 - complete)
│   ├── About.astro            (Phase 2 - new)
│   ├── Workshops.astro        (Phase 2 - new)
│   ├── Accommodations.astro   (Phase 2 - new)
│   ├── Calendar.astro         (Phase 2 - new, includes lazy iframe)
│   ├── Connect.astro          (Phase 2 - new)
│   ├── Map.astro              (Phase 2 - new, includes lazy iframe)
│   ├── Footer.astro           (Phase 1 - complete)
│   ├── ImageTest.astro        (Phase 1 - can be removed in Phase 2)
│   └── Nav.astro
├── assets/images/             (add 5 images from original site)
├── layouts/BaseLayout.astro   (Phase 1 - complete)
├── pages/index.astro          (Phase 2 - replace placeholders with real components)
└── styles/global.css          (Phase 1 - complete)
```

### Pattern 1: Plain Astro Content Component

Use for About, Workshops, Accommodations, Connect:

```astro
---
// src/components/About.astro
import { Image } from 'astro:assets';
import quiltWorkspace from '../assets/images/quilt-workspace.jpeg';
import quiltDisplay1 from '../assets/images/quilt-display-1.jpeg';
import quiltDisplay2 from '../assets/images/quilt-display-2.jpeg';
import quiltDisplay3 from '../assets/images/quilt-display-3.jpeg';
---

<section id="about" class="py-16 md:py-24 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <h2 class="font-serif text-3xl md:text-4xl text-stone-800 mb-4">Welcome to Timber &amp; Threads</h2>
      <div class="w-24 h-1 bg-brand mx-auto"></div>
    </div>
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div class="space-y-6">
        <p class="text-lg text-stone-700 leading-relaxed">...</p>
        <p class="text-lg text-stone-700 leading-relaxed">...</p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="relative aspect-square rounded-lg overflow-hidden">
          <Image src={quiltWorkspace} alt="Quilting workspace" widths={[400, 800]} sizes="25vw" class="object-cover w-full h-full" />
        </div>
        <!-- more images -->
      </div>
    </div>
  </div>
</section>
```

### Pattern 2: Lazy-Loaded iframe via IntersectionObserver

Use for Calendar (EMBD-01) and Map (EMBD-02):

```astro
---
// src/components/Calendar.astro
---

<section id="calendar" class="py-16 md:py-24 bg-stone-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- ... heading ... -->

    <!-- Responsive iframe container: data-src holds the real URL -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div class="relative w-full" style="padding-top: 75%">
        <iframe
          id="calendar-iframe"
          data-src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&title=Availability%20Calendar&showPrint=0&src=dGltYmVyYW5kdGhyZWFkczI0QGdtYWlsLmNvbQ&color=%23039BE5"
          class="absolute top-0 left-0 w-full h-full border-0"
          frameborder="0"
          scrolling="no"
          title="Retreat Availability Calendar"
          aria-label="Google Calendar showing retreat availability"
        ></iframe>
      </div>
    </div>
  </div>
</section>

<script>
  const iframe = document.getElementById('calendar-iframe') as HTMLIFrameElement | null;
  if (iframe) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const src = iframe.dataset.src;
            if (src && !iframe.src) {
              iframe.src = src;
            }
            observer.unobserve(iframe);
          }
        });
      },
      { rootMargin: '200px' }  // Start loading 200px before viewport
    );
    observer.observe(iframe);
  }
</script>
```

**Why `rootMargin: '200px'`:** Starts loading the iframe 200px before it enters the viewport, so users don't see a loading flash. The scroll-spy script already uses `rootMargin: '-5% 0% -90% 0%'` for a different purpose (detecting "active" section) — the two observers don't conflict since they observe different elements.

### Pattern 3: Teal Decorative Divider

Used on all section headings in the original site. Establish this as a shared visual motif:

```html
<div class="w-24 h-1 bg-brand mx-auto mb-8"></div>
```

This is a CSS-only visual element, no component abstraction needed at this scale.

### Pattern 4: Section Alternating Backgrounds

Follow the existing v2 pattern from `index.astro`. Map the sections:

| Section | Background |
|---------|-----------|
| `#home` (Hero) | Full-bleed image |
| `#about` | `bg-white` |
| `#retreats` | `bg-stone-50` |
| `#accommodations` | `bg-stone-100` |
| `#calendar` | `bg-stone-50` |
| `#gallery` | `bg-white` |
| `#contact` | `bg-stone-50` |
| `#location` | `bg-stone-50` |

Note: The "connect" section from the original site maps to `#contact` in v2 (the nav already uses `#contact`). The Connect section content (Facebook link) will live there — the contact form is deferred to a later phase. Or, Connect can be a new section between `#contact` and `#location`. The planner should decide: collapse Connect into Contact section, or add a new `#connect` nav item.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive iframes | Custom aspect-ratio hack | CSS `aspect-ratio` or padding-top trick | Already proven in Calendar.tsx (padding-top: 75%) |
| Lazy iframe loading | Custom polling interval | IntersectionObserver + data-src swap | Native browser API, zero dependencies |
| Image optimization | Manual resize/convert | `astro:assets` `<Image>` | Automatic WebP, srcset, lazy loading |
| Tab switching (Map) | React state component | CSS-only layout showing both columns | Saves ~40KB React bundle; both sections visible improves UX |
| Scroll button | React event handler | Plain `<a href="#contact">` | Anchor links work natively; smooth-scroll is in global.css |

---

## Common Pitfalls

### Pitfall 1: Iframe Loaded on Initial Page Load
**What goes wrong:** Placing `src` directly on the `<iframe>` causes Google Calendar/Maps to load during initial page parse, adding ~500ms of network blocking to Time to Interactive.
**Why it happens:** Browser immediately fetches iframe src on parse.
**How to avoid:** Use `data-src` on the iframe element; only assign `iframe.src` from the IntersectionObserver callback.
**Warning signs:** Lighthouse TTI or LCP penalty; network waterfall shows calendar.google.com requests before page paint.

### Pitfall 2: Script Runs Before DOM Element Exists
**What goes wrong:** `document.getElementById('calendar-iframe')` returns null because the script executes before the element is painted.
**Why it happens:** In Astro, `<script>` tags in components are bundled as `type="module"` and deferred by default — this is actually safe. But if the script is placed before the `<section>` in source order, the element reference can fail.
**How to avoid:** Place the `<script>` tag AFTER the HTML markup in the `.astro` file, or use `document.addEventListener('DOMContentLoaded', ...)` as a safety net.
**Warning signs:** Console error "Cannot read properties of null (reading 'dataset')".

### Pitfall 3: `aspect-square` Doesn't Work on Images Without Container Sizing
**What goes wrong:** The staggered image grid in the About section shows non-square images or layout collapse.
**Why it happens:** `aspect-square` + `overflow-hidden` on the parent div requires `<Image>` to have `class="object-cover w-full h-full"` — not just `object-cover`.
**How to avoid:** Wrap each image in `<div class="relative aspect-square rounded-lg overflow-hidden">` and use `class="object-cover w-full h-full"` on the `<Image>`.
**Warning signs:** Images appear squished or don't fill their grid cells.

### Pitfall 4: `&amp;` vs `&` in Astro Templates
**What goes wrong:** Rendering `Timber & Threads` unescaped in Astro JSX-like template outputs a raw `&` that browsers may interpret as malformed HTML.
**Why it happens:** Astro HTML is strict; `&` in attribute-adjacent text can trigger parser warnings.
**How to avoid:** Use `&amp;` in Astro template HTML or `Timber &amp; Threads` consistently — same pattern already used in Hero.astro and Nav.astro in v2.
**Warning signs:** HTML validator warnings; rare visual glitches in very old browsers.

### Pitfall 5: Section ID Mismatch Breaking Nav Scroll-Spy
**What goes wrong:** Creating a section with `id="workshops"` when `Nav.astro` links to `href="#retreats"` means the nav link never activates its scroll-spy state.
**Why it happens:** The scroll-spy in `scroll-spy.js` matches `href="#${entry.target.id}"` against nav links. ID and href must match exactly.
**How to avoid:** Use `id="retreats"` on the Workshops section. The nav already has `#retreats`. The label "Retreats" vs "Quilting Retreats" is a heading inside the section, not the ID.
**Section ID reference for v2:**

| Section | Required `id=` | Nav href | Heading inside section |
|---------|---------------|---------|----------------------|
| About | `about` | `#about` | "Welcome to Timber & Threads" |
| Workshops | `retreats` | `#retreats` | "Quilting Retreats" |
| Accommodations | `accommodations` | `#accommodations` | "Stay With Us" |
| Calendar | `calendar` | `#calendar` | "Availability Calendar" |
| Gallery | `gallery` | `#gallery` | "Gallery" |
| Connect / Contact | `contact` | `#contact` | "Connect With Us" (or "Contact") |
| Location | `location` | `#location` | "Find Us" |

### Pitfall 6: Pricing Information Lost in Section Reorganization
**What goes wrong:** Original site puts Pricing and Meal Options inside the Calendar section. In v2, if the planner moves them to Accommodations without explicitly migrating all bullet points, CONT-07 fails the "no information loss" test.
**How to avoid:** Use the content inventory above verbatim. Copy all 3 pricing rows and all 5 pricing notes. Copy all 3 meal option rows.
**Warning signs:** Comparison with original site screenshot shows missing price figures.

---

## Code Examples

### Lazy-Load Calendar iframe (complete component pattern)
```astro
---
// Calendar.astro — no imports needed for pure HTML sections
---

<section id="calendar" class="py-16 md:py-24 bg-stone-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div class="text-center mb-12">
      <h2 class="font-serif text-3xl md:text-4xl text-stone-800 mb-4">Availability Calendar</h2>
      <div class="w-24 h-1 bg-brand mx-auto mb-8"></div>
      <p class="text-lg text-stone-700 max-w-2xl mx-auto">
        Plan your creative getaway at Timber &amp; Threads Retreat
      </p>
    </div>

    <!-- Calendar embed (lazy-loaded) -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
      <div class="relative w-full" style="padding-top: 75%;">
        <iframe
          id="calendar-iframe"
          data-src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&title=Availability%20Calendar&showPrint=0&src=dGltYmVyYW5kdGhyZWFkczI0QGdtYWlsLmNvbQ&color=%23039BE5"
          class="absolute top-0 left-0 w-full h-full border-0"
          frameborder="0"
          scrolling="no"
          title="Retreat Availability Calendar"
        ></iframe>
      </div>
    </div>

    <!-- Contact note -->
    <div class="bg-white rounded-lg shadow-sm p-8 text-center max-w-3xl mx-auto mb-8">
      <p class="text-lg text-stone-700 mb-2">
        To check availability and make a reservation, please contact us directly.
      </p>
      <p class="text-stone-600 italic mb-6">Calendar is updated regularly to reflect current bookings.</p>
      <a href="#contact" class="inline-flex items-center px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors">
        Contact Us
      </a>
    </div>

    <!-- Pricing -->
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Pricing Information card -->
      <!-- Meal Options card -->
    </div>

  </div>
</section>

<script>
  const iframe = document.getElementById('calendar-iframe') as HTMLIFrameElement | null;
  if (iframe) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const src = iframe.dataset.src;
          if (src) iframe.src = src;
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(iframe);
  }
</script>
```

### Staggered Image Grid (About section)
```astro
<div class="grid grid-cols-2 gap-4">
  <!-- Top-left: normal -->
  <div class="relative aspect-square rounded-lg overflow-hidden">
    <Image src={quiltWorkspace} alt="Quilting workspace" widths={[400, 800]} sizes="(max-width: 768px) 50vw, 25vw" class="object-cover w-full h-full" />
  </div>
  <!-- Top-right: shifted down -->
  <div class="relative aspect-square rounded-lg overflow-hidden mt-8">
    <Image src={quiltDisplay1} alt="Quilt display" widths={[400, 800]} sizes="(max-width: 768px) 50vw, 25vw" class="object-cover w-full h-full" />
  </div>
  <!-- Bottom-left: shifted up -->
  <div class="relative aspect-square rounded-lg overflow-hidden -mt-8">
    <Image src={quiltDisplay2} alt="Quilt display" widths={[400, 800]} sizes="(max-width: 768px) 50vw, 25vw" class="object-cover w-full h-full" />
  </div>
  <!-- Bottom-right: normal -->
  <div class="relative aspect-square rounded-lg overflow-hidden">
    <Image src={quiltDisplay3} alt="Quilt display" widths={[400, 800]} sizes="(max-width: 768px) 50vw, 25vw" class="object-cover w-full h-full" />
  </div>
</div>
```

### Three-Card Layout (Workshops section)
```astro
<div class="grid md:grid-cols-3 gap-8">
  <div class="bg-stone-50 rounded-lg p-6 shadow-sm">
    <!-- SVG icon + h3 + paragraph + ul -->
  </div>
  <!-- repeat x3 -->
</div>
```

### Facebook Social Preview Card (Connect section)
```astro
<div class="rounded-lg overflow-hidden shadow-md border border-stone-200">
  <a href="https://www.facebook.com/people/Timber-and-Threads-Retreat-Center/61571800331062/" target="_blank" rel="noopener noreferrer">
    <div class="bg-blue-600 text-white p-4 flex items-center gap-2">
      <!-- Facebook SVG icon -->
      <span class="font-medium">Timber and Threads Retreat Center</span>
    </div>
    <div class="p-4 bg-white">
      <p class="text-stone-700 mb-3">Join our community of quilters and crafters! Follow our page for:</p>
      <ul class="text-stone-700 space-y-2 list-disc pl-5">
        <li>Upcoming retreat dates</li>
        <li>Special events and workshops</li>
        <li>Photos of recent quilting projects</li>
        <li>Retreat center updates</li>
      </ul>
      <p class="mt-4 text-sm text-stone-500">Last updated: March 2025</p>
    </div>
  </a>
</div>
```

---

## Section Naming Decision (Requires Planner Choice)

The original site has a `#connect` section (Facebook). The v2 nav has a `#contact` section (placeholder). Two options:

**Option A (Recommended): Keep `#contact` and put Connect content there**
- No nav change needed
- Connect replaces the contact form placeholder (contact form is deferred to a future phase per Phase 1 decisions)
- Heading can be "Connect With Us" inside the `#contact` section

**Option B: Add `#connect` as separate section**
- Requires updating `Nav.astro` and `Footer.astro` nav arrays
- Adds a 9th nav item
- Not needed — the original only had 8 nav items with Connect separate, but `#contact` serves the same purpose

**Planner should choose Option A** — less nav churn, contact form (Phase 3+) can live alongside the Facebook link.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React state for tab switching | CSS multi-column or CSS-only details | Astro static-first | Eliminates React dependency for trivial UX |
| `next/image` with fill prop | `astro:assets` `<Image>` with widths/sizes | Phase 1 complete | Build-time WebP generation, native responsive srcset |
| `react-scroll` Link component | Native `<a href="#section">` + CSS scroll-behavior | Phase 1 complete | Zero JS for smooth scroll |

---

## Open Questions

1. **Pricing placement — Calendar vs Accommodations?**
   - What we know: Original places pricing inside the Calendar section. Success criteria mentions pricing ($500-600/night) must be visible.
   - What's unclear: Whether users expect to find pricing near the calendar (logical: "when available, how much?") or near accommodations.
   - Recommendation: Keep pricing in Calendar section to match original layout, satisfying CONT-07 no-information-loss.

2. **Connect section vs Contact section naming**
   - What we know: Nav uses `#contact`; original site has both a `#contact` (form) and `#connect` (Facebook).
   - What's unclear: Whether the contact form is expected in Phase 2.
   - Recommendation: Phase 2 contact form is out of scope (was a complex React component with API call). Put the Connect (Facebook) content in `#contact` section. Label heading "Connect With Us." This keeps nav intact.

3. **Gallery section in Phase 2**
   - What we know: Gallery (`#gallery`) has `<ImageTest>` placeholder from Phase 1. Requirements don't list gallery as CONT-XX for Phase 2.
   - What's unclear: Should `ImageTest.astro` remain, or should it be replaced with real gallery content?
   - Recommendation: Leave `ImageTest.astro` in place for now (gallery is Phase 3). Remove the "Image Pipeline Test" label and replace with a "Coming soon" placeholder if needed.

---

## Sources

### Primary (HIGH confidence)
- `/home/evan/Projects/clients/timberandthreads/src/components/About.tsx` — complete content extracted
- `/home/evan/Projects/clients/timberandthreads/src/components/Workshops.tsx` — complete content extracted
- `/home/evan/Projects/clients/timberandthreads/src/components/Accommodations.tsx` — complete content extracted
- `/home/evan/Projects/clients/timberandthreads/src/components/Calendar.tsx` — complete content extracted + embed URLs
- `/home/evan/Projects/clients/timberandthreads/src/components/Map.tsx` — complete content extracted + embed URLs + directions
- `/home/evan/Projects/clients/timberandthreads/src/components/Connect.tsx` — complete content extracted + Facebook URL
- `/home/evan/Projects/clients/timberandthreads/src/components/Footer.tsx` — checked; v2 Footer.astro is richer
- `/home/evan/Projects/clients/timberandthreads-v2/src/` — all Phase 1 artifacts verified
- [Astro Client-Side Scripts Docs](https://docs.astro.build/en/guides/client-side-scripts/) — script module behavior confirmed

### Secondary (MEDIUM confidence)
- [Walter Ebert: Lazy Loading Google Maps with IntersectionObserver](https://walterebert.com/blog/lazy-loading-google-maps-with-the-intersection-observer-api/) — data-src swap pattern confirmed
- [nikitahl.com: Lazy load images, videos and iframes](https://nikitahl.com/lazy-load-images) — vanilla JS IntersectionObserver iframe pattern

---

## Metadata

**Confidence breakdown:**
- Content inventory: HIGH — directly read from source TSX files, verbatim
- Image asset mapping: HIGH — files confirmed present in original public/assets/gallery/
- Lazy-load iframe pattern: HIGH — well-established browser API, verified against multiple sources
- Architecture patterns: HIGH — extends proven Phase 1 patterns
- Section naming decisions: MEDIUM — requires planner judgment call on Connect/Contact merge

**Research date:** 2026-02-17
**Valid until:** 2026-04-17 (stable domain; only risk is Google embed URL format changes, which is low)
