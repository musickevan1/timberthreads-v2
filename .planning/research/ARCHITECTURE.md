# Architecture Research: Astro Single-Page Scrolling Site

**Domain:** Content website (single-page scrolling)
**Researched:** 2026-02-16
**Confidence:** HIGH

## Standard Astro Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Browser (Client Layer)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ Static  │  │ React   │  │ Contact │  │ Lazy    │        │
│  │ HTML    │  │ Island  │  │ Form    │  │ Iframes │        │
│  │ Sections│  │(Gallery)│  │ Island  │  │         │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │ (hydrated)  │ (hydrated)  │            │
│       │            └─────────────┴─────────────┘            │
│       │              ↓ Interaction (POST)                   │
├───────┴──────────────┴──────────────────────────────────────┤
│                   Vercel Edge Network                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐    ┌──────────────────────────┐   │
│  │  Static HTML Page    │    │  Server API Endpoint     │   │
│  │  (prebuilt)          │    │  (SSR - on-demand)       │   │
│  └──────────────────────┘    │  POST /api/contact.json  │   │
│                               │  → Nodemailer → Email    │   │
│                               └──────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                   External Services                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │Cloudinary│  │ Google   │  │ SMTP     │                   │
│  │  (CDN)   │  │ Maps/Cal │  │ Provider │                   │
│  └──────────┘  └──────────┘  └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Static Sections** | Render non-interactive content (About, Services, etc.) | `.astro` components with no client JS |
| **React Islands** | Provide interactivity where needed (gallery, form) | React components with `client:visible` or `client:load` |
| **Layout** | Wrap page with common structure (meta, fonts, scripts) | Base layout `.astro` with `<slot />` |
| **Server Endpoint** | Handle form submission, send email | API route in `pages/api/` exporting POST function |
| **Lazy Loaders** | Defer iframe/embed loading until visible | Custom script or `client:visible` directive |

## Recommended Project Structure

```
timberandthreads-v2/
├── src/
│   ├── pages/                    # Routes (only pages/ is required)
│   │   ├── index.astro           # Single scrolling homepage
│   │   └── api/                  # Server endpoints (SSR mode)
│   │       └── contact.json.ts   # POST handler for contact form
│   │
│   ├── layouts/                  # Page templates
│   │   └── BaseLayout.astro      # Common wrapper (head, fonts, analytics)
│   │
│   ├── components/               # Reusable UI components
│   │   ├── sections/             # Page sections (About, Services, etc.)
│   │   │   ├── Hero.astro
│   │   │   ├── About.astro
│   │   │   ├── Services.astro
│   │   │   ├── Gallery.astro     # Wrapper for React island
│   │   │   ├── Video.astro
│   │   │   ├── Contact.astro     # Wrapper for React form island
│   │   │   └── Footer.astro
│   │   │
│   │   ├── islands/              # Interactive React components
│   │   │   ├── GalleryIsland.tsx # Image lightbox gallery
│   │   │   └── ContactForm.tsx   # Form with validation
│   │   │
│   │   ├── ui/                   # Small reusable UI elements
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   └── LazyIframe.astro  # Intersection Observer wrapper
│   │   │
│   │   └── common/               # Shared components
│   │       ├── Header.astro
│   │       └── Navigation.astro
│   │
│   ├── styles/                   # Global CSS
│   │   └── global.css            # Tailwind imports + custom globals
│   │
│   ├── lib/                      # Utilities and helpers
│   │   ├── email.ts              # Nodemailer transporter setup
│   │   ├── validation.ts         # Shared validation (server + client)
│   │   └── cloudinary.ts         # Image URL helpers (if needed)
│   │
│   └── types/                    # TypeScript definitions
│       └── index.ts              # Shared types (form data, etc.)
│
├── public/                       # Static assets (served as-is)
│   ├── fonts/                    # Custom web fonts
│   ├── favicon.ico
│   └── robots.txt
│
├── astro.config.mjs              # Astro + integrations config
├── tailwind.config.mjs           # Tailwind customization
├── tsconfig.json                 # TypeScript settings
└── .env                          # Environment variables (SMTP, etc.)
```

### Structure Rationale

