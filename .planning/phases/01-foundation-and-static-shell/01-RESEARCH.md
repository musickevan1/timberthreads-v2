# Phase 1: Foundation and Static Shell - Research

**Researched:** 2026-02-16
**Domain:** Astro 5 + Tailwind CSS v4 + Vercel deployment infrastructure
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Design fidelity:**
- Same feel as current site, with minor polish allowed (better spacing, smoother transitions)
- Not pixel-perfect — match the overall design but allow tasteful refinements
- Current site has 6 React hydration errors and broken gallery ("Loading gallery images...") — these are the primary pain points to fix

**Color palette:**
- Keep current teal accent: #0D9488 (Tailwind teal-600) — this is the brand color
- Stone palette for backgrounds: stone-50, stone-100, teal-50, white
- Text colors: stone-800/900 for body, stone-600 for secondary
- Alternating section backgrounds pattern preserved

**Typography:**
- Inter for body text (400 weight, 16px base)
- Serif (Georgia/system serif) for headings (500 weight for h1, 400 for h2)
- Keep the same font pairing — provides "modern warmth"

**Navigation:**
- Sticky nav, always visible at top while scrolling
- Same section order: Home, About, Retreats, Accommodations, Calendar, Gallery, Contact, Location
- Active section highlighting via scroll-spy (nav link gets visual indicator for current section)
- Remove Admin link from footer (not in v1 scope)
- Smooth-scroll to sections on nav link click

**Layout shell:**
- Alternating section backgrounds preserved (white, stone-100, teal-50, etc.)
- Hero section: full-viewport height with retreat front photo as background
- Hero structure: logo, tagline ("Relax, create, and connect in nature's embrace"), CTA buttons ("Learn More", "Contact Us to Book")
- Hero should be built to support future video background swap (Phase 3 promo video)

**Images:**
- Pull images from current site to start
- User will provide original high-res versions when ready — swap in later
- Logo (quilting patch design) is finalized — won't change

### Claude's Discretion

- Mobile hamburger menu open style (recommended: full-screen overlay for older demographic with large tap targets)
- Nav logo treatment (text only vs logo image + text)
- Scroll animation speed/easing
- Nav background behavior (solid vs transparent-on-hero)
- Footer structure and navigation
- Max content width (current is ~1280px)
- Micro-interactions and polish (performance-first)

### Deferred Ideas (OUT OF SCOPE)

- Hero background video loop — Phase 3 (promo video not ready yet)
- Admin interface — v2 feature (ADMN-01 through ADMN-03)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FOUND-01 | Astro 5 project with Tailwind CSS v4, TypeScript strict, and Vercel deployment pipeline | Astro 5.2+ `npx astro add tailwind` auto-wires `@tailwindcss/vite`. TypeScript strict is default in Astro 5. `npx astro add vercel` adds `@astrojs/vercel` adapter. |
| FOUND-02 | BaseLayout with meta tags, Open Graph, fonts, and global styles | Pattern verified: `src/layouts/BaseLayout.astro` with `<slot name="head" />`, separate `Head.astro` component for meta/OG tags, experimental fonts API for Inter. |
| FOUND-03 | Mobile-first responsive design with breakpoints at sm/md/lg/xl | Tailwind v4 ships with default breakpoints sm/md/lg/xl/2xl; mobile-first is default via `min-width` queries. No config change needed. |
| FOUND-04 | Navigation with smooth-scroll anchor links to all sections | Pattern: CSS `scroll-behavior: smooth` on `html` + `href="#section-id"` links. Scroll-spy via vanilla JS `IntersectionObserver` with `rootMargin: "-5% 0% -95% 0%"` to track active section. |
| FOUND-05 | Image optimization pipeline established (Cloudinary CDN for gallery, Astro `<Image>` for local assets) | Astro `<Image>` and `<Picture>` components auto-generate WebP/AVIF srcsets. Cloudinary: configure `image.domains: ['res.cloudinary.com']` in astro.config; use plain `<img>` tags with Cloudinary URLs (no SDK needed in Phase 1). |
| FOUND-06 | Production build verified on Vercel with zero errors | `npx astro add vercel` + `output: 'static'` + `adapter: vercel()` in astro.config. Zero-config Vercel deploy via git push. |
</phase_requirements>

---

