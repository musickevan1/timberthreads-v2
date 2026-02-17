// ============================================================
// Cloudinary URL helpers
// Update CLOUD_NAME when real Cloudinary account is configured
// ============================================================

export const CLOUD_NAME = 'timberandthreads';

/**
 * Build a full Cloudinary image URL with arbitrary transforms.
 */
export function cloudinaryUrl(publicId: string, transforms: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

/**
 * Square thumbnail crop using AI-gravity fill — ideal for gallery grids.
 * Default size: 400×400 px.
 */
export function thumbUrl(publicId: string, size = 400): string {
  return cloudinaryUrl(publicId, `c_fill,g_auto,w_${size},h_${size}/f_auto/q_auto`);
}

/**
 * Full-size image for lightbox display.
 * Default max width: 2000 px.
 */
export function fullUrl(publicId: string, maxWidth = 2000): string {
  return cloudinaryUrl(publicId, `w_${maxWidth}/f_auto/q_auto`);
}

/**
 * Single-width variant for use in responsive srcset strings.
 */
export function srcsetUrl(publicId: string, width: number): string {
  return cloudinaryUrl(publicId, `w_${width}/f_auto/q_auto`);
}

// ============================================================
// TypeScript types
// ============================================================

export type GalleryCategory = 'facility' | 'quilting';

export interface GalleryImage {
  id: string;
  cloudinaryPublicId: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  category: GalleryCategory;
  order?: number;
}

// ============================================================
// Hardcoded image data
// Dimensions are placeholder DSLR typical (3:2 landscape).
// Replace with real dimensions when photos are uploaded to Cloudinary.
// ============================================================

export const galleryImages: GalleryImage[] = [
  // --- Facility ---
  {
    id: 'facility-1',
    cloudinaryPublicId: 'retreat/facility/front-view',
    width: 4000,
    height: 2667,
    alt: 'Front view of the Timber & Threads Retreat building surrounded by Ozark trees',
    caption: 'The retreat nestled among the trees on a private Missouri Ozarks island',
    category: 'facility',
    order: 1,
  },
  {
    id: 'facility-2',
    cloudinaryPublicId: 'retreat/facility/workspace',
    width: 4000,
    height: 2667,
    alt: 'Spacious quilting workspace with long tables and natural light',
    caption: 'Generous workspace with plenty of room to spread out your projects',
    category: 'facility',
    order: 2,
  },
  {
    id: 'facility-3',
    cloudinaryPublicId: 'retreat/facility/common-area',
    width: 4000,
    height: 2667,
    alt: 'Cozy common area with comfortable seating and rustic wood decor',
    caption: 'Relax and connect with fellow crafters in the welcoming common area',
    category: 'facility',
    order: 3,
  },
  {
    id: 'facility-4',
    cloudinaryPublicId: 'retreat/facility/entrance-driveway',
    width: 4000,
    height: 2667,
    alt: 'Tree-lined entrance driveway leading to the retreat property',
    caption: 'Arriving at the retreat — a peaceful drive through the Ozark forest',
    category: 'facility',
    order: 4,
  },

  // --- Quilting ---
  {
    id: 'quilting-1',
    cloudinaryPublicId: 'retreat/quilting/quilt-display-1',
    width: 4000,
    height: 2667,
    alt: 'Colorful handmade quilt displayed on a wooden wall inside the retreat',
    caption: 'Hand-stitched quilts created by retreat guests on display throughout the space',
    category: 'quilting',
    order: 1,
  },
  {
    id: 'quilting-2',
    cloudinaryPublicId: 'retreat/quilting/quilt-display-2',
    width: 4000,
    height: 2667,
    alt: 'Vibrant patchwork quilt with traditional Missouri star pattern',
    caption: 'Traditional star-pattern quilt celebrating Missouri crafting heritage',
    category: 'quilting',
    order: 2,
  },
  {
    id: 'quilting-3',
    cloudinaryPublicId: 'retreat/quilting/quilt-display-3',
    width: 4000,
    height: 2667,
    alt: 'Detail shot of intricate hand-quilted stitching on a nature-themed quilt',
    caption: 'Intricate hand-stitching — the details that make each quilt a treasure',
    category: 'quilting',
    order: 3,
  },
  {
    id: 'quilting-4',
    cloudinaryPublicId: 'retreat/quilting/quilt-workspace',
    width: 4000,
    height: 2667,
    alt: 'Quilting workspace with sewing machines, fabric bolts, and tools arranged on tables',
    caption: 'Fully equipped quilting stations ready for your creative sessions',
    category: 'quilting',
    order: 4,
  },
];

// ============================================================
// Filtered, sorted category exports
// ============================================================

export const facilityImages: GalleryImage[] = galleryImages
  .filter((img) => img.category === 'facility')
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const quiltingImages: GalleryImage[] = galleryImages
  .filter((img) => img.category === 'quilting')
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
