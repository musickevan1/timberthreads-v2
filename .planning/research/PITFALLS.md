# Pitfalls Research

**Domain:** Astro Content Website (Next.js Migration)
**Researched:** 2026-02-16
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Over-Hydration Destroys Performance Gains

**What goes wrong:**
Developers apply `client:load` to every interactive component by default, forcing immediate JavaScript loading across the page. This defeats Astro's core advantage—ships zero JavaScript by default—and degrades performance to that of a traditional SSR framework or worse. One documented case saw a Lighthouse score of only 70 despite using static rendering, caused by applying `client:load` to both navigation and comments components.

**Why it happens:**
React/Next.js trains developers to think "interactive by default." The mental model of "everything needs JavaScript" carries over during migration. `client:load` "just works" immediately during development, so developers don't question whether a better directive exists.

**How to avoid:**
- Default to **no directive** (static HTML only)
- Use `client:visible` for below-fold content (comments, carousels, footer widgets)
- Use `client:idle` for secondary features (newsletter signup, share buttons)
- Reserve `client:load` ONLY for critical first-screen interactions (navigation, search)
- Documented improvement: Switching comments from `client:load` to `client:visible` and newsletter from `client:load` to `client:idle` reduced first-screen JavaScript from 150KB to 45KB, improving LCP from 3.2s to 1.6s and Lighthouse score from 72 to 94

**Warning signs:**
- Lighthouse performance score below 90 on static content pages
- JavaScript bundle sizes over 50KB for content-focused pages
- Slow FCP/LCP on fast connections (if slow on fast networks, rural 3G will be unusable)
- DevTools network tab shows multiple framework chunks loading immediately

**Phase to address:**
Phase 1 (Foundation) - Establish directive strategy before building features. Document which directive to use for each component type. Review during Phase 2 (Gallery) when adding React island for admin.

---

### Pitfall 2: Images in public/ Folder Bypass All Optimization

**What goes wrong:**
Images placed in `public/` directory are served as-is without any optimization—no compression, no format conversion (WebP/AVIF), no responsive sizes, no lazy loading. For a quilting retreat site with heavy photo galleries on slow rural connections, unoptimized images are catastrophic. A single 3MB JPEG can take 30+ seconds to load on slow 3G.

**Why it happens:**
Next.js developers are familiar with `public/` for static assets and continue this pattern. Astro's documentation clearly states "images in public/ are never optimized" but this warning is easy to miss during migration rush. The site works locally on fast WiFi, masking the severity of the problem.

