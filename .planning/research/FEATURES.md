# Feature Landscape

**Domain:** Retreat Center / Small Business Hospitality Website
**Researched:** 2026-02-16
**Confidence:** MEDIUM

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Mobile-responsive design** | 70%+ of travelers book from mobile devices; 52% of global web traffic is mobile | Medium | Must work perfectly on phones/tablets. Critical for older demographic who increasingly use mobile |
| **Professional photography** | Visual proof of quality; users judge in <1 second | Low | High-res images of rooms, facilities, lake views, quilting spaces. Professional = non-negotiable |
| **Clear contact information** | Users leave if they can't find contact info easily | Low | Phone, email, address visible on every page (especially header/footer) |
| **Location & directions** | Essential for trip planning; proximity to airports/amenities reassures guests | Low | Embedded Google Maps, written directions, distance to airports/hospitals |
| **Availability calendar** | Transparency builds trust; reduces inquiry volume | Medium | Real-time updates showing booked/available dates |
| **Pricing information** | Users expect transparency; hiding prices creates friction | Low | Clear pricing (per night, group rates), deposit requirements, what's included |
| **Room/facility details** | Users need to visualize the space and understand amenities | Low | Bedroom count, bathrooms, kitchen, capacity, sleeping arrangements |
| **Photo gallery** | Users expect visual proof before committing | Low-Medium | Grid or masonry layout with lazy-loading, organized by category (rooms, facilities, lake, events) |
| **About/story section** | Establishes trust and personal connection | Low | Who runs it, why it exists, what makes it special |
| **Social proof (reviews/testimonials)** | 95% read reviews before booking; 72% say positive reviews increase trust | Low | Google Reviews integration or testimonial quotes with photos |
| **Fast load times** | Users leave if site is slow; impacts SEO | Medium | Optimized images, lazy-loading, Core Web Vitals compliance |

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Virtual tour (360° or video)** | Helps guests visualize experience; transports viewers to location | Medium | Video walkthrough of island, lakefront, quilting studio with design walls |
| **Nearby quilt shop directory** | Quilters value proximity to fabric/supply shops | Low | List of shops within 30min-2hrs with links/addresses |
| **Detailed amenity showcase** | Highlights specialized quilting features that competitors lack | Low | 75-foot design walls, cutting stations with mats/rulers, irons, comfortable chairs |
| **Event calendar/workshop schedule** | Shows active community; attracts repeat visitors | Low-Medium | Public calendar of hosted workshops, open retreat dates |
| **Meal options transparency** | Reduces friction for groups with dietary needs | Low | Clear description of meal packages, dietary accommodations |
| **Guest photo gallery** | Shows real events, builds community feeling | Low | Photos from past retreats (with permission), happy guests crafting |
| **Itinerary examples** | Helps first-time retreat planners visualize their experience | Low | Sample day-by-day schedule (arrival, sewing time, meals, social) |
| **Group booking guide** | Reduces inquiry volume; empowers organizers | Low | How to plan, what to bring, tips for first-time organizers |
| **Weather/seasonal info** | Helps with packing and planning | Low | Best seasons to visit, typical weather, what to pack |
| **Accessibility information** | Critical for older demographic, shows consideration | Low | Stairs, mobility accommodations, bathroom accessibility |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Full online booking/payment system** | High complexity, ongoing maintenance, unnecessary for consultation-based model | Keep contact form with inquiry-to-quote workflow. Lower barrier to entry, allows custom quotes |
| **User accounts/login system** | Unnecessary complexity for a content site with no member portal | Use email-based inquiry system. Simpler, more appropriate for small business |
| **Live chat widget** | Resource-intensive to staff; older demographic prefers phone/email | Prominent phone number and contact form. Matches existing workflow |
| **Blog with frequent updates** | Time-consuming to maintain; creates staleness if not updated | Static "Tips for Planning" or "What to Bring" pages. Timeless content, no maintenance burden |
| **Online store for merchandise** | Scope creep; not core business | Focus on retreat booking. Could add external link to Etsy/Shopify if needed later |
| **Social media feeds** | Can look stale if not actively maintained; Facebook already exists | Static social links in footer. Avoids embedding stale feeds |
| **Automated availability sync** | Over-engineering for manual Google Calendar management | Embed public Google Calendar. Free, works with existing process |
| **Multi-language support** | Unnecessary for rural Missouri demographic | English only. Can reassess if international interest develops |
| **Newsletter subscription** | Requires consistent content creation and email marketing | Use Facebook for updates (already established). Lower maintenance |
| **Booking deposit processing** | PCI compliance, payment gateway fees, security concerns | Handle deposits via phone/email after inquiry. Maintains personal touch |