## Summary

Phase 1 establishes a working Astro 5 static site with Tailwind CSS v4, strict TypeScript, and a Vercel deployment. The stack is well-documented and the integration path is fully supported as of Astro 5.2. The most significant change from "common knowledge" is that Tailwind v4 integration no longer uses `@astrojs/tailwind` — it uses `@tailwindcss/vite` directly, which `npx astro add tailwind` now handles automatically on Astro 5.2+.

There is one important color discrepancy to flag: the user specified `#0D9488` as "Tailwind teal-600," but this was the v3 value. Tailwind v4 changed the teal palette to OKLCH, making `teal-600` approximately `#009689`. To preserve the exact brand color, the CSS should define a custom `--color-brand: #0D9488` via `@theme` rather than relying on the built-in `teal-600`. This ensures color fidelity on the production site.

The full-viewport hero section needs to be structured with a `position: relative` container holding a background image layer and a separate foreground content layer. This architecture allows a future video element to replace the background layer in Phase 3 without touching the content or layout. The sticky navigation with scroll-spy is best implemented in vanilla JS using `IntersectionObserver` — no framework needed, zero bundle cost.

**Primary recommendation:** Scaffold with `npm create astro@latest`, run `npx astro add tailwind vercel`, configure `output: 'static'`, and define the brand teal as a custom CSS variable in `@theme` to match the exact hex value from the current site.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | 5.x (latest) | Site framework, static generation, component model | Official project scaffold; islands architecture; zero-JS by default |
| @tailwindcss/vite | 4.x | Tailwind v4 Vite plugin (CSS-first, no config file) | The official v4 approach for Vite-based frameworks; `@astrojs/tailwind` is deprecated |
| @astrojs/vercel | latest | Vercel adapter for deployment | Official Astro adapter; enables Vercel image optimization service |
| typescript | bundled with Astro | Type safety | Strict mode is now the Astro 5 default; no separate install needed |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @fontsource/inter | latest | Self-hosted Inter font (npm) | Alternative to Google Fonts CDN; avoids external request; good for privacy |
| astro-cloudinary (astro-cloudinary SDK) | latest | Cloudinary `<CldImage>` component | Only needed if transformation API is required; Phase 1 can use plain `<img>` tags with Cloudinary URLs |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@tailwindcss/vite` | `@astrojs/tailwind` | `@astrojs/tailwind` is deprecated for Tailwind v4; only use if you need v3 compatibility |
| Vercel adapter | Zero-config Vercel deploy (no adapter) | No adapter works for pure static; adapter adds Vercel Image Optimization support, which we need for `<Image>` component |
| Google Fonts CDN link in `<head>` | `@fontsource/inter` npm package | CDN approach is simpler but adds external request; npm package is zero-latency but adds ~50KB to build (acceptable) |
| Vanilla JS scroll-spy | Astro integration / React | No framework needed; IntersectionObserver is built into all modern browsers; keeps JS bundle near zero |

**Installation:**
```bash
# Scaffold
npm create astro@latest -- --template minimal

# Add integrations (auto-configures astro.config.mjs)
npx astro add tailwind
npx astro add vercel

# Optional: self-hosted fonts
npm install @fontsource-variable/inter
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── assets/              # Images processed by Astro <Image> (WebP/AVIF at build)
│   ├── images/          # Hero photo, logo, non-gallery images
│   └── fonts/           # Local font files (if not using @fontsource)
├── components/          # Reusable .astro components
│   ├── Head.astro        # <head> meta, OG tags, fonts
│   ├── Nav.astro         # Sticky navigation with scroll-spy
│   ├── Hero.astro        # Full-viewport hero section
│   └── Footer.astro      # Footer with copyright
├── layouts/
│   └── BaseLayout.astro  # Page shell: html, head, nav, slot, footer
├── pages/
│   └── index.astro       # Single-page app — all sections here
├── scripts/
│   └── scroll-spy.js     # Vanilla JS IntersectionObserver for nav active state
└── styles/
    └── global.css        # @import "tailwindcss"; + @theme; + base styles
