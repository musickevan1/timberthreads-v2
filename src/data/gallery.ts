// ============================================================
// Gallery Data - Local Images with Astro Optimization
// ============================================================

import type { ImageMetadata } from 'astro';

// Import existing gallery images
import heroFrontView from '../assets/images/hero-front-view.jpeg';
import entranceDriveway from '../assets/images/entrance-driveway.jpeg';
import workspace from '../assets/images/workspace.jpeg';
import commonArea from '../assets/images/common-area.jpeg';
import quiltDisplay1 from '../assets/images/quilt-display-1.jpeg';
import quiltDisplay2 from '../assets/images/quilt-display-2.jpeg';
import quiltDisplay3 from '../assets/images/quilt-display-3.jpeg';
import quiltWorkspace from '../assets/images/quilt-workspace.jpeg';

// Import v2 gallery images
import v2ExteriorDriveway from '../assets/images/v2-exterior-driveway.jpg';
import v2QuiltingWorkspace from '../assets/images/v2-quilting-workspace.jpg';
import v2BedroomQuiltedBedding from '../assets/images/v2-bedroom-quilted-bedding.jpg';
import v2BedroomQuiltsHangings from '../assets/images/v2-bedroom-quilts-hangings.jpg';
import v2CommonAreaSectional from '../assets/images/v2-common-area-sectional.jpg';
import v2DiningWorkArea from '../assets/images/v2-dining-work-area.jpg';
import v2WorkspaceBrightWindows from '../assets/images/v2-workspace-bright-windows.jpg';
import v2BedroomTwinBeds from '../assets/images/v2-bedroom-twin-beds.jpg';

// ============================================================
// TypeScript types
// ============================================================

export type GalleryCategoryName = 'property' | 'bedrooms' | 'workspaces';

export interface GalleryImage {
  id: string;
  image: ImageMetadata;
  alt: string;
  caption: string;
  category: GalleryCategoryName;
  order?: number;
}

// ============================================================
// Gallery image data — organized as a property tour
// ============================================================

export const galleryImages: GalleryImage[] = [
  // --- Property: Arrival and shared spaces ---
  {
    id: 'property-1',
    image: heroFrontView,
    alt: 'Front view of the Timber & Threads Retreat building surrounded by Ozark trees',
    caption: 'The retreat nestled among the trees on a private Missouri Ozarks island',
    category: 'property',
    order: 1,
  },
  {
    id: 'property-2',
    image: v2ExteriorDriveway,
    alt: 'Tree-lined driveway and curved walkway leading to the retreat, with guest parking among the Ozark trees',
    caption: 'Arriving at the retreat — a welcoming curved walkway through the trees',
    category: 'property',
    order: 2,
  },
  {
    id: 'property-3',
    image: entranceDriveway,
    alt: 'Tree-lined entrance driveway leading to the retreat property',
    caption: 'Arriving at the retreat — a peaceful drive through the Ozark forest',
    category: 'property',
    order: 3,
  },
  {
    id: 'property-4',
    image: v2CommonAreaSectional,
    alt: 'Cozy common area with large sectional sofa, handmade quilts on walls, and a vintage tool chest accent piece',
    caption: 'Relax in the spacious common area — quilts and comfort everywhere you look',
    category: 'property',
    order: 4,
  },
  {
    id: 'property-5',
    image: commonArea,
    alt: 'Cozy common area with comfortable seating and rustic wood decor',
    caption: 'Relax and connect with fellow crafters in the welcoming common area',
    category: 'property',
    order: 5,
  },
  {
    id: 'property-6',
    image: v2DiningWorkArea,
    alt: 'Bright dining and work area with tables arranged for group activities, quilts on display, and natural light streaming through windows',
    caption: 'Gather around the tables for meals, crafting, or conversation',
    category: 'property',
    order: 6,
  },

  // --- Bedrooms: Settle in ---
  {
    id: 'bedrooms-1',
    image: v2BedroomQuiltedBedding,
    alt: 'Bedroom with comfortable beds dressed in handmade quilted bedding, colorful quilts decorating the walls',
    caption: 'Sleep surrounded by handcrafted quilts — every room tells a creative story',
    category: 'bedrooms',
    order: 1,
  },
  {
    id: 'bedrooms-2',
    image: v2BedroomQuiltsHangings,
    alt: 'Bedroom with cozy beds and an array of quilted wall hangings in vibrant patterns',
    caption: 'Vibrant quilt art adorns the walls of each bedroom',
    category: 'bedrooms',
    order: 2,
  },
  {
    id: 'bedrooms-3',
    image: v2BedroomTwinBeds,
    alt: 'Bedroom with twin beds, quilted bedspreads, and a sunny window overlooking the property',
    caption: 'Twin beds with quilted bedspreads and a peaceful view',
    category: 'bedrooms',
    order: 3,
  },

  // --- Workspaces: Create ---
  {
    id: 'workspaces-1',
    image: v2QuiltingWorkspace,
    alt: 'Quilting workspace with a large cutting mat table, organized supplies, and quilts displayed on the walls',
    caption: 'Dedicated cutting and quilting workspace with everything you need to create',
    category: 'workspaces',
    order: 1,
  },
  {
    id: 'workspaces-2',
    image: workspace,
    alt: 'Spacious quilting workspace with long tables and natural light',
    caption: 'Generous workspace with plenty of room to spread out your projects',
    category: 'workspaces',
    order: 2,
  },
  {
    id: 'workspaces-3',
    image: v2WorkspaceBrightWindows,
    alt: 'Spacious workspace with long tables, a TV for tutorials, and bright windows flooding the room with natural light',
    caption: 'Bright, airy workspace with plenty of room to spread out your projects',
    category: 'workspaces',
    order: 3,
  },
  {
    id: 'workspaces-4',
    image: quiltWorkspace,
    alt: 'Quilting workspace with sewing machines, fabric bolts, and tools arranged on tables',
    caption: 'Fully equipped quilting stations ready for your creative sessions',
    category: 'workspaces',
    order: 4,
  },
  {
    id: 'workspaces-5',
    image: quiltDisplay1,
    alt: 'Colorful handmade quilt displayed on a wooden wall inside the retreat',
    caption: 'Hand-stitched quilts created by retreat guests on display throughout the space',
    category: 'workspaces',
    order: 5,
  },
  {
    id: 'workspaces-6',
    image: quiltDisplay2,
    alt: 'Vibrant patchwork quilt with traditional Missouri star pattern',
    caption: 'Traditional star-pattern quilt celebrating Missouri crafting heritage',
    category: 'workspaces',
    order: 6,
  },
  {
    id: 'workspaces-7',
    image: quiltDisplay3,
    alt: 'Detail shot of intricate hand-quilted stitching on a nature-themed quilt',
    caption: 'Intricate hand-stitching — the details that make each quilt a treasure',
    category: 'workspaces',
    order: 7,
  },
];

// TODO: Future outdoor photos to add when available:
// - Dock on the lake (category: 'property')
// - Picnic table area (category: 'property')
// - Fire pit area (category: 'property')

// ============================================================
// Filtered, sorted category exports
// ============================================================

export const propertyImages: GalleryImage[] = galleryImages
  .filter((img) => img.category === 'property')
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const bedroomImages: GalleryImage[] = galleryImages
  .filter((img) => img.category === 'bedrooms')
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export const workspaceImages: GalleryImage[] = galleryImages
  .filter((img) => img.category === 'workspaces')
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
