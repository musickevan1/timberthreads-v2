---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/assets/images/v2-outdoor-grounds.jpg
  - src/assets/images/v2-entrance-gate.jpg
  - src/data/gallery.ts
autonomous: true
requirements: [GALLERY-IMPROVE]

must_haves:
  truths:
    - "Gallery Property section includes outdoor grounds photo showing mature trees and blue sky"
    - "Gallery Property section includes entrance gate photo with quilt barn sign"
    - "Gallery Property section includes exterior driveway photo (already in assets, now wired)"
    - "Property images flow in a natural tour order: entrance gate -> grounds -> exterior -> building front -> common areas"
    - "All gallery images have descriptive, specific alt text and captions"
  artifacts:
    - path: "src/assets/images/v2-outdoor-grounds.jpg"
      provides: "Outdoor grounds photo (from IMG_0868)"
    - path: "src/assets/images/v2-entrance-gate.jpg"
      provides: "Entrance gate photo with quilt barn sign (from IMG_4269)"
    - path: "src/data/gallery.ts"
      provides: "Updated gallery data with 3 new Property images and reordered tour flow"
      contains: "v2OutdoorGrounds"
  key_links:
    - from: "src/data/gallery.ts"
      to: "src/assets/images/v2-outdoor-grounds.jpg"
      via: "import statement"
      pattern: "import.*v2-outdoor-grounds"
    - from: "src/data/gallery.ts"
      to: "src/assets/images/v2-entrance-gate.jpg"
      via: "import statement"
      pattern: "import.*v2-entrance-gate"
    - from: "src/data/gallery.ts"
      to: "src/assets/images/v2-exterior-driveway.jpg"
      via: "import statement"
      pattern: "import.*v2-exterior-driveway"
---

<objective>
Add 3 new Property images to the gallery and reorder Property section for a natural "property tour" flow.

Purpose: The Property gallery currently has 5 images focused on indoor common areas and one building exterior. Adding the outdoor grounds shot (IMG_0868), entrance gate with quilt barn sign (IMG_4269), and the already-imported-but-unused v2-exterior-driveway.jpg creates a complete arrival-to-interior tour experience (8 Property images total).

Output: Updated gallery.ts with 3 additional Property images, reordered for natural tour flow. Two new optimized images in src/assets/images/.
</objective>

<execution_context>
@/home/evan/.claude/get-shit-done/workflows/execute-plan.md
@/home/evan/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/data/gallery.ts
@src/assets/images/ (v2-exterior-driveway.jpg exists but is NOT imported in gallery.ts)
</context>

<interfaces>
<!-- From src/data/gallery.ts — the executor needs these types -->

```typescript
export type GalleryCategoryName = 'property' | 'bedrooms' | 'workspaces' | 'quilts';

export interface GalleryImage {
  id: string;
  image: ImageMetadata;
  alt: string;
  caption: string;
  category: GalleryCategoryName;
  order?: number;
  /** CSS object-position for thumbnail cropping (default: 'center') */
  cropPosition?: string;
}
```

<!-- Existing import pattern for v2 images: -->
```typescript
import v2QuiltingWorkspace from '../assets/images/v2-quilting-workspace.jpg';
```
</interfaces>

<tasks>

<task type="auto">
  <name>Task 1: Copy, auto-orient, and optimize new gallery images</name>
  <files>src/assets/images/v2-outdoor-grounds.jpg, src/assets/images/v2-entrance-gate.jpg</files>
  <action>
Copy two new images into src/assets/images/ with proper naming, auto-orient, and resize for web:

1. Outdoor grounds (IMG_0868.jpg — 2664x2038, 2.6MB phone photo):
   ```bash
   magick v2-gallery/IMG_0868.jpg -auto-orient -resize '2400x>' -quality 85 src/assets/images/v2-outdoor-grounds.jpg
   ```
   This is a landscape shot of mature trees, driveway, blue sky. Already landscape orientation (2664x2038) so auto-orient is just a safety check. Resize to max 2400px wide (Astro will further optimize at build time).

2. Entrance gate with quilt barn sign (IMG_4269.jpg — 6024x4020, 11.6MB DSLR photo):
   ```bash
   magick v2-gallery/jpg/IMG_4269.jpg -auto-orient -resize '2400x>' -quality 85 src/assets/images/v2-entrance-gate.jpg
   ```
   This is a winter outdoor shot of the property entrance with the quilt barn sign and address visible. The 6024px DSLR original is way too large -- resize down to 2400px max width to match other gallery images. Quality 85 balances file size with visual quality.

Do NOT copy any of the dark/underexposed jpg/ interior shots. Those need professional color grading before use.

Note: v2-exterior-driveway.jpg already exists in src/assets/images/ (4032x3024, 5.4MB) -- it was imported during a previous phase but never added to gallery.ts. No copy needed, but it is oversized. Resize it in place:
   ```bash
   magick src/assets/images/v2-exterior-driveway.jpg -auto-orient -resize '2400x>' -quality 85 src/assets/images/v2-exterior-driveway.jpg
   ```
  </action>
  <verify>
    <automated>ls -la src/assets/images/v2-outdoor-grounds.jpg src/assets/images/v2-entrance-gate.jpg src/assets/images/v2-exterior-driveway.jpg && identify src/assets/images/v2-outdoor-grounds.jpg && identify src/assets/images/v2-entrance-gate.jpg && identify src/assets/images/v2-exterior-driveway.jpg</automated>
  </verify>
  <done>Three images exist in src/assets/images/: v2-outdoor-grounds.jpg, v2-entrance-gate.jpg, and v2-exterior-driveway.jpg (resized). All are max 2400px wide.</done>
