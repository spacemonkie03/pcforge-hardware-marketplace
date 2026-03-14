# Image Slot Audit

This audit groups the current storefront image needs by page and surface. It reflects the frontend after the UI overhaul and the licensed asset wiring pass.

## Homepage

| Page | Component | Asset type | Category | Purpose | Aspect ratio | Min resolution | Needed image kind | Reuse allowed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `index.tsx` featured listings grid | Listing card hero image | GPU listings | Show real premium listings from backend data | 4:3 | 1200x900 | Real product/listing image, fallback placeholder | Reuse shared GPU fallback when listing lacks image |
| `/` | `index.tsx` new listings rail | Listing card thumbnail | GPU listings | Show newest listings from backend data | 1:1 inside compact card | 800x800 | Real product/listing image, fallback placeholder | Reuse shared GPU fallback |
| `/` | `index.tsx` category cards | Category cover | GPU, CPU, motherboard, RAM, storage, PSU | Visual browse entry points | 16:10 | 1600x1000 | Dedicated category cover preferred | Reuse local category cover across cards and other fallback surfaces |
| `/` | `index.tsx` featured products | Product card image | Catalog products | Show premium catalog items | 4:3 | 1200x900 | Real product image, fallback category image | Reuse local category cover when product image missing |
| `/` | `index.tsx` marketplace catalog embed | Product/listing cards | Mixed | Inherited from shared marketplace cards | 4:3 | 1200x900 | Real image or fallback | Reuse shared category fallbacks |

## Category Cards

| Page | Component | Asset type | Category | Purpose | Aspect ratio | Min resolution | Needed image kind | Reuse allowed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `CategoryImage` in `index.tsx` | Category cover | GPU | Category browse cover | 16:10 | 1600x1000 | Dedicated category cover | Reuse for GPU placeholder/fallback |
| `/` | `CategoryImage` in `index.tsx` | Category cover | CPU | Category browse cover | 16:10 | 1600x1000 | Dedicated category cover | Reuse for CPU product/builder fallback |
| `/` | `CategoryImage` in `index.tsx` | Category cover | Motherboard | Category browse cover | 16:10 | 1600x1000 | Dedicated category cover | Reuse for motherboard product/builder fallback |
| `/` | `CategoryImage` in `index.tsx` | Category cover | RAM | Category browse cover | 16:10 | 1600x1000 | Dedicated category cover | Reuse for RAM product/builder fallback |
| `/` | `CategoryImage` in `index.tsx` | Category cover | Storage | Category browse cover | 16:10 | 1600x1000 | Dedicated category cover | Reuse for storage product/builder fallback |
| `/` | `CategoryImage` in `index.tsx` | Category cover | PSU | Category browse cover | 16:10 | 1600x1000 | Dedicated category cover | Reuse for PSU product/builder fallback |
| `/` | `CategoryImage` in `index.tsx` | Category cover | Other storefront categories | Future browse cover support | 16:10 | 1600x1000 | Dedicated cover preferred, placeholder acceptable | Reuse shared category placeholder until sourced |

## Featured Listing Cards

| Page | Component | Asset type | Category | Purpose | Aspect ratio | Min resolution | Needed image kind | Reuse allowed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `ListingCard` | Listing hero image | GPU | Featured storefront listing cards | 4:3 | 1200x900 | Real listing image preferred | Reuse local GPU cover when missing |
| `/marketplace` | `ListingCard` | Listing hero image | GPU | Shared listing browsing cards | 4:3 | 1200x900 | Real listing image preferred | Reuse local GPU cover when missing |

## Marketplace Cards

| Page | Component | Asset type | Category | Purpose | Aspect ratio | Min resolution | Needed image kind | Reuse allowed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/marketplace` | `ProductCard` | Product image | CPU, GPU, motherboard, RAM, storage, PSU, case, cooler | Shared product browse cards | 4:3 | 1200x900 | Real product image preferred | Reuse local category cover fallback |
| `/marketplace` | `ListingCard` | Listing image | GPU | Shared marketplace listing cards | 4:3 | 1200x900 | Real listing image preferred | Reuse local GPU cover fallback |
| `/` embedded marketplace feed | `MarketplaceCatalogFeed` | Shared card media | Mixed | Keep homepage catalog visually complete | 4:3 | 1200x900 | Real or fallback | Reuse shared fallback assets |

## Listing Detail Pages

| Page | Component | Asset type | Category | Purpose | Aspect ratio | Min resolution | Needed image kind | Reuse allowed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/listings/[id]` | Hero gallery image | Listing detail primary image | GPU | Primary media on detail page | 4:3 | 1600x1200 | Real listing image preferred | Reuse local GPU fallback when missing |
| `/listings/[id]` | Secondary gallery tiles | Listing detail gallery images | GPU | Supplemental listing media | 1:1 | 1000x1000 | Real listing image only | Do not replace with decorative local images |

## PC Builder

| Page | Component | Asset type | Category | Purpose | Aspect ratio | Min resolution | Needed image kind | Reuse allowed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/pc-builder` | `PartSelector` selected state | Selected part thumbnail | CPU, motherboard, RAM, GPU, storage, PSU, case, cooler | Confirm current part visually | 1:1 | 600x600 | Real product image preferred | Reuse local category cover fallback |
| `/pc-builder` | `PcBuilderSummary` | Build summary thumbnails | CPU, motherboard, RAM, GPU, storage, PSU, case, cooler | Show selected parts with better scanability | 1:1 | 600x600 | Real product image preferred | Reuse local category cover fallback |

## Shared Placeholders / Fallbacks

| Page | Component | Asset type | Category | Purpose | Aspect ratio | Min resolution | Needed image kind | Reuse allowed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shared | `ProductCard` | Product fallback | CPU, GPU, motherboard, RAM, storage, PSU, case, cooler | Fill empty product slots without broken UI | 4:3 | 1200x900 | Local category cover or shared placeholder | Reuse by category |
| Shared | `ListingCard` | Listing fallback | GPU | Fill empty listing slots without broken UI | 4:3 | 1200x900 | Local GPU cover or shared placeholder | Reuse across all listing cards |
| Shared | `CategoryImage` | Category fallback | Any unsourced category | Keep category cards polished until dedicated assets exist | 16:10 | 1600x1000 | Placeholder | Reuse shared category placeholder |

## Notes

- Real backend listing and product images should always take precedence over local decorative assets.
- Dedicated category covers are now most useful for storefront browsing, placeholders, builder summary tiles, and other empty-image states.
- Unsourced categories outside the main hardware target set should continue using placeholders until safely licensed assets are found.
