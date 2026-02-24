# Client Meeting Prep — Timber & Threads v2

**Meeting Date:** Tomorrow
**Client:** timberandthreads24@gmail.com | (417) 343-1473

---

## v2 Overview for Client

### What's New (The Pitch)

**v2 is a complete rebuild focused on speed and reliability for rural Missouri visitors:**

| Area | v1 (Old Site) | v2 (New Site) |
|------|---------------|---------------|
| **Framework** | Next.js (React) | Astro (static-first) |
| **JavaScript shipped** | ~150KB+ | <50KB (zero for content sections) |
| **Hydration errors** | 6 React errors in production | 0 (no hydration) |
| **Loading experience** | Flash of content, spinner delays | Instant, progressive |
| **Gallery** | API calls on page load, loading states | Pre-built, instant display |
| **Contact form** | Gmail SMTP (complex setup) | Resend (reliable delivery) |
| **Codebase** | 53GB with video files | Clean, organized, <10MB |

### Key Benefits to Highlight

1. **Fast on slow connections** — Site loads instantly even on rural 3G/4G
2. **Polished, warm feel** — Same content, refined spacing and transitions
3. **Reliable contact form** — Emails go through, owner can reply directly
4. **Gallery ready for new photos** — Cloudinary CDN serves optimized images
5. **Video section waiting** — Placeholder ready for promo video

---

## Current Site Status

### ✅ Complete & Deployed to Vercel

- **Layout:** BaseLayout with sticky nav, scroll-spy, hero, footer
- **Sections:** About, Workshops, Accommodations, Calendar, Gallery, Contact, Map, Connect
- **Gallery:** Two categories (Facility + Quilting) with PhotoSwipe lightbox
- **Contact Form:** Full validation, honeypot spam protection, Resend email delivery
- **Lazy Loading:** Google Calendar + Maps only load when scrolled into view

### 🔜 Phase 5 (Next Up)

- Lighthouse 90+ performance score
- WCAG AA accessibility audit
- SEO meta tags, sitemap, robots.txt
- Production domain deployment (timberandthreadsretreat.com)

---

## Video Footage Assets

### Drone Clips (5 files, ~15 min raw footage)

| File | Duration | Size | Notes |
|------|----------|------|-------|
| DJI_0014.MP4 | 2:34 | 665MB | |
| DJI_0015.MP4 | 2:14 | 578MB | |
| DJI_0016.MP4 | 1:51 | 479MB | |
| DJI_0017.MP4 | 2:38 | 681MB | |
| DJI_0018_fixed.MP4 | 5:50 | 1.5GB | Fixed version |

**Location:** `../timberandthreads/drone-clips/100MEDIA/`

### Interior Clips (22 files, ~21GB)

Canon footage from inside the retreat — workspaces, bedrooms, amenities.

**Location:** `../timberandthreads/processing/resolve-ready/interior/`

### Processed for DaVinci Resolve

All footage has been transcoded to ProRes/optimized for editing:
- Drone: `../timberandthreads/processing/resolve-ready/drone/` (24GB)
- Interior: `../timberandthreads/processing/resolve-ready/interior/` (21GB)

---

## Preview Clip Options

For the client meeting, you could quickly pull together:

### Option A: Quick Drone Montage (Easiest)
Pick 3-5 best shots from drone footage, 10-15 seconds each
- Estimated time: 30-60 min in DaVinci Resolve
- Show: aerial approach, lake views, island setting

### Option B: Full 60-Second Preview (More Work)
Drone + interior clips, music bed, basic color grade
- Estimated time: 2-3 hours
- Sections: Hero drone shot → Interior walkthrough → Amenities → Drone sunset

### Option C: Raw Clip Preview (No Editing)
Just play a few raw clips during the meeting
- Zero prep time
- Show: DJI_0017 or DJI_0018 (longest, most coverage)

---

## Action Items Before Meeting

- [ ] Choose preview approach (A, B, or C above)
- [ ] Pull up current v2 preview URL from Vercel
- [ ] Have drone clips folder ready to screen share
- [ ] Note: Client will need to verify Resend domain before production email works

---

## Reminders for Meeting

1. **Domain:** timberandthreadsretreat.com already points to Vercel
2. **Email:** Resend requires SPF/DKIM DNS records (Cloudflare) before production
3. **Photos:** Feb 15 shoot photos still need sorting/editing before gallery refresh
4. **Video:** Full promo video editing is separate from website project

---

## Quick Links

- **Vercel Dashboard:** vercel.com (timber+vercel@evanmusick.dev)
- **Cloudinary:** cloudinary.com (timber+cloudinary@evanmusick.dev)
- **Cloudflare DNS:** dash.cloudflare.com (timber@evanmusick.dev)
