# Phase 12: Google Maps Driving Route - Research

**Researched:** 2026-03-02
**Domain:** Google Maps Embed API (Directions mode), Astro environment variables, API key security
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Route Origin & Path**
- Route starts from the Breaktime / Golden Valley Fireworks area on Highway 7 (near NW 221 Rd intersection)
- Claude researches the exact address/coordinates for this landmark during the research phase
- Route MUST match the existing text directions: Highway 7 → NW 221 Rd → T intersection → left turn → gate → property
- Do not let Google pick an arbitrary "fastest route" — the route should follow the known-good path visitors actually take

**Text Directions & Supporting Content**
- Keep all 6 text direction steps exactly as they are — rural GPS is unreliable, text is the safety net
- Keep the GPS warning callout as-is
- Keep the address "306 NW 300 Rd, Clinton, MO 64735" visible below the map
- Add an "Open in Google Maps" link so visitors can launch turn-by-turn navigation from their current location

**Map Implementation**
- Use the free Google Maps Embed API (Directions mode), not the paid JavaScript API
- Roadmap view (not satellite) — clean and readable for following directions
- Keep current 4:3 aspect ratio (75% padding-top) in the existing two-column layout
- Keep current mobile stacking behavior (map above, directions below)
- Maintain the existing lazy-load pattern (IntersectionObserver on the iframe)

**API Key Setup**
- Store as `PUBLIC_GOOGLE_MAPS_KEY` in environment variables
- Add to .env locally and Vercel dashboard for production
- Restrict API key to production domain in Google Cloud Console
- Key must NOT be committed to git

### Claude's Discretion

- Whether to label the starting landmark marker on the route (vs. just the route line)
- Exact styling of the "Open in Google Maps" link
- Mobile map height adjustments if 4:3 is too tall on small screens

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MAPS-01 | Embedded Google Map displays visual driving route to the property | Embed API directions mode with `origin`, `destination`, `waypoints` parameters covers this entirely. Route from Breaktime to 306 NW 300 Rd, Clinton, MO using `waypoints` to force the NW 221 Rd path. |
| MAPS-02 | Maps API key is domain-restricted and stored as environment variable | `PUBLIC_GOOGLE_MAPS_KEY` in `.env` + Vercel env, accessed via `import.meta.env.PUBLIC_GOOGLE_MAPS_KEY` in frontmatter, restricted to `https://timberandthreadsretreat.com` in Google Cloud Console with Maps Embed API-only API restriction. |
</phase_requirements>

---

## Summary

Phase 12 is a targeted upgrade to `Map.astro`: swap the existing static location-pin iframe for a Directions-mode iframe that shows the visual route from Highway 7 to the property. The Google Maps Embed API has a first-class "directions" mode that accepts `origin`, `destination`, and `waypoints` parameters — this is exactly the right tool. No JavaScript SDK is needed, no NPM packages are needed, and the API is genuinely free with unlimited requests.

The main technical risk is route accuracy. Google's routing algorithm may pick a different path than the known-good visitor route. The `waypoints` parameter (Embed API supports up to 20) can be used to force the route through the NW 221 Rd corridor, making Google follow the same path as the text directions. The fallback if waypoints don't fully constrain the route is to pick origin/destination coordinates that naturally produce the correct path given the rural road network.

API key security follows the same pattern already established in this project (`.env` + `import.meta.env`), with one difference: this key is `PUBLIC_` prefixed because it is embedded in an iframe URL that renders in the browser. A `PUBLIC_` variable is inlined at build time into the HTML. It must be restricted to the production domain in Google Cloud Console and scoped to "Maps Embed API" only in API restrictions — this prevents the key from being used for any other Google Maps service even if scraped.

**Primary recommendation:** Use Google Maps Embed API directions mode with `origin=215+NW+Highway+7,Clinton,MO+64735` (the Breaktime store address), `waypoints=NW+221+Rd,Clinton,MO+64735` to force the correct rural corridor, and `destination=306+NW+300+Rd,Clinton,MO+64735`. Restrict the API key to `https://timberandthreadsretreat.com` and scope it to Maps Embed API only.

---

## Standard Stack

### Core

| Library / Service | Version / Tier | Purpose | Why Standard |
|-------------------|----------------|---------|--------------|
| Google Maps Embed API | Free, unlimited | Directions-mode iframe — no JS SDK required | Official Google product, zero bundle cost, explicitly free per Google docs |
| Astro `import.meta.env` | Built-in (Astro 5) | Inject API key into iframe URL at build time | Established pattern in this project (Resend key uses same mechanism) |

