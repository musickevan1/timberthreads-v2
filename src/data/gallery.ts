// ============================================================
// Gallery Data - Local Images with Astro Optimization
// ============================================================

import type { ImageMetadata } from 'astro';

// Import existing gallery images
import heroFrontView from '../assets/images/hero-front-view-cropped.jpg';
import entranceDriveway from '../assets/images/entrance-driveway-summer.jpg';
import workspace from '../assets/images/workspace.jpeg';
import commonArea from '../assets/images/common-area.jpeg';
import quiltDisplay1 from '../assets/images/quilt-display-1-cropped.jpg';
import quiltDisplay2 from '../assets/images/quilt-display-2-cropped.jpg';
import quiltDisplay3 from '../assets/images/quilt-display-3.jpeg';
import quiltWorkspace from '../assets/images/quilt-workspace.jpeg';

// Import v2 gallery images
import v2QuiltingWorkspace from '../assets/images/v2-quilting-workspace.jpg';
import v2BedroomQuiltedBedding from '../assets/images/v2-bedroom-quilted-bedding.jpg';
import v2BedroomQuiltsHangings from '../assets/images/v2-bedroom-quilts-hangings.jpg';
import v2CommonAreaSectional from '../assets/images/v2-common-area-sectional.jpg';
import v2DiningWorkArea from '../assets/images/v2-dining-work-area.jpg';
import v2WorkspaceBrightWindows from '../assets/images/v2-workspace-bright-windows.jpg';
import v2BedroomTwinBeds from '../assets/images/v2-bedroom-twin-beds.jpg';
import v2OutdoorGrounds from '../assets/images/v2-outdoor-grounds.jpg';
import v2EntranceGate from '../assets/images/v2-entrance-gate.jpg';
import v2ExteriorDriveway from '../assets/images/v2-exterior-driveway.jpg';

// ============================================================
// TypeScript types
// ============================================================

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

// ============================================================
// Gallery image data — organized as a property tour
// ============================================================