- **`components/sections/`**: Organizes homepage sections as discrete, composable units. Each section is self-contained and can be reordered in `index.astro`.
- **`components/islands/`**: Isolates React components requiring client-side interactivity. Clear naming (`*Island.tsx`) signals hydration boundary.
- **`components/ui/`**: Small, reusable primitives (buttons, cards, lazy loaders) avoid duplication and maintain consistency.
- **`lib/`**: Business logic separate from UI. Server-only code (Nodemailer) and shared utilities (validation) live here.
- **`pages/api/`**: Server endpoints for dynamic functionality (form handling). Only runs in SSR mode, not prebuilt.

## Architectural Patterns

### Pattern 1: Hybrid Static + SSR Deployment

**What:** Deploy mostly static HTML with selective server-side rendering for API endpoints.

**When to use:** Single-page scrolling site with one dynamic feature (contact form).

**Trade-offs:**
- **Pro:** Fast initial load (static HTML), only server-renders form endpoint.
- **Pro:** Cheaper hosting (fewer serverless invocations).
- **Con:** Requires SSR adapter even for single endpoint (no mixed static + server routes in Astro).

**Configuration:**
```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',  // Required for API endpoints
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,  // Vercel Image Optimization
  }),
  integrations: [
    react(),
    tailwind(),
  ],
});
```

**Note:** Even though homepage is static HTML, `output: 'server'` enables `/api/contact.json` endpoint. Astro prerenders pages by default in SSR mode unless they have server logic.

### Pattern 2: Islands Architecture for Selective Hydration

**What:** Render entire page as static HTML, hydrate only interactive components (gallery, form).

**When to use:** Page has few interactive regions among mostly static content.

**Trade-offs:**
- **Pro:** Minimal JavaScript shipped to client (10-50KB vs 200KB+ for SPA).
- **Pro:** Fast First Contentful Paint and Time to Interactive.
- **Con:** React components can't share state without coordination (use URL params or events).

**Example:**
```astro
---
// src/components/sections/Gallery.astro
import GalleryIsland from '../islands/GalleryIsland.tsx';

// Static data (could come from CMS, file, etc.)
const images = [
  { src: 'https://res.cloudinary.com/...', alt: 'Project 1' },
  { src: 'https://res.cloudinary.com/...', alt: 'Project 2' },
];
---

<section id="gallery" class="py-16">
  <h2 class="text-3xl font-bold mb-8">Our Work</h2>

  <!-- Only this component hydrates on client -->
  <GalleryIsland client:visible images={images} />
</section>
```

**Client directives:**
- `client:load` — Hydrate immediately on page load (hero interactions)
- `client:visible` — Hydrate when scrolled into view (below-fold sections)
- `client:idle` — Hydrate when browser idle (non-critical)

**Best choice for this project:** `client:visible` for gallery and contact form (both below fold).

### Pattern 3: Lazy-Loaded Embeds with Intersection Observer

**What:** Defer loading of heavy iframes (Google Maps, Calendar) until user scrolls near them.

**When to use:** Third-party embeds that block page load (maps, YouTube, etc.).

