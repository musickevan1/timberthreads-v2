// ============================================================
// Gallery Data - Local Images with Astro Optimization
// ============================================================

import type { ImageMetadata } from 'astro';

// Import all gallery images
import heroFrontView from '../assets/images/hero-front-view.jpeg';
import entranceDriveway from '../assets/images/entrance-driveway.jpeg';
import workspace from '../assets/images/workspace.jpeg';
import commonArea from '../assets/images/common-area.jpeg';
import quiltDisplay1 from '../assets/images/quilt-display-1.jpeg';
import quiltDisplay2 from '../assets/images/quilt-display-2.jpeg';
import quiltDisplay3 from '../assets/images/quilt-display-3.jpeg';
import quiltWorkspace from '../assets/images/quilt-workspace.jpeg';

// ============================================================
// TypeScript types
// ============================================================

export type GalleryCategoryName = 'facility' | 'quilting';

export interface GalleryImage {
  id: string;
  image: ImageMetadata;
  alt: string;
  caption: string;
  category: GalleryCategoryName;
  order?: number;
}

// ============================================================
// Gallery image data
// ============================================================

export const galleryImages: GalleryImage[] = [
  // --- Facility ---
  {
    id: 'facility-1',
    image: heroFrontView,
    alt: 'Front view of the Timber & Threads Retreat building surrounded by Ozark trees',
    caption: 'The retreat nestled among the trees on a private Missouri Ozarks island',
    category: 'facility',
    order: 1,
  },
  {
    id: 'facility-2',
    image: workspace,
    alt: 'Spacious quilting workspace with long tables and natural light',
    caption: 'Generous workspace with plenty of room to spread out your projects',
    category: 'facility',
    order: 2,
  },
  {
    id: 'facility-3',
    image: commonArea,
    alt: 'Cozy common area with comfortable seating and rustic wood decor',
    caption: 'Relax and connect with fellow crafters in the welcoming common area',
    category: 'facility',
    order: 3,
  },
  {
    id: 'facility-4',
    image: entranceDriveway,
    alt: 'Tree-lined entrance driveway leading to the retreat property',
    caption: 'Arriving at the retreat — a peaceful drive through the Ozark forest',
    category: 'facility',
    order: 4,
  },

  // --- Quilting ---
  {
    id: 'quilting-1',
    image: quiltDisplay1,
    alt: 'Colorful handmade quilt displayed on a wooden wall inside the retreat',
    caption: 'Hand-stitched quilts created by retreat guests on display throughout the space',
    category: 'quilting',
    order: 1,
  },
  {
    id: 'quilting-2',
    image: quiltDisplay2,
    alt: 'Vibrant patchwork quilt with traditional Missouri star pattern',
    caption: 'Traditional star-pattern quilt celebrating Missouri crafting heritage',
    category: 'quilting',
    order: 2,
  },
  {
    id: 'quilting-3',
    image: quiltDisplay3,
    alt: 'Detail shot of intricate hand-quilted stitching on a nature-themed quilt',
    caption: 'Intricate hand-stitching — the details that make each quilt a treasure',
    category: 'quilting',
    order: 3,
  },
  {
    id: 'quilting-4',
    image: quiltWorkspace,
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