## Feature Dependencies

```
Mobile-responsive design
    └──enables──> All other features (foundational)

Professional photography
    └──requires──> Photo gallery
    └──enables──> Virtual tour

Availability calendar
    └──enhanced by──> Event calendar/workshop schedule

Social proof (reviews)
    └──enhanced by──> Guest photo gallery

Clear contact info
    └──required for──> Inquiry-to-quote workflow
    └──reduces need for──> Live chat

Location & directions
    └──enhanced by──> Nearby quilt shop directory
    └──enhanced by──> Weather/seasonal info

Room/facility details
    └──enhanced by──> Detailed amenity showcase
    └──enhanced by──> Accessibility information
    └──enhanced by──> Professional photography
```

### Dependency Notes

- **Mobile-responsive design is foundational:** All features must work on mobile. Build mobile-first.
- **Professional photography enables multiple features:** Gallery, virtual tour, room details all depend on quality images.
- **Availability calendar + Event calendar:** Can be same Google Calendar with different views (availability vs scheduled workshops).
- **Contact form is cornerstone of workflow:** Anti-features like online booking system would conflict with this established process.
- **Accessibility info enhances room details:** Natural fit to include accessibility in facility descriptions.

## MVP Recommendation

### Launch With (v1)

Prioritize these features for initial launch:

1. **Mobile-responsive design** — Foundational; 70%+ of traffic will be mobile
2. **Professional photography** — Critical first impression; enables gallery and room details
3. **Photo gallery** — Table stakes for visual proof; organized by category
4. **Clear contact information** — Visible phone/email on every page
5. **Availability calendar** — Embedded Google Calendar (free, matches current workflow)
6. **Pricing information** — Transparent rates, deposit requirements, what's included
7. **Room/facility details** — Bedroom count, capacity, amenities, quilting features
8. **Location & directions** — Embedded Google Maps, written directions
9. **About/story section** — Builds trust and personal connection
10. **Contact form** — Inquiry-to-quote workflow (matches current process)
11. **Social proof** — Initial testimonials (3-5 quotes) with plan to add Google Reviews widget
12. **Fast load times** — Optimized images, lazy-loading galleries

**Rationale:** These features cover all table stakes and enable the core inquiry-to-quote workflow. Avoid over-engineering (no booking system, no user accounts). Focus on what converts: beautiful photos, clear pricing, easy contact.

### Add After Validation (v1.x)

Features to add once core site is working and generating inquiries:

- **Detailed amenity showcase** — Expand facility details with quilting-specific features (design walls, cutting stations)
- **Nearby quilt shop directory** — Value-add for quilters planning their trip
- **Guest photo gallery** — Once permission system established, showcase real retreats
- **Itinerary examples** — Help first-time organizers visualize their retreat
- **Group booking guide** — Reduce repetitive inquiry questions with comprehensive guide
- **Accessibility information** — Important for older demographic; add to facility details
- **Weather/seasonal info** — Helpful for packing/planning

**Trigger:** Add these when receiving 5+ inquiries/month and feedback indicates need.

### Future Consideration (v2+)

Features to defer until product-market fit is established:

- **Virtual tour (360° or video)** — HIGH value but MEDIUM complexity. Wait until budget allows professional videography.
- **Event calendar/workshop schedule** — If transitioning from private retreats to public workshops.
- **Multi-language support** — Only if international interest develops.