**Trade-offs:**
- **Pro:** Faster initial page load (doesn't fetch iframe content upfront).
- **Pro:** Saves bandwidth if user never scrolls to section.
- **Con:** Slight delay when user reaches section (acceptable for below-fold content).

**Example:**
```astro
---
// src/components/ui/LazyIframe.astro
export interface Props {
  src: string;
  title: string;
  aspectRatio?: string;
}

const { src, title, aspectRatio = '16/9' } = Astro.props;
const id = `iframe-${Math.random().toString(36).slice(2)}`;
---

<div
  class="lazy-iframe-container"
  data-src={src}
  style={`aspect-ratio: ${aspectRatio}`}
  id={id}
>
  <div class="loading-placeholder bg-gray-200 animate-pulse w-full h-full"></div>
</div>

<script define:vars={{ id, src, title }}>
  const container = document.getElementById(id);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.title = title;
        iframe.className = 'w-full h-full';
        iframe.loading = 'lazy';

        // Clear placeholder and append iframe
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        container.appendChild(iframe);

        observer.unobserve(container);
      }
    });
  }, { rootMargin: '100px' }); // Start loading 100px before visible

  observer.observe(container);
</script>
```

**Usage:**
```astro
<LazyIframe
  src="https://www.google.com/maps/embed?pb=..."
  title="Our Location"
  aspectRatio="4/3"
/>
```

### Pattern 4: Server Endpoint for Form Handling

**What:** Create API route that receives form POST, validates, sends email via Nodemailer.

**When to use:** Contact forms, newsletter signups, any server-side data processing.

**Trade-offs:**
- **Pro:** Secure (email credentials never exposed to client).
- **Pro:** Works without JavaScript enabled (progressive enhancement).
- **Con:** Requires SSR mode (serverless function on Vercel).

**Example:**
```typescript
// src/pages/api/contact.json.ts
import type { APIRoute } from 'astro';
import { sendContactEmail } from '../../lib/email';
import { validateContactForm } from '../../lib/validation';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validate input
    const validation = validateContactForm(data);
    if (!validation.success) {
      return new Response(JSON.stringify({
        error: 'Invalid form data',
        details: validation.errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send email
    await sendContactEmail({
      name: data.name,
      email: data.email,
      message: data.message,
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Message sent successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(JSON.stringify({
      error: 'Failed to send message',
      message: 'Please try again later'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

```typescript
// src/lib/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: import.meta.env.SMTP_HOST,
  port: parseInt(import.meta.env.SMTP_PORT),
  secure: import.meta.env.SMTP_SECURE === 'true',
  auth: {
    user: import.meta.env.SMTP_USER,
    pass: import.meta.env.SMTP_PASS,
  },
});