export const galleryImages: GalleryImage[] = [
  // --- Property: Arrival and shared spaces ---
  {
    id: 'property-1',
    image: v2EntranceGate,
    alt: 'Timber & Threads entrance gate with hand-painted quilt barn sign, flanked by stone pillars and winter trees',
    caption: 'Welcome to Timber & Threads — the quilt barn sign marks the entrance to your creative getaway',
    category: 'property',
    order: 1,
    cropPosition: '50% 50%',
  },
  {
    id: 'property-2',
    image: v2OutdoorGrounds,
    alt: 'Spacious retreat grounds with mature oak trees, gravel driveway, and open blue sky on a sunny day',
    caption: 'Acres of peaceful Ozarks grounds with towering oaks and wide-open sky',
    category: 'property',
    order: 2,
    cropPosition: '50% 40%',
  },
  {
    id: 'property-3',
    image: v2ExteriorDriveway,
    alt: 'Gravel driveway winding through the retreat property on a warm summer day',
    caption: 'The driveway leads you through the property to the retreat building',
    category: 'property',
    order: 3,
    cropPosition: '50% 50%',
  },
  {
    id: 'property-4',
    image: heroFrontView,
    alt: 'Front view of the Timber & Threads Retreat building surrounded by Ozark trees',
    caption: 'The retreat nestled among the trees on a private Missouri Ozarks island',
    category: 'property',
    order: 4,
    cropPosition: '50% 45%',
  },
  {
    id: 'property-5',
    image: entranceDriveway,
    alt: 'Scenic grounds with mature oak trees, gravel driveway, and lush green lawn',
    caption: 'The peaceful retreat grounds — mature trees, open lawn, and a winding path to the island',
    category: 'property',
    order: 5,
  },
  {
    id: 'property-6',
    image: v2CommonAreaSectional,
    alt: 'Cozy common area with large sectional sofa, handmade quilts on walls, and a vintage tool chest accent piece',
    caption: 'Relax in the spacious common area — quilts and comfort everywhere you look',
    category: 'property',
    order: 6,
    cropPosition: '50% 60%',
  },
  {
    id: 'property-7',
    image: commonArea,
    alt: 'Cozy common area with comfortable seating and rustic wood decor',
    caption: 'Relax and connect with fellow crafters in the welcoming common area',
    category: 'property',
    order: 7,
    cropPosition: '50% 55%',
  },
  {
    id: 'property-8',
    image: v2DiningWorkArea,
    alt: 'Bright dining and work area with tables arranged for group activities, quilts on display, and natural light streaming through windows',
    caption: 'Gather around the tables for meals, crafting, or conversation',
    category: 'property',
    order: 8,
    cropPosition: '50% 55%',
  },

  // --- Bedrooms: Settle in ---
  {
    id: 'bedrooms-1',
    image: v2BedroomQuiltedBedding,
    alt: 'Bedroom with comfortable beds dressed in handmade quilted bedding, colorful quilts decorating the walls',
    caption: 'Sleep surrounded by handcrafted quilts — every room tells a creative story',
    category: 'bedrooms',
    order: 1,
    cropPosition: '50% 55%',
  },
  {
    id: 'bedrooms-2',
    image: v2BedroomQuiltsHangings,
    alt: 'Bedroom with cozy beds and an array of quilted wall hangings in vibrant patterns',
    caption: 'Vibrant quilt art adorns the walls of each bedroom',
    category: 'bedrooms',
    order: 2,
    cropPosition: '50% 50%',
  },
  {
    id: 'bedrooms-3',
    image: v2BedroomTwinBeds,
    alt: 'Bedroom with twin beds, quilted bedspreads, and a sunny window overlooking the property',
    caption: 'Twin beds with quilted bedspreads and a peaceful view',
    category: 'bedrooms',
    order: 3,
    cropPosition: '50% 60%',
  },

  // --- Workspaces: Create ---
  {
    id: 'workspaces-1',
    image: v2QuiltingWorkspace,
    alt: 'Quilting workspace with a large cutting mat table, organized supplies, and quilts displayed on the walls',
    caption: 'Dedicated cutting and quilting workspace with everything you need to create',
    category: 'workspaces',
    order: 1,
    cropPosition: '50% 45%',
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
    cropPosition: '50% 50%',
  },
  {
    id: 'workspaces-4',
    image: quiltWorkspace,
    alt: 'Quilting workspace with sewing machines, fabric bolts, and tools arranged on tables',
    caption: 'Fully equipped quilting stations ready for your creative sessions',
    category: 'workspaces',
    order: 4,
    cropPosition: '50% 55%',
  },

  // --- Quilts: Handmade creations ---
  {
    id: 'quilts-1',
    image: quiltDisplay1,
    alt: 'Colorful handmade quilt with traditional star pattern in warm autumn tones',
    caption: 'A traditional star-pattern quilt in warm autumn tones — handcrafted at the retreat',
    category: 'quilts',
    order: 1,
  },
  {
    id: 'quilts-2',
    image: quiltDisplay2,
    alt: 'Quilted tree design with geometric leaf canopy in teal, olive, orange, and pink',
    caption: 'A geometric tree quilt — bold colors and precise piecing create a striking design',
    category: 'quilts',
    order: 2,
  },
  {
    id: 'quilts-3',
    image: quiltDisplay3,
    alt: 'Cheerful quilted fabric panels with flower vase designs in pink, blue, and green',
    caption: 'Playful flower vase panels — vibrant colors and whimsical applique',
    category: 'quilts',
    order: 4,
  },
];

// NOTE: 58 DSLR photos in v2-gallery/jpg/ are underexposed/dark
// and need professional color grading before use.
// Best candidates once edited: IMG_4220 (bathroom), IMG_4230 (kitchen),
// IMG_4246 (bedroom with blue/white quilt wall art)

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

export const quiltImages: GalleryImage[] = galleryImages
  .filter((img) => img.category === 'quilts')
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