### Supporting

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Google Cloud Console | N/A (web UI) | Create API key, set HTTP referrer restriction, set API restriction | One-time setup step |
| Vercel Dashboard env vars | N/A (web UI) | Store `PUBLIC_GOOGLE_MAPS_KEY` for production | Required for Vercel deploy; dev uses `.env` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Embed API (directions mode, free) | Maps JavaScript API | JS API costs ~$5/1000 loads, adds ~400KB bundle, requires Preact/React island — all worse for this use case |
| Embed API (directions mode, free) | Static map image | Static image can't zoom/pan — fails success criterion 2 |
| Embed API iframe | Leaflet + OpenStreetMap | Free, but requires JS bundle and won't show the Google-familiar satellite/road tiles visitors expect |

**Installation:** None required. No NPM packages. Everything is built into Astro and the Google embed URL.

---

## Architecture Patterns

### Recommended Project Structure

No new files or folders needed. The entire change lives in one file:

```
src/
└── components/
    └── Map.astro    ← only file that changes
```

`.env` and `.env.example` also get one new line each. Vercel dashboard gets one new env var.

### Pattern 1: PUBLIC_ env var in Astro frontmatter → iframe src

**What:** `PUBLIC_` variables are available in `.astro` frontmatter via `import.meta.env`. They are inlined at build time — the final HTML contains the literal key string, not a JS expression. This is correct and expected for an Embed API key that is meant to be visible in the iframe URL.

**When to use:** Any value that must be embedded in a static HTML attribute (href, src, data-*) and is safe to be public-facing.

**Example:**
```astro
---
// Source: https://docs.astro.build/en/guides/environment-variables/
const mapsKey = import.meta.env.PUBLIC_GOOGLE_MAPS_KEY;
---

<iframe
  data-src={`https://www.google.com/maps/embed/v1/directions?key=${mapsKey}&origin=...`}
  ...
></iframe>
```

Note: The key goes into `data-src` (not `src`) because this project uses the existing IntersectionObserver lazy-load pattern — the JS reads `dataset.src` and assigns it to `iframe.src` on scroll. The URL string is composed in frontmatter where `import.meta.env` is available.

### Pattern 2: Embed API Directions Mode URL construction

**What:** The directions iframe URL follows a fixed structure. Parameters are URL-encoded strings. Spaces become `+`, addresses are comma-separated.

**When to use:** Any time a driving route between two points needs to be shown in an iframe.

**Example:**
```
https://www.google.com/maps/embed/v1/directions
  ?key=YOUR_API_KEY
  &origin=215+NW+Highway+7,Clinton,MO+64735
  &destination=306+NW+300+Rd,Clinton,MO+64735
  &waypoints=NW+221+Rd%2CClinton%2CMO+64735
  &mode=driving
  &maptype=roadmap
```

Source: https://developers.google.com/maps/documentation/embed/embedding-map

### Pattern 3: Waypoints to constrain rural route

**What:** The `waypoints` parameter passes an intermediate location the route must pass through. For rural areas where Google might pick an alternate highway, a waypoint on the correct road forces Google to use that corridor.

**When to use:** When the algorithmically "fastest" route differs from the known-good visitor route.

**Example:**
```
&waypoints=NW+221+Rd%2CClinton%2CMO
```

The Embed API supports up to 20 waypoints separated by `|`. A single waypoint for NW 221 Rd should be sufficient to constrain the route to the correct corridor.

**Caution (MEDIUM confidence):** The effectiveness of the waypoint at forcing a specific rural road depends on whether Google has that road addressable as a waypoint. This should be tested after implementation — if the waypoint resolves to a wrong location, fall back to lat/lng coordinates for the waypoint instead.

### Pattern 4: "Open in Google Maps" link for turn-by-turn navigation

**What:** A standard hyperlink using the Maps URL API that opens the Google Maps app (mobile) or google.com/maps (desktop) with turn-by-turn navigation to the destination. Omitting `origin` causes Google Maps to use the device's current location.

**When to use:** When the user wants to leave the page and navigate from their current position.

**Example:**
```html
<!-- Source: https://developers.google.com/maps/documentation/urls/get-started -->
<a
  href="https://www.google.com/maps/dir/?api=1&destination=306+NW+300+Rd,Clinton,MO+64735&travelmode=driving"
  target="_blank"
  rel="noopener noreferrer"