export async function sendContactEmail(data: {
  name: string;
  email: string;
  message: string;
}) {
  await transporter.sendMail({
    from: import.meta.env.SMTP_FROM,
    to: import.meta.env.CONTACT_EMAIL,
    replyTo: data.email,
    subject: `Contact Form: ${data.name}`,
    text: data.message,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `,
  });
}
```

### Pattern 5: Component Composition for Section-Based Layout

**What:** Break homepage into discrete section components, compose in `index.astro`.

**When to use:** Single-page scrolling sites with multiple distinct sections.

**Trade-offs:**
- **Pro:** Easy to reorder, enable/disable sections.
- **Pro:** Each section is independently testable and maintainable.
- **Con:** More files to manage (acceptable at ~10 sections).

**Example:**
```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/sections/Hero.astro';
import About from '../components/sections/About.astro';
import Services from '../components/sections/Services.astro';
import Gallery from '../components/sections/Gallery.astro';
import Video from '../components/sections/Video.astro';
import Contact from '../components/sections/Contact.astro';
import Footer from '../components/sections/Footer.astro';
---

<BaseLayout title="Timber & Threads - Custom Woodwork">
  <Hero />
  <About />
  <Services />
  <Gallery />
  <Video />
  <Contact />
  <Footer />
</BaseLayout>
```

Each section component is self-contained with its own styles (Tailwind classes) and content. Reordering is as simple as moving lines.

## Data Flow

### Page Load Flow

```
User requests /
    ↓
Vercel serves prebuilt static HTML (index.html)
    ↓
Browser parses HTML, requests assets (CSS, fonts, images)
    ↓
Cloudinary CDN delivers optimized images (WebP/AVIF)
    ↓
Tailwind CSS renders layout
    ↓
React islands hydrate when visible (Intersection Observer)
    ↓
Lazy iframes load when scrolled into view
```

### Form Submission Flow

```
User fills contact form → clicks submit
    ↓
React component validates input (client-side)
    ↓
POST fetch to /api/contact.json
    ↓
Vercel invokes serverless function
    ↓
Validation runs (server-side)
    ↓
Nodemailer sends email via SMTP
    ↓
Response: { success: true } or { error: "..." }
    ↓
React component shows success/error message
```

### Key Data Flows

1. **Static Content:** Astro components render to HTML at build time. No runtime data fetching needed.
2. **Image URLs:** Hardcoded Cloudinary URLs in component props. No API calls required.
3. **Form Data:** User input → Client validation → Server endpoint → SMTP → Email delivery.
4. **Interactive State:** Isolated within React islands. Gallery selection state doesn't leak outside component.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using `output: 'static'` with API Endpoints

**What people do:** Try to use static output mode but add `/api/contact.json` endpoint.

**Why it's wrong:** Static mode prerenders everything at build time. API endpoints only work in `output: 'server'` or `output: 'hybrid'` mode.

**Do this instead:** Use `output: 'server'` mode. Astro still prerenders pages that don't need server logic, so homepage remains static HTML.

**Detection:** Build fails with error: "Endpoints only supported in SSR mode."

### Anti-Pattern 2: Hydrating Entire Page as SPA

**What people do:** Wrap entire homepage in a React component with `client:load`.

**Why it's wrong:** Ships massive JavaScript bundle (~200KB+), defeats Astro's performance benefits. Slow Time to Interactive.

**Do this instead:** Use Astro components for static sections, hydrate only interactive islands (gallery, form).

**Detection:** Lighthouse performance score <90, large JavaScript bundle in DevTools Network tab.

### Anti-Pattern 3: Inline Styles Instead of Tailwind

**What people do:** Add `<style>` blocks in every component instead of using Tailwind utilities.

**Why it's wrong:** Duplicates CSS, harder to maintain consistency, loses Tailwind's optimization (PurgeCSS).

**Do this instead:** Use Tailwind utility classes. Extract complex patterns to `@apply` directives in `global.css` only if heavily repeated.

**Example:**
```astro
<!-- BAD -->
<div style="padding: 2rem; background: #f3f4f6; border-radius: 0.5rem;">

<!-- GOOD -->
<div class="p-8 bg-gray-100 rounded-lg">
```

### Anti-Pattern 4: Loading All Images Eagerly

**What people do:** Use `loading="eager"` or omit `loading` attribute on all images.

**Why it's wrong:** Downloads 20+ images on initial page load, blocks rendering, poor Lighthouse LCP score.

**Do this instead:**
- Hero image: `loading="eager"` + `fetchpriority="high"`
- Below-fold images: `loading="lazy"` (default in Astro)
- Gallery thumbnails: `loading="lazy"`

**Example:**
```astro
<!-- Hero image (above fold) -->
<img
  src="https://res.cloudinary.com/.../hero.jpg"
  loading="eager"
  fetchpriority="high"
  alt="Hero"
/>

<!-- Gallery images (below fold) -->
<img
  src="https://res.cloudinary.com/.../project-1.jpg"
  loading="lazy"
  alt="Project 1"
/>
```

### Anti-Pattern 5: Putting Business Logic in Components

**What people do:** Embed Nodemailer setup, validation logic directly in `.astro` or `.tsx` files.

**Why it's wrong:** Hard to test, can't reuse logic, mixes concerns (UI + business logic).

**Do this instead:** Extract to `src/lib/` utilities. Import and call from components/endpoints.

**Example:**
```typescript
// BAD: src/pages/api/contact.json.ts
export const POST = async ({ request }) => {
  const transporter = nodemailer.createTransport({ /* ... */ });
  // 50 lines of validation and email logic...
};

// GOOD: src/pages/api/contact.json.ts
import { sendContactEmail } from '../../lib/email';
import { validateContactForm } from '../../lib/validation';

export const POST = async ({ request }) => {
  const data = await request.json();
  const validation = validateContactForm(data);
  if (!validation.success) return errorResponse(validation.errors);

  await sendContactEmail(data);
  return successResponse();
};
```

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Cloudinary** | Direct URL references in `<img src="...">` | No API calls needed. Use Cloudinary's URL transformation params for responsive images. |
| **Google Maps** | `<LazyIframe>` wrapper with Intersection Observer | Defer loading until scrolled into view. Use embed URL from Google Maps share. |
| **Google Calendar** | `<LazyIframe>` wrapper with Intersection Observer | Same lazy-load pattern as Maps. Public calendar embed URL. |
| **SMTP (Nodemailer)** | Server endpoint with transporter from `.env` | Credentials in environment variables. Never expose to client. |
| **Vercel Analytics** | `webAnalytics: { enabled: true }` in Vercel adapter | Automatic script injection. No manual setup. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Astro Section ↔ React Island** | Props (one-way data flow) | Astro passes data as props. React can't communicate back except via events or URL. |
| **React Island ↔ Server Endpoint** | `fetch()` POST request | Form submits JSON to `/api/contact.json`, receives JSON response. |
| **Layout ↔ Page** | `<slot />` content projection | BaseLayout wraps page content. No data passed, just structure. |
| **Component ↔ Utility** | Import/export functions | UI components import validation, email helpers from `lib/`. |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-10K visits/month** | Current architecture is perfect. Static HTML + single serverless endpoint. Cost: ~$0/month (Vercel free tier). |
| **10K-100K visits/month** | No changes needed. Add caching headers to API endpoint (`Cache-Control: no-store` for form). Consider Vercel Analytics upgrade for better insights. Cost: $0-20/month. |
| **100K+ visits/month** | Consider replacing Nodemailer with transactional email API (Resend, SendGrid) for better deliverability. Add rate limiting to contact endpoint (prevent spam). Use Vercel Edge Functions instead of serverless for faster response. Cost: $20-100/month. |

### Scaling Priorities

1. **First bottleneck:** Contact form spam. **Fix:** Add Cloudflare Turnstile or hCaptcha (free, privacy-focused).
2. **Second bottleneck:** Image bandwidth. **Fix:** Already solved with Cloudinary CDN. Ensure `f_auto,q_auto` in all image URLs.
3. **Third bottleneck:** Server endpoint cold starts. **Fix:** Upgrade to Vercel Pro for faster cold start regions, or migrate to Edge Functions.

**Note:** For a single-page scrolling site with ~10 sections, scaling is unlikely to be a problem. Static HTML scales infinitely on CDN.

## Build Order Recommendations

Based on component dependencies, recommended build order:

1. **Phase 1: Foundation**
   - `BaseLayout.astro` (wrapper for all pages)
   - `global.css` (Tailwind imports)
   - `index.astro` (empty shell)

2. **Phase 2: Static Sections**
   - `Hero.astro` (simplest section, no dependencies)
   - `About.astro`
   - `Services.astro`
   - `Footer.astro`

3. **Phase 3: Media Sections**
   - `Video.astro` (HTML5 video, no islands)
   - `LazyIframe.astro` utility
   - Add lazy-loaded embeds (Maps, Calendar)

4. **Phase 4: Interactive Islands**
   - `GalleryIsland.tsx` (React component + lightbox)
   - `Gallery.astro` (wrapper with `client:visible`)

5. **Phase 5: Form + Server Endpoint**
   - `lib/validation.ts` (shared validation)
   - `lib/email.ts` (Nodemailer setup)
   - `api/contact.json.ts` (server endpoint)
   - `ContactForm.tsx` (React island)
   - `Contact.astro` (wrapper)

6. **Phase 6: Polish**
   - Smooth scroll behavior
   - Section anchor links in navigation
   - Loading states, error handling
   - Accessibility audit (ARIA labels, focus management)

**Dependency rationale:**
- Static sections before islands (validate build process works)
- Media sections before islands (simpler, test lazy loading pattern)
- Gallery before form (gallery is read-only, simpler state management)
- Form endpoint last (requires SSR mode, most complex integration)

## Sources

### Astro Official Documentation (HIGH confidence)
- [Project Structure](https://docs.astro.build/en/basics/project-structure/)
- [Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)
- [Server Endpoints](https://docs.astro.build/en/guides/endpoints/)
- [Vercel Adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/)
- [Build Forms with API Routes](https://docs.astro.build/en/recipes/build-forms-api/)

### Community Best Practices (MEDIUM confidence)
- [Astro Islands Architecture Explained - Strapi](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide)
- [Best Practices for File Organization in Astro.js](https://tillitsdone.com/blogs/astro-js-file-organization-guide/)
- [How To Make Reusable Components with Astro](https://www.kristiannielsen.com/blog/how-to-make-reusable-components-with-astro/)
- [Understanding Astro Islands Architecture - LogRocket](https://blog.logrocket.com/understanding-astro-islands-architecture/)

### Integration Guides (MEDIUM confidence)
- [Astro Cloudinary Integration](https://astro.cloudinary.dev/guides/image-optimization)
- [How to send e-mail with Astro and Nodemailer](https://giannistolou.gr/blog/how-to-send-email-with-astro-and-nodemailer)
- [Astro Lazy Loading with Intersection Observer](https://lukealexdavis.co.uk/morsels/morsel-28/)

---
*Architecture research for: Timber & Threads Astro website rebuild*
*Researched: 2026-02-16*