public/
├── favicon.svg
└── robots.txt
astro.config.mjs
tsconfig.json
```

### Pattern 1: Tailwind v4 CSS-First Configuration

**What:** All Tailwind configuration lives in `global.css` via `@theme` directive. No `tailwind.config.js`.
**When to use:** Always for new Tailwind v4 projects.
**Example:**
```css
/* src/styles/global.css */
/* Source: https://tailwindcss.com/docs/theme */
@import "tailwindcss";

@theme {
  /* Brand color override: #0D9488 was Tailwind v3 teal-600.
     Tailwind v4 teal-600 is oklch(60% .118 184.704) ≈ #009689.
     Define exact brand hex to preserve site identity. */
  --color-brand: #0D9488;
  --color-brand-dark: #0B7D74;
  --color-brand-light: #14B8A6;

  /* Typography scale */
  --font-sans: 'Inter Variable', ui-sans-serif, system-ui, sans-serif;
  --font-serif: Georgia, 'Times New Roman', serif;
}

/* Base styles */
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  font-size: 1rem; /* 16px base */
  color: var(--color-stone-800);
}
```

### Pattern 2: BaseLayout with Slot-Based Head

**What:** BaseLayout provides the HTML shell; pages inject custom `<head>` content via named slot.
**When to use:** Always; this is the standard Astro pattern for per-page meta tags.
**Example:**
```astro
---
// src/layouts/BaseLayout.astro
// Source: https://github.com/withastro/docs/blob/main/src/content/docs/en/basics/layouts.mdx
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = 'Timber & Threads Retreat',
  description = 'A quilting and crafting retreat on a private island in the Missouri Ozarks.',
  ogImage = '/og-default.jpg',
} = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={Astro.url.href} />
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <!-- Page-specific head content -->
    <slot name="head" />
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### Pattern 3: Hero Section with Video-Ready Architecture

**What:** Hero uses a two-layer structure: background layer (image now, video later) + foreground content layer. Swapping Phase 3 video requires only changing the background layer.
**When to use:** Any full-screen hero that may receive a video background in the future.
**Example:**
```astro
---
// src/components/Hero.astro
import { Image } from 'astro:assets';
import heroImage from '../assets/images/hero.jpg';
---
<section id="home" class="relative h-screen overflow-hidden">
  <!-- Background layer: swap this for <video> in Phase 3 -->
  <div class="absolute inset-0 z-0">
    <Image
      src={heroImage}
      alt=""
      class="w-full h-full object-cover object-center"
      fetchpriority="high"
      loading="eager"
      widths={[768, 1280, 1920]}
      sizes="100vw"
    />
    <div class="absolute inset-0 bg-black/30"></div>
  </div>

  <!-- Foreground content layer: untouched by Phase 3 video swap -->
  <div class="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
    <img src="/logo.svg" alt="Timber & Threads Retreat" class="w-32 mb-6" />
    <h1 class="font-serif text-4xl md:text-5xl lg:text-6xl mb-4">
      Timber & Threads Retreat
    </h1>
    <p class="text-xl md:text-2xl mb-8 max-w-xl">
      Relax, create, and connect in nature's embrace
    </p>
    <div class="flex gap-4 flex-wrap justify-center">
      <a href="#about" class="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded transition-colors">
        Learn More
      </a>
      <a href="#contact" class="border-2 border-white text-white hover:bg-white hover:text-stone-900 px-6 py-3 rounded transition-colors">
        Contact Us to Book
      </a>
    </div>
  </div>
</section>
```

### Pattern 4: Scroll-Spy Navigation (Vanilla JS)

**What:** `IntersectionObserver` watches section elements and sets `aria-current="true"` on the matching nav link. CSS targets `[aria-current="true"]` for the active indicator.
**When to use:** Any single-page site with anchor navigation. No framework required.
**Example:**
```javascript
// src/scripts/scroll-spy.js
// Source: IntersectionObserver pattern from multiple community implementations
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
      }
    });
  },
  {
    // Thin horizontal band: section is "active" when its top edge is in the
    // top 10% of the viewport.
    rootMargin: '-5% 0% -90% 0%',
  }
);

sections.forEach((section) => observer.observe(section));
```

```astro
<!-- In Nav.astro -->
<script>
  import '../scripts/scroll-spy.js';
</script>
<nav class="sticky top-0 z-50 bg-white shadow-sm">
  <!-- nav items: aria-current="true" gets teal underline via CSS -->
</nav>
```

### Pattern 5: astro.config.mjs for Static + Vercel