>
  Open in Google Maps
</a>
```

No API key is needed for this link — it's the standard public Google Maps URL.

### Anti-Patterns to Avoid

- **Putting `src` directly instead of `data-src`:** The existing IntersectionObserver pattern reads `dataset.src`. If you set `src` directly, the map loads eagerly on page load, breaking the lazy-load behavior that was established in Phase 8 (PERF-05).
- **Using `import.meta.env` inside a `<script>` tag (client-side):** `PUBLIC_` vars ARE available in client-side scripts in Astro, but the URL construction should happen in the frontmatter where it's simpler and more explicit. Don't move the URL-building logic into the `<script>` block.
- **Committing the API key:** The key is `PUBLIC_` (visible in HTML) but must not be in git. It should live in `.env` (gitignored) and Vercel dashboard only.
- **Omitting the `key` parameter:** Without a key the Embed API returns an error iframe. The key is mandatory for all requests even though the service is free.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Route display in iframe | Custom tile rendering, Leaflet map | Google Maps Embed API directions mode | Free, no bundle cost, familiar UI, supports zoom/pan natively |
| Force route through specific road | Complex JS routing algorithm | `waypoints` parameter in Embed API URL | Built-in parameter, up to 20 waypoints, no code required |
| Turn-by-turn launch link | Custom deeplink builder | `https://www.google.com/maps/dir/?api=1&destination=...` | Official Maps URL API, works on iOS (Apple Maps prompt) and Android |
| API key injection | Custom server-side proxy | `import.meta.env.PUBLIC_GOOGLE_MAPS_KEY` in frontmatter | Already established pattern in this project; Astro inlines at build time |

**Key insight:** The Embed API's directions mode handles everything declaratively via URL parameters. There is no JavaScript routing logic to write, no SDK to initialize, no event handling. The entire implementation is a URL string swap in the iframe's `data-src` attribute plus environment variable wiring.

---

## Common Pitfalls

### Pitfall 1: Google picks a different route than NW 221 Rd

**What goes wrong:** Google's routing algorithm finds a faster path (possibly via a different highway approach) and the embedded map shows a route that doesn't match the text directions. Visitors follow the map, get confused.

**Why it happens:** Rural areas have limited road data and Google optimizes for travel time, not familiarity.

**How to avoid:** Use the `waypoints` parameter to pass through a point on NW 221 Rd. If an address-based waypoint doesn't constrain the route well enough, switch to lat/lng coordinates for the waypoint (approximately `38.3630,-93.7390` is the NW 221 Rd corridor north of Highway 7).

**Warning signs:** After building the URL, open it in a browser before deploying. Visually verify the route line follows Highway 7 → NW 221 Rd → left turn → property.

### Pitfall 2: iframe renders blank or shows "This page can't load Google Maps correctly"

**What goes wrong:** The map area shows an error message instead of the map.

**Why it happens:** API key is missing, incorrect, or has a restriction mismatch (e.g., `localhost` is not in the allowed referrers, or the key is not enabled for Maps Embed API).

**How to avoid:**
- During development, the API key restriction should allow `localhost` OR the key should be temporarily unrestricted for local testing. Add `http://localhost:*` to the HTTP referrer list in Cloud Console during development, then remove it before go-live.
- Verify the API restriction includes "Maps Embed API" explicitly.
- Test the raw URL directly in a browser with `?key=YOUR_KEY` to confirm the key works before integrating.

**Warning signs:** Gray box with "For development purposes only" watermark means key works but billing account isn't set up. Error message means key is invalid or not permitted.

### Pitfall 3: `import.meta.env.PUBLIC_GOOGLE_MAPS_KEY` is undefined at build time

**What goes wrong:** The `data-src` URL contains `undefined` literally, so `https://...?key=undefined` is loaded. Map fails.

**Why it happens:** The `.env` file doesn't have `PUBLIC_GOOGLE_MAPS_KEY` set, or the Vercel environment variable is missing.

**How to avoid:** Add the key to `.env` before running `astro dev` or `astro build`. The `.env.example` file should document the new variable so it's never missed in future setup.

**Warning signs:** View source on the built HTML and search for `key=undefined`.

