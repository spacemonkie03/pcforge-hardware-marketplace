# Image Assets Report

## What Was Downloaded

Licensed storefront image assets were downloaded from Wikimedia Commons for these core hardware categories:

- GPU
- CPU
- Motherboard
- RAM
- Storage
- PSU
- Case
- Cooler

For each category, two assets were stored locally:

- one primary category cover in `frontend/public/images/categories/`
- one secondary fallback/component image in `frontend/public/images/components/<category>/`

All downloaded files and licensing metadata are recorded in [image-assets-manifest.json](/c:/Users/SSS/Desktop/pc-hardware-marketplace/docs/image-assets-manifest.json).

## What Was Wired Into The Site

- Homepage category cards now use dedicated local category covers first.
- Homepage product and listing sections keep real backend images when available and fall back to local licensed assets when not.
- Shared `ProductCard` and `ListingCard` components now use local licensed fallbacks instead of empty states.
- Listing detail pages now use the local GPU fallback if a listing lacks an uploaded image.
- PC Builder selected-part and summary rows now show thumbnails using real product images first and local category covers second.
- Shared SVG placeholders were added for categories and generic component surfaces where no safe category asset exists.

## Asset Structure

- `frontend/public/images/categories/`
- `frontend/public/images/components/<category>/`
- `frontend/public/images/placeholders/`

## Missing Or Intentionally Left As Placeholders

- Keyboard
- Mouse
- Headset
- Microphone
- Monitor
- Liquid cooling
- Case fan

These categories were not sourced in this pass because the request prioritized the core hardware set and the current homepage only surfaces the first six storefront categories.

## Licensing Notes

- All downloaded photo assets in this pass came from Wikimedia Commons.
- Licenses vary by file and include `CC BY-SA 4.0`, `CC BY 4.0`, `CC BY 2.0`, and `Public domain`.
- Attribution and license details are stored per file in the JSON manifest.
- The local SVG placeholder graphics were created in-project and are not external downloads.

## Safety Notes

- No copyrighted marketplace photography was scraped or hotlinked.
- No backend data flow was changed to fabricate image availability.
- Real backend listing and product images still take precedence over local decorative assets.