**What:** Complete configuration for a static Astro site with Tailwind v4 and Vercel image optimization.
**When to use:** This project specifically.
**Example:**
```javascript
// astro.config.mjs
// Source: https://docs.astro.build/en/guides/integrations-guide/vercel/
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    // Allow Cloudinary CDN images to be used with <Image>
    domains: ['res.cloudinary.com'],
  },
});
```

### Anti-Patterns to Avoid

- **Using `@astrojs/tailwind`:** This integration is deprecated for Tailwind v4. Use `@tailwindcss/vite` directly.
- **Using `tailwind.config.js` for theme config:** Tailwind v4 uses CSS-first `@theme` in your CSS file. The JS config file is no longer needed or recommended for new projects.
- **Relying on `teal-600` to match the brand hex:** Tailwind v4 changed the palette to OKLCH. `teal-600` is now `#009689`, not `#0D9488`. Define `--color-brand: #0D9488` explicitly.
- **Putting `<script>` logic inline without `is:inline`:** Astro bundles and deduplicates `<script>` tags by default. Inline scripts (e.g., for scroll-spy) should be imported via `import` in a `<script>` block, not written inline, to avoid duplication across component instances.
- **Importing global CSS in every page:** Import `global.css` once in `BaseLayout.astro`. All pages that use BaseLayout automatically get the styles.
- **Omitting `output: 'static'` from astro.config:** Without it, the Vercel adapter defaults to server-side rendering. Since this is a static site, `output: 'static'` must be explicit.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| WebP/AVIF srcset generation | Custom image transform script | Astro `<Image>` / `<Picture>` | Handles format negotiation, srcset widths, lazy loading, and width/height to prevent CLS automatically |
| Responsive image sizes | Manual `srcset` attributes | `widths` + `sizes` props on `<Image>` | Astro computes optimal widths and generates correct `srcset` at build time |
| Font preloading | Manual `<link rel="preload">` | `@fontsource-variable/inter` npm package or Astro experimental fonts API | NPM approach self-hosts and avoids CLS from external font requests |
| IntersectionObserver polyfill | Custom scroll handler | None needed | All browsers targeted (modern) support IntersectionObserver natively; no polyfill required |
| Open Graph meta tags | Custom per-page OG markup | Centralized BaseLayout props (`title`, `description`, `ogImage`) | Consistent structure, easy to extend per page via slot |

**Key insight:** Astro's `<Image>` component is a significant capability — it eliminates all manual image optimization work. Every local image that passes through it gets automatic WebP conversion, srcset generation, and the `loading="lazy"` + `decoding="async"` attributes. The only manual step is specifying `widths` and `sizes` for responsive behavior.

---

## Common Pitfalls

### Pitfall 1: Tailwind v4 Color Shift from v3

**What goes wrong:** Developer uses `teal-600` class expecting `#0D9488` (the v3 value). Built site renders a slightly different teal (`#009689`).
**Why it happens:** Tailwind v4 migrated all colors from hex to OKLCH for perceptual uniformity. The `teal-600` oklch value does not map to the same hex.
**How to avoid:** Define `--color-brand: #0D9488` in `@theme` in `global.css`. Use `bg-brand`, `text-brand`, `border-brand` classes everywhere instead of `teal-600`.
**Warning signs:** Buttons or nav links look slightly green-shifted compared to the current site.

### Pitfall 2: `@astrojs/tailwind` Package Conflict

**What goes wrong:** Developer installs `@astrojs/tailwind` (the old integration) alongside Tailwind v4 packages. Tailwind v4 is partially initialized twice; CSS may not load or may be malformed.
**Why it happens:** `@astrojs/tailwind` was designed for Tailwind v3. It is deprecated for v4 and should not be used.
**How to avoid:** Only use `@tailwindcss/vite`. If `npx astro add tailwind` is run on Astro 5.2+, it installs the correct plugin automatically. Do not install `@astrojs/tailwind` separately.
**Warning signs:** `tailwind.config.js` is generated (sign of old integration); CSS classes appear unstyled in dev.

### Pitfall 3: Missing `output: 'static'` on Vercel