### Pitfall 4: Billing account required for API key to work

**What goes wrong:** Key is created but requests return errors because the Google Cloud project has no billing account linked.

**Why it happens:** Google requires billing to be enabled on any Cloud project that uses Maps APIs — even though the Embed API itself has no charge.

**How to avoid:** When creating the key in Cloud Console, ensure the project has a billing account linked. This is a one-time Google Cloud setup requirement. No charges will accrue for Embed API use — it is explicitly "unlimited free" per Google's billing docs.

**Warning signs:** "BillingNotEnabled" error in the iframe or when testing the key.

### Pitfall 5: `data-src` value construction fails with template literal in `<script>`

**What goes wrong:** The URL is built in the `<script>` block where `import.meta.env` is accessible, but the result is subtly different from building it in the frontmatter.

**Why it happens:** In Astro client-side `<script>` tags, `import.meta.env.PUBLIC_*` values ARE inlined, but the syntax must be used carefully.

**How to avoid:** Build the URL string in the Astro frontmatter (`---`) and pass it as a `data-src` attribute. This is explicit, type-checkable, and consistent with the rest of the component.

---

## Code Examples

Verified patterns from official sources:

### Complete Embed API Directions URL

```
// Source: https://developers.google.com/maps/documentation/embed/embedding-map
https://www.google.com/maps/embed/v1/directions
  ?key=YOUR_API_KEY
  &origin=215+NW+Highway+7,Clinton,MO+64735
  &destination=306+NW+300+Rd,Clinton,MO+64735
  &waypoints=NW+221+Rd,Clinton,MO+64735
  &mode=driving
  &maptype=roadmap
```

### Astro component pattern (Map.astro frontmatter + iframe)

```astro
---
// Source: https://docs.astro.build/en/guides/environment-variables/
const mapsKey = import.meta.env.PUBLIC_GOOGLE_MAPS_KEY;

const origin = encodeURIComponent('215 NW Highway 7, Clinton, MO 64735');
const destination = encodeURIComponent('306 NW 300 Rd, Clinton, MO 64735');
const waypoint = encodeURIComponent('NW 221 Rd, Clinton, MO 64735');

const mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${mapsKey}&origin=${origin}&destination=${destination}&waypoints=${waypoint}&mode=driving&maptype=roadmap`;
---

<iframe
  id="maps-iframe"
  data-src={mapSrc}
  class="absolute top-0 left-0 w-full h-full border-0"
  frameborder="0"
  scrolling="no"
  title="Driving directions to Timber & Threads Retreat"
  aria-label="Google Maps showing driving route to retreat"
  allowfullscreen
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>
```

Note: The existing `<script>` block remains unchanged — it reads `dataset.src` and sets `iframe.src` on intersection.

### "Open in Google Maps" link

```html
<!-- Source: https://developers.google.com/maps/documentation/urls/get-started -->
<!-- No API key needed — standard public Maps URL -->
<a
  href="https://www.google.com/maps/dir/?api=1&destination=306+NW+300+Rd%2CClinton%2CMO+64735&travelmode=driving"
  target="_blank"
  rel="noopener noreferrer"
>
  Open in Google Maps
</a>
```

Omitting `origin` causes Google Maps to use the device's current location, which is what visitors need.

### .env addition

```bash
# .env (not committed to git)
PUBLIC_GOOGLE_MAPS_KEY=AIzaSy...

# .env.example (committed to git as documentation)
PUBLIC_GOOGLE_MAPS_KEY=your_maps_embed_api_key_here
```

### Google Cloud Console API key restriction (HTTP referrer pattern)

```
# Source: https://developers.google.com/maps/api-security-best-practices
# Application restriction: Websites (HTTP referrers)
# Allowed referrers:
https://timberandthreadsretreat.com
https://timberandthreadsretreat.com/*

# API restriction: Restrict to specific APIs
# Select: Maps Embed API (only)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Static location pin (current Map.astro) | Directions mode with route | This phase | Visitors can see the actual path to follow, not just a destination dot |
| No API key required for legacy embed | API key required for v1 embed API | Google Maps Platform 2018 | Must create a Cloud project and key; legacy keyless URLs may still work but are deprecated |

**Deprecated/outdated:**
- **Legacy keyless Google Maps embeds:** URLs of the form `https://www.google.com/maps/embed?pb=!1m18...` (as currently in Map.astro) do not require an API key and still work, but they are the old format. The v1 Embed API (`/maps/embed/v1/directions`) requires a key but supports structured parameters like `origin` and `destination` that the legacy format does not.