</task>

<task type="auto">
  <name>Task 2: Update gallery.ts — add 3 Property images, reorder for tour flow, improve captions</name>
  <files>src/data/gallery.ts</files>
  <action>
Update src/data/gallery.ts with the following changes:

**1. Add 3 new imports** (after existing v2 imports, around line 24):
```typescript
import v2OutdoorGrounds from '../assets/images/v2-outdoor-grounds.jpg';
import v2EntranceGate from '../assets/images/v2-entrance-gate.jpg';
import v2ExteriorDriveway from '../assets/images/v2-exterior-driveway.jpg';
```

**2. Reorganize the Property section** for a natural arrival tour. Reorder and renumber the `order` fields. The new sequence should be:

```
order 1: v2EntranceGate — Entrance gate with quilt barn sign (NEW)
  id: 'property-1'
  alt: 'Timber & Threads entrance gate with hand-painted quilt barn sign, flanked by stone pillars and winter trees'
  caption: 'Welcome to Timber & Threads — the quilt barn sign marks the entrance to your creative getaway'
  cropPosition: '50% 50%'

order 2: v2OutdoorGrounds — Outdoor grounds, mature trees (NEW)
  id: 'property-2'
  alt: 'Spacious retreat grounds with mature oak trees, gravel driveway, and open blue sky on a sunny day'
  caption: 'Acres of peaceful Ozarks grounds with towering oaks and wide-open sky'
  cropPosition: '50% 40%'

order 3: v2ExteriorDriveway — Exterior driveway view (EXISTING IMAGE, NEW TO GALLERY)
  id: 'property-3'
  alt: 'Gravel driveway winding through the retreat property on a warm summer day'
  caption: 'The driveway leads you through the property to the retreat building'
  cropPosition: '50% 50%'

order 4: heroFrontView — Front view of building (EXISTING, was order 1)
  id: 'property-4'
  alt: (keep existing)
  caption: (keep existing)
  cropPosition: '50% 45%' (keep existing)

order 5: entranceDriveway — Entrance driveway summer (EXISTING, was order 2)
  id: 'property-5'
  alt: (keep existing)
  caption: (keep existing)

order 6: v2CommonAreaSectional — Common area (EXISTING, was order 3)
  id: 'property-6'
  alt: (keep existing)
  caption: (keep existing)
  cropPosition: '50% 60%' (keep existing)

order 7: commonArea — Common area original (EXISTING, was order 4)
  id: 'property-7'
  alt: (keep existing)
  caption: (keep existing)
  cropPosition: '50% 55%' (keep existing)

order 8: v2DiningWorkArea — Dining/work area (EXISTING, was order 5)
  id: 'property-8'
  alt: (keep existing)
  caption: (keep existing)
  cropPosition: '50% 55%' (keep existing)
```

This creates a natural tour: gate entrance -> outdoor grounds -> driveway approach -> building front -> summer entrance -> then step inside to common area -> alternate common area angle -> dining/work area.

**3. Keep Bedrooms, Workspaces, and Quilts sections unchanged.**

**4. Update the TODO comment** at the bottom (around line 187). Remove the "Future outdoor photos to add" TODO since we have now added outdoor shots. Replace with a note about dark photos needing editing:

```typescript
// NOTE: 58 DSLR photos in v2-gallery/jpg/ are underexposed/dark
// and need professional color grading before use.
// Best candidates once edited: IMG_4220 (bathroom), IMG_4230 (kitchen),
// IMG_4246 (bedroom with blue/white quilt wall art)
```
  </action>
  <verify>
    <automated>cd /home/evan/Projects/clients/timberandthreads-v2 && npx astro check 2>&1 | tail -20 && grep -c "category: 'property'" src/data/gallery.ts</automated>
  </verify>
  <done>gallery.ts has 8 Property images (was 5) in natural tour order (gate -> grounds -> driveway -> building -> common areas). 3 Bedroom, 4 Workspace, 3 Quilt images unchanged (18 total). All imports resolve. astro check passes. Dark photo note replaces old TODO.</done>
</task>

</tasks>

<verification>
1. `npx astro check` passes with no errors (all imports resolve, types valid)
2. `npx astro build` succeeds (images optimized at build time)
3. Property category count is 8 (was 5), verify with: `grep -c "category: 'property'" src/data/gallery.ts`
4. Total gallery image count is 18 (was 15), verify with: `grep -c "category:" src/data/gallery.ts`
5. All three new/resized images are max 2400px wide
</verification>

<success_criteria>
- Gallery Property section expanded from 5 to 8 images
- Tour flow starts with entrance gate, moves through grounds and exterior, then into building
- v2-exterior-driveway.jpg (previously unused) is now in the gallery
- No dark/underexposed images included
- Build passes cleanly
</success_criteria>

<output>
After completion, create `.planning/quick/1-improve-and-align-gallery-review-all-v2-/1-SUMMARY.md`
</output>