**How to avoid:**
- Place ALL optimizable images in `src/` directory (enables Astro's Image component optimization)
- Use Cloudinary CDN for gallery images (already in project context)
- Never use `<img>` tags—always use `<Image>` or `<Picture>` component
- For Cloudinary integration: Use Astro Cloudinary or custom Image Service to deliver directly from Cloudinary's CDN (avoids double optimization where Astro downloads from Cloudinary, re-optimizes, then serves)
- Set explicit `width` and `height` attributes to minimize CLS (Cumulative Layout Shift)
- Test on throttled 3G connection (Chrome DevTools Network tab)

**Warning signs:**
- Image file sizes over 200KB in production
- PageSpeed Insights reports "Serve images in next-gen formats"
- CLS (Cumulative Layout Shift) score above 0.1
- Images without width/height causing layout jumps
- Slow load times on throttled network testing

**Phase to address:**
Phase 1 (Foundation) - Set up image optimization architecture. Phase 2 (Gallery) - Critical for gallery feature with Cloudinary integration. Test thoroughly on 3G throttle before deployment.

---

### Pitfall 3: Passing Functions/Complex Props to Islands Breaks Client Hydration

**What goes wrong:**
Attempting to pass functions, class instances, or complex objects as props from Astro components to React islands fails silently or throws serialization errors. Astro cannot pass functions from server to client in a way that makes them executable. This commonly breaks when migrating Next.js patterns where passing event handlers as props is standard.

**Why it happens:**
Server-side rendering in Astro happens at build time (or request time for SSR), not in the browser. Props must be JSON-serializable to cross the server/client boundary. React/Next.js allows passing functions freely because everything runs in the same JavaScript context.

**How to avoid:**
- Pass only JSON-serializable data: strings, numbers, arrays, plain objects
- Define event handlers INSIDE the React island component
- For shared state between islands, use Nano Stores (not props)
- Cannot pass React Context between islands (each island is isolated)
- Cannot pass Astro components as children to React islands (use named slots for complex composition)
- Use `experimentalReactChildren` flag if passing children, but note runtime cost

**Warning signs:**
- Console errors about serialization during build or hydration
- Props showing as `undefined` in client component despite being set in Astro
- "Invalid hook call" errors when using React hooks in islands
- Components working in development but breaking in production build

**Phase to address:**
Phase 2 (Gallery) - When implementing React admin island. Document prop patterns clearly. Phase planning should include explicit decision about state management approach (Nano Stores vs. isolated island state).

---

### Pitfall 4: Build-Time API Calls Without Caching Destroy Build Speed

**What goes wrong:**
Making API calls to fetch data during static site generation (SSG) without caching causes every page to trigger redundant network requests. For content collections or gallery data, this multiplies build times from seconds to minutes. One documented case showed API calls increasing build time from milliseconds to seconds PER PAGE, scaling to 30+ minute builds for large sites.

**Why it happens:**
Astro calls the component render function for each page/route during build. If data fetching happens in component code without caching, each page makes its own request. Coming from Next.js `getStaticProps` (which has built-in caching), developers don't realize Astro handles this differently.

**How to avoid:**
- Cache API responses during build (use build-time caching libraries or manual Map-based caching)
- Fetch data ONCE at the top level, pass down as props
- Use Content Collections for markdown/MDX content (built-in caching)
- For external APIs (like Cloudinary for gallery), fetch list once and cache
- Consider `concurrency` settings in Vite config, but test (higher isn't always better—optimal is often 4 on 12-core systems)
- Disable HTML compression during builds (CDNs handle this better; build-time compression adds overhead)
- Set `--max-old-space-size=8192` for Node memory (prevents garbage collection pauses)

**Warning signs:**
- Build times over 30 seconds for small sites (<100 pages)
- Network requests visible during build for every page
- Build times increasing linearly with page count
- API rate limits being hit during builds

**Phase to address:**
Phase 1 (Foundation) - Establish data fetching patterns. Phase 2 (Gallery) - Critical when integrating Cloudinary gallery data. Monitor build times; investigate if exceeds 60 seconds.

---

### Pitfall 5: Dynamic Tailwind Classes Get Purged in Production

**What goes wrong:**
Dynamically constructed Tailwind class names (e.g., `bg-${color}-500` or conditional classes built from variables) are not detected by Tailwind's JIT compiler and get purged from production builds. Styles work in development but vanish in production, causing broken layouts and invisible elements.

**Why it happens:**
Tailwind v3+ uses Just-In-Time compilation, only generating CSS for classes it detects in source files through static analysis. It cannot detect classes built dynamically at runtime because the scanner only analyzes source code strings.

**How to avoid:**
- Never use string interpolation for Tailwind classes (`bg-${color}-500` will break)
- Use complete class names: `color === 'blue' ? 'bg-blue-500' : 'bg-red-500'`
- Add dynamic classes to `safelist` in `tailwind.config.js` if truly needed
- Ensure `content` paths in `tailwind.config.js` include ALL file types: `.astro`, `.jsx`, `.tsx`, `.md`, `.mdx`
- Be aware that aggressive CSS purging might miss SSR-rendered pages not in initial scan
- Test production builds thoroughly—development mode doesn't purge

**Warning signs:**
- Styles present in dev but missing in production build
- Empty or unstyled elements in production deployment
- Production CSS bundle unusually small compared to development
- Console warnings about missing classes in production

**Phase to address:**
Phase 1 (Foundation) - Configure Tailwind correctly before building features. Verify in production build early. Every phase should test production builds to catch purge issues.

---

### Pitfall 6: Vercel Edge Runtime Incompatibilities Break Deployment

**What goes wrong:**
Deploying to Vercel with edge runtime enabled causes failures for libraries using Node.js built-in modules (`url`, `fs`, `crypto`, etc.) or exceeding the 1MB edge function size limit. Contact form using Nodemailer (needs Node.js APIs) will fail on edge runtime.

**Why it happens:**
Edge runtime is a subset of Node.js with restrictions (no native Node APIs, strict size limits). Many libraries assume full Node.js environment. Astro's Vercel adapter defaults can enable edge middleware, breaking compatibility.

**How to avoid:**
- For contact form with Nodemailer: Use serverless mode, NOT edge runtime
- Configure `@astrojs/vercel` adapter explicitly: `output: 'server'` or `output: 'hybrid'` with `edgeMiddleware: false`
- If using edge functions, check library compatibility (Nodemailer won't work)
- Edge functions limited to 1MB—if bundle exceeds, switch to serverless
- For API routes requiring Node.js: Place in `/api` and ensure serverless mode
- Test deployment on Vercel preview before production release

**Warning signs:**
- Build succeeds but functions fail at runtime on Vercel
- "Cannot find module" errors for Node built-in modules
- "Edge function size exceeded" errors during deployment
- Nodemailer or other Node-native libraries throwing errors in production

**Phase to address:**
Phase 3 (Contact Form) - Critical before implementing Nodemailer endpoint. Verify adapter configuration supports serverless functions before writing contact form logic.

---

### Pitfall 7: Large Component Lists Trigger Astro Rendering Performance Cliff

**What goes wrong:**
Rendering thousands of components in a single page (e.g., large photo galleries with individual components per image) hits Astro's known performance limitation. Memory allocation for RenderTemplateResult instances causes 10x+ slowdown compared to other frameworks. Rendering 15,000 components can take 650ms in Astro vs 100ms in legacy PHP.

**Why it happens:**
Astro's rendering pipeline creates excessive intermediate objects (RenderTemplateResult, HTMLString instances) for each component and attribute. With thousands of items, this allocates 20-25MB of memory per request, overwhelming garbage collection. Streaming adds additional overhead (disabling streaming can cut time from 750ms to 350ms).

**How to avoid:**
- For large galleries: Render static HTML list, hydrate a SINGLE interactive island for sorting/filtering/pagination
- Don't map over large arrays creating client islands (anti-pattern documented in multiple sources)
- Use static rendering for list items, JavaScript only for controls
- Consider pagination or virtual scrolling for very large sets
- If absolutely need many components: Disable streaming (`output.streaming: false` in config) to improve by ~50%
- For this project's gallery admin: Limit initial render to reasonable batch size (e.g., 50 images), load more on demand

**Warning signs:**
- Pages with many repeated components taking >500ms to render
- High memory usage during builds
- Build times increasing non-linearly with content volume
- Gallery pages slow even on fast connections

**Phase to address:**
Phase 2 (Gallery) - Design gallery architecture to avoid this pitfall. Use static thumbnails with single interactive island for admin controls, not individual islands per image.

---

### Pitfall 8: Google Maps iframe Blocks Main Thread, Destroys Mobile Performance

**What goes wrong:**
Embedding Google Maps via iframe immediately injects JavaScript files, stylesheets, and makes 100+ HTTP requests, blocking page rendering. On slow rural 3G connections, this can add 5-10 seconds to page load and tank Lighthouse scores.

**Why it happens:**
Default iframe embeds load immediately, regardless of whether user scrolls to the map. Google Maps is notoriously heavy (hundreds of KB of JavaScript). Most developers copy embed code directly from Google Maps without optimization.

**How to avoid:**
- Use lazy loading: `loading="lazy"` attribute on iframe (native browser support)
- Better: Use Intersection Observer to only load map when container is visible
- Best: Replace iframe with static map image initially, swap to interactive map on user click
- Google's official recommendation: Wait for user action (click) to initialize map
- Static map placeholder loads instantly (single image), interactive map only on demand
- For quilting retreat site: Location map likely below-fold—perfect candidate for lazy loading or click-to-activate pattern

**Warning signs:**
- PageSpeed Insights warning about "Reduce impact of third-party code"
- Large number of requests (100+) for simple map embed
- High "Total Blocking Time" metric
- Map loads immediately even if below fold
- Poor mobile performance scores

**Phase to address:**
Phase 4 (Location/Directions) - Implement lazy-loading or placeholder pattern from the start. Test on 3G throttle.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Using `public/` for images | No configuration needed, works immediately | Zero optimization, massive file sizes, slow rural loading | Never for content images; only for brand assets you control optimization for |
| `client:load` on everything | Components work immediately, no thinking required | Huge JavaScript bundles, negates Astro benefits, slow mobile | Never; always choose appropriate directive |
| Skipping build time testing | Faster development iteration | Production surprises (purged Tailwind, broken hydration) | Early prototyping only; test builds before every phase completion |
| Inline API calls without caching | Simple, straightforward code | Exponential build times, API rate limits | Only for single-page sites or truly dynamic data |
| Default Vercel adapter config | Zero configuration needed | Edge runtime breaks Node.js libraries (Nodemailer) | Static-only sites with no server functions |
| Skipping 3G throttle testing | Fast local testing | Unusable site for target rural audience | Never for this project—rural users are primary audience |
| Embedding full Google Maps iframe | Copy-paste embed code, works | Blocks main thread, 100+ requests, terrible mobile perf | Never; always use lazy loading or placeholder |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Cloudinary | Loading URLs through Astro Image component (double optimization) | Use Astro Cloudinary or custom Image Service to deliver directly from Cloudinary CDN |
| Cloudinary | Using dynamic crop modes (`thumb`) with responsive sizing | Crop in first stage (before transformations), then allow responsive sizing on cropped result |
| Nodemailer (contact form) | Deploying to edge runtime | Configure Vercel adapter for serverless mode; add rate limiting and honeypot spam prevention |
| Nodemailer | Missing TLS encryption and DKIM/SPF | Enable TLS, configure DKIM/SPF, validate inputs, implement rate limiting by IP |
| Google Maps | Direct iframe embed without lazy loading | Use `loading="lazy"` attribute or Intersection Observer, or static image placeholder with click-to-load |
| Tailwind CSS | Missing `.astro` files in `content` config | Include all file types: `['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}']` |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized images in gallery | Slow loading on fast WiFi becomes unusable on 3G | Use Cloudinary with auto-format, auto-quality, responsive sizes; test on 3G throttle | First rural user on 4G |
| Building client islands per array item | Works fine with 10 items, grinds to halt with 100+ | Static list rendering + single island for controls (sort/filter/pagination) | >50 interactive components |
| API calls without build caching | 5-second builds acceptable early on | Cache API responses, fetch once and pass down | >20 pages with API dependencies |
| Immediate iframe embeds (Maps, YouTube) | Desktop WiFi shows no issues | Lazy load or click-to-activate pattern | First mobile or slow connection user |
| Unthrottled contact form | Works fine during development | Implement rate limiting (5 submissions per IP per hour), honeypot fields, CAPTCHA | First spam bot discovers form |
| Dynamic Tailwind classes | Dev mode shows styles correctly | Use complete class names or safelist; test production builds | Production deployment |
| Streaming with many components | Fine with small pages | Disable streaming for component-heavy pages | >1000 components on single page |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| No rate limiting on contact form | Email bombing, SMTP quota exhaustion, spam complaints | Implement 5 submissions/hour per IP, exponential backoff, monitor abuse |
| Missing input validation in Nodemailer | Email header injection, open relay exploitation | Strict validation/sanitization of all inputs, text-only emails, validate email format |
| Exposing SMTP credentials | Credentials leak in client bundle or Git | Use environment variables, never commit .env files, use Vercel environment secrets |
| No CAPTCHA or honeypot | Form spam floods inbox, damages sender reputation | Add honeypot field (hidden input bots fill), consider Friendly Captcha for UX-friendly bot prevention |
| Allowing arbitrary file uploads (future gallery admin) | Malicious file execution, storage exhaustion | Validate file types, scan for malware, use Cloudinary's moderation features, size limits |
| Missing CORS configuration for API routes | CSRF attacks on contact form | Configure CORS properly, validate Origin header, use CSRF tokens for state-changing operations |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Loading 50+ full-resolution gallery images at once | 3G users wait 2+ minutes, page appears broken | Lazy load below-fold images, use low-quality image placeholders (LQIP), paginate or virtual scroll |
| No visual feedback during contact form submission | User clicks "Send" multiple times, generates duplicate emails | Show loading spinner, disable button, display success/error message clearly |
| Flash of unstyled content (FOUC) during hydration | Jarring visual shift when React islands load | Use CSS to style static state identically to hydrated state, minimize CLS |
| Gallery images without dimensions | Page jumps as images load (terrible CLS) | Always set explicit width/height, use aspect-ratio CSS, reserve space before load |
| Video autoplaying on mobile 3G | Consumes data allowance, slow load blocks page | Use poster image placeholder, require click to play, consider video facade pattern |
| No offline state messaging | Users on spotty rural connections see broken images, confused | Implement service worker for offline detection, show friendly message, cache critical assets |
| Tiny clickable areas on mobile | Difficult to tap gallery controls or links on small screens | Minimum 44x44px touch targets, increase button padding for mobile |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Gallery images:** Often missing width/height attributes (verify: check for CLS in Lighthouse, inspect img tags)
- [ ] **Contact form:** Often missing rate limiting (verify: attempt 10 rapid submissions, check server-side limits)
- [ ] **Contact form:** Often missing honeypot spam prevention (verify: hidden field exists, server rejects if filled)
- [ ] **React islands:** Often missing proper client directive (verify: not using client:load by default, check bundle size)
- [ ] **Images in src/:** Often missing lazy loading (verify: check loading="lazy" or client:visible for below-fold)
- [ ] **Cloudinary integration:** Often using Astro Image instead of direct delivery (verify: check if images coming from Cloudinary CDN, not reprocessed)
- [ ] **Production build:** Often not tested on 3G throttle (verify: Chrome DevTools Network → Slow 3G, test all pages)
- [ ] **Tailwind production:** Often missing dynamic classes (verify: check safelist config, test all conditional styles in build)
- [ ] **Google Maps:** Often blocking main thread (verify: check loading="lazy" or Intersection Observer, test mobile Lighthouse)
- [ ] **Vercel deployment:** Often using wrong runtime (verify: serverless for Nodemailer, check adapter config)
- [ ] **API routes:** Often missing CORS and CSRF (verify: test cross-origin requests, check CSRF token implementation)
- [ ] **Build times:** Often unmonitored until too late (verify: document build time after each phase, investigate if >60s)

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Over-hydration (client:load everywhere) | LOW | Audit components, change directives to client:visible/idle, test performance improvement |
| Images in public/ folder | MEDIUM | Move to src/, refactor Image components, re-optimize through Cloudinary, test thoroughly |
| Broken client hydration (function props) | LOW | Refactor to pass data only, move handlers into island, use Nano Stores for shared state |
| Slow builds from API calls | MEDIUM | Implement caching layer, refactor to fetch-once pattern, monitor build times |
| Tailwind classes purged | LOW | Fix dynamic classes or add to safelist, rebuild and redeploy, add to testing checklist |
| Vercel edge runtime failure | LOW | Update adapter config to serverless, redeploy, verify functions work |
| Large component rendering cliff | HIGH | Architectural refactor to static list + single island, potentially redesign feature |
| Google Maps blocking performance | LOW | Add lazy loading or placeholder pattern, redeploy, verify Lighthouse improvement |
| Contact form spam | LOW | Add rate limiting, honeypot, CAPTCHA, monitor inbox |
| Unoptimized images in production | MEDIUM | Audit all images, implement Cloudinary transformations, test on 3G |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Over-hydration | Phase 1 (Foundation) | Document directive strategy; review in Phase 2 when adding React island |
| Images in public/ | Phase 1 (Foundation) | All images in src/ or Cloudinary; verify with build audit |
| Function props to islands | Phase 2 (Gallery) | Test React admin island hydration; check console for serialization errors |
| Slow builds from API calls | Phase 1 (Foundation), Phase 2 (Gallery) | Monitor build times; investigate if >60s; verify caching working |
| Tailwind purging | Phase 1 (Foundation) | Test production build; verify no missing styles; add to phase completion checklist |
| Vercel edge runtime | Phase 3 (Contact Form) | Verify adapter config before implementing Nodemailer; test preview deployment |
| Large component lists | Phase 2 (Gallery) | Design architecture to avoid; static list + single island pattern |
| Google Maps blocking | Phase 4 (Location) | Implement lazy loading from start; test mobile Lighthouse score |
| Form spam | Phase 3 (Contact Form) | Rate limiting, honeypot, input validation implemented before first deploy |
| Unoptimized Cloudinary | Phase 2 (Gallery) | Verify direct CDN delivery (not double optimization); test image sizes |
| Missing 3G testing | Every phase | Test on Slow 3G throttle before phase sign-off; document load times |
| Build testing skipped | Every phase | Test production build before completion; verify Tailwind, hydration, images |

## Sources

### Official Documentation
- [Astro Docs: Migrating from Next.js](https://docs.astro.build/en/guides/migrate-to-astro/from-nextjs/)
- [Astro Docs: Islands Architecture](https://docs.astro.build/en/concepts/islands/)
- [Astro Docs: Images](https://docs.astro.build/en/guides/images/)
- [Astro Docs: Front-end Frameworks](https://docs.astro.build/en/guides/framework-components/)
- [Astro Docs: Vercel Adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/)
- [Astro Docs: Content Collections](https://docs.astro.build/en/guides/content-collections/)

### Performance & Optimization
- [Complete Guide to Astro Performance Optimization](https://eastondev.com/blog/en/posts/dev/20251202-astro-performance-optimization/)
- [Astro Build Speed Optimization Guide](https://www.bitdoze.com/astro-ssg-build-optimization/)
- [Web Performance Optimization with Astro Deep Dive](https://www.blackholesoftware.com/blog/astro-performance-optimization-deep-dive/)
- [2026 Web Performance Standards](https://www.inmotionhosting.com/blog/web-performance-benchmarks/)
- [Mobile Optimization: Avoid 4G Latency](https://www.globaldots.com/resources/blog/mobile-optimization-avoid-4g-latency-with-performance-best-practices/)

### Migration Experiences
- [Alejandro Celaya: Migrating from Next.js to Astro](https://alejandrocelaya.blog/2023/10/19/my-thoughts-after-migrating-content-centric-websites-from-next-js-to-astro/)
- [Converting Next.js to Astro - Eric Clemmons](https://ericclemmons.com/blog/converting-nextjs-to-astro)
- [Rebuilding from Next.js to Astro](https://lik.ai/blog/nextjs-to-astro-migration/)
- [Migrating from NextJS to Astro Guide](https://makersden.io/blog/migrating-from-nextjs-to-astro)

### Specific Issues
- [GitHub Issue #11454: Slow Rendering Performance](https://github.com/withastro/astro/issues/11454)
- [Share State Between Islands](https://docs.astro.build/en/recipes/sharing-state-islands/)
- [Astro Cloudinary Documentation](https://astro.cloudinary.dev/)
- [How to Optimize Images in Astro](https://uploadcare.com/blog/how-to-optimize-images-in-astro/)
- [Lazy Load Google Maps Iframe](https://key2blogging.com/lazyload-google-map-iframe/)
- [Securing Nodemailer](https://medium.com/@Scofield_Idehen/securing-nodemailer-with-proper-authentication-a5fb1fa372d0)
- [Form Spam Prevention Best Practices](https://friendlycaptcha.com/insights/form-spam-prevention/)

### Community Resources
- [Astro Islands Architecture Explained - Strapi](https://strapi.io/blog/astro-islands-architecture-explained-complete-guide)
- [Understanding Astro Islands - LogRocket](https://blog.logrocket.com/understanding-astro-islands-architecture/)
- [Astro Island Architecture Demystified - SoftwareMill](https://softwaremill.com/astro-island-architecture-demystified/)
- [Astro Client Directives Explained - Medium](https://medium.com/@mirko.tomhave/astro-client-directives-explained-b0daac284c0)

---
*Pitfalls research for: Astro Content Website (Next.js Migration to Astro for Quilting Retreat)*
*Researched: 2026-02-16*
*Target Audience: Slow rural 3G/4G connections (Missouri)*
*Stack: Astro, React islands, Tailwind CSS, Cloudinary, Vercel, Nodemailer*