**What goes wrong:** Site deploys to Vercel but Vercel treats it as a serverless function endpoint rather than static files. Cold start latency and possible 404s on direct URL access.
**Why it happens:** The `@astrojs/vercel` adapter defaults to on-demand rendering unless `output: 'static'` is set.
**How to avoid:** Always set `output: 'static'` in `astro.config.mjs` before deploying.
**Warning signs:** Vercel dashboard shows "Serverless Function" output type instead of "Static"; pages load slower than expected.

### Pitfall 4: Hero Image CLS Without Explicit Dimensions

**What goes wrong:** Page layout shifts when the hero image loads because the browser doesn't know the image's dimensions.
**Why it happens:** Astro's `<Image>` component requires `alt` but the `width` and `height` are inferred from the source file. If the image file isn't committed yet (placeholder), the dimensions may be wrong.
**How to avoid:** Commit the actual hero image into `src/assets/images/` at the intended aspect ratio. Astro reads dimensions at build time. For the Phase 1 image pulled from the current site, use `object-cover` with an explicit container height (`h-screen`), not intrinsic image sizing.
**Warning signs:** Lighthouse reports CLS > 0.1; layout visibly jumps on first load.

### Pitfall 5: Scroll-Spy `rootMargin` Getting Multiple Active Sections

**What goes wrong:** Two nav links are active simultaneously when sections are close together or a section is very tall.
**Why it happens:** Default `rootMargin: '0px'` means a section is "intersecting" whenever any pixel is visible. Multiple sections can intersect at once.
**How to avoid:** Use `rootMargin: '-5% 0% -90% 0%'` to create a thin detection band near the top of the viewport. Only the section whose top edge has crossed this band is considered active. For very tall sections (e.g., Gallery), this still works correctly.
**Warning signs:** Two nav links highlighted simultaneously while scrolling.

### Pitfall 6: Cloudinary Image Not Authorized

**What goes wrong:** Images from Cloudinary CDN URLs fail to render through Astro's `<Image>` component with an "unauthorized remote image" error.
**Why it happens:** Astro requires remote image domains to be explicitly allowlisted in `astro.config.mjs` for security.
**How to avoid:** Add `image: { domains: ['res.cloudinary.com'] }` to `astro.config.mjs`. For Phase 1 verification, using a plain `<img>` tag with the Cloudinary URL also works and does not require domain allowlisting.
**Warning signs:** Build error mentioning "unauthorized remote image domain."

---

## Code Examples

Verified patterns from official sources:

### Astro Image Component — Local Image with Responsive Sizes

```astro
---
// Source: https://github.com/withastro/docs/blob/main/src/content/docs/en/reference/modules/astro-assets.mdx
import { Image } from 'astro:assets';
import heroImage from '../assets/images/hero.jpg';
---
<Image
  src={heroImage}
  alt="Timber & Threads Retreat exterior"
  widths={[768, 1280, 1920]}
  sizes="100vw"
  loading="eager"
  fetchpriority="high"
  class="w-full h-full object-cover"
/>
```

### Astro Image Component — Picture for Multi-Format (AVIF + WebP)

```astro
---
// Source: https://github.com/withastro/docs/blob/main/src/content/docs/en/guides/images.mdx
import { Picture } from 'astro:assets';
import myImage from '../assets/images/my_image.png';
---
<Picture
  src={myImage}
  formats={['avif', 'webp']}
  alt="Description of image"
/>
```

### Tailwind v4 Global CSS Setup

```css
/* src/styles/global.css */
/* Source: https://tailwindcss.com/docs/installation/using-vite */
@import "tailwindcss";

@theme {
  --color-brand: #0D9488;
  --color-brand-dark: #0B7D74;
}
```

### astro.config.mjs — Full Static + Vercel + Tailwind v4

```javascript
// Source: https://docs.astro.build/en/guides/integrations-guide/vercel/
// Source: https://tailwindcss.com/docs/installation/using-vite
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ['res.cloudinary.com'],
  },
});
```

### Cloudinary URL Test (Phase 1 Verification)

```astro
---
// Phase 1 success criterion: verify Cloudinary URL loads
// No SDK needed for Phase 1 — plain <img> is sufficient
const cloudinaryTestUrl =
  'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/sample.jpg';
---
<!-- This confirms the CDN path works before Phase 3 builds on it -->
<img
  src={cloudinaryTestUrl}
  alt="Cloudinary CDN test image"
  width="400"
  height="300"
  loading="lazy"
/>
```