**Trigger:** Virtual tour when revenue supports $2-5K investment. Event calendar if business model shifts to public workshops.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Mobile-responsive design | HIGH | MEDIUM | P1 |
| Professional photography | HIGH | LOW-MEDIUM (outsource) | P1 |
| Photo gallery | HIGH | LOW | P1 |
| Clear contact info | HIGH | LOW | P1 |
| Availability calendar (Google) | HIGH | LOW | P1 |
| Pricing information | HIGH | LOW | P1 |
| Room/facility details | HIGH | LOW | P1 |
| Location & directions | HIGH | LOW | P1 |
| About/story section | HIGH | LOW | P1 |
| Contact form | HIGH | LOW | P1 |
| Social proof (testimonials) | HIGH | LOW | P1 |
| Fast load times | HIGH | MEDIUM | P1 |
| Detailed amenity showcase | MEDIUM | LOW | P2 |
| Nearby quilt shop directory | MEDIUM | LOW | P2 |
| Guest photo gallery | MEDIUM | LOW | P2 |
| Itinerary examples | MEDIUM | LOW | P2 |
| Group booking guide | MEDIUM | LOW | P2 |
| Accessibility information | MEDIUM | LOW | P2 |
| Weather/seasonal info | MEDIUM | LOW | P2 |
| Virtual tour (video) | HIGH | MEDIUM-HIGH | P3 |
| Event calendar/workshops | MEDIUM | MEDIUM | P3 |
| Online booking system | LOW (conflicts with workflow) | HIGH | NEVER |
| User accounts | LOW | HIGH | NEVER |
| Live chat | LOW | HIGH | NEVER |

**Priority key:**
- **P1: Must have for launch** — Core functionality, table stakes
- **P2: Should have, add when possible** — Enhances experience, differentiates
- **P3: Nice to have, future consideration** — High value but can wait for budget/need
- **NEVER: Anti-features** — Deliberately excluded to avoid complexity

## Accessibility Design Notes (Older Demographic)

Given the target audience (quilters, older demographic, not tech-savvy), these design principles apply across all features:

### Typography & Readability
- **Minimum 16px font size** (preferably 18px for body text)
- **Clear, readable fonts** (avoid decorative fonts for body text)
- **High contrast text** (dark text on light backgrounds)
- **Shorter paragraphs** with clear headings
- **Bullet points and lists** for scannable content

### Navigation & Interaction
- **Simple, intuitive menus** with clear labels
- **Large, clickable buttons** (minimum 44x44px touch targets)
- **Clear visual hierarchy** (most important info stands out)
- **Minimal clicks to key info** (contact, pricing, availability)
- **Breadcrumbs for navigation context**

### Visual Design
- **Whitespace for breathing room** (avoid visual clutter)
- **One primary action per section** (reduce cognitive load)
- **Consistent layout patterns** (predictable structure)
- **Clear calls-to-action** ("Call to Inquire", "View Availability")

### Multimedia
- **Alt text for all images** (screen reader support)
- **Captions for videos** (if added in v2+)
- **Lazy-loading for galleries** (performance without sacrificing quality)

### Mobile Considerations
- **Touch-friendly interface** (no hover-only interactions)
- **Readable text without zooming**
- **Scrollable galleries** (swipe gestures)
- **Click-to-call phone numbers** (instant action on mobile)

**Standard:** Aim for WCAG AA conformance minimum, with AAA for text contrast where possible.

## Competitor Feature Analysis

Based on research of quilting retreat centers and small hospitality businesses:

| Feature | Typical Competitors | Our Approach | Advantage |
|---------|-------------------|--------------|-----------|
| **Photography** | Mixed quality, often amateur | Professional photos of lake, island, facilities | Stronger first impression |
| **Availability** | Phone-only, unclear calendars | Embedded Google Calendar (real-time) | Transparency builds trust |
| **Amenities** | Generic lists | Quilting-specific details (design walls, cutting stations) | Shows understanding of quilter needs |
| **Pricing** | Often hidden, call-for-quote | Transparent pricing on site | Reduces friction, filters serious inquiries |
| **Location info** | Address only | Map + directions + nearby quilt shops | Helps trip planning |
| **Guest photos** | Rare | Past retreat photos with permission | Social proof + community feeling |
| **Accessibility** | Rarely mentioned | Clear accessibility information | Shows consideration for older guests |
| **Booking** | Mix of complex systems or phone-only | Simple contact form → personal quote | Matches current workflow, maintains personal touch |
| **Mobile experience** | Often poor | Mobile-first design | Meets users where they are (70%+ mobile) |

