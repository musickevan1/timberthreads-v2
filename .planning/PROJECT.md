# Timber & Threads Retreat — Website Rebuild (Astro)

## What This Is

A ground-up rebuild of the Timber & Threads Retreat website using Astro — a static-first framework that ships zero JavaScript for content sections and only hydrates interactive islands (gallery, contact form). The retreat center is a quilting and crafting getaway on a small island surrounded by a lake in rural Clinton, Missouri. This rebuild carries over all existing content and design direction from the current Next.js site, but with better performance, visual polish, and a clean organized codebase.

## Current Milestone: v2.0 Website Rebuild

**Goal:** A polished, high-performance website that loads fast on rural Missouri connections, integrates new photos from the Feb 15 shoot, and includes a placeholder for the promo video.

## Core Value

The website must load fast and look polished on slow rural connections, making the retreat feel warm and inviting enough that quilters, crafters, and families want to book a stay.

## Requirements

### Validated

(None yet — fresh rebuild)

### Active

- [ ] Homepage with all content sections migrated from current site (hero, about, workshops, accommodations, calendar, gallery, contact, map, connect, footer)
- [ ] Visual refinements over current site — improved spacing, transitions, typography
- [ ] Hardcoded gallery with images from Cloudinary (no dynamic API calls on page load)
- [ ] Video section placeholder with poster image (swap in promo video when ready)
- [ ] Contact form with email delivery via Nodemailer
- [ ] Lazy-loaded Google Calendar and Google Maps embeds
- [ ] New photos from Feb 15 shoot integrated (after sorting/editing)
- [ ] Lighthouse mobile performance score 90+ on Fast 3G
- [ ] Deploy to Vercel on timberandthreadsretreat.com domain
- [ ] Clean, organized codebase with domain-based component structure

### Out of Scope

- Full visual redesign — client likes the current look, just refine it
- Admin gallery management — add in a later phase after public site is solid
- Dynamic gallery API (Cloudinary/Redis fetching) — hardcode images for now, wire up later
- Booking/payment system — not requested
- Workshop registration — not requested
- Mobile app — web only
- Promo video editing — separate workflow, just build the placeholder section

## Context

**Previous site:** Next.js 14 on Vercel with Tailwind CSS. Live at timberandthreadsretreat.com. Had 6 React hydration errors in production, gallery loading flash, admin password exposed in client-side env var, and 53GB of video processing files cluttering the repo. Old site source at `../timberandthreads/` for content reference.

**Existing services (carry over):**
- Cloudinary — image CDN + uploads (timber+cloudinary@evanmusick.dev)
- Upstash Redis — gallery metadata persistence (timber+upstash@evanmusick.dev, not needed for v1 public site)
- Vercel — hosting (timber+vercel@evanmusick.dev)
- Cloudflare — DNS + email routing (timber@evanmusick.dev)
- Gmail SMTP — contact form emails via Nodemailer

**New media:**
- Photos from Feb 15 shoot are raw from camera, need sorting and editing before integration
- Promo video still needs editing — build placeholder section now, integrate later

**Client:** timberandthreads24@gmail.com, (417) 343-1473
**Location:** 306 NW 300 Rd, Clinton, MO 64735

**Content sections (all from current site):**

| Section | Description |
|---------|-------------|
| Hero | Full-screen background image with logo, tagline, CTA buttons |
| About | Retreat description — island setting, quilting/crafting focus |
| Workshops | Group retreats, family gatherings, amenities with details |
| Accommodations | 4 bedrooms, 2 bathrooms, workspaces, pricing ($500-600/night) |
| Calendar | Google Calendar embed showing availability |
| Gallery | Two sections: Facility photos + Quilting photos |
| Contact | Contact info + email form (name, email, message) |
| Map | Google Maps embed + entrance photo with description |
| Connect | Facebook page link + social preview card |
| Footer | Copyright + admin/contact links |

## Constraints

- **Framework:** Astro with Tailwind CSS — static-first, islands for interactivity
- **Audience:** Rural Missouri — many visitors on slow 3G/4G connections, must be fast
- **Budget:** Budget-conscious client ($300 original site) — use free tiers where possible
- **Hosting:** Vercel free tier — bundle sizes matter
- **Domain:** timberandthreadsretreat.com (Cloudflare DNS, already configured)
- **Photos:** Raw from camera — sorting/editing is a prerequisite before integration
- **Video:** Not ready yet — placeholder only, no video files to deploy

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Site is 90% static content — Astro ships zero JS for static sections, massive performance win | — Pending |
| Fresh repo over cleanup | Old repo had 53GB of video files, legacy code, rewritten history — clean start is faster | — Pending |
| Hardcoded gallery | No API calls on page load = faster, simpler. Dynamic API added with admin phase later | — Pending |
| Sibling directory | Keep old site at ../timberandthreads/ as content reference during migration | — Pending |
| Public site first | Get the visitor-facing site polished before building admin interface | — Pending |
| Lazy-load embeds | Google Calendar + Maps iframes are heavy — lazy-load to avoid blocking initial render | — Pending |
| Video placeholder | Promo video isn't ready — build the section structure now, swap in video later | — Pending |

---
*Last updated: 2026-02-16 after initialization*