### Sticky Navigation with Active State CSS

```astro
---
// src/components/Nav.astro
const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Retreats', href: '#retreats' },
  { label: 'Accommodations', href: '#accommodations' },
  { label: 'Calendar', href: '#calendar' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
  { label: 'Location', href: '#location' },
];
---
<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
  <nav class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
    <a href="#home" class="font-serif text-xl text-stone-900">
      Timber & Threads
    </a>
    <!-- Desktop nav -->
    <ul class="hidden md:flex gap-6">
      {navItems.map(({ label, href }) => (
        <li>
          <a
            href={href}
            class="text-stone-600 hover:text-brand transition-colors text-sm
                   [&[aria-current='true']]:text-brand
                   [&[aria-current='true']]:border-b-2
                   [&[aria-current='true']]:border-brand"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
    <!-- Mobile hamburger -->
    <button
      id="mobile-menu-toggle"
      aria-label="Open navigation menu"
      aria-expanded="false"
      class="md:hidden p-2"
    >
      <svg ...hamburger icon... />
    </button>
  </nav>
  <!-- Mobile full-screen overlay (Claude's discretion: large targets for older demographic) -->
  <div id="mobile-menu" class="hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8">
    {navItems.map(({ label, href }) => (
      <a href={href} class="text-2xl font-serif text-stone-900 hover:text-brand">{label}</a>
    ))}
  </div>
</header>

<script>
  import '../scripts/scroll-spy.js';

  // Mobile menu toggle
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu?.classList.toggle('hidden');
  });
  // Close menu on nav link click
  menu?.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', () => {
      menu.classList.add('hidden');
      toggle?.setAttribute('aria-expanded', 'false');
    })
  );
</script>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin via `npx astro add tailwind` | Tailwind v4 + Astro 5.2 (2025) | No separate Astro integration; Tailwind configures itself via Vite |
| `tailwind.config.js` for theme | `@theme {}` directive in CSS file | Tailwind v4.0 (Jan 2025) | All design tokens live in CSS; no JS config file needed |
| `@tailwind base/components/utilities` directives | `@import "tailwindcss"` single import | Tailwind v4.0 (Jan 2025) | Single line replaces three directives |
| `import vercel from '@astrojs/vercel/static'` | `import vercel from '@astrojs/vercel'` | @astrojs/vercel v8+ | Single unified import; subpath exports removed |
| TypeScript flag in create-astro CLI | Strict mode is the default; no flag needed | Astro 5.0 | No `--typescript strict` needed; it is automatic |
| `src/env.d.ts` reference file | Not needed in Astro 5 (tsconfig `include` handles it) | Astro 5.0 | Fewer boilerplate files; tsconfig updated automatically |

**Deprecated/outdated:**
- `@astrojs/tailwind`: Deprecated for Tailwind v4. Do not use.
- `@tailwind base;` / `@tailwind components;` / `@tailwind utilities;`: Replaced by single `@import "tailwindcss"`.
- `import vercel from '@astrojs/vercel/static'`: The `/static` subpath no longer exists. Use root import.
- `--typescript` CLI flag: Removed in Astro 5; strict is automatic.

---

## Recommendations for Claude's Discretion Areas

### Mobile Menu Style
**Recommendation: Full-screen overlay** (as noted in decisions).
- Implementation: Fixed full-screen `<div>` with `z-index` above everything, white background, centered column of large (2xl font) nav links.
- Tap target: Each link should be at minimum 56px tall (exceeds 44px minimum for older demographic).
- Animation: Simple opacity + scale fade-in via CSS transition, triggered by toggling a class. No JS animation library needed.

### Nav Background Behavior
**Recommendation: Solid white with slight transparency and backdrop blur on scroll**.
- Class: `bg-white/95 backdrop-blur-sm` — creates a frosted glass effect that looks polished without complexity.
- The hero image shows through slightly when the user is at the top, which feels premium.
- Alternative (fully transparent on hero): Requires JS to toggle background class on scroll — avoids for now, adds complexity and the current site uses solid nav.

### Max Content Width
**Recommendation: `max-w-7xl` (1280px)** — matches what the current site appears to use, standard for content-heavy marketing sites.
- Use `mx-auto px-4 sm:px-6 lg:px-8` for consistent section padding.

### Footer Structure
**Recommendation: Minimal footer** — copyright + phone + email + condensed nav links.
- Three columns on desktop: Brand/tagline | Navigation | Contact info
- Single centered column on mobile
- Remove Admin link (locked decision)

### Scroll Animation Speed
**Recommendation: CSS only, no JS animation library**.
- `scroll-behavior: smooth` on `html` element is sufficient for anchor link scrolling.
- Speed: browser default (~400-700ms based on distance) — natural feel, no custom easing needed.
- Additional polish (hover transitions): `transition-colors duration-200` on interactive elements.

---

## Open Questions

1. **Google Fonts vs. self-hosted Inter**
   - What we know: User specified "Inter for body text." Two options: Google Fonts `<link>` (external request, but cached across sites) or `@fontsource-variable/inter` npm package (self-hosted, ~50KB, no external request).
   - What's unclear: User hasn't specified a preference. Astro also has an experimental fonts API that supports Google Fonts with self-hosting built in.
   - Recommendation: Use `@fontsource-variable/inter` for self-hosting. It's a one-line npm install and removes all dependency on Google's CDN. For a rural retreat site prioritizing fast loads, eliminating external requests is worth the 50KB.

2. **Logo file format and location**
   - What we know: Logo (quilting patch design) is finalized, won't change. User will provide high-res originals later.
   - What's unclear: Is the logo SVG (ideal) or PNG/JPG? For Phase 1, we need to pull it from the current site.
   - Recommendation: Inspect `timberandthreadsretreat.com` to extract the logo. If it's SVG, place in `public/` and use as `<img src="/logo.svg">`. If raster, place in `src/assets/` and use Astro `<Image>`.

3. **Cloudinary cloud name for Phase 1 test**
   - What we know: Gallery is broken on the current site, and the fix is static Cloudinary URLs in Phase 3.
   - What's unclear: The Cloudinary cloud name is not documented in the project files.
   - Recommendation: For Phase 1 success criterion 4 (test Cloudinary URL loads), use a public Cloudinary demo URL (`res.cloudinary.com/demo/image/upload/...`) to verify the pipeline. The actual cloud name is needed in Phase 3.

---

## Sources

### Primary (HIGH confidence)
- `/withastro/docs` (Context7) — project setup, Image component, layouts, Vercel adapter, TypeScript config, client scripts, remote images
- `/websites/tailwindcss` (Context7) — Tailwind v4 `@theme` directive, CSS variables, color system, Vite plugin
- `https://tailwindcss.com/docs/installation/using-vite` — Tailwind v4 Vite integration
- `https://tailwindcss.com/docs/theme` — `@theme` directive syntax
- `https://docs.astro.build/en/guides/integrations-guide/vercel/` — Vercel adapter configuration and import path
- `https://astro.build/blog/astro-520/` — Astro 5.2 Tailwind v4 native support announcement