**Our differentiator:** Professional presentation with personal touch. Not over-engineered (no booking system), not under-invested (quality photos, clear info).

## Sources

### Retreat Center Features
- [12 Key Features to Make Your Retreat Websites a Success](https://basundari.com/retreat-websites/) — MEDIUM confidence (WebSearch verified)
- [What Makes A Great Retreat? Essential Retreat Center Amenities](https://www.wcrc.info/blog/retreat-center-amenities-to-consider/) — MEDIUM confidence

### Hospitality Website Best Practices
- [Digital Marketing Hospitality 2026 Guide for Hotels](https://www.digileapservices.com/digital-marketing-hospitality-2026/) — MEDIUM confidence
- [35 Stunning Hotel Website Design Examples in 2025](https://hoteltechreport.com/news/hotel-website-designs) — MEDIUM confidence

### Vacation Rental Features
- [8 Features Your Vacation Rental Website Needs to Succeed](https://blog.usewebready.com/features-vacation-rental-website-needs/) — MEDIUM confidence
- [10 Vital Elements of an Effective Vacation Rental Website](https://leadgenapp.io/10-vital-elements-of-an-effective-vacation-rental-website/) — MEDIUM confidence

### Quilting Retreat Centers (Competitor Analysis)
- [Quilting Events at Stitchin Heaven](https://stitchinheaven.com/pages/the-retreat-center-and-the-cottages) — HIGH confidence (actual competitor)
- [1847 Quilt Retreat Center](https://1847quiltretreatcenter.com/) — HIGH confidence (actual competitor)
- [Camellia Palms Retreat Center](https://www.camelliapalmsretreat.com/) — HIGH confidence (actual competitor)

### Older Demographic Accessibility
- [Web Accessibility for Older Adults: Inclusive Design](https://www.levelaccess.com/blog/ensuring-web-accessibility-for-older-adults/) — MEDIUM confidence
- [W3C: Older Users and Web Accessibility](https://www.w3.org/WAI/older-users/) — HIGH confidence (official standards)
- [Creating a User-Friendly Website Experience for Seniors](https://www.winwithmcclatchy.com/blog/user-friendly-websites-for-seniors) — MEDIUM confidence

### Small Business Website Best Practices
- [Study: 20 Most Common Small Business Website Mistakes](https://gillandrews.com/common-website-mistakes-small-business/) — MEDIUM confidence
- [8 Common Website Design Mistakes to Avoid in 2026](https://www.zachsean.com/post/8-common-website-design-mistakes-to-avoid-in-2026-for-better-conversions-and-user-experience) — MEDIUM confidence

### Google Calendar Integration
- [Google Calendar Help: Add a calendar to your website](https://support.google.com/calendar/answer/41207?hl=en) — HIGH confidence (official docs)
- [How to Embed Google Calendar](https://www.fillout.com/blog/embed-a-google-calendar) — MEDIUM confidence

### Contact Form vs Booking System
- [What is a Booking Form? Smoother reservation process](https://hocoos.com/answers/what-is-a-booking-form/) — MEDIUM confidence
- [How to Create a Booking Form](https://www.oncehub.com/blog/how-to-create-a-booking-form-and-smarter-alternatives-that-save-you-time) — MEDIUM confidence

### Reviews & Testimonials
- [Why Customer Reviews Are Important for Small Businesses](https://www.allbusiness.com/why-customer-reviews-are-important) — MEDIUM confidence
- [The Importance of Testimonials for Small Business](https://smith.ai/blog/the-importance-of-testimonials-and-case-studies-for-small-business) — MEDIUM confidence

### Photo Gallery Best Practices
- [Photo Gallery Best Practices: Let Your Work Shine](https://www.hostgator.com/blog/photo-gallery-best-practices/) — MEDIUM confidence

---
*Feature research for: Timber & Threads Quilting Retreat*
*Researched: 2026-02-16*
*Overall confidence: MEDIUM (WebSearch + competitor analysis + official docs)*