---

## Landmark Research: Breaktime Store Address

**Finding:** The Breaktime convenience store on Highway 7 in Clinton, MO is located at **215 NW Highway 7, Clinton, MO 64735** (also appears as 215 NW MO-7).

**Sources:** Yelp listing (updated January 2026), GasBuddy, MechanicAdvisor — multiple sources agree on 215 NW Highway 7.

**Confidence:** MEDIUM-HIGH. Multiple listing sources agree on this address. The planner should verify this resolves correctly in a Google Maps URL before finalizing. A mismatch could shift the route origin to the wrong side of the Highway 7 / NW 221 Rd intersection.

**Alternative approach:** If the address doesn't resolve well, use lat/lng coordinates for the origin. The approximate coordinates for the NW 221 Rd / Highway 7 intersection are approximately `38.3628,-93.7378`. These can be used directly as `origin=38.3628,-93.7378`.

---

## Open Questions

1. **Does the `waypoints=NW+221+Rd,Clinton,MO` parameter successfully force the route through that road?**
   - What we know: The Embed API `waypoints` parameter is documented to route through intermediate locations. The road exists in Google Maps.
   - What's unclear: Whether Google can resolve "NW 221 Rd, Clinton, MO" as a valid waypoint address (rural road segments are sometimes unaddressable). If it can't resolve, it may silently ignore the waypoint and use a different route.
   - Recommendation: Test the full URL in a browser before deploying. If the waypoint doesn't work as an address, substitute with lat/lng coordinates: `waypoints=38.3870,-93.7330` (a point along NW 221 Rd north of the intersection).

2. **Does the client already have a Google Cloud project with billing enabled?**
   - What we know: STATE.md notes this is unknown and it's a prerequisite blocker.
   - What's unclear: Whether an existing project exists (shared with other Google services the client uses) or whether a new project must be created.
   - Recommendation: The plan should include a step to check/create the Cloud project before any code changes. If no project exists, creating one and enabling billing (even with zero-cost usage) takes approximately 15 minutes.

3. **Should the HTTP referrer restriction include preview/staging URLs?**
   - What we know: The production domain is `timberandthreadsretreat.com`. Vercel also creates preview deployment URLs per commit.
   - What's unclear: Whether the client cares about Maps working in Vercel preview deployments.
   - Recommendation: For simplicity, restrict to production domain only. Preview deployments won't show the map but that's acceptable for this project.

---

## Sources

### Primary (HIGH confidence)
- https://developers.google.com/maps/documentation/embed/embedding-map — Directions mode parameters, waypoints format, maptype options
- https://developers.google.com/maps/documentation/embed/get-started — Overview, API key requirement, free pricing confirmation
- https://developers.google.com/maps/documentation/embed/usage-and-billing — Confirmed: unlimited free, no daily limits, no billing charges for Embed API
- https://developers.google.com/maps/api-security-best-practices — HTTP referrer restriction setup, dual restriction strategy (application + API)
- https://developers.google.com/maps/documentation/urls/get-started — "Open in Google Maps" link format, `dir` action, `api=1` requirement
- https://docs.astro.build/en/guides/environment-variables/ — `PUBLIC_` var behavior, `import.meta.env` in frontmatter

### Secondary (MEDIUM confidence)
- https://www.yelp.com/biz/break-time-clinton (updated Jan 2026) — Breaktime address: 215 NW Highway 7, Clinton, MO 64735
- https://www.gasbuddy.com/station/122395 — Confirms 215 NW MO-7, Clinton, MO
- https://mapsplatform.google.com/resources/blog/build-more-for-free-and-access-more-discounts-online-with-google-maps-platform-updates/ — Confirms Maps Embed API and Maps SDK have unlimited free usage

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Embed API directions mode is the explicitly correct tool; confirmed free; confirmed no npm packages needed
- Architecture: HIGH — URL construction in frontmatter is consistent with established Astro patterns in this project; API key setup is documented in official Google guides
- Pitfalls: MEDIUM — Route accuracy via waypoints is documented but real-world effectiveness on rural Missouri road segments hasn't been directly verified; all other pitfalls are HIGH confidence

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (stable API, but verify Breaktime address is still current before coding)