### Secondary (MEDIUM confidence)
- `https://tailwindcss.com/blog/tailwindcss-v4` — v4 release notes (color system change to OKLCH)
- `https://tailwindcolor.com/teal` — teal-600 hex value verification in v4
- WebSearch: "@astrojs/tailwind deprecated v4 2025" — confirmed by multiple sources that `@astrojs/tailwind` is deprecated for v4
- WebSearch: "IntersectionObserver scroll-spy rootMargin pattern" — community pattern, verified against MDN docs

### Tertiary (LOW confidence — flag for validation)
- `rootMargin: '-5% 0% -90% 0%'` for scroll-spy: commonly cited community pattern, not from an official Astro source. Works in practice; exact values may need tuning based on section heights.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against Context7 (official Astro docs) and official Tailwind docs; Astro 5.2 release blog confirms Tailwind v4 integration path
- Architecture: HIGH — BaseLayout pattern, Image component usage, and astro.config structure are all from official docs
- Pitfalls: HIGH (color shift, deprecated packages) / MEDIUM (scroll-spy rootMargin) — color shift confirmed by tailwindcolor.com; deprecated package confirmed by official docs and release blog
- Code examples: HIGH — all examples adapted from official Context7 sources

**Research date:** 2026-02-16
**Valid until:** 2026-03-16 (Astro and Tailwind are active projects; check for minor version updates before planning)
