# Phase 12: Google Maps Driving Route - Context

**Gathered:** 2026-03-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the static Google Maps location pin with an interactive driving route from a nearby highway landmark to the retreat property (306 NW 300 Rd, Clinton, MO 64735). The existing two-column layout (map + text directions) stays intact. API key setup and domain restriction are included.

</domain>

<decisions>
## Implementation Decisions

### Route Origin & Path
- Route starts from the Breaktime / Golden Valley Fireworks area on Highway 7 (near NW 221 Rd intersection)
- Claude researches the exact address/coordinates for this landmark during the research phase
- Route MUST match the existing text directions: Highway 7 → NW 221 Rd → T intersection → left turn → gate → property
- Do not let Google pick an arbitrary "fastest route" — the route should follow the known-good path visitors actually take

### Text Directions & Supporting Content
- Keep all 6 text direction steps exactly as they are — rural GPS is unreliable, text is the safety net
- Keep the GPS warning callout as-is
- Keep the address "306 NW 300 Rd, Clinton, MO 64735" visible below the map
- Add an "Open in Google Maps" link so visitors can launch turn-by-turn navigation from their current location

### Map Implementation
- Use the free Google Maps Embed API (Directions mode), not the paid JavaScript API
- Roadmap view (not satellite) — clean and readable for following directions
- Keep current 4:3 aspect ratio (75% padding-top) in the existing two-column layout
- Keep current mobile stacking behavior (map above, directions below)
- Maintain the existing lazy-load pattern (IntersectionObserver on the iframe)

### API Key Setup
- Store as `PUBLIC_GOOGLE_MAPS_KEY` in environment variables
- Add to .env locally and Vercel dashboard for production
- Restrict API key to production domain in Google Cloud Console
- Key must NOT be committed to git

### Claude's Discretion
- Whether to label the starting landmark marker on the route (vs. just the route line)
- Exact styling of the "Open in Google Maps" link
- Mobile map height adjustments if 4:3 is too tall on small screens

</decisions>

<specifics>
## Specific Ideas

- The Breaktime convenience store and Golden Valley Fireworks are the known landmarks visitors use to find the turnoff from Highway 7
- The existing text directions are battle-tested — guests actually use them. The visual route supplements but doesn't replace them.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 12-google-maps-driving-route*
*Context gathered: 2026-03-02*
